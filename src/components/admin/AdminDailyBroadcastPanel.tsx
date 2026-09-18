import { useCallback, useEffect, useMemo, useState } from "react";
import {
  MessageCircle,
  Loader2,
  Sparkles,
  Copy,
  CheckCircle2,
  Undo2,
  Settings2,
  History,
  RefreshCw,
  Send,
  Trash2,
  Plus,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface Broadcast {
  id: string;
  broadcast_date: string;
  topic: string | null;
  body_zh_tw: string;
  body_en: string;
  status: string;
  posted_at: string | null;
}

interface Recipient {
  id?: string;
  phone: string;
  label?: string;
  lang?: string;
}

interface SendLogRow {
  id: string;
  broadcast_id: string;
  phone: string;
  label: string | null;
  status: string;
  error: string | null;
  sent_at: string;
}

interface Settings {
  id: number;
  weekday_topics: Record<string, string>;
  enabled: boolean;
  include_en: boolean;
  send_hour: number;
  auto_send: boolean;
  recipients: Recipient[];
  template_name: string | null;
  template_language: string | null;
}

const WEEKDAYS = [
  { key: "0", label: "admin.broadcast.sun" },
  { key: "1", label: "admin.broadcast.mon" },
  { key: "2", label: "admin.broadcast.tue" },
  { key: "3", label: "admin.broadcast.wed" },
  { key: "4", label: "admin.broadcast.thu" },
  { key: "5", label: "admin.broadcast.fri" },
  { key: "6", label: "admin.broadcast.sat" },
];

/** Today's date in Hong Kong time (YYYY-MM-DD). */
function hkToday() {
  return new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

export function AdminDailyBroadcastPanel() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [busy, setBusy] = useState(false);
  const [rows, setRows] = useState<Broadcast[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [topicHint, setTopicHint] = useState("");
  const [draftZh, setDraftZh] = useState<string | null>(null);
  const [draftEn, setDraftEn] = useState<string | null>(null);
  const [sendLog, setSendLog] = useState<SendLogRow[]>([]);
  const [sending, setSending] = useState(false);

  const today = hkToday();

  const load = useCallback(async () => {
    const [bRes, sRes, lRes] = await Promise.all([
      (supabase as any)
        .from("daily_broadcasts")
        .select("*")
        .order("broadcast_date", { ascending: false })
        .limit(30),
      (supabase as any).from("daily_broadcast_settings").select("*").eq("id", 1).maybeSingle(),
      (supabase as any)
        .from("daily_broadcast_sends")
        .select("*")
        .order("sent_at", { ascending: false })
        .limit(50),
    ]);
    if (bRes.data) setRows(bRes.data as Broadcast[]);
    if (sRes.data) {
      const s = sRes.data as Settings;
      // Give every recipient a stable id so React keys never change while typing.
      s.recipients = (s.recipients ?? []).map((r) => ({ ...r, id: r.id ?? crypto.randomUUID() }));
      setSettings(s);
    }
    if (lRes.data) setSendLog(lRes.data as SendLogRow[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const todayRow = useMemo(() => rows.find((r) => r.broadcast_date === today) ?? null, [rows, today]);
  const history = useMemo(() => rows.filter((r) => r.broadcast_date !== today), [rows, today]);

  const zh = draftZh ?? todayRow?.body_zh_tw ?? "";
  const en = draftEn ?? todayRow?.body_en ?? "";
  const dirty = draftZh !== null || draftEn !== null;

  const generate = async (force: boolean) => {
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("daily-broadcast-generate", {
        body: { force, topic: topicHint || undefined },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      setTopicHint("");
      setDraftZh(null);
      setDraftEn(null);
      toast.success(t("admin.broadcast.generated"));
      await load();
    } catch (e: any) {
      if (import.meta.env.DEV) console.error("broadcast generate failed", e);
      toast.error(e.message || t("admin.broadcast.generateFailed"));
    } finally {
      setGenerating(false);
    }
  };

  const patch = async (id: string, values: Record<string, any>) => {
    setBusy(true);
    try {
      const { error } = await (supabase as any)
        .from("daily_broadcasts")
        .update(values)
        .eq("id", id);
      if (error) throw error;
      await load();
    } catch (e: any) {
      toast.error(e.message || "Update failed");
    } finally {
      setBusy(false);
    }
  };

  const saveEdits = async () => {
    if (!todayRow) return;
    await patch(todayRow.id, { body_zh_tw: zh, body_en: en });
    setDraftZh(null);
    setDraftEn(null);
    toast.success(t("admin.broadcast.saved"));
  };

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(t("admin.broadcast.copied"));
    } catch {
      toast.error("Copy failed");
    }
  };

  const openWhatsApp = (text: string) => {
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  };

  const updateSettings = async (values: Partial<Settings>) => {
    const { error } = await (supabase as any)
      .from("daily_broadcast_settings")
      .update(values)
      .eq("id", 1);
    if (error) {
      toast.error(error.message);
      return;
    }
    await load();
  };

  const recipients: Recipient[] = settings?.recipients ?? [];

  const updateRecipients = (next: Recipient[]) => updateSettings({ recipients: next } as any);

  const sendNow = async () => {
    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke("daily-broadcast-send", { body: {} });
      if (error) {
        let detail = error.message;
        try {
          const raw = await (error as any).context?.text?.();
          if (raw) detail = JSON.parse(raw)?.error ?? raw;
        } catch {
          // keep the generic message
        }
        throw new Error(detail);
      }
      const res = data as any;
      if (res?.error) throw new Error(res.error);
      if (res?.skipped) {
        toast.info(String(res.skipped));
      } else if (res?.failed) {
        toast.warning(
          t("admin.broadcast.sendPartial")
            .replace("{sent}", String(res.sent))
            .replace("{failed}", String(res.failed)),
        );
      } else {
        toast.success(t("admin.broadcast.sendSuccess").replace("{sent}", String(res?.sent ?? 0)));
      }
      await load();
    } catch (e: any) {
      if (import.meta.env.DEV) console.error("broadcast send failed", e);
      toast.error(e.message || t("admin.broadcast.sendFailed"));
    } finally {
      setSending(false);
    }
  };



  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="mobile-transparent-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            {t("admin.broadcast.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{t("admin.broadcast.intro")}</p>
          <p className="text-xs text-muted-foreground">{t("admin.broadcast.whatsappHint")}</p>

          <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
            <div>
              <Label>{t("admin.broadcast.topicHint")}</Label>
              <Input
                value={topicHint}
                onChange={(e) => setTopicHint(e.target.value)}
                placeholder={t("admin.broadcast.topicPlaceholder")}
              />
            </div>
            <Button onClick={() => generate(!!todayRow)} disabled={generating}>
              {generating ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : todayRow ? (
                <RefreshCw className="w-4 h-4 mr-2" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              {todayRow ? t("admin.broadcast.regenerate") : t("admin.broadcast.generate")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Today's message */}
      <Card className="mobile-transparent-card">
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle className="text-sm flex items-center gap-2">
              {t("admin.broadcast.today")} · {today}
              {todayRow &&
                (todayRow.status === "posted" ? (
                  <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30">
                    {t("admin.broadcast.posted")}
                  </Badge>
                ) : (
                  <Badge variant="outline">{t("admin.broadcast.draft")}</Badge>
                ))}
            </CardTitle>
            {todayRow?.topic && (
              <span className="text-xs text-muted-foreground">{todayRow.topic}</span>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {!todayRow ? (
            <p className="text-sm text-muted-foreground">{t("admin.broadcast.noDraft")}</p>
          ) : (
            <>
              <div>
                <Label>{t("admin.broadcast.bodyZh")}</Label>
                <Textarea
                  rows={14}
                  value={zh}
                  onChange={(e) => setDraftZh(e.target.value)}
                  className="font-mono text-[13px] whitespace-pre-wrap"
                />
              </div>

              {(en || settings?.include_en) && (
                <div>
                  <Label>{t("admin.broadcast.bodyEn")}</Label>
                  <Textarea
                    rows={12}
                    value={en}
                    onChange={(e) => setDraftEn(e.target.value)}
                    className="font-mono text-[13px] whitespace-pre-wrap"
                  />
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <Button onClick={() => copyText(zh)}>
                  <Copy className="w-4 h-4 mr-2" />
                  {t("admin.broadcast.copy")}
                </Button>
                <Button
                  variant="outline"
                  className="border-emerald-500/40 text-emerald-600 hover:bg-emerald-500/10"
                  onClick={() => openWhatsApp(zh)}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {t("admin.broadcast.openWhatsapp")}
                </Button>
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={sendNow}
                  disabled={sending || dirty}
                >
                  {sending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  {t("admin.broadcast.sendNow")}
                </Button>
                <Button size="default" variant="secondary" onClick={saveEdits} disabled={!dirty || busy}>
                  {t("admin.broadcast.save")}
                </Button>
                {todayRow.status === "posted" ? (
                  <Button
                    variant="ghost"
                    onClick={() => patch(todayRow.id, { status: "draft", posted_at: null })}
                    disabled={busy}
                  >
                    <Undo2 className="w-4 h-4 mr-2" />
                    {t("admin.broadcast.markDraft")}
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    onClick={() =>
                      patch(todayRow.id, { status: "posted", posted_at: new Date().toISOString() })
                    }
                    disabled={busy}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    {t("admin.broadcast.markPosted")}
                  </Button>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Auto-send */}
      {settings && (
        <Card className="mobile-transparent-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Send className="w-4 h-4" />
              {t("admin.broadcast.sending")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <Label htmlFor="bc-auto-send" className="text-sm">
                {t("admin.broadcast.autoSend")}
              </Label>
              <Switch
                id="bc-auto-send"
                checked={!!settings.auto_send}
                onCheckedChange={(v) => updateSettings({ auto_send: v } as any)}
              />
            </div>
            <p className="text-xs text-muted-foreground">{t("admin.broadcast.autoSendHint")}</p>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label className="text-xs">{t("admin.broadcast.templateName")}</Label>
                <Input
                  defaultValue={settings.template_name ?? ""}
                  placeholder="daily_update"
                  onBlur={(e) => {
                    if (e.target.value !== (settings.template_name ?? "")) {
                      updateSettings({ template_name: e.target.value } as any);
                    }
                  }}
                />
              </div>
              <div>
                <Label className="text-xs">{t("admin.broadcast.templateLanguage")}</Label>
                <Input
                  defaultValue={settings.template_language ?? "zh_HK"}
                  placeholder="zh_HK"
                  onBlur={(e) => {
                    if (e.target.value !== (settings.template_language ?? "")) {
                      updateSettings({ template_language: e.target.value } as any);
                    }
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">{t("admin.broadcast.recipients")}</Label>
              {recipients.map((r, i) => (
                <div key={r.id ?? `idx-${i}`} className="grid gap-2 sm:grid-cols-[1fr_1fr_90px_auto]">
                  <Input
                    value={r.phone}
                    placeholder={t("admin.broadcast.phone")}
                    onChange={(e) => {
                      const next = [...recipients];
                      next[i] = { ...r, phone: e.target.value };
                      setSettings((s) => (s ? { ...s, recipients: next } : s));
                    }}
                    onBlur={() => updateRecipients(recipients)}
                  />
                  <Input
                    value={r.label ?? ""}
                    placeholder={t("admin.broadcast.recipientLabel")}
                    onChange={(e) => {
                      const next = [...recipients];
                      next[i] = { ...r, label: e.target.value };
                      setSettings((s) => (s ? { ...s, recipients: next } : s));
                    }}
                    onBlur={() => updateRecipients(recipients)}
                  />
                  <Input
                    value={r.lang ?? "zh"}
                    placeholder={t("admin.broadcast.recipientLang")}
                    onChange={(e) => {
                      const next = [...recipients];
                      next[i] = { ...r, lang: e.target.value };
                      setSettings((s) => (s ? { ...s, recipients: next } : s));
                    }}
                    onBlur={() => updateRecipients(recipients)}
                  />

                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={t("admin.broadcast.remove")}
                    onClick={() => updateRecipients(recipients.filter((_, j) => j !== i))}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  updateRecipients([...recipients, { id: crypto.randomUUID(), phone: "", label: "", lang: "zh" }])
                }
              >
                <Plus className="w-4 h-4 mr-1.5" />
                {t("admin.broadcast.addRecipient")}
              </Button>
            </div>

            <div className="space-y-1">
              <Label className="text-sm">{t("admin.broadcast.sendLog")}</Label>
              {sendLog.length === 0 ? (
                <p className="text-xs text-muted-foreground">{t("admin.broadcast.noSendLog")}</p>
              ) : (
                <div className="space-y-1">
                  {sendLog.map((s) => (
                    <div key={s.id} className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="text-muted-foreground">
                        {new Date(s.sent_at).toLocaleString()}
                      </span>
                      <span className="font-medium">{s.label || s.phone}</span>
                      {s.status === "sent" ? (
                        <Badge variant="secondary">{t("admin.broadcast.statusSent")}</Badge>
                      ) : (
                        <Badge variant="destructive">{t("admin.broadcast.statusFailed")}</Badge>
                      )}
                      {s.error && (
                        <span className="text-destructive/80 truncate max-w-[280px]">{s.error}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Settings */}
      {settings && (
        <Card className="mobile-transparent-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Settings2 className="w-4 h-4" />
              {t("admin.broadcast.settings")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <Label htmlFor="bc-enabled" className="text-sm">
                {t("admin.broadcast.enabled")}
              </Label>
              <Switch
                id="bc-enabled"
                checked={settings.enabled}
                onCheckedChange={(v) => updateSettings({ enabled: v })}
              />
            </div>
            <div className="flex items-center justify-between gap-4">
              <Label htmlFor="bc-en" className="text-sm">
                {t("admin.broadcast.includeEn")}
              </Label>
              <Switch
                id="bc-en"
                checked={settings.include_en}
                onCheckedChange={(v) => updateSettings({ include_en: v })}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm">{t("admin.broadcast.weekdayTopics")}</Label>
              {WEEKDAYS.map((d) => (
                <div key={d.key} className="grid gap-1 sm:grid-cols-[120px_1fr] sm:items-center">
                  <span className="text-xs text-muted-foreground">{t(d.label)}</span>
                  <Input
                    defaultValue={settings.weekday_topics?.[d.key] ?? ""}
                    onBlur={(e) => {
                      const next = { ...(settings.weekday_topics ?? {}), [d.key]: e.target.value };
                      if (e.target.value !== (settings.weekday_topics?.[d.key] ?? "")) {
                        updateSettings({ weekday_topics: next });
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* History */}
      {history.length > 0 && (
        <Card className="mobile-transparent-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <History className="w-4 h-4" />
              {t("admin.broadcast.history")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {history.map((r) => (
              <div key={r.id} className="border-b border-border/50 pb-3 last:border-0">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-medium">
                    {r.broadcast_date}
                    {r.topic ? ` · ${r.topic}` : ""}
                  </span>
                  <div className="flex items-center gap-2">
                    {r.status === "posted" ? (
                      <Badge variant="secondary">{t("admin.broadcast.posted")}</Badge>
                    ) : (
                      <Badge variant="outline">{t("admin.broadcast.draft")}</Badge>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => copyText(r.body_zh_tw)}>
                      <Copy className="w-3.5 h-3.5 mr-1.5" />
                      {t("admin.broadcast.reuse")}
                    </Button>
                  </div>
                </div>
                <p className="mt-1 text-xs text-muted-foreground whitespace-pre-wrap line-clamp-4">
                  {r.body_zh_tw}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
