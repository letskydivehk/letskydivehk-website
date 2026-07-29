import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export interface ExpiringInfo {
  amount: number;
  days: number;
  expiresAt: string;
}

export function useCreditBalance() {
  const { user } = useAuth();
  const [balance, setBalance] = useState<number | null>(null);
  const [expiring, setExpiring] = useState<ExpiringInfo | null>(null);
  const [nextExpiry, setNextExpiry] = useState<ExpiringInfo | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setBalance(null);
      setExpiring(null);
      setNextExpiry(null);
      return;
    }
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      const [{ data: bal }, { data: exp }, { data: all }] = await Promise.all([
        supabase.rpc("get_credit_balance", { _user_id: user.id }),
        (supabase as any).rpc("get_expiring_credits", { _user_id: user.id, _days: 30 }),
        (supabase as any).rpc("get_expiring_credits", { _user_id: user.id, _days: 400 }),
      ]);
      if (cancelled) return;
      setBalance(typeof bal === "number" ? bal : 0);
      if (Array.isArray(exp) && exp.length > 0) {
        const total = exp.reduce((s: number, r: any) => s + (r.amount || 0), 0);
        const soonest = exp[0];
        setExpiring({
          amount: total,
          days: soonest.days_remaining ?? 0,
          expiresAt: soonest.expires_at,
        });
      } else {
        setExpiring(null);
      }
      if (Array.isArray(all) && all.length > 0) {
        const soonest = all[0];
        setNextExpiry({
          amount: all.reduce((s: number, r: any) => s + (r.amount || 0), 0),
          days: soonest.days_remaining ?? 0,
          expiresAt: soonest.expires_at,
        });
      } else {
        setNextExpiry(null);
      }
      setLoading(false);
    };
    load();


    const channel = supabase
      .channel(`credit-balance-${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "credit_transactions", filter: `user_id=eq.${user.id}` },
        () => load(),
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [user]);

  return { balance, expiring, nextExpiry, loading };
}
