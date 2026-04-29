import { motion } from 'framer-motion'
import { Hotel, MapPin } from 'lucide-react'
import type { LocationAccommodation } from '@/hooks/useLocationTourism'
import { useLanguage } from '@/contexts/LanguageContext'

interface Props {
  items: LocationAccommodation[]
}

export function LocationAccommodations({ items }: Props) {
  const { t } = useLanguage()
  if (!items.length) return null

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }}>
      <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-3">
        <Hotel className="w-6 h-6 text-accent-blue" />
        {t('locationDetail.whereToStay')}
      </h2>
      <p className="text-muted-foreground mb-6">{t('locationDetail.whereToStaySubtitle')}</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-card rounded-2xl overflow-hidden clean-border mobile-transparent-card flex flex-col"
          >
            {item.image_url && (
              <div className="aspect-[4/3] overflow-hidden">
                <img src={item.image_url} alt={item.name} loading="lazy" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-5 flex flex-col flex-1">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-bold text-foreground text-lg leading-tight">{item.name}</h3>
                <span className="text-accent-emerald font-bold text-sm whitespace-nowrap">{item.price_tier}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                <span className="bg-accent-blue/10 text-accent-blue px-2 py-0.5 rounded-full">{item.type}</span>
                {item.distance && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {item.distance}
                  </span>
                )}
              </div>
              {item.description && (
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
