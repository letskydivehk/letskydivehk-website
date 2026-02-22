import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

interface ServiceIncludesProps {
  items: string[]
}

export function ServiceIncludes({ items }: ServiceIncludesProps) {
  const { t } = useLanguage()

  if (items.length === 0) return null

  return (
    <section className="py-24 bg-card/50">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-black text-foreground mb-4">
            {t('services.whatsIncluded')}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-3 bg-card rounded-xl p-4 clean-border"
            >
              <div className="w-8 h-8 rounded-full bg-accent-orange/10 flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-accent-orange" />
              </div>
              <span className="text-foreground font-medium text-sm">{item}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
