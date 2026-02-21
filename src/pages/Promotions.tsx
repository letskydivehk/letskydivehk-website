import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, Tag, Calendar, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Footer } from '@/components/Footer';
import { BackgroundDecorations } from '@/components/BackgroundDecorations';

const promotions = [
  {
    id: 'group-discount-2',
    icon: Users,
    titleKey: 'promo.group2.title',
    descKey: 'promo.group2.desc',
    detailsKey: 'promo.group2.details',
    termsKey: 'promo.group2.terms',
    highlight: '-$100',
    highlightLabelKey: 'promo.perPerson',
    active: true,
  },
];

export default function Promotions() {
  const { t } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <BackgroundDecorations />
      <main className="relative z-10 pt-24 pb-16">
        {/* Header */}
        <div className="max-w-4xl mx-auto px-6 mb-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('promo.backToHome')}
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-accent-orange/10 text-accent-orange px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
              <Tag className="w-4 h-4" />
              {t('promo.badge')}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4">
              {t('promo.title')}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              {t('promo.subtitle')}
            </p>
          </motion.div>
        </div>

        {/* Promotions List */}
        <div className="max-w-4xl mx-auto px-6 space-y-8">
          {promotions.map((promo, index) => {
            const Icon = promo.icon;
            return (
              <motion.div
                key={promo.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-lg"
              >
                {/* Active badge */}
                {promo.active && (
                  <div className="absolute top-4 right-4 bg-accent-emerald text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {t('promo.active')}
                  </div>
                )}

                <div className="p-6 sm:p-8">
                  {/* Icon + Title */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-accent-orange/10 flex items-center justify-center">
                      <Icon className="w-7 h-7 text-accent-orange" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold mb-1">{t(promo.titleKey)}</h2>
                      <p className="text-muted-foreground">{t(promo.descKey)}</p>
                    </div>
                  </div>

                  {/* Coupon Button */}
                  <a
                    href="/#booking"
                    className="group block bg-gradient-to-r from-accent-orange/10 to-accent-orange/5 border-2 border-dashed border-accent-orange/40 rounded-xl p-5 mb-6 hover:border-accent-orange hover:from-accent-orange/20 hover:to-accent-orange/10 transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-4xl sm:text-5xl font-black text-accent-orange">
                        {promo.highlight}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-foreground text-lg">
                          {t(promo.highlightLabelKey)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {t(promo.detailsKey)}
                        </div>
                      </div>
                      <div className="flex-shrink-0 bg-accent-orange text-white font-bold px-5 py-2.5 rounded-lg group-hover:scale-105 transition-transform duration-200 flex items-center gap-2">
                        {t('promo.claimCoupon')}
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </a>

                  {/* Terms */}
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}
