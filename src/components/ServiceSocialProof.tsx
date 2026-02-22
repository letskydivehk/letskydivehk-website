import { motion } from 'framer-motion'
import { Plane, Shield, MapPin, Star } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { AnimatedCounter } from './AnimatedCounter'

interface ServiceSocialProofProps {
  testimonialKey: string
  testimonialAuthorKey: string
}

export function ServiceSocialProof({ testimonialKey, testimonialAuthorKey }: ServiceSocialProofProps) {
  const { t } = useLanguage()

  const stats = [
    { end: 10000, suffix: '+', label: t('about.stats.safeJumps'), icon: <Plane className="w-6 h-6" /> },
    { end: 10, suffix: '+', label: t('about.stats.yearsExperience'), icon: <Shield className="w-6 h-6" /> },
    { end: 6, suffix: '', label: t('about.stats.locations'), icon: <MapPin className="w-6 h-6" /> },
    { end: 100, suffix: '%', label: t('about.stats.safetyRecord'), icon: <Star className="w-6 h-6" /> },
  ]

  return (
    <section className="py-24 bg-card/50">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <AnimatedCounter
              key={index}
              end={stat.end}
              suffix={stat.suffix}
              label={stat.label}
              icon={stat.icon}
              duration={2 + index * 0.3}
            />
          ))}
        </div>

        {/* Testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="bg-card rounded-2xl p-8 clean-border mobile-transparent-card">
            <div className="flex justify-center mb-4">
              {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} className="w-5 h-5 text-accent-orange fill-accent-orange" />
              ))}
            </div>
            <p className="text-lg text-foreground italic mb-4 leading-relaxed">
              "{t(testimonialKey)}"
            </p>
            <p className="text-sm text-muted-foreground font-semibold">
              — {t(testimonialAuthorKey)}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
