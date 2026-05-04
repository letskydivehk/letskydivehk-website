import { motion } from 'framer-motion'
import { UtensilsCrossed } from 'lucide-react'
import type { LocationFood as FoodItem } from '@/hooks/useLocationTourism'
import { useLanguage } from '@/contexts/LanguageContext'

interface Props {
  items: FoodItem[]
}

export function LocationFood({ items }: Props) {
  const { t, translateData } = useLanguage()
  if (!items.length) return null

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
      <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-3">
        <UtensilsCrossed className="w-6 h-6 text-accent-emerald" />
        {t('locationDetail.mustTryFood')}
      </h2>
      <p className="text-muted-foreground mb-6">{t('locationDetail.mustTryFoodSubtitle')}</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-card rounded-2xl overflow-hidden clean-border mobile-transparent-card flex flex-col"
          >
            {item.image_url && (
              <div className="aspect-[4/3] overflow-hidden">
                <img src={item.image_url} alt={item.dish_name} loading="lazy" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-5 flex flex-col flex-1">
              <h3 className="font-bold text-foreground text-lg mb-1">{translateData(item.dish_name, item.dish_name)}</h3>
              {item.where_to_try && (
                <p className="text-xs text-accent-emerald font-medium mb-2">📍 {translateData(item.where_to_try, item.where_to_try)}</p>
              )}
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
