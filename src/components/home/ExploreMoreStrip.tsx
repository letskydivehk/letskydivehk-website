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
    <section aria-label="Explore more" className="home-explore-nav py-6 sm:py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-y border-border">
          {cards.map(({ to, icon: Icon, title, sub, accent, iconColor }) => (
            <Link
              key={to}
              to={to}
              className={`group relative overflow-hidden bg-gradient-to-br ${accent} p-5 sm:p-6 lg:border-r lg:last:border-r-0 border-border hover:bg-card transition-all`}
            >
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-card shadow-sm">
                  <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm md:text-base font-bold text-foreground leading-snug line-clamp-2">{title}</h3>
                  {sub && <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{sub}</p>}
                </div>
                <ArrowRight className="w-4 h-4 shrink-0 text-muted-foreground group-hover:text-accent-blue group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
