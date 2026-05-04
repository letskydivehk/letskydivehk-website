import { motion } from 'framer-motion'
import { Compass, MapPin } from 'lucide-react'
import type { LocationAttraction } from '@/hooks/useLocationTourism'
import { useLanguage } from '@/contexts/LanguageContext'

interface Props {
  items: LocationAttraction[]
}

export function LocationAttractions({ items }: Props) {
  const { t, translateData } = useLanguage()
  if (!items.length) return null

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.36 }}>
      <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-3">
        <Compass className="w-6 h-6 text-accent-orange" />
        {t('locationDetail.thingsToDo')}
      </h2>
      <p className="text-muted-foreground mb-6">{t('locationDetail.thingsToDoSubtitle')}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-card rounded-2xl overflow-hidden clean-border mobile-transparent-card flex flex-col sm:flex-row"
          >
            {item.image_url && (
              <div className="sm:w-2/5 aspect-[4/3] sm:aspect-auto overflow-hidden flex-shrink-0">
                <img src={item.image_url} alt={item.name} loading="lazy" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-5 flex flex-col flex-1">
              <h3 className="font-bold text-foreground text-lg mb-2">{translateData(item.name, item.name)}</h3>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                <span className="bg-accent-orange/10 text-accent-orange px-2 py-0.5 rounded-full capitalize">
                  {translateData(item.category, item.category)}
                </span>
                {item.distance && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {translateData(item.distance, item.distance)}
                  </span>
                )}
              </div>
              {item.description && (
                <p className="text-sm text-muted-foreground leading-relaxed">{translateData(item.description, item.description)}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
