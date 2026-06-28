import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SouvenirSize {
  id: string;
  souvenir_id: string;
  size_label: string;
  height_range: string;
  weight_range: string;
  display_order: number;
}

export interface SouvenirVariant {
  id: string;
  souvenir_id: string;
  name_en: string;
  name_zh_tw: string;
  name_zh_cn: string;
  image_url: string | null;
  display_order: number;
  is_active: boolean;
}

export interface BulkPricingTier {
  qty: number;
  original_price: number;
  sale_price: number;
}

export interface Souvenir {
  id: string;
  name_en: string;
  name_zh_tw: string;
  name_zh_cn: string;
  description_en: string;
  description_zh_tw: string;
  description_zh_cn: string;
  vendor_note_en: string | null;
  vendor_note_zh_tw: string | null;
  vendor_note_zh_cn: string | null;
  price: number;
  original_price: number | null;
  bulk_pricing: BulkPricingTier[];
  customisation_required: boolean;
  image_url: string | null;
  is_active: boolean;
  display_order: number;
  sizes: SouvenirSize[];
  variants: SouvenirVariant[];
}

export function useSouvenirs(opts: { includeInactive?: boolean } = {}) {
  const [items, setItems] = useState<Souvenir[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    let query = supabase.from("souvenirs").select("*").order("display_order", { ascending: true });
    if (!opts.includeInactive) query = query.eq("is_active", true);
    const { data: souvenirs, error } = await query;
    if (error || !souvenirs) {
      setItems([]);
      setIsLoading(false);
      return;
    }
    const ids = souvenirs.map((s) => s.id);
    let sizes: SouvenirSize[] = [];
    let variants: SouvenirVariant[] = [];
    if (ids.length > 0) {
      const [sizesRes, variantsRes] = await Promise.all([
        supabase
          .from("souvenir_sizes")
          .select("*")
          .in("souvenir_id", ids)
          .order("display_order", { ascending: true }),
        (supabase as unknown as {
          from: (t: string) => {
            select: (s: string) => {
              in: (col: string, vals: string[]) => {
                order: (
                  col: string,
                  o: { ascending: boolean }
                ) => Promise<{ data: SouvenirVariant[] | null }>;
              };
            };
          };
        })
          .from("souvenir_variants")
          .select("*")
          .in("souvenir_id", ids)
          .order("display_order", { ascending: true }),
      ]);
      sizes = (sizesRes.data as SouvenirSize[]) ?? [];
      variants = (variantsRes.data as SouvenirVariant[]) ?? [];
      if (!opts.includeInactive) {
        variants = variants.filter((v) => v.is_active);
      }
    }
    setItems(
      souvenirs.map((s) => {
        const rec = s as Record<string, unknown>;
        const rawBulk = rec.bulk_pricing;
        const bulk: BulkPricingTier[] = Array.isArray(rawBulk)
          ? (rawBulk as BulkPricingTier[])
          : [];
        return {
          ...(s as Omit<Souvenir, "sizes" | "bulk_pricing" | "variants">),
          bulk_pricing: bulk,
          sizes: sizes.filter((sz) => sz.souvenir_id === s.id),
          variants: variants.filter((v) => v.souvenir_id === s.id),
        } as Souvenir;
      })
    );
    setIsLoading(false);
  }, [opts.includeInactive]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { items, isLoading, refetch: fetchData };
}
