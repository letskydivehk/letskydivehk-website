import { useState, useEffect } from "react";
import { Loader2, Plus, Trash2, Wand2, ChevronDown, ChevronUp, Save, GripVertical } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuizAdmin, type DBQuizOption, type DBQuizQuestion } from "@/hooks/useQuiz";
import { useLocations } from "@/hooks/useLocations";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

type LocalQuestion = DBQuizQuestion & { _dirty?: boolean; _new?: boolean };
type LocalOption = DBQuizOption & { _dirty?: boolean; _new?: boolean; _delete?: boolean };

export function AdminQuizPanel() {
  const { data, isLoading, refetch } = useQuizAdmin();
  const { data: locations = [] } = useLocations();
  const qc = useQueryClient();
  const [questions, setQuestions] = useState<LocalQuestion[]>([]);
  const [optionsByQ, setOptionsByQ] = useState<Record<string, LocalOption[]>>({});
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({});
  const [translating, setTranslating] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!data) return;
    setQuestions(data);
    const map: Record<string, LocalOption[]> = {};
    data.forEach((q) => (map[q.id] = q.options));
    setOptionsByQ(map);
  }, [data]);

  const toggle = (id: string) => setOpenIds({ ...openIds, [id]: !openIds[id] });

  const updateQuestion = (id: string, patch: Partial<LocalQuestion>) =>
    setQuestions((qs) => qs.map((q) => (q.id === id ? { ...q, ...patch, _dirty: true } : q)));

  const updateOption = (qid: string, oid: string, patch: Partial<LocalOption>) =>
    setOptionsByQ((m) => ({
      ...m,
      [qid]: m[qid].map((o) => (o.id === oid ? { ...o, ...patch, _dirty: true } : o)),
    }));

  const addQuestion = () => {
    const tempId = `new-${crypto.randomUUID()}`;
    const newQ: LocalQuestion = {
      id: tempId, slug: `q-${Date.now()}`, display_order: questions.length + 1, is_active: true,
      text_en: "", text_zh_tw: "", text_zh_cn: "", options: [], _new: true, _dirty: true,
    };
    setQuestions([...questions, newQ]);
    setOptionsByQ({ ...optionsByQ, [tempId]: [] });
    setOpenIds({ ...openIds, [tempId]: true });
  };

  const deleteQuestion = async (id: string) => {
    if (!confirm("Delete this question and all its options?")) return;
    if (!id.startsWith("new-")) {
      const { error } = await supabase.from("quiz_questions").delete().eq("id", id);
      if (error) return toast.error(error.message);
    }
    setQuestions(questions.filter((q) => q.id !== id));
    toast.success("Question removed");
  };

  const addOption = (qid: string) => {
    const list = optionsByQ[qid] || [];
    const newO: LocalOption = {
      id: `new-${crypto.randomUUID()}`, question_id: qid, display_order: list.length + 1,
      label_en: "", label_zh_tw: "", label_zh_cn: "",
      service_weights: {}, location_weights: {}, pin_location_slug: null,
      _new: true, _dirty: true,
    };
    setOptionsByQ({ ...optionsByQ, [qid]: [...list, newO] });
  };

  const deleteOption = (qid: string, oid: string) => {
    if (oid.startsWith("new-")) {
      setOptionsByQ({ ...optionsByQ, [qid]: optionsByQ[qid].filter((o) => o.id !== oid) });
    } else {
      updateOption(qid, oid, { _delete: true });
    }
  };

  const translate = async (text: string, key: string): Promise<{ zh_tw: string; zh_cn: string } | null> => {
    if (!text.trim()) { toast.error("Enter English text first"); return null; }
    setTranslating(key);
    try {
      const { data, error } = await supabase.functions.invoke("translate-quiz", { body: { text } });
      if (error) throw error;
      return data as { zh_tw: string; zh_cn: string };
    } catch (e: any) {
      toast.error(e?.message || "Translation failed");
      return null;
    } finally {
      setTranslating(null);
    }
  };

  const translateQuestion = async (q: LocalQuestion) => {
    const r = await translate(q.text_en, `q-${q.id}`);
    if (r) updateQuestion(q.id, { text_zh_tw: r.zh_tw, text_zh_cn: r.zh_cn });
  };
  const translateOption = async (qid: string, o: LocalOption) => {
    const r = await translate(o.label_en, `o-${o.id}`);
    if (r) updateOption(qid, o.id, { label_zh_tw: r.zh_tw, label_zh_cn: r.zh_cn });
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      // Save questions
      for (const q of questions) {
        if (!q._dirty && !q._new) continue;
        const payload = {
          slug: q.slug, display_order: q.display_order, is_active: q.is_active,
          text_en: q.text_en, text_zh_tw: q.text_zh_tw, text_zh_cn: q.text_zh_cn,
        };
        if (q._new) {
          const { data: ins, error } = await supabase.from("quiz_questions").insert(payload).select().single();
          if (error) throw error;
          // remap option question_ids
          const opts = (optionsByQ[q.id] || []).map((o) => ({ ...o, question_id: ins.id }));
          optionsByQ[ins.id] = opts;
          delete optionsByQ[q.id];
          q.id = ins.id;
        } else {
          const { error } = await supabase.from("quiz_questions").update(payload).eq("id", q.id);
          if (error) throw error;
        }
      }

      // Save options
      for (const qid of Object.keys(optionsByQ)) {
        for (const o of optionsByQ[qid]) {
          if (o._delete && !o._new) {
            const { error } = await supabase.from("quiz_options").delete().eq("id", o.id);
            if (error) throw error;
            continue;
          }
          if (!o._dirty && !o._new) continue;
          const payload = {
            question_id: qid, display_order: o.display_order,
            label_en: o.label_en, label_zh_tw: o.label_zh_tw, label_zh_cn: o.label_zh_cn,
            service_weights: o.service_weights, location_weights: o.location_weights,
            pin_location_slug: o.pin_location_slug || null,
          };
          if (o._new) {
            const { error } = await supabase.from("quiz_options").insert(payload);
            if (error) throw error;
          } else {
            const { error } = await supabase.from("quiz_options").update(payload).eq("id", o.id);
            if (error) throw error;
          }
        }
      }

      toast.success("Saved");
      qc.invalidateQueries({ queryKey: ["quiz"] });
      refetch();
    } catch (e: any) {
      toast.error(e?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) return <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  return (
    <div className="space-y-4">
      <div className="bg-muted/40 rounded-xl p-4 text-sm space-y-1">
        <div className="font-semibold">How scoring works</div>
        <p className="text-muted-foreground">
          <strong>Service weights</strong> add up across all answers — highest total wins (Tandem / A-Licence / Group).{" "}
          <strong>Location weights</strong> (proximity, scenery, budget, country, best months) score each dropzone.{" "}
          <strong>Pin to dropzone</strong> gives that dropzone +10 if the answer is chosen — strongest way to force a recommendation.
        </p>
      </div>

      <div className="flex gap-2">
        <Button onClick={addQuestion} variant="outline"><Plus className="w-4 h-4 mr-1" />Add question</Button>
        <Button onClick={saveAll} disabled={saving} className="ml-auto">
          {saving ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
          Save all changes
        </Button>
      </div>

      {questions.map((q) => {
        const opts = (optionsByQ[q.id] || []).filter((o) => !o._delete);
        const open = openIds[q.id];
        return (
          <div key={q.id} className="border border-border rounded-xl bg-card">
            <div className="flex items-center gap-2 p-3 border-b border-border">
              <GripVertical className="w-4 h-4 text-muted-foreground" />
              <Input
                className="max-w-[120px]"
                value={q.slug}
                onChange={(e) => updateQuestion(q.id, { slug: e.target.value })}
                placeholder="slug"
              />
              <Input
                type="number" className="w-20"
                value={q.display_order}
                onChange={(e) => updateQuestion(q.id, { display_order: parseInt(e.target.value) || 0 })}
              />
              <div className="flex items-center gap-1 text-xs ml-2">
                <Switch checked={q.is_active} onCheckedChange={(v) => updateQuestion(q.id, { is_active: v })} />
                Active
              </div>
              <div className="flex-1 truncate text-sm font-medium">{q.text_en || <span className="text-muted-foreground italic">(no text)</span>}</div>
              <Button size="sm" variant="ghost" onClick={() => toggle(q.id)}>
                {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => deleteQuestion(q.id)}>
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>

            {open && (
              <div className="p-4 space-y-4">
                <div className="grid sm:grid-cols-3 gap-2">
                  <div>
                    <Label className="text-xs">EN</Label>
                    <Input value={q.text_en} onChange={(e) => updateQuestion(q.id, { text_en: e.target.value })} />
                  </div>
                  <div>
                    <Label className="text-xs">繁中</Label>
                    <Input value={q.text_zh_tw} onChange={(e) => updateQuestion(q.id, { text_zh_tw: e.target.value })} />
                  </div>
                  <div>
                    <Label className="text-xs">简中</Label>
                    <Input value={q.text_zh_cn} onChange={(e) => updateQuestion(q.id, { text_zh_cn: e.target.value })} />
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={() => translateQuestion(q)} disabled={translating === `q-${q.id}`}>
                  {translating === `q-${q.id}` ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Wand2 className="w-3 h-3 mr-1" />}
                  Auto-translate question
                </Button>

                <div className="border-t border-border pt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-sm">Options</div>
                    <Button size="sm" variant="outline" onClick={() => addOption(q.id)}>
                      <Plus className="w-3 h-3 mr-1" />Add option
                    </Button>
                  </div>

                  {opts.map((o) => (
                    <OptionEditor
                      key={o.id}
                      option={o}
                      locations={locations}
                      translating={translating === `o-${o.id}`}
                      onChange={(patch) => updateOption(q.id, o.id, patch)}
                      onTranslate={() => translateOption(q.id, o)}
                      onDelete={() => deleteOption(q.id, o.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function OptionEditor({
  option, locations, translating, onChange, onTranslate, onDelete,
}: {
  option: LocalOption;
  locations: { slug: string; Name: string | null }[];
  translating: boolean;
  onChange: (patch: Partial<LocalOption>) => void;
  onTranslate: () => void;
  onDelete: () => void;
}) {
  const sw = option.service_weights || {};
  const lw = option.location_weights || {};
  const setSW = (k: string, v: number) => {
    const next = { ...sw };
    if (v === 0 || isNaN(v)) delete (next as any)[k];
    else (next as any)[k] = v;
    onChange({ service_weights: next });
  };
  const setLW = (k: string, v: any) => {
    const next: any = { ...lw };
    if (v === "" || v === null || v === 0 || v === false) delete next[k];
    else next[k] = v;
    onChange({ location_weights: next });
  };
  return (
    <div className="border border-border rounded-lg p-3 bg-background space-y-3">
      <div className="grid sm:grid-cols-3 gap-2">
        <Input placeholder="EN label" value={option.label_en} onChange={(e) => onChange({ label_en: e.target.value })} />
        <Input placeholder="繁中" value={option.label_zh_tw} onChange={(e) => onChange({ label_zh_tw: e.target.value })} />
        <Input placeholder="简中" value={option.label_zh_cn} onChange={(e) => onChange({ label_zh_cn: e.target.value })} />
      </div>
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <Button size="sm" variant="outline" onClick={onTranslate} disabled={translating}>
          {translating ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Wand2 className="w-3 h-3 mr-1" />}
          Auto-translate
        </Button>
        <Button size="sm" variant="ghost" onClick={onDelete} className="ml-auto">
          <Trash2 className="w-3 h-3 text-destructive" />
        </Button>
      </div>

      <div className="grid sm:grid-cols-3 gap-2 text-xs">
        <div>
          <Label className="text-xs">Tandem</Label>
          <Input type="number" value={sw.tandem || 0} onChange={(e) => setSW("tandem", parseInt(e.target.value) || 0)} />
        </div>
        <div>
          <Label className="text-xs">A-Licence</Label>
          <Input type="number" value={sw.alicence || 0} onChange={(e) => setSW("alicence", parseInt(e.target.value) || 0)} />
        </div>
        <div>
          <Label className="text-xs">Group</Label>
          <Input type="number" value={sw.group || 0} onChange={(e) => setSW("group", parseInt(e.target.value) || 0)} />
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-2 text-xs">
        <div>
          <Label className="text-xs">Proximity</Label>
          <Input type="number" value={lw.proximity || 0} onChange={(e) => setLW("proximity", parseInt(e.target.value) || 0)} />
        </div>
        <div>
          <Label className="text-xs">Scenery</Label>
          <Input type="number" value={lw.scenery || 0} onChange={(e) => setLW("scenery", parseInt(e.target.value) || 0)} />
        </div>
        <div>
          <Label className="text-xs">Budget</Label>
          <Input type="number" value={lw.budget || 0} onChange={(e) => setLW("budget", parseInt(e.target.value) || 0)} />
        </div>
        <div>
          <Label className="text-xs">Country boost</Label>
          <select className="w-full h-9 rounded-md border border-input bg-background px-2 text-sm"
            value={lw.country || ""} onChange={(e) => setLW("country", e.target.value || "")}>
            <option value="">—</option>
            <option value="Thailand">Thailand</option>
            <option value="China">China</option>
          </select>
        </div>
        <div className="flex items-end gap-2">
          <Switch checked={!!lw.needsAff} onCheckedChange={(v) => setLW("needsAff", v)} />
          <Label className="text-xs">Needs A-Licence</Label>
        </div>
        <div className="flex items-end gap-2">
          <Switch checked={!!lw.needsGroup} onCheckedChange={(v) => setLW("needsGroup", v)} />
          <Label className="text-xs">Needs Group</Label>
        </div>
        <div className="sm:col-span-2">
          <Label className="text-xs">Best months (comma-separated 1–12)</Label>
          <Input
            value={(lw.monthPref || []).join(",")}
            onChange={(e) => {
              const arr = e.target.value.split(",").map((s) => parseInt(s.trim())).filter((n) => n >= 1 && n <= 12);
              setLW("monthPref", arr.length ? arr : null);
            }}
            placeholder="e.g. 11,12,1,2"
          />
        </div>
        <div>
          <Label className="text-xs">📍 Pin to dropzone</Label>
          <select className="w-full h-9 rounded-md border border-input bg-background px-2 text-sm"
            value={option.pin_location_slug || ""}
            onChange={(e) => onChange({ pin_location_slug: e.target.value || null })}>
            <option value="">— None —</option>
            {locations.map((l) => (
              <option key={l.slug} value={l.slug}>{l.Name || l.slug}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
