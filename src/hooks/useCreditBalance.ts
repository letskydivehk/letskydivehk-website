import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export function useCreditBalance() {
  const { user } = useAuth();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setBalance(null);
      return;
    }
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      const { data } = await supabase.rpc("get_credit_balance", { _user_id: user.id });
      if (!cancelled) {
        setBalance(typeof data === "number" ? data : 0);
        setLoading(false);
      }
    };
    load();

    // Live-update when transactions change for this user
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

  return { balance, loading };
}
