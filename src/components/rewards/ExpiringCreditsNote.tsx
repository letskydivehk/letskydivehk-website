import { Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCreditBalance } from "@/hooks/useCreditBalance";
import { rewardsCopy as c, pick } from "@/lib/rewardsCopy";

export function ExpiringCreditsNote() {
  const { language } = useLanguage();
  const { balance, expiring } = useCreditBalance();
  if (!expiring || balance === null) return null;
  const msg = pick(c.expiringSoonPrefix, language)
    .replace("{total}", String(balance))
    .replace("{amount}", String(expiring.amount))
    .replace("{days}", String(expiring.days));
  return (
    <div className="flex items-start gap-2 p-2.5 mt-2 rounded-md bg-amber-500/10 border border-amber-500/20">
      <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
      <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">{msg}</p>
    </div>
  );
}
