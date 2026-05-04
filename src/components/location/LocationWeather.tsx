import { motion } from 'framer-motion'
import { Cloud, Wind, Thermometer, CalendarDays, Loader2 } from 'lucide-react'
import { useWeather, describeWeather } from '@/hooks/useWeather'
import { useLanguage } from '@/contexts/LanguageContext'

interface Props {
  lat: number | null
  lon: number | null
  bestMonths: number[] | null
  climateSummary: string | null
}

const monthLabels: Record<'en' | 'zh-TW' | 'zh-CN', string[]> = {
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  'zh-TW': ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  'zh-CN': ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
}

export function LocationWeather({ lat, lon, bestMonths, climateSummary }: Props) {
  const { language, t, translateData } = useLanguage()
  const { data: weather, isLoading } = useWeather(lat, lon)
  const labels = monthLabels[language]

  if (!lat || !lon) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.22 }}
      className="bg-card rounded-2xl p-8 clean-border mobile-transparent-card"
    >
      <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
        <Cloud className="w-6 h-6 text-accent-blue" />
        {t('locationDetail.weatherClimate')}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Current weather */}
        <div className="bg-background/50 rounded-xl p-6">
          <p className="text-sm text-muted-foreground mb-3">{t('locationDetail.currentWeather')}</p>
          {isLoading ? (
            <Loader2 className="w-6 h-6 animate-spin text-accent-blue" />
          ) : weather ? (
            <>
              <div className="flex items-baseline gap-2 mb-3">
                <Thermometer className="w-6 h-6 text-accent-orange" />
                <span className="text-4xl font-black text-foreground">{weather.temperature}°C</span>
              </div>
              <p className="text-muted-foreground mb-2">{describeWeather(weather.weatherCode, language)}</p>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Wind className="w-4 h-4" />
                {t('locationDetail.windSpeed')}: {weather.windSpeed} km/h
              </p>
            </>
          ) : (
            <p className="text-muted-foreground text-sm">—</p>
          )}
        </div>

        {/* Best months */}
        {bestMonths && bestMonths.length > 0 && (
          <div className="bg-background/50 rounded-xl p-6">
            <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              {t('locationDetail.bestTimeToVisit')}
            </p>
            <div className="grid grid-cols-6 gap-2">
              {labels.map((label, i) => {
                const month = i + 1
                const isBest = bestMonths.includes(month)
                return (
                  <div
                    key={month}
                    className={`text-center text-xs font-medium py-2 rounded-md ${
                      isBest
                        ? 'bg-accent-emerald/20 text-accent-emerald'
                        : 'bg-muted/30 text-muted-foreground'
                    }`}
                  >
                    {label}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {climateSummary && (
        <p className="text-muted-foreground leading-relaxed">{climateSummary}</p>
      )}
    </motion.div>
  )
}
