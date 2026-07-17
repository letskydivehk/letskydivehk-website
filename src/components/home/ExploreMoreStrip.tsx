import { Link } from "react-router-dom";
import { Compass, Users, Gift, Sparkles, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function ExploreMoreStrip() {
  const { t } = useLanguage();

  const cards = [
    {
      to: "/quiz",
      icon: Compass,
      title: t("quiz.cta.title"),
      sub: t("quiz.cta.badge"),
      accent: "from-sky-500/20 to-sky-400/5",
      iconColor: "text-sky-400",
    },
    {
      to: "/membership",
      icon: Users,
      title: t("referral.banner.title"),
      sub: t("referral.banner.cta"),
      accent: "from-emerald-500/20 to-emerald-400/5",
      iconColor: "text-emerald-400",
    },
    {
      to: "/membership/tiers",
      icon: Gift,
      title: t("rewards.tabTiers") || "Rewards",
      sub: t("rewards.heroSub") || "",
      accent: "from-amber-500/20 to-amber-400/5",
      iconColor: "text-amber-400",
    },
    {
      to: "/souvenirs",
      icon: Sparkles,
      title: t("souvenirs.teaser.title"),
      sub: t("souvenirs.teaser.badge"),
      accent: "from-fuchsia-500/20 to-fuchsia-400/5",
      iconColor: "text-fuchsia-400",
    },
  ];

  return (
    <section aria-label="Explore more" className="py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {cards.map(({ to, icon: Icon, title, sub, accent, iconColor }) => (
            <Link
              key={to}
              to={to}
              className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${accent} backdrop-blur-sm p-4 hover:border-white/25 hover:-translate-y-0.5 transition-all`}
            >
              <div className="flex items-center justify-between mb-3">
                <Icon className={`w-6 h-6 ${iconColor}`} />
                <ArrowRight className="w-4 h-4 text-foreground/50 group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
              </div>
              <h3 className="text-sm md:text-base font-bold text-foreground leading-snug line-clamp-2">
                {title}
              </h3>
              {sub && (
                <p className="text-xs text-foreground/60 mt-1 line-clamp-1">{sub}</p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
