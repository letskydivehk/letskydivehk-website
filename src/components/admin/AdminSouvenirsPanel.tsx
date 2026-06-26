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
          image_url: item.image_url,
          is_active: item.is_active,
          display_order: item.display_order,
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

          {/* Price */}
          <div className="max-w-xs">
            <Label>Price (HKD)</Label>
            <Input
              type="number"
              value={item.price}
              onChange={(e) => update(item.id, { price: parseInt(e.target.value) || 0 })}
            />
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
