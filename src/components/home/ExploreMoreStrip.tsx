import { Link } from "react-router-dom";
import { Compass, Users, Gift, Sparkles, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function ExploreMoreStrip() {
  const { t, language } = useLanguage();

  const cards = [
    {
      to: "/quiz",
      icon: Compass,
      title: t("quiz.cta.title"),
      sub: t("quiz.cta.badge"),
      accent: "from-accent-blue/10 to-card/80",
      iconColor: "text-accent-blue",
    },
    {
      to: "/promotions",
      icon: Users,
      title: t("referral.banner.title"),
      sub: t("referral.banner.cta"),
      accent: "from-accent-emerald/10 to-card/80",
      iconColor: "text-accent-emerald",
    },
    {
      to: "/membership/tiers",
      icon: Gift,
      title: language === "en" ? "Rewards & Tiers" : language === "zh-CN" ? "会员奖励" : "會員獎勵",
      sub: language === "en" ? "Unlock magnets & discounts" : language === "zh-CN" ? "解锁磁石贴与折扣" : "解鎖磁石貼與折扣",
      accent: "from-accent-orange/10 to-card/80",
      iconColor: "text-accent-orange",
    },
    {
      to: "/souvenirs",
      icon: Sparkles,
      title: t("souvenirs.teaser.title"),
      sub: t("souvenirs.teaser.badge"),
      accent: "from-secondary/10 to-card/80",
      iconColor: "text-secondary",
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
              className={`group relative overflow-hidden rounded-lg border border-border bg-gradient-to-br ${accent} backdrop-blur-xl p-4 shadow-sm hover:border-accent-blue/30 hover:shadow-lg hover:-translate-y-0.5 transition-all`}
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
