import { Plane, MapPin, Users, Shield } from "lucide-react";
import { AnimatedCounter } from "./AnimatedCounter";
import { useLanguage } from "@/contexts/LanguageContext";

export function StatsSection() {
  const { t } = useLanguage();

  const stats = [
    { end: 10000, suffix: "+", label: t("about.stats.safeJumps"), icon: <Plane className="w-6 h-6" /> },
    { end: 15, suffix: "+", label: t("about.stats.yearsExperience"), icon: <Shield className="w-6 h-6" /> },
    { end: 6, suffix: "", label: t("about.stats.locations"), icon: <MapPin className="w-6 h-6" /> },
    { end: 100, suffix: "%", label: t("about.stats.safetyRecord"), icon: <Users className="w-6 h-6" /> },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20 max-w-4xl mx-auto">
      {stats.map((stat, index) => (
        <AnimatedCounter
          key={index}
          end={stat.end}
          suffix={stat.suffix}
          label={stat.label}
          icon={stat.icon}
          duration={2 + index * 0.3}
        />
      ))}
    </div>
  );
}
