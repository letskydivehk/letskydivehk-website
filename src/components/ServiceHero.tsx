import { motion } from 'framer-motion'
import { ArrowRight, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLanguage } from '@/contexts/LanguageContext'

interface ServiceHeroProps {
  title: string
  subtitle: string
  tagline: string
  backgroundImage: string
  onBookNow: () => void
}

export function ServiceHero({ title, subtitle, tagline, backgroundImage, onBookNow }: ServiceHeroProps) {
  const { t } = useLanguage()

  return (
    <section className="relative min-h-[70vh] flex items-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/80" />
      </div>

      {/* Back button */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-white/80 hover:text-white bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium transition-all"
        >
          ← {t('servicePage.backToHome')}
        </Link>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 sm:px-8 lg:px-12 py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <span className="inline-block bg-accent-orange/90 text-white text-sm font-bold px-4 py-1.5 rounded-full mb-6">
            {tagline}
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-tight mb-4">
            {title}
          </h1>
          <p className="text-xl lg:text-2xl text-white/80 mb-10 leading-relaxed max-w-2xl">
            {subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBookNow}
              className="bg-accent-orange text-white font-bold px-8 py-4 rounded-lg text-lg hover:bg-accent-orange/90 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {t('common.bookNow')} <ArrowRight className="w-5 h-5" />
            </motion.button>
            <motion.a
              href="#pricing"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/10 backdrop-blur-sm text-white font-semibold px-8 py-4 rounded-lg text-lg border border-white/20 hover:bg-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MapPin className="w-5 h-5" /> {t('servicePage.viewLocations')}
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
