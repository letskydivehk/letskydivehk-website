import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2, Save, ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import type { ItineraryDay, LocationService } from "@/hooks/useLocationServices";

interface TourRow extends LocationService {
  locationName?: string;
}

export function AdminToursPanel() {
  const qc = useQueryClient();
  const [rows, setRows] = useState<TourRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("location_services")
      .select("*, locations(Name)")
      .eq("service_type", "package")
      .order("display_order");
    if (error) {
      toast.error("Failed to load tours");
      setLoading(false);
      return;
    }
    setRows(
      (data || []).map((d: any) => ({
        ...d,
        itinerary: Array.isArray(d.itinerary) ? d.itinerary : [],
        photos: Array.isArray(d.photos) ? d.photos : [],
        locationName: d.locations?.Name,
      })) as TourRow[],
    );
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const updateRow = (id: string, patch: Partial<TourRow>) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const updateDay = (id: string, idx: number, patch: Partial<ItineraryDay>) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, itinerary: r.itinerary.map((d, i) => (i === idx ? { ...d, ...patch } : d)) }
          : r,
      ),
    );
  };

  const addDay = (id: string) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              itinerary: [
                ...r.itinerary,
                { day: r.itinerary.length + 1, title: "", location: "", accommodation: "", transportation: "", meals: "", activities: [], notes: "" },
              ],
            }
          : r,
      ),
    );
  };

  const removeDay = (id: string, idx: number) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, itinerary: r.itinerary.filter((_, i) => i !== idx).map((d, i) => ({ ...d, day: i + 1 })) }
          : r,
      ),
    );
  };

  const save = async (row: TourRow) => {
    setSavingId(row.id);
    const { error } = await supabase
      .from("location_services")
      .update({
        service_name: row.service_name,
        price_display: row.price_display,
        deposit_amount: row.deposit_amount,
        includes: row.includes,
        photos: row.photos,
        itinerary: row.itinerary as any,
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
        <p className="text-sm text-muted-foreground">Edit tour pricing, deposit, includes, and itinerary per location.</p>
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
                  {row.service_name} · {row.price_display} · Deposit HKD ${row.deposit_amount} · {row.itinerary.length} day(s)
                </div>
              </div>
              {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {isOpen && (
              <div className="p-4 border-t space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <Label>Service name</Label>
                    <Input value={row.service_name} onChange={(e) => updateRow(row.id, { service_name: e.target.value })} />
                  </div>
                  <div>
                    <Label>Price display</Label>
                    <Input value={row.price_display} onChange={(e) => updateRow(row.id, { price_display: e.target.value })} />
                  </div>
                  <div>
                    <Label>Deposit (HKD)</Label>
                    <Input
                      type="number"
                      value={row.deposit_amount}
                      onChange={(e) => updateRow(row.id, { deposit_amount: Number(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                <div>
                  <Label>Includes (one per line)</Label>
                  <Textarea
                    rows={4}
                    value={(row.includes || []).join("\n")}
                    onChange={(e) =>
                      updateRow(row.id, { includes: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })
                    }
                  />
                </div>

                <div>
                  <Label>Photo URLs (one per line)</Label>
                  <Textarea
                    rows={4}
                    placeholder="https://images.unsplash.com/photo-..."
                    value={(row.photos || []).join("\n")}
                    onChange={(e) =>
                      updateRow(row.id, { photos: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })
                    }
                  />
                  {row.photos?.length > 0 && (
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {row.photos.map((url, i) => (
                        <img key={i} src={url} alt="" className="w-20 h-16 object-cover rounded border" />
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-base">Itinerary</Label>
                    <Button type="button" size="sm" variant="outline" onClick={() => addDay(row.id)}>
                      <Plus className="w-3 h-3 mr-1" /> Add day
                    </Button>
                  </div>

                  {row.itinerary.length === 0 && (
                    <p className="text-sm text-muted-foreground italic">No days yet. Add the first day to begin.</p>
                  )}

                  <div className="space-y-3">
                    {row.itinerary.map((day, idx) => (
                      <div key={idx} className="border rounded-md p-3 bg-muted/30 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">Day {day.day}</span>
                          <Button type="button" size="sm" variant="ghost" onClick={() => removeDay(row.id, idx)}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <Input placeholder="Title" value={day.title || ""} onChange={(e) => updateDay(row.id, idx, { title: e.target.value })} />
                          <Input placeholder="Location" value={day.location || ""} onChange={(e) => updateDay(row.id, idx, { location: e.target.value })} />
                          <Input placeholder="Accommodation" value={day.accommodation || ""} onChange={(e) => updateDay(row.id, idx, { accommodation: e.target.value })} />
                          <Input placeholder="Transportation" value={day.transportation || ""} onChange={(e) => updateDay(row.id, idx, { transportation: e.target.value })} />
                          <Input placeholder="Meals" value={day.meals || ""} onChange={(e) => updateDay(row.id, idx, { meals: e.target.value })} />
                          <Input
                            placeholder="Activities (comma-separated)"
                            value={(day.activities || []).join(", ")}
                            onChange={(e) =>
                              updateDay(row.id, idx, {
                                activities: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                              })
                            }
                          />
                        </div>
                        <Textarea placeholder="Notes" rows={2} value={day.notes || ""} onChange={(e) => updateDay(row.id, idx, { notes: e.target.value })} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="button" onClick={() => save(row)} disabled={savingId === row.id}>
                    {savingId === row.id ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Save
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
