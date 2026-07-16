import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Coins, Award, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { rewardsCopy as c, pick } from "@/lib/rewardsCopy";

export function RewardsTeaser() {
  const { language } = useLanguage();
  const p = (t: any) => pick(t, language);

  const cards = [
    {
      to: "/membership/tiers?tab=points",
      icon: Coins,
      color: "from-amber-400 to-orange-500",
      title: p(c.teaserPointsTitle),
      body: p(c.teaserPointsBody),
    },
    {
      to: "/membership/tiers?tab=magnets",
      icon: Award,
      color: "from-sky-400 to-indigo-500",
      title: p(c.teaserMagnetsTitle),
      body: p(c.teaserMagnetsBody),
    },
  ];

  return (
    <section className="py-16 md:py-20 px-4 relative">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <p className="text-sm font-semibold text-accent-orange uppercase tracking-wider mb-2">
            {p(c.heroBadge)}
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-foreground">{p(c.heroTitle)}</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">{p(c.heroSub)}</p>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2">
          {cards.map(({ to, icon: Icon, color, title, body }, i) => (
            <motion.div
              key={to}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link
                to={to}
                className="group block h-full rounded-2xl border border-border/60 bg-card p-6 mobile-transparent-card hover:border-accent-orange/40 hover:shadow-lg transition-all"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-md`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-1.5">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{body}</p>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-accent-orange group-hover:gap-2 transition-all">
                  {p(c.seeFullPlan)} <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
