import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowRight, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import magnetFridgeMosaic from "@/assets/magnet-fridge-mosaic.jpg";

export function SouvenirTeaser() {
  const { t } = useLanguage();

  return (
    <section aria-label="Souvenir teaser" className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-center bg-gradient-to-br from-sky-50 to-white rounded-3xl border border-border overflow-hidden shadow-sm">
          <div className="order-2 md:order-1 p-6 sm:p-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-orange/10 text-accent-orange text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              {t("souvenirs.teaser.badge")}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 leading-tight">
              {t("souvenirs.teaser.title")}
            </h2>
            <p className="text-foreground/70 mb-6">{t("souvenirs.teaser.subtitle")}</p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#booking"
                className="inline-flex items-center gap-2 bg-accent-orange hover:bg-accent-orange/90 text-white font-semibold px-5 py-3 rounded-lg transition-colors"
              >
                {t("souvenirs.teaser.cta.book")}
                <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                to="/souvenirs"
                className="inline-flex items-center gap-2 border border-border bg-background hover:bg-muted text-foreground font-semibold px-5 py-3 rounded-lg transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                {t("souvenirs.teaser.cta.view")}
              </Link>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="order-1 md:order-2 h-64 md:h-full min-h-[280px] overflow-hidden"
          >
            <img
              src={magnetFridgeMosaic}
              alt={t("souvenirs.teaser.title")}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
