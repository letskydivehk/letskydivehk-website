import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSouvenirs, type Souvenir } from "@/hooks/useSouvenirs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Upload, Plus, Trash2, Save } from "lucide-react";
import { toast } from "sonner";

export function AdminSouvenirsPanel() {
  const { items, isLoading, refetch } = useSouvenirs({ includeInactive: true });
  const [editing, setEditing] = useState<Record<string, Souvenir>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  useEffect(() => {
    const map: Record<string, Souvenir> = {};
    items.forEach((it) => {
      map[it.id] = JSON.parse(JSON.stringify(it));
    });
    setEditing(map);
  }, [items]);

  const update = (id: string, patch: Partial<Souvenir>) => {
    setEditing((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));
  };

  const updateSize = (id: string, sizeId: string, patch: Partial<Souvenir["sizes"][number]>) => {
    setEditing((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        sizes: prev[id].sizes.map((s) => (s.id === sizeId ? { ...s, ...patch } : s)),
      },
    }));
  };

  const updateTier = (id: string, idx: number, patch: Partial<Souvenir["bulk_pricing"][number]>) => {
    setEditing((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        bulk_pricing: prev[id].bulk_pricing.map((t, i) => (i === idx ? { ...t, ...patch } : t)),
      },
    }));
  };

  const addTier = (id: string) => {
    setEditing((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        bulk_pricing: [...prev[id].bulk_pricing, { qty: 1, original_price: 0, sale_price: 0 }],
      },
    }));
  };

  const removeTier = (id: string, idx: number) => {
    setEditing((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        bulk_pricing: prev[id].bulk_pricing.filter((_, i) => i !== idx),
      },
    }));
  };

  const addSize = async (souvenirId: string) => {
    const current = editing[souvenirId];
    if (!current) return;
    const nextOrder = (current.sizes.reduce((m, s) => Math.max(m, s.display_order), 0) || 0) + 1;
    const { error } = await supabase.from("souvenir_sizes").insert({
      souvenir_id: souvenirId,
      size_label: "New",
      display_order: nextOrder,
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Size added");
    refetch();
  };

  const removeSize = async (sizeId: string) => {
    if (!confirm("Remove this size?")) return;
    const { error } = await supabase.from("souvenir_sizes").delete().eq("id", sizeId);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Size removed");
    refetch();
  };

  const save = async (id: string) => {
    const item = editing[id];
    if (!item) return;
    setSavingId(id);
    try {
      const { error: e1 } = await supabase
        .from("souvenirs")
        .update({
          name_en: item.name_en,
          name_zh_tw: item.name_zh_tw,
          name_zh_cn: item.name_zh_cn,
          description_en: item.description_en,
          description_zh_tw: item.description_zh_tw,
          description_zh_cn: item.description_zh_cn,
          price: item.price,
          original_price: item.original_price,
          image_url: item.image_url,
          is_active: item.is_active,
          display_order: item.display_order,
          customisation_required: item.customisation_required,
          vendor_note_en: item.vendor_note_en,
          vendor_note_zh_tw: item.vendor_note_zh_tw,
          vendor_note_zh_cn: item.vendor_note_zh_cn,
          bulk_pricing: item.bulk_pricing as unknown as never,
        })
        .eq("id", id);
      if (e1) throw e1;

      for (const sz of item.sizes) {
        const { error } = await supabase
          .from("souvenir_sizes")
          .update({
            size_label: sz.size_label,
            height_range: sz.height_range,
            weight_range: sz.weight_range,
            display_order: sz.display_order,
          })
          .eq("id", sz.id);
        if (error) throw error;
      }
      toast.success("Saved");
      refetch();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSavingId(null);
    }
  };

  const uploadImage = async (id: string, file: File) => {
    setUploadingId(id);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `souvenirs/${id}-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("gallery").upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from("gallery").getPublicUrl(path);
      update(id, { image_url: pub.publicUrl });
      // persist immediately
      const { error: dbErr } = await supabase
        .from("souvenirs")
        .update({ image_url: pub.publicUrl })
        .eq("id", id);
      if (dbErr) throw dbErr;
      toast.success("Image uploaded");
      refetch();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingId(null);
    }
  };

  const addSouvenir = async () => {
    const { data, error } = await supabase
      .from("souvenirs")
      .insert({
        name_en: "New product",
        name_zh_tw: "新產品",
        name_zh_cn: "新产品",
        price: 0,
        display_order: items.length,
      })
      .select()
      .single();
    if (error || !data) {
      toast.error(error?.message || "Failed to create");
      return;
    }
    // add default size rows
    const labels = ["S", "M", "L", "XL", "2XL"];
    await supabase.from("souvenir_sizes").insert(
      labels.map((label, i) => ({
        souvenir_id: data.id,
        size_label: label,
        display_order: i + 1,
      }))
    );
    toast.success("Product added");
    refetch();
  };

  const removeSouvenir = async (id: string) => {
    if (!confirm("Delete this souvenir? This cannot be undone.")) return;
    const { error } = await supabase.from("souvenirs").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Deleted");
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={addSouvenir} className="gap-2">
          <Plus className="w-4 h-4" /> Add souvenir
        </Button>
      </div>

      {Object.values(editing).map((item) => (
        <Card key={item.id} className="p-6 space-y-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h3 className="text-lg font-bold">{item.name_en || "(no name)"}</h3>
              <p className="text-sm text-muted-foreground">HK${item.price}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label htmlFor={`active-${item.id}`} className="text-sm">Active</Label>
                <Switch
                  id={`active-${item.id}`}
                  checked={item.is_active}
                  onCheckedChange={(c) => update(item.id, { is_active: c })}
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeSouvenir(item.id)}
                className="text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Image */}
          <div>
            <Label className="mb-2 block">Product image</Label>
            <div className="flex items-center gap-4">
              <div className="w-32 h-32 rounded-lg border bg-muted/30 overflow-hidden flex items-center justify-center">
                {item.image_url ? (
                  <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs text-muted-foreground">No image</span>
                )}
              </div>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) uploadImage(item.id, f);
                  }}
                />
                <Button asChild variant="outline" className="gap-2" disabled={uploadingId === item.id}>
                  <span>
                    {uploadingId === item.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    Upload image
                  </span>
                </Button>
              </label>
            </div>
          </div>

          {/* Names */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label>Name (English)</Label>
              <Input value={item.name_en} onChange={(e) => update(item.id, { name_en: e.target.value })} />
            </div>
            <div>
              <Label>Name (繁體)</Label>
              <Input value={item.name_zh_tw} onChange={(e) => update(item.id, { name_zh_tw: e.target.value })} />
            </div>
            <div>
              <Label>Name (简体)</Label>
              <Input value={item.name_zh_cn} onChange={(e) => update(item.id, { name_zh_cn: e.target.value })} />
            </div>
          </div>

          {/* Descriptions */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label>Description (English)</Label>
              <Textarea
                rows={3}
                value={item.description_en}
                onChange={(e) => update(item.id, { description_en: e.target.value })}
              />
            </div>
            <div>
              <Label>Description (繁體)</Label>
              <Textarea
                rows={3}
                value={item.description_zh_tw}
                onChange={(e) => update(item.id, { description_zh_tw: e.target.value })}
              />
            </div>
            <div>
              <Label>Description (简体)</Label>
              <Textarea
                rows={3}
                value={item.description_zh_cn}
                onChange={(e) => update(item.id, { description_zh_cn: e.target.value })}
              />
            </div>
          </div>

          {/* Vendor / collaboration note */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label>Vendor note (English)</Label>
              <Input
                placeholder="e.g. In collaboration with Bingomagnetic"
                value={item.vendor_note_en ?? ""}
                onChange={(e) => update(item.id, { vendor_note_en: e.target.value || null })}
              />
            </div>
            <div>
              <Label>Vendor note (繁體)</Label>
              <Input
                value={item.vendor_note_zh_tw ?? ""}
                onChange={(e) => update(item.id, { vendor_note_zh_tw: e.target.value || null })}
              />
            </div>
            <div>
              <Label>Vendor note (简体)</Label>
              <Input
                value={item.vendor_note_zh_cn ?? ""}
                onChange={(e) => update(item.id, { vendor_note_zh_cn: e.target.value || null })}
              />
            </div>
          </div>

          {/* Price + original price + customisation toggle */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label>Price (HKD)</Label>
              <Input
                type="number"
                value={item.price}
                onChange={(e) => update(item.id, { price: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label>Original price (HKD, optional)</Label>
              <Input
                type="number"
                placeholder="Leave blank for no strike-through"
                value={item.original_price ?? ""}
                onChange={(e) => {
                  const v = e.target.value;
                  update(item.id, { original_price: v === "" ? null : parseInt(v) || 0 });
                }}
              />
            </div>
            <div className="flex items-end gap-3">
              <div className="flex items-center gap-2 pb-2">
                <Switch
                  id={`cust-${item.id}`}
                  checked={item.customisation_required}
                  onCheckedChange={(c) => update(item.id, { customisation_required: c })}
                />
                <Label htmlFor={`cust-${item.id}`}>Require photo upload</Label>
              </div>
            </div>
          </div>

          {/* Bulk pricing tiers */}
          <div>
            <Label className="mb-2 block">Bulk pricing tiers</Label>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Original (HKD)</TableHead>
                  <TableHead>Sale (HKD)</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {item.bulk_pricing.map((tier, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <Input
                        type="number"
                        value={tier.qty}
                        onChange={(e) => updateTier(item.id, idx, { qty: parseInt(e.target.value) || 0 })}
                        className="w-24"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={tier.original_price}
                        onChange={(e) =>
                          updateTier(item.id, idx, { original_price: parseInt(e.target.value) || 0 })
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={tier.sale_price}
                        onChange={(e) =>
                          updateTier(item.id, idx, { sale_price: parseInt(e.target.value) || 0 })
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeTier(item.id, idx)}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button
              variant="outline"
              size="sm"
              onClick={() => addTier(item.id)}
              className="gap-2 mt-3"
            >
              <Plus className="w-4 h-4" /> Add tier
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Each row becomes a row in the bulk-pricing table on the product card. Set original = sale for "no discount" rows.
            </p>
          </div>

          {/* Size chart */}
          <div>
            <Label className="mb-2 block">Size chart</Label>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Size</TableHead>
                  <TableHead>Height range</TableHead>
                  <TableHead>Weight range</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {item.sizes.map((sz) => (
                  <TableRow key={sz.id}>
                    <TableCell>
                      <Input
                        value={sz.size_label}
                        onChange={(e) => updateSize(item.id, sz.id, { size_label: e.target.value })}
                        className="w-20"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        placeholder="e.g. 160-170 cm"
                        value={sz.height_range}
                        onChange={(e) => updateSize(item.id, sz.id, { height_range: e.target.value })}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        placeholder="e.g. 55-65 kg"
                        value={sz.weight_range}
                        onChange={(e) => updateSize(item.id, sz.id, { weight_range: e.target.value })}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSize(sz.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button
              variant="outline"
              size="sm"
              onClick={() => addSize(item.id)}
              className="gap-2 mt-3"
            >
              <Plus className="w-4 h-4" /> Add size (e.g. 3XL, 4XL)
            </Button>
          </div>

          {/* Edition design variants */}
          {item.customisation_required && (
            <VariantsEditor souvenirId={item.id} variants={item.variants} onChanged={refetch} />
          )}



          <div className="flex justify-end">
            <Button onClick={() => save(item.id)} disabled={savingId === item.id} className="gap-2">
              {savingId === item.id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save changes
            </Button>
          </div>
        </Card>
      ))}

      {items.length === 0 && (
        <p className="text-center text-muted-foreground py-12">No souvenirs yet. Click "Add souvenir" to create one.</p>
      )}
    </div>
  );
}

function VariantsEditor({
  souvenirId,
  variants,
  onChanged,
}: {
  souvenirId: string;
  variants: import("@/hooks/useSouvenirs").SouvenirVariant[];
  onChanged: () => void;
}) {
  type V = import("@/hooks/useSouvenirs").SouvenirVariant;
  const [draft, setDraft] = useState<Record<string, V>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const sb = supabase as unknown as {
    from: (t: string) => {
      insert: (rec: Record<string, unknown>) => Promise<{ error: { message: string } | null }>;
      update: (rec: Record<string, unknown>) => {
        eq: (col: string, val: string) => Promise<{ error: { message: string } | null }>;
      };
      delete: () => { eq: (col: string, val: string) => Promise<{ error: { message: string } | null }> };
    };
  };

  useEffect(() => {
    const map: Record<string, V> = {};
    variants.forEach((v) => (map[v.id] = { ...v }));
    setDraft(map);
  }, [variants]);

  const set = (id: string, patch: Partial<V>) =>
    setDraft((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));

  const add = async () => {
    const nextOrder = (variants.reduce((m, v) => Math.max(m, v.display_order), 0) || 0) + 1;
    const { error } = await sb.from("souvenir_variants").insert({
      souvenir_id: souvenirId,
      name_en: `Design ${nextOrder}`,
      name_zh_tw: `設計 ${nextOrder}`,
      name_zh_cn: `设计 ${nextOrder}`,
      display_order: nextOrder,
    });
    if (error) return toast.error(error.message);
    toast.success("Design added");
    onChanged();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this design?")) return;
    const { error } = await sb.from("souvenir_variants").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    onChanged();
  };

  const save = async (id: string) => {
    const v = draft[id];
    if (!v) return;
    setSavingId(id);
    try {
      const { error } = await sb
        .from("souvenir_variants")
        .update({
          name_en: v.name_en,
          name_zh_tw: v.name_zh_tw,
          name_zh_cn: v.name_zh_cn,
          display_order: v.display_order,
          is_active: v.is_active,
        })
        .eq("id", id);
      if (error) throw error;
      toast.success("Saved");
      onChanged();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSavingId(null);
    }
  };

  const uploadImage = async (id: string, file: File) => {
    setUploadingId(id);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `souvenir-variants/${id}-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("gallery").upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from("gallery").getPublicUrl(path);
      const { error: dbErr } = await sb
        .from("souvenir_variants")
        .update({ image_url: pub.publicUrl })
        .eq("id", id);
      if (dbErr) throw dbErr;
      toast.success("Image uploaded");
      onChanged();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingId(null);
    }
  };

  const list = Object.values(draft).sort((a, b) => a.display_order - b.display_order);

  return (
    <div>
      <Label className="mb-2 block">Edition designs ({list.length}/4)</Label>
      <p className="text-xs text-muted-foreground mb-3">
        Upload preset designs (e.g. Skydiving Edition). Customers pick any combination and quantity on the souvenirs page.
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {list.map((v) => (
          <div key={v.id} className="rounded-lg border p-3 space-y-2 bg-card">
            <div className="aspect-square rounded-md border bg-muted/30 overflow-hidden flex items-center justify-center">
              {v.image_url ? (
                <img src={v.image_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs text-muted-foreground">No image</span>
              )}
            </div>
            <label className="cursor-pointer block">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadImage(v.id, f);
                }}
              />
              <Button asChild variant="outline" size="sm" className="w-full gap-2" disabled={uploadingId === v.id}>
                <span>
                  {uploadingId === v.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                  Upload
                </span>
              </Button>
            </label>
            <Input placeholder="Name (EN)" value={v.name_en} onChange={(e) => set(v.id, { name_en: e.target.value })} />
            <Input placeholder="名稱 (繁)" value={v.name_zh_tw} onChange={(e) => set(v.id, { name_zh_tw: e.target.value })} />
            <Input placeholder="名称 (简)" value={v.name_zh_cn} onChange={(e) => set(v.id, { name_zh_cn: e.target.value })} />
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Switch checked={v.is_active} onCheckedChange={(c) => set(v.id, { is_active: c })} />
                <span className="text-xs">Active</span>
              </div>
              <Input
                type="number"
                className="w-16"
                value={v.display_order}
                onChange={(e) => set(v.id, { display_order: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="flex-1 gap-1" onClick={() => save(v.id)} disabled={savingId === v.id}>
                {savingId === v.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                Save
              </Button>
              <Button size="sm" variant="ghost" className="text-destructive" onClick={() => remove(v.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <Button variant="outline" size="sm" className="gap-2 mt-3" onClick={add} disabled={list.length >= 4}>
        <Plus className="w-4 h-4" /> Add design slot {list.length >= 4 ? "(max 4)" : ""}
      </Button>
    </div>
  );
}
