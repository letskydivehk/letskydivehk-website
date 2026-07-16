import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export interface UserMagnet {
  id: string;
  tier: "silver" | "gold" | "platinum" | "diamond";
  jumps_at_award: number;
  coupon_code: string | null;
  coupon_discount: number | null;
  coupon_expires_at: string | null;
  coupon_used_at: string | null;
  awarded_at: string;
}

export function useUserMagnets() {
  const { user } = useAuth();
  const [magnets, setMagnets] = useState<UserMagnet[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setMagnets([]);
      return;
    }
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      const { data } = await (supabase as any)
        .from("user_magnets")
        .select("*")
        .eq("user_id", user.id)
        .order("awarded_at", { ascending: true });
      if (!cancelled) {
        setMagnets((data as UserMagnet[]) || []);
        setLoading(false);
      }
    };
    load();

    const channel = supabase
      .channel(`user-magnets-${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "user_magnets", filter: `user_id=eq.${user.id}` },
        () => load(),
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [user]);

  return { magnets, loading };
}
