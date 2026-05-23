import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2, Save, ChevronDown, ChevronUp, GripVertical, ArrowUp, ArrowDown, Sunrise, Sun, Moon, X, ImagePlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type {
  AddOnItem,
  ItineraryDay,
  ItineraryItem,
  ItineraryPeriod,
  ItinerarySegment,
  LocationService,
} from "@/hooks/useLocationServices";

interface TourRow extends LocationService {
  locationName?: string;
}

const PERIODS: { key: ItineraryPeriod; label: string; Icon: typeof Sun; color: string }[] = [
  { key: "morning", label: "Morning", Icon: Sunrise, color: "text-amber-500" },
  { key: "afternoon", label: "Afternoon", Icon: Sun, color: "text-orange-500" },
  { key: "evening", label: "Evening", Icon: Moon, color: "text-indigo-500" },
];

function ensureSegments(day: ItineraryDay): ItinerarySegment[] {
  if (Array.isArray(day.segments) && day.segments.length > 0) {
    return PERIODS.map(
      (p) => day.segments!.find((s) => s.period === p.key) ?? { period: p.key, items: [] },
    );
  }
  return PERIODS.map((p) => ({ period: p.key, items: [] }));
}

function SortableItemRow({
  id,
  item,
  onChange,
  onRemove,
}: {
  id: string;
  item: ItineraryItem;
  onChange: (patch: Partial<ItineraryItem>) => void;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2 bg-background rounded border p-2">
      <button
        type="button"
        className="cursor-grab text-muted-foreground hover:text-foreground touch-none"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="w-4 h-4" />
      </button>
      <Input
        placeholder="Activity / schedule item"
        value={item.title}
        onChange={(e) => onChange({ title: e.target.value })}
        className="flex-1 h-8 text-sm"
      />
      <Input
        placeholder="Location (optional)"
        value={item.location || ""}
        onChange={(e) => onChange({ location: e.target.value || null })}
        className="flex-1 h-8 text-sm"
      />
      <Button type="button" size="sm" variant="ghost" onClick={onRemove} className="h-8 w-8 p-0">
        <Trash2 className="w-3.5 h-3.5" />
      </Button>
    </div>
  );
}

