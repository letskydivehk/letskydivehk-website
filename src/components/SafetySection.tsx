import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ShieldCheck, Layers, CloudSun, BookOpenCheck, ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export function SafetySection() {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState<number | null>(null);
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
              className="bg-card border border-border rounded-lg p-6 mobile-transparent-card"
            >
              <div className="w-11 h-11 rounded-xl bg-accent-orange/10 text-accent-orange flex items-center justify-center mb-4">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-foreground">{t(title)}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t(body)}</p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setExpanded(expanded === i ? null : i)}
                aria-expanded={expanded === i}
                className="mt-4 w-full justify-between px-0 text-accent-orange hover:bg-transparent hover:text-accent-orange/80"
              >
                {t("safety.breakdown")}
                <ChevronDown className={`h-4 w-4 transition-transform ${expanded === i ? "rotate-180" : ""}`} />
              </Button>
              <AnimatePresence initial={false}>
                {expanded === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="border-t border-border pt-3 text-xs leading-relaxed text-muted-foreground">
                      {t(`safety.pillar${i + 1}.detail`)}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Button
            variant="ghost"
            onClick={scrollToTimeline}
            className="inline-flex items-center gap-2 text-accent-orange font-semibold hover:gap-3 transition-all"
          >
            {t("safety.cta")} <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
