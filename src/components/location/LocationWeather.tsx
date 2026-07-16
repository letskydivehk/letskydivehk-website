import { motion } from 'framer-motion'
import { AlertTriangle, CalendarDays, Cloud, CloudRain, ExternalLink, Loader2, RefreshCw, Thermometer, Wind } from 'lucide-react'
import { describeWeather, readCachedWeather, useWeather } from '@/hooks/useWeather'
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

function relativeTime(ts: number, t: (k: string) => string): string {
  const diffMs = Date.now() - ts
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return t('weather.justNow')
  if (mins < 60) return t('weather.minutesAgo').replace('{n}', String(mins))
  const hours = Math.floor(mins / 60)
  if (hours < 24) return t('weather.hoursAgo').replace('{n}', String(hours))
  const days = Math.floor(hours / 24)
  return t('weather.daysAgo').replace('{n}', String(days))
}

export function LocationWeather({ lat, lon, bestMonths, climateSummary }: Props) {
  const { language, t, translateData } = useLanguage()
  const { data: weather, isLoading, isError, isFetching, refetch, dataUpdatedAt } = useWeather(lat, lon)
  const labels = monthLabels[language]

  if (!lat || !lon) return null

  const cached = readCachedWeather(lat, lon)
  const displayWeather = weather ?? cached?.data ?? null
  const displayUpdatedAt = dataUpdatedAt || cached?.updatedAt || 0

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
        <div className="bg-background/50 rounded-xl p-6">
          <p className="text-sm text-muted-foreground mb-3">{t('locationDetail.currentWeather')}</p>
          {isLoading && !displayWeather ? (
            <Loader2 className="w-6 h-6 animate-spin text-accent-blue" />
          ) : displayWeather ? (
            <>
              <div className="flex items-baseline gap-2 mb-3">
                <Thermometer className="w-6 h-6 text-accent-orange" />
                <span className="text-4xl font-black text-foreground">{displayWeather.temperature}°C</span>
              </div>
              <p className="text-muted-foreground mb-2">{describeWeather(displayWeather.weatherCode, language)}</p>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Wind className="w-4 h-4" />
                {t('locationDetail.windSpeed')}: {displayWeather.windSpeed} km/h
              </p>
              <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                <CloudRain className="w-4 h-4" />
                {t('weather.precipitation')}: {displayWeather.precipitation} mm
              </p>
            </>
          ) : (
            <p className="text-muted-foreground text-sm">—</p>
          )}

          {isError ? (
            <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-xs">
              <div className="flex items-center gap-2 text-destructive font-semibold mb-1">
                <AlertTriangle className="w-4 h-4" />
                {t('weather.updateFailed')}
              </div>
              {displayUpdatedAt > 0 && (
                <p className="text-muted-foreground">
                  {t('weather.lastUpdated')}: {relativeTime(displayUpdatedAt, t)}
                </p>
              )}
              <button
                onClick={() => refetch()}
                disabled={isFetching}
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-destructive text-destructive-foreground font-semibold hover:opacity-90 transition disabled:opacity-60"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
                {t('weather.retry')}
              </button>
            </div>
          ) : displayUpdatedAt > 0 ? (
            <p className="mt-3 text-xs text-muted-foreground">
              {t('weather.lastUpdated')}: {relativeTime(displayUpdatedAt, t)}
            </p>
          ) : null}

          <a
            href={`https://www.windy.com/?${lat},${lon},9`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 bg-accent-blue text-white font-semibold rounded-lg hover:bg-accent-blue/90 transition-colors text-sm w-full justify-center"
          >
            {t('weather.viewLive')}
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

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
        <p className="text-muted-foreground leading-relaxed">{translateData(climateSummary, climateSummary)}</p>
      )}
    </motion.div>
  )
}
