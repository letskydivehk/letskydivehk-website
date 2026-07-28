import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, CalendarDays, Cloud, CloudRain, ExternalLink, Info, Loader2, RefreshCw, Thermometer, Wind } from 'lucide-react'
import { describeWeather, readCachedWeather, useWeather, calculateJumpScore, getWeatherTipKey } from '@/hooks/useWeather'
import { useLanguage } from '@/contexts/LanguageContext'
import { WeatherIcon } from '@/components/WeatherIcon'

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

function getMonthStatus(month: number, bestMonths: number[], t: (k: string) => string) {
  const isBest = bestMonths.includes(month)
  if (isBest) return { label: t('weather.highSeason'), color: 'bg-accent-emerald/20 text-accent-emerald border-accent-emerald/30' }
  // Treat adjacent months as shoulder season
  const adjacent = bestMonths.some((m) => Math.abs(m - month) === 1 || Math.abs(m - month) === 11)
  if (adjacent) return { label: t('weather.shoulderSeason'), color: 'bg-accent-orange/10 text-accent-orange border-accent-orange/30' }
  return { label: t('weather.lowSeason'), color: 'bg-muted/30 text-muted-foreground border-border/50' }
}

export function LocationWeather({ lat, lon, bestMonths, climateSummary }: Props) {
  const { language, t, translateData } = useLanguage()
  const { data: weather, isLoading, isError, isFetching, refetch, dataUpdatedAt } = useWeather(lat, lon)
  const labels = monthLabels[language]

  if (!lat || !lon) return null

  const cached = readCachedWeather(lat, lon)
  const displayWeather = weather ?? cached?.data ?? null
  const displayUpdatedAt = dataUpdatedAt || cached?.updatedAt || 0
  const jumpScore = calculateJumpScore(displayWeather)
  const tipKey = getWeatherTipKey(displayWeather)

  const scoreColor = {
    excellent: 'bg-accent-emerald text-white',
    good: 'bg-accent-emerald/80 text-white',
    moderate: 'bg-accent-orange text-white',
    poor: 'bg-destructive/80 text-white',
    noJump: 'bg-destructive text-white',
  }[jumpScore.level]

  // Auto-refresh relative time display
  const [, tick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => tick((n) => n + 1), 60000)
    return () => clearInterval(id)
  }, [])

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
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-muted-foreground">{t('locationDetail.currentWeather')}</p>
            {displayWeather && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${scoreColor}`}>
                {t(jumpScore.labelKey)}
              </span>
            )}
          </div>

          {isLoading && !displayWeather ? (
            <Loader2 className="w-6 h-6 animate-spin text-accent-blue" />
          ) : displayWeather ? (
            <>
              <div className="flex items-center gap-4 mb-4">
                <WeatherIcon code={displayWeather.weatherCode} isDay={displayWeather.isDay} size={56} />
                <div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <Thermometer className="w-5 h-5 text-accent-orange" />
                    <span className="text-4xl font-black text-foreground">{displayWeather.temperature}°C</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{describeWeather(displayWeather.weatherCode, language)}</p>
                </div>
              </div>

              <div className="mb-4 p-3 rounded-xl bg-card border border-border/50">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{t('weather.jumpScore')}</span>
                  <span className="text-lg font-black text-foreground">{jumpScore.score}</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden mb-2">
                  <motion.div
                    className={`h-full rounded-full ${scoreColor.split(' ')[0]}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${jumpScore.score}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
                <p className="text-sm text-foreground">{t(jumpScore.adviceKey)}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-background rounded-lg p-3">
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                    <Wind className="w-3.5 h-3.5" />
                    {t('locationDetail.windSpeed')}
                  </p>
                  <p className="text-base font-bold text-foreground">{displayWeather.windSpeed} <span className="text-xs font-normal text-muted-foreground">km/h</span></p>
                </div>
                <div className="bg-background rounded-lg p-3">
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                    <CloudRain className="w-3.5 h-3.5" />
                    {t('weather.precipitation')}
                  </p>
                  <p className="text-base font-bold text-foreground">{displayWeather.precipitation} <span className="text-xs font-normal text-muted-foreground">mm</span></p>
                </div>
              </div>

              <div className="flex items-start gap-2 p-3 rounded-lg bg-accent-blue/10 border border-accent-blue/20">
                <Info className="w-4 h-4 text-accent-blue flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-accent-blue block mb-0.5">{t('weather.tip')}</span>
                  <p className="text-sm text-foreground">{t(tipKey)}</p>
                </div>
              </div>
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
            <p className="text-sm text-muted-foreground mb-4 flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              {t('locationDetail.bestTimeToVisit')}
            </p>

            <div className="space-y-3 mb-4">
              {labels.map((label, i) => {
                const month = i + 1
                const { label: statusLabel, color } = getMonthStatus(month, bestMonths, t)
                const isBest = bestMonths.includes(month)
                const barWidth = isBest ? 100 : bestMonths.some((m) => Math.abs(m - month) === 1 || Math.abs(m - month) === 11) ? 60 : 30
                return (
                  <div key={month} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-8">{label}</span>
                    <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${color.split(' ')[0]}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${barWidth}%` }}
                        transition={{ duration: 0.5, delay: i * 0.04 }}
                      />
                    </div>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded border ${color} whitespace-nowrap`}>
                      {statusLabel}
                    </span>
                  </div>
                )
              })}
            </div>

            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-accent-emerald/20 border border-accent-emerald/30" />
                {t('weather.highSeason')}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-accent-orange/10 border border-accent-orange/30" />
                {t('weather.shoulderSeason')}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-muted/30 border border-border/50" />
                {t('weather.lowSeason')}
              </span>
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
