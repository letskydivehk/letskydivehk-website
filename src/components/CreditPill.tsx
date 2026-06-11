import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Coins } from "lucide-react";
import { useCreditBalance } from "@/hooks/useCreditBalance";
import { useAuth } from "@/contexts/AuthContext";

export function CreditPill() {
  const { user } = useAuth();
  const { balance } = useCreditBalance();

  if (!user || balance === null) return null;

  return (
    <Link to="/membership" aria-label={`Credit balance: $${balance}`}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-amber-400/90 to-orange-500/90 text-white font-bold px-3 py-1.5 rounded-full border border-white/30 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      >
        <Coins className="w-3.5 h-3.5" />
        <span className="text-sm tabular-nums">${balance}</span>
      </motion.div>
    </Link>
  );
}
