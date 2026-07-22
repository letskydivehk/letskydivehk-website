import { Clock, RefreshCw } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCreditBalance } from "@/hooks/useCreditBalance";
import { rewardsCopy as c, pick } from "@/lib/rewardsCopy";

const renewNote = {
  en: "Points valid 365 days — any credit activity auto-renews all unexpired points.",
  "zh-TW": "積分有效期 365 天，只要有任何積分活動即自動續期。",
  "zh-CN": "积分有效期 365 天，只要有任何积分活动即自动续期。",
} as const;

export function ExpiringCreditsNote() {
  const { language } = useLanguage();
  const { balance, expiring } = useCreditBalance();
  if (balance === null) return null;
  const renewMsg = renewNote[language as keyof typeof renewNote] ?? renewNote.en;
  return (
    <div className="space-y-2 mt-2">
      {expiring && (
        <div className="flex items-start gap-2 p-2.5 rounded-md bg-amber-500/10 border border-amber-500/20">
          <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
            {pick(c.expiringSoonPrefix, language)
              .replace("{total}", String(balance))
              .replace("{amount}", String(expiring.amount))
              .replace("{days}", String(expiring.days))}
          </p>
        </div>
      )}
      <div className="flex items-start gap-2 p-2.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">
        <RefreshCw className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
        <p className="text-xs text-emerald-700 dark:text-emerald-300 leading-relaxed">{renewMsg}</p>
      </div>
    </div>
  );
}

