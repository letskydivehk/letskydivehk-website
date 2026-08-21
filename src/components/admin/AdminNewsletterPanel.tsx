import { useCallback, useEffect, useState } from "react";
import {
  Mail,
  Loader2,
  Sparkles,
  CheckCircle2,
  Undo2,
  Send,
  Trash2,
  ArrowUp,
  ArrowDown,
  Users,
  Pause,
  Play,
  Eye,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NewsletterPreview } from "./NewsletterPreview";
import { toast } from "sonner";

interface Article {
  id: string;
  topic: string | null;
  subject_zh_tw: string;
  subject_en: string;
  body_zh_tw: string;
  body_en: string;
  hero_image_url: string | null;
  queue_position: number;
  status: string;
  sent_at: string | null;
  recipients_count: number;
  created_at: string;
}

const QUEUE_TARGET = 5;

export function AdminNewsletterPanel() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [subscribers, setSubscribers] = useState<number>(0);
  const [paused, setPaused] = useState(false);
  const [pauseReason, setPauseReason] = useState<string | null>(null);
  const [topicHint, setTopicHint] = useState("");
  const [testEmail, setTestEmail] = useState("");
  const [drafts, setDrafts] = useState<Record<string, Partial<Article>>>({});
  const [previewArticle, setPreviewArticle] = useState<Article | null>(null);

  const load = useCallback(async () => {
    const [artRes, countRes, stateRes] = await Promise.all([
      (supabase as any)
        .from("newsletter_articles")
        .select("*")
        .order("status", { ascending: true })
        .order("queue_position", { ascending: true }),
      (supabase as any).rpc("newsletter_subscriber_count"),
      (supabase as any).from("newsletter_job_state").select("*").eq("id", 1).maybeSingle(),
    ]);

    if (artRes.data) setArticles(artRes.data as Article[]);
    if (typeof countRes.data === "number") setSubscribers(countRes.data);
    if (stateRes.data) {
      setPaused(!!stateRes.data.paused);
      setPauseReason(stateRes.data.pause_reason ?? null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const upcoming = articles
    .filter((a) => a.status !== "sent")
    .sort((a, b) => a.queue_position - b.queue_position)
    .slice(0, QUEUE_TARGET);
  const history = articles
    .filter((a) => a.status === "sent")
    .sort((a, b) => (b.sent_at || "").localeCompare(a.sent_at || ""));

  const generate = async (count: number) => {
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("newsletter-generate", {
        body: { count, topic: topicHint || undefined },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      toast.success(t("admin.newsletter.generated"));
      setTopicHint("");
      await load();
    } catch (e: any) {
      if (import.meta.env.DEV) console.error("generate failed", e);
      toast.error(e.message || t("admin.newsletter.generateFailed"));
    } finally {
      setGenerating(false);
    }
  };

  const patch = async (id: string, values: Record<string, any>) => {
    setBusyId(id);
    try {
      const { error } = await (supabase as any)
        .from("newsletter_articles")
        .update(values)
        .eq("id", id);
      if (error) throw error;
      await load();
    } catch (e: any) {
      toast.error(e.message || "Update failed");
    } finally {
      setBusyId(null);
    }
  };

  const saveEdits = async (a: Article) => {
    const d = drafts[a.id];
    if (!d) return;
    await patch(a.id, d);
    setDrafts((prev) => {
      const next = { ...prev };
      delete next[a.id];
      return next;
    });
    toast.success(t("admin.newsletter.saved"));
  };

  const move = async (a: Article, dir: -1 | 1) => {
    const list = upcoming;
    const idx = list.findIndex((x) => x.id === a.id);
    const other = list[idx + dir];
    if (!other) return;
    await patch(a.id, { queue_position: other.queue_position });
    await patch(other.id, { queue_position: a.queue_position });
  };

  const remove = async (a: Article) => {
    setBusyId(a.id);
    try {
      const { error } = await (supabase as any)
        .from("newsletter_articles")
        .delete()
        .eq("id", a.id);
      if (error) throw error;
      toast.success(t("admin.newsletter.deleted"));
      await load();
    } catch (e: any) {
      toast.error(e.message || "Delete failed");
    } finally {
      setBusyId(null);
    }
  };

  const sendTest = async (a: Article) => {
    if (!testEmail) {
      toast.error(t("admin.newsletter.testEmailRequired"));
      return;
    }
    setBusyId(a.id);
    try {
      const { data, error } = await supabase.functions.invoke("newsletter-send", {
        body: { test_to: testEmail, article_id: a.id },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      toast.success(t("admin.newsletter.testSent"));
    } catch (e: any) {
      toast.error(e.message || "Test send failed");
    } finally {
      setBusyId(null);
    }
  };

  const sendNow = async () => {
    setBusyId("manual");
    try {
      const { data, error } = await supabase.functions.invoke("newsletter-send", {
        body: { manual: true },
      });
      if (error) throw error;
      const res = data as any;
      if (res?.error) throw new Error(res.error);
      if (res?.skipped) {
        toast.info(`${t("admin.newsletter.skipped")}: ${res.skipped}`);
      } else {
        toast.success(`${t("admin.newsletter.sentBatch")} (${res?.sent ?? 0})`);
      }
      await load();
    } catch (e: any) {
      toast.error(e.message || "Send failed");
    } finally {
      setBusyId(null);
    }
  };

  const togglePause = async () => {
    const { error } = await (supabase as any)
      .from("newsletter_job_state")
      .update({ paused: !paused, pause_reason: !paused ? "Paused by admin" : null })
      .eq("id", 1);
    if (error) {
      toast.error(error.message);
      return;
    }
    await load();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const statusBadge = (status: string) => {
    if (status === "approved")
      return <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30">{t("admin.newsletter.statusApproved")}</Badge>;
    if (status === "sent")
      return <Badge variant="secondary">{t("admin.newsletter.statusSent")}</Badge>;
    return <Badge variant="outline">{t("admin.newsletter.statusDraft")}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header / controls */}
      <Card className="mobile-transparent-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Mail className="w-4 h-4" />
            {t("admin.newsletter.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{t("admin.newsletter.intro")}</p>

          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1">
              <Users className="w-3.5 h-3.5" />
              {t("admin.newsletter.subscribers")}: <strong>{subscribers}</strong>
            </span>
            {paused && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 text-destructive px-3 py-1">
                <Pause className="w-3.5 h-3.5" />
                {t("admin.newsletter.paused")}
                {pauseReason ? ` — ${pauseReason}` : ""}
              </span>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>{t("admin.newsletter.topicHint")}</Label>
              <Input
                value={topicHint}
                onChange={(e) => setTopicHint(e.target.value)}
                placeholder={t("admin.newsletter.topicPlaceholder")}
              />
            </div>
            <div>
              <Label>{t("admin.newsletter.testEmail")}</Label>
              <Input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={() => generate(1)} disabled={generating}>
              {generating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
              {t("admin.newsletter.generateOne")}
            </Button>
            <Button
              variant="outline"
              onClick={() => generate(Math.max(1, QUEUE_TARGET - upcoming.length))}
              disabled={generating || upcoming.length >= QUEUE_TARGET}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {t("admin.newsletter.fillQueue")}
            </Button>
            <Button variant="outline" onClick={sendNow} disabled={busyId === "manual"}>
              {busyId === "manual" ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
              {t("admin.newsletter.sendNow")}
            </Button>
            <Button variant="ghost" onClick={togglePause}>
              {paused ? <Play className="w-4 h-4 mr-2" /> : <Pause className="w-4 h-4 mr-2" />}
              {paused ? t("admin.newsletter.resume") : t("admin.newsletter.pause")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Queue */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground">
          {t("admin.newsletter.queue")} ({upcoming.length}/{QUEUE_TARGET})
        </h3>

        {upcoming.length === 0 && (
          <p className="text-sm text-muted-foreground">{t("admin.newsletter.emptyQueue")}</p>
        )}

        {upcoming.map((a, i) => {
          const d = drafts[a.id] || {};
          const val = (k: keyof Article) => (d[k] as string) ?? (a[k] as string);
          const set = (k: keyof Article, v: string) =>
            setDrafts((prev) => ({ ...prev, [a.id]: { ...prev[a.id], [k]: v } }));
          const dirty = !!drafts[a.id];

          return (
            <Card key={a.id} className="mobile-transparent-card">
              <CardHeader className="pb-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    #{i + 1} {statusBadge(a.status)}
                  </CardTitle>
                  <div className="flex items-center gap-1">
                    <Button size="icon" variant="ghost" onClick={() => move(a, -1)} disabled={i === 0}>
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => move(a, 1)}
                      disabled={i === upcoming.length - 1}
                    >
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => remove(a)} disabled={busyId === a.id}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                {a.topic && <p className="text-xs text-muted-foreground">{a.topic}</p>}
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label>{t("admin.newsletter.subjectZh")}</Label>
                    <Input value={val("subject_zh_tw")} onChange={(e) => set("subject_zh_tw", e.target.value)} />
                  </div>
                  <div>
                    <Label>{t("admin.newsletter.subjectEn")}</Label>
                    <Input value={val("subject_en")} onChange={(e) => set("subject_en", e.target.value)} />
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label>{t("admin.newsletter.bodyZh")}</Label>
                    <Textarea
                      rows={10}
                      value={val("body_zh_tw")}
                      onChange={(e) => set("body_zh_tw", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>{t("admin.newsletter.bodyEn")}</Label>
                    <Textarea rows={10} value={val("body_en")} onChange={(e) => set("body_en", e.target.value)} />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={() => saveEdits(a)} disabled={!dirty || busyId === a.id}>
                    {t("admin.newsletter.save")}
                  </Button>
                  {a.status === "draft" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => patch(a.id, { status: "approved" })}
                      disabled={busyId === a.id}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      {t("admin.newsletter.approve")}
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => patch(a.id, { status: "draft" })}
                      disabled={busyId === a.id}
                    >
                      <Undo2 className="w-4 h-4 mr-2" />
                      {t("admin.newsletter.unapprove")}
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => sendTest(a)} disabled={busyId === a.id}>
                    <Send className="w-4 h-4 mr-2" />
                    {t("admin.newsletter.sendTest")}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setPreviewArticle({ ...a, ...(drafts[a.id] || {}) } as Article)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {t("admin.newsletter.preview")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* History */}
      {history.length > 0 && (
        <Card className="mobile-transparent-card">
          <CardHeader>
            <CardTitle className="text-base">{t("admin.newsletter.history")}</CardTitle>
            <p className="text-xs text-muted-foreground">{t("admin.newsletter.historyHint")}</p>
          </CardHeader>
          <CardContent className="space-y-2">
            {history.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => setPreviewArticle(a)}
                className="w-full text-left flex flex-wrap items-center justify-between gap-2 border-b border-border/50 pb-2 text-sm last:border-0 hover:bg-muted/40 rounded-md px-2 -mx-2 py-1 transition-colors"
              >
                <span className="font-medium flex items-center gap-2">
                  <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                  {a.subject_zh_tw || a.subject_en}
                </span>
                <span className="text-muted-foreground text-xs">
                  {a.sent_at ? new Date(a.sent_at).toLocaleDateString() : "—"} ·{" "}
                  {a.recipients_count} {t("admin.newsletter.recipients")}
                </span>
              </button>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Preview dialog */}
      <Dialog open={!!previewArticle} onOpenChange={(o) => !o && setPreviewArticle(null)}>
        <DialogContent className="max-w-[680px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("admin.newsletter.previewTitle")}</DialogTitle>
            <DialogDescription>
              {previewArticle?.sent_at
                ? `${new Date(previewArticle.sent_at).toLocaleString()} · ${previewArticle.recipients_count} ${t("admin.newsletter.recipients")}`
                : t("admin.newsletter.previewHint")}
            </DialogDescription>
          </DialogHeader>
          {previewArticle && (
            <NewsletterPreview
              subjectZh={previewArticle.subject_zh_tw}
              subjectEn={previewArticle.subject_en}
              bodyZh={previewArticle.body_zh_tw}
              bodyEn={previewArticle.body_en}
              heroImageUrl={previewArticle.hero_image_url}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
