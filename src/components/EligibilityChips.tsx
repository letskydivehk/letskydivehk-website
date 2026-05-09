import { CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function EligibilityChips() {
  const { t } = useLanguage();
  const chips = ["eligibility.age", "eligibility.weight", "eligibility.health"];
  return (
    <div className="flex flex-col items-center gap-2 mb-8">
      <span className="text-white/70 text-xs uppercase tracking-wider">
        {t("eligibility.title")}
      </span>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {chips.map((c) => (
          <span
            key={c}
            className="inline-flex items-center gap-1.5 text-white text-sm bg-emerald-500/20 border border-emerald-300/30 rounded-full px-3 py-1"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
            {t(c)}
          </span>
        ))}
      </div>
    </div>
  );
}
