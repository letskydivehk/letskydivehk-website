import { ShieldCheck, Award, Users } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function TrustBar() {
  const { t } = useLanguage();
  const items = [
    { icon: Award, key: "trust.certified" },
    { icon: Users, key: "trust.experience" },
    { icon: ShieldCheck, key: "trust.safety" },
  ];
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-6">
      {items.map(({ icon: Icon, key }) => (
        <div
          key={key}
          className="inline-flex items-center gap-2 text-white/90 text-sm sm:text-base font-medium bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1.5"
        >
          <Icon className="w-4 h-4 text-accent-orange" />
          <span>{t(key)}</span>
        </div>
      ))}
    </div>
  );
}