export function AdminToursPanel() {
  const qc = useQueryClient();
  const [rows, setRows] = useState<TourRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("location_services")
      .select("*, locations(Name)")
      .eq("service_type", "Tour")
      .order("display_order");
    if (error) {
      toast.error("Failed to load tours");
      setLoading(false);
      return;
    }
    setRows(
      (data || []).map((d: any) => ({
        ...d,
        itinerary: (Array.isArray(d.itinerary) ? d.itinerary : []).map((day: any) => ({
          ...day,
          segments: ensureSegments(day),
        })),
        photos: Array.isArray(d.photos) ? d.photos : [],
        add_ons: Array.isArray(d.add_ons) ? d.add_ons : [],
        locationName: d.locations?.Name,
      })) as TourRow[],
    );
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const updateRow = (id: string, patch: Partial<TourRow>) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const updateDay = (id: string, idx: number, patch: Partial<ItineraryDay>) =>
    setRows((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, itinerary: r.itinerary.map((d, i) => (i === idx ? { ...d, ...patch } : d)) }
          : r,
      ),
    );

  const updateSegment = (
    id: string,
    dayIdx: number,
    period: ItineraryPeriod,
    items: ItineraryItem[],
  ) =>
    setRows((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        return {
          ...r,
          itinerary: r.itinerary.map((d, i) => {
            if (i !== dayIdx) return d;
            const segments = ensureSegments(d).map((s) => (s.period === period ? { ...s, items } : s));
            return { ...d, segments };
          }),
        };
      }),
    );

  const addDay = (id: string) =>
    setRows((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              itinerary: [
                ...r.itinerary,
                {
                  day: r.itinerary.length + 1,
                  title: "",
                  segments: PERIODS.map((p) => ({ period: p.key, items: [] })),
                },
              ],
            }
          : r,
      ),
    );

  const removeDay = (id: string, idx: number) =>
    setRows((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, itinerary: r.itinerary.filter((_, i) => i !== idx).map((d, i) => ({ ...d, day: i + 1 })) }
          : r,
      ),
    );

  const moveDay = (id: string, idx: number, dir: -1 | 1) =>
    setRows((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const target = idx + dir;
        if (target < 0 || target >= r.itinerary.length) return r;
        const next = [...r.itinerary];
        [next[idx], next[target]] = [next[target], next[idx]];
        return { ...r, itinerary: next.map((d, i) => ({ ...d, day: i + 1 })) };
      }),
    );

  const save = async (row: TourRow) => {
    setSavingId(row.id);
    const cleanedItinerary = row.itinerary.map((d) => ({
      day: d.day,
      title: d.title || "",
      segments: ensureSegments(d).map((s) => ({
        period: s.period,
        items: s.items.filter((it) => it.title && it.title.trim().length > 0),
      })),
    }));
    const cleanedAddOns = (row.add_ons || [])
      .filter((a) => a.name && a.name.trim().length > 0)
      .map((a) => ({ name: a.name.trim(), price: a.price?.trim() || null }));
    const cleanedIncludes = (row.includes || []).map((s) => s.trim()).filter(Boolean);

    const { error } = await supabase
      .from("location_services")
      .update({
        service_name: row.service_name,
        price_display: row.price_display,
        deposit_amount: row.deposit_amount,
        includes: cleanedIncludes,
        add_ons: cleanedAddOns as any,
        photos: row.photos,
        itinerary: cleanedItinerary as any,
      })
      .eq("id", row.id);
    setSavingId(null);
    if (error) {
      toast.error("Save failed: " + error.message);
      return;
    }
    toast.success("Saved");
    qc.invalidateQueries({ queryKey: ["location-services"] });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold">Skydiving Tours</h2>
        <p className="text-sm text-muted-foreground">
          Edit pricing, what's included, optional add-ons, photos, and the timeline-based itinerary per tour.
        </p>
      </div>
      {rows.map((row) => {
        const isOpen = openId === row.id;
        return (
          <div key={row.id} className="border rounded-lg bg-card">
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : row.id)}
              className="w-full flex items-center justify-between p-4 text-left"
            >
              <div>
                <div className="font-semibold">{row.locationName || row.location_id}</div>
                <div className="text-xs text-muted-foreground">
                  {row.service_name} · {row.price_display} · Deposit HKD ${row.deposit_amount} ·{" "}
                  {row.itinerary.length} day(s)
                </div>
              </div>
              {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {isOpen && (
              <div className="p-4 border-t">
                <Tabs defaultValue="pricing" className="w-full">
                  <TabsList className="grid grid-cols-4 w-full mb-4">
                    <TabsTrigger value="pricing">Pricing</TabsTrigger>
                    <TabsTrigger value="included">Included & Add-ons</TabsTrigger>
                    <TabsTrigger value="photos">Photos</TabsTrigger>
                    <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                  </TabsList>

                  {/* PRICING */}
                  <TabsContent value="pricing" className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <Label>Service name</Label>
                        <Input
                          value={row.service_name}
                          onChange={(e) => updateRow(row.id, { service_name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Price display</Label>
                        <Input
                          value={row.price_display}
                          onChange={(e) => updateRow(row.id, { price_display: e.target.value })}
                          placeholder="$6,799起"
                        />
                        <p className="text-[11px] text-muted-foreground mt-1">
                          Format hint: use <code>$X,XXX起</code> for "starts from".
                        </p>
                      </div>
                      <div>
                        <Label>Deposit (HKD)</Label>
                        <Input
                          type="number"
                          value={row.deposit_amount}
                          onChange={(e) =>
                            updateRow(row.id, { deposit_amount: Number(e.target.value) || 0 })
                          }
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {/* INCLUDED & ADD-ONS */}
                  <TabsContent value="included" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border rounded-lg p-3 bg-emerald-50/30">
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-emerald-700 font-semibold">Included in package</Label>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs"
                            onClick={() =>
                              updateRow(row.id, { includes: [...(row.includes || []), ""] })
                            }
                          >
                            <Plus className="w-3 h-3 mr-1" /> Add
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {(row.includes || []).map((item, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <Input
                                value={item}
                                onChange={(e) => {
                                  const next = [...(row.includes || [])];
                                  next[i] = e.target.value;
                                  updateRow(row.id, { includes: next });
                                }}
                                className="h-8 text-sm"
                                placeholder="e.g. Meals"
                              />
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-destructive"
                                onClick={() =>
                                  updateRow(row.id, {
                                    includes: (row.includes || []).filter((_, j) => j !== i),
                                  })
                                }
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          ))}
                          {(row.includes || []).length === 0 && (
                            <p className="text-xs italic text-muted-foreground">No items yet.</p>
                          )}
                        </div>
                      </div>

                      <div className="border rounded-lg p-3 bg-accent-orange/5">
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-accent-orange font-semibold">Optional add-ons</Label>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs"
                            onClick={() =>
                              updateRow(row.id, {
                                add_ons: [...(row.add_ons || []), { name: "", price: null }],
                              })
                            }
                          >
                            <Plus className="w-3 h-3 mr-1" /> Add
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {(row.add_ons || []).map((a, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <Input
                                value={a.name}
                                onChange={(e) => {
                                  const next: AddOnItem[] = [...(row.add_ons || [])];
                                  next[i] = { ...next[i], name: e.target.value };
                                  updateRow(row.id, { add_ons: next });
                                }}
                                className="h-8 text-sm flex-1"
                                placeholder="e.g. Round-trip flights"
                              />
                              <Input
                                value={a.price || ""}
                                onChange={(e) => {
                                  const next: AddOnItem[] = [...(row.add_ons || [])];
                                  next[i] = { ...next[i], price: e.target.value || null };
                                  updateRow(row.id, { add_ons: next });
                                }}
                                className="h-8 text-sm w-28"
                                placeholder="Price (opt.)"
                              />
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-destructive"
                                onClick={() =>
                                  updateRow(row.id, {
                                    add_ons: (row.add_ons || []).filter((_, j) => j !== i),
                                  })
                                }
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          ))}
                          {(row.add_ons || []).length === 0 && (
                            <p className="text-xs italic text-muted-foreground">No add-ons yet.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* PHOTOS */}
                  <TabsContent value="photos" className="space-y-3">
                    {row.photos?.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {row.photos.map((url, i) => (
                          <div key={i} className="relative group rounded-lg overflow-hidden border bg-muted aspect-[4/3]">
                            <img src={url} alt="" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() =>
                                updateRow(row.id, {
                                  photos: row.photos.filter((_, j) => j !== i),
                                })
                              }
                              className="absolute top-1 right-1 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              aria-label="Remove photo"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Input
                        placeholder="Paste image URL and press Enter"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            const v = (e.target as HTMLInputElement).value.trim();
                            if (v) {
                              updateRow(row.id, { photos: [...(row.photos || []), v] });
                              (e.target as HTMLInputElement).value = "";
                            }
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={(e) => {
                          const input = (e.currentTarget.parentElement?.querySelector("input") as HTMLInputElement);
                          const v = input?.value.trim();
                          if (v) {
                            updateRow(row.id, { photos: [...(row.photos || []), v] });
                            input.value = "";
                          }
                        }}
                      >
                        <ImagePlus className="w-4 h-4 mr-1" /> Add
                      </Button>
                    </div>
                    <details className="text-xs">
                      <summary className="cursor-pointer text-muted-foreground">Bulk edit URLs</summary>
                      <Textarea
                        rows={4}
                        className="mt-2"
                        value={(row.photos || []).join("\n")}
                        onChange={(e) =>
                          updateRow(row.id, {
                            photos: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean),
                          })
                        }
                      />
                    </details>
                  </TabsContent>

                  {/* ITINERARY */}
                  <TabsContent value="itinerary" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base">Itinerary timeline</Label>
                      <Button type="button" size="sm" variant="outline" onClick={() => addDay(row.id)}>
                        <Plus className="w-3 h-3 mr-1" /> Add day
                      </Button>
                    </div>

                    {row.itinerary.length === 0 && (
                      <p className="text-sm text-muted-foreground italic">No days yet. Add the first day to begin.</p>
                    )}

                    <div className="space-y-4">
                      {row.itinerary.map((day, dayIdx) => {
                        const segments = ensureSegments(day);
                        return (
                          <div key={dayIdx} className="border rounded-lg p-4 bg-muted/30 space-y-3">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 rounded bg-accent-orange text-white text-xs font-semibold whitespace-nowrap">
                                Day {day.day}
                              </span>
                              <Input
                                placeholder="Day title (e.g. Arrival & Old City)"
                                value={day.title || ""}
                                onChange={(e) => updateDay(row.id, dayIdx, { title: e.target.value })}
                                className="flex-1 h-9"
                              />
                              <Button type="button" size="sm" variant="ghost" onClick={() => moveDay(row.id, dayIdx, -1)} disabled={dayIdx === 0} className="h-8 w-8 p-0">
                                <ArrowUp className="w-3.5 h-3.5" />
                              </Button>
                              <Button type="button" size="sm" variant="ghost" onClick={() => moveDay(row.id, dayIdx, 1)} disabled={dayIdx === row.itinerary.length - 1} className="h-8 w-8 p-0">
                                <ArrowDown className="w-3.5 h-3.5" />
                              </Button>
                              <Button type="button" size="sm" variant="ghost" onClick={() => removeDay(row.id, dayIdx)} className="h-8 w-8 p-0 text-destructive">
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>

                            <div className="space-y-3">
                              {PERIODS.map(({ key, label, Icon, color }) => {
                                const seg = segments.find((s) => s.period === key)!;
                                const ids = seg.items.map((_, i) => `${dayIdx}-${key}-${i}`);
                                const onDragEnd = (e: DragEndEvent) => {
                                  const { active, over } = e;
                                  if (!over || active.id === over.id) return;
                                  const oldIdx = ids.indexOf(String(active.id));
                                  const newIdx = ids.indexOf(String(over.id));
                                  if (oldIdx < 0 || newIdx < 0) return;
                                  updateSegment(row.id, dayIdx, key, arrayMove(seg.items, oldIdx, newIdx));
                                };
                                return (
                                  <div key={key} className="rounded-md border bg-background/60 p-3">
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center gap-2">
                                        <Icon className={`w-4 h-4 ${color}`} />
                                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
                                      </div>
                                      <Button
                                        type="button"
                                        size="sm"
                                        variant="ghost"
                                        className="h-7 text-xs"
                                        onClick={() => updateSegment(row.id, dayIdx, key, [...seg.items, { title: "", location: "" }])}
                                      >
                                        <Plus className="w-3 h-3 mr-1" /> Add item
                                      </Button>
                                    </div>
                                    {seg.items.length === 0 ? (
                                      <p className="text-xs text-muted-foreground italic px-1">No items</p>
                                    ) : (
                                      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
                                        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
                                          <div className="space-y-2">
                                            {seg.items.map((item, i) => (
                                              <SortableItemRow
                                                key={ids[i]}
                                                id={ids[i]}
                                                item={item}
                                                onChange={(patch) =>
                                                  updateSegment(
                                                    row.id,
                                                    dayIdx,
                                                    key,
                                                    seg.items.map((it, j) => (j === i ? { ...it, ...patch } : it)),
                                                  )
                                                }
                                                onRemove={() =>
                                                  updateSegment(
                                                    row.id,
                                                    dayIdx,
                                                    key,
                                                    seg.items.filter((_, j) => j !== i),
                                                  )
                                                }
                                              />
                                            ))}
                                          </div>
                                        </SortableContext>
                                      </DndContext>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Sticky save bar */}
                <div className="sticky bottom-0 -mx-4 -mb-4 mt-4 px-4 py-3 border-t bg-card/95 backdrop-blur flex justify-end">
                  <Button type="button" onClick={() => save(row)} disabled={savingId === row.id}>
                    {savingId === row.id ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Save changes
                  </Button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
