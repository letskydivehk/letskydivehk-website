import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Coins } from "lucide-react";
import { useCreditBalance } from "@/hooks/useCreditBalance";
import { useAuth } from "@/contexts/AuthContext";

export function CreditPill() {
  const { user } = useAuth();
  const { balance } = useCreditBalance();
  const prev = useRef<number | null>(null);
  const [pulse, setPulse] = useState(false);

  const mv = useMotionValue(0);
  const display = useTransform(mv, (v) => `$${Math.round(v)}`);

  useEffect(() => {
    if (balance === null || balance === undefined) return;
    const from = prev.current ?? balance;
    const controls = animate(mv, balance, {
      duration: from === balance ? 0 : 0.7,
      ease: [0.22, 1, 0.36, 1],
    });
    if (prev.current !== null && balance > prev.current) {
      setPulse(true);
      const t = setTimeout(() => setPulse(false), 1200);
      prev.current = balance;
      return () => {
        controls.stop();
        clearTimeout(t);
      };
    }
    prev.current = balance;
    return () => controls.stop();
  }, [balance, mv]);

  if (!user || balance === null) return null;

  return (
    <Link to="/membership" aria-label={`Credit balance: $${balance}`}>
      <motion.div
        whileHover={{ scale: 1.06, y: -1 }}
        whileTap={{ scale: 0.94 }}
        transition={{ type: "spring", stiffness: 380, damping: 22 }}
        className={`hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-amber-400/95 to-orange-500/95 text-white font-bold px-3 py-1.5 rounded-full border border-white/30 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
          pulse ? "animate-glow-pulse" : ""
        }`}
      >
        <Coins className="w-3.5 h-3.5" />
        <motion.span className="text-sm tabular-nums">{display}</motion.span>
      </motion.div>
    </Link>
  );
}
