import { motion } from "framer-motion";
import { ChevronRight, Sparkles, GraduationCap, Plane, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

export function AlumniPathway() {
  const { t } = useLanguage();
  const steps = [
    { icon: Sparkles, key: "pathway.step1" },
    { icon: GraduationCap, key: "pathway.step2" },
    { icon: Plane, key: "pathway.step3" },
    { icon: Users, key: "pathway.step4" },
  ];
  return (
    <section className="relative py-20 sm:py-24 bg-muted/30">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block bg-accent-orange/10 text-accent-orange text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            {t("pathway.badge")}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground mb-4">
            {t("pathway.title")}
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            {t("pathway.subtitle")}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mb-10">
          {steps.map(({ icon: Icon, key }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-2 sm:gap-4"
            >
              <div className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center text-accent-orange shadow-sm">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-sm font-semibold text-foreground text-center max-w-[110px]">
                  {t(key)}
                </span>
              </div>
              {i < steps.length - 1 && (
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              )}
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/services/a-licence"
            className="inline-flex items-center gap-2 bg-accent-orange text-white font-bold px-6 py-3 rounded-xl hover:bg-accent-orange/90 transition-colors"
          >
            {t("pathway.cta")} <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
