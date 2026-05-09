import { motion } from "framer-motion";
import { ShieldCheck, Layers, CloudSun, BookOpenCheck, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function SafetySection() {
  const { t } = useLanguage();
  const pillars = [
    { icon: ShieldCheck, title: "safety.pillar1.title", body: "safety.pillar1.body" },
    { icon: Layers, title: "safety.pillar2.title", body: "safety.pillar2.body" },
    { icon: CloudSun, title: "safety.pillar3.title", body: "safety.pillar3.body" },
    { icon: BookOpenCheck, title: "safety.pillar4.title", body: "safety.pillar4.body" },
  ];

  const scrollToTimeline = () => {
    document.getElementById("jump-day")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="safety" className="relative py-20 sm:py-24 bg-background">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-block bg-accent-orange/10 text-accent-orange text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            {t("safety.badge")}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground mb-4">
            {t("safety.title")}
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            {t("safety.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {pillars.map(({ icon: Icon, title, body }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-card border border-border rounded-2xl p-6 mobile-transparent-card"
            >
              <div className="w-11 h-11 rounded-xl bg-accent-orange/10 text-accent-orange flex items-center justify-center mb-4">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-foreground">{t(title)}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t(body)}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={scrollToTimeline}
            className="inline-flex items-center gap-2 text-accent-orange font-semibold hover:gap-3 transition-all"
          >
            {t("safety.cta")} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
