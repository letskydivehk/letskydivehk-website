import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ChevronRight, Compass } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function QuizCTA() {
  const { t } = useLanguage();

  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent-orange via-accent-orange to-orange-500 p-8 sm:p-12 text-white shadow-2xl"
        >
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-16 -left-10 w-56 h-56 bg-white/10 rounded-full blur-3xl" />

          <div className="relative flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
                <Compass className="w-10 h-10 sm:w-12 sm:h-12" strokeWidth={1.8} />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-white/15 px-3 py-1 rounded-full text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                {t("quiz.cta.badge")}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black mb-2 leading-tight">
                {t("quiz.cta.title")}
              </h2>
              <p className="text-white/90 text-sm sm:text-base">{t("quiz.cta.subtitle")}</p>
            </div>

            <Link
              to="/quiz"
              className="flex-shrink-0 inline-flex items-center gap-2 bg-white text-accent-orange font-bold px-6 py-3.5 rounded-xl hover:bg-white/90 transition-colors shadow-lg"
            >
              {t("quiz.cta.button")}
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
