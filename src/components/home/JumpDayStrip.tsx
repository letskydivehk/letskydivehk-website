import { Link } from "react-router-dom";
import { ShieldCheck, Clock, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function JumpDayStrip() {
  const { t } = useLanguage();

  const cards = [
    {
      to: "/#safety",
      icon: ShieldCheck,
      title: t("safety.title"),
      sub: t("safety.badge"),
      accent: "from-accent-emerald/10 to-card/80",
      iconColor: "text-accent-emerald",
    },
    {
      to: "/#timeline",
      icon: Clock,
      title: t("timeline.title"),
      sub: t("timeline.badge"),
      accent: "from-accent-blue/10 to-card/80",
      iconColor: "text-accent-blue",
    },
  ];

  return (
    <section aria-label="Your jump day" className="py-8 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
        {cards.map(({ to, icon: Icon, title, sub, accent, iconColor }) => (
          <Link
            key={to}
            to={to}
            className={`group text-left relative overflow-hidden rounded-lg border border-border bg-gradient-to-br ${accent} backdrop-blur-xl p-5 shadow-sm hover:border-accent-blue/30 hover:shadow-lg hover:-translate-y-0.5 transition-all`}
          >
            <div className="flex items-center justify-between mb-3">
              <Icon className={`w-7 h-7 ${iconColor}`} />
              <ArrowRight className="w-5 h-5 text-foreground/50 group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
            </div>
            <h3 className="text-base md:text-lg font-bold text-foreground leading-snug">
              {title}
            </h3>
            <p className="text-xs md:text-sm text-foreground/60 mt-1">{sub}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
