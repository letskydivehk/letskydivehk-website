import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

interface ServiceCTAProps {
  onBookNow: () => void
}

export function ServiceCTA({ onBookNow }: ServiceCTAProps) {
  const { t } = useLanguage()

  return (
    <section className="py-20 bg-gradient-to-r from-accent-orange to-accent-orange/80 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
            {t('servicePage.ctaTitle')}
          </h2>
          <p className="text-xl text-white/80 mb-8">
            {t('servicePage.ctaSubtitle')}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBookNow}
            className="bg-white text-accent-orange font-bold px-10 py-4 rounded-lg text-lg hover:bg-white/90 transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            {t('common.bookNow')} <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
