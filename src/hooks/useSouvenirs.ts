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

export interface Souvenir {
  id: string;
  name_en: string;
  name_zh_tw: string;
  name_zh_cn: string;
  description_en: string;
  description_zh_tw: string;
  description_zh_cn: string;
  price: number;
  image_url: string | null;
  is_active: boolean;
  display_order: number;
  sizes: SouvenirSize[];
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
    if (ids.length > 0) {
      const { data: sizeRows } = await supabase
        .from("souvenir_sizes")
        .select("*")
        .in("souvenir_id", ids)
        .order("display_order", { ascending: true });
      sizes = (sizeRows as SouvenirSize[]) ?? [];
    }
    setItems(
      souvenirs.map((s) => ({
        ...(s as Omit<Souvenir, "sizes">),
        sizes: sizes.filter((sz) => sz.souvenir_id === s.id),
      }))
    );
    setIsLoading(false);
  }, [opts.includeInactive]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { items, isLoading, refetch: fetchData };
}
