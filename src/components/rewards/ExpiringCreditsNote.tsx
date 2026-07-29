import { Clock, RefreshCw, CalendarClock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCreditBalance } from "@/hooks/useCreditBalance";
import { rewardsCopy as c, pick } from "@/lib/rewardsCopy";

const renewNote = {
  en: "Points valid 365 days — any credit activity auto-renews all unexpired points.",
  "zh-TW": "積分有效期 365 天，只要有任何積分活動即自動續期。",
  "zh-CN": "积分有效期 365 天，只要有任何积分活动即自动续期。",
} as const;

const expiryLabel = {
  en: "Points expiry date",
  "zh-TW": "積分到期日",
  "zh-CN": "积分到期日",
} as const;

const daysLeftLabel = {
  en: "{n} days left",
  "zh-TW": "尚餘 {n} 天",
  "zh-CN": "尚余 {n} 天",
} as const;

const localeMap: Record<string, string> = {
  en: "en-US",
  "zh-TW": "zh-HK",
  "zh-CN": "zh-CN",
};

export function ExpiringCreditsNote() {
  const { language } = useLanguage();
  const { balance, expiring, nextExpiry } = useCreditBalance();
  if (balance === null) return null;
  const renewMsg = renewNote[language as keyof typeof renewNote] ?? renewNote.en;
  const expiryTitle = expiryLabel[language as keyof typeof expiryLabel] ?? expiryLabel.en;
  const daysTpl = daysLeftLabel[language as keyof typeof daysLeftLabel] ?? daysLeftLabel.en;
  const formattedDate = nextExpiry
    ? new Date(nextExpiry.expiresAt).toLocaleDateString(localeMap[language] ?? "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="space-y-2 mt-2">
      {formattedDate && (
        <div className="flex items-center justify-between gap-2 p-2.5 rounded-md bg-accent-blue/10 border border-accent-blue/20">
          <span className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <CalendarClock className="w-3.5 h-3.5 text-accent-blue shrink-0" />
            {expiryTitle}
          </span>
          <span className="text-xs font-bold text-foreground text-right">
            {formattedDate}
            <span className="block font-normal text-muted-foreground">
              {daysTpl.replace("{n}", String(nextExpiry!.days))}
            </span>
          </span>
        </div>
      )}
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


