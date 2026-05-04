import { motion } from 'framer-motion'
import { Lightbulb, Plane } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

interface TravelTips {
  currency?: string
  language?: string
  visa?: string
  plug?: string
  tipping?: string
}

interface Props {
  tips: TravelTips | null
  gettingThereFromHk: string | null
}

export function LocationTravelTips({ tips, gettingThereFromHk }: Props) {
  const { t, translateData } = useLanguage()
  if (!tips && !gettingThereFromHk) return null

  const labelMap: Record<keyof TravelTips, string> = {
    currency: t('locationDetail.tip.currency'),
    language: t('locationDetail.tip.language'),
    visa: t('locationDetail.tip.visa'),
    plug: t('locationDetail.tip.plug'),
    tipping: t('locationDetail.tip.tipping'),
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.44 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      {gettingThereFromHk && (
        <div className="bg-card rounded-2xl p-8 clean-border mobile-transparent-card">
          <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-3">
            <Plane className="w-5 h-5 text-accent-blue" />
            {t('locationDetail.gettingThere')}
          </h3>
          <p className="text-muted-foreground leading-relaxed">{translateData(gettingThereFromHk, gettingThereFromHk)}</p>
        </div>
      )}

      {tips && (
        <div className="bg-card rounded-2xl p-8 clean-border mobile-transparent-card">
          <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-3">
            <Lightbulb className="w-5 h-5 text-accent-orange" />
            {t('locationDetail.travelTips')}
          </h3>
          <dl className="space-y-3">
            {(Object.keys(labelMap) as (keyof TravelTips)[]).map((key) =>
              tips[key] ? (
                <div key={key} className="flex flex-col sm:flex-row sm:gap-3">
                  <dt className="text-sm font-semibold text-foreground sm:w-24 flex-shrink-0">{labelMap[key]}</dt>
                  <dd className="text-sm text-muted-foreground">{translateData(tips[key]!, tips[key]!)}</dd>
                </div>
              ) : null,
            )}
          </dl>
        </div>
      )}
    </motion.div>
  )
}
