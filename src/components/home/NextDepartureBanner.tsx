import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { zhTW, zhCN } from 'date-fns/locale'
import { Wind, CalendarDays, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import {
  useIndoorService,
  useServiceDepartures,
  useNextDeparture,
  INDOOR_LOCATION_SLUG,
} from '@/hooks/useServiceDepartures'

export function NextDepartureBanner() {
  const { t, language } = useLanguage()
  const { data: indoor } = useIndoorService()
  const { data: departures } = useServiceDepartures(indoor?.service.id)
  const next = useNextDeparture(departures)

  if (!indoor || !next) return null

  const dateLocale = language === 'zh-TW' ? zhTW : language === 'zh-CN' ? zhCN : undefined

  return (
    <section className="py-8">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="rounded-3xl border border-accent-orange/30 bg-card/70 backdrop-blur-sm p-5 sm:p-7 mobile-transparent-card">
          <div className="flex flex-col lg:flex-row lg:items-center gap-5">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-12 h-12 rounded-2xl bg-accent-orange/15 flex items-center justify-center flex-shrink-0">
                <Wind className="w-6 h-6 text-accent-orange" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-[10px] font-black tracking-wide bg-accent-orange text-white px-2 py-0.5 rounded-full">
                    {t('departures.featured')}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-foreground">
                    {t('departures.banner.title')}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">{t('departures.banner.desc')}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 lg:gap-6">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-accent-orange" />
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                    {t('departures.next')}
                  </p>
                  <p className="text-sm font-bold text-foreground">
                    {format(new Date(next.departure_date), 'PPP', { locale: dateLocale })}
                    <span className="ml-2 text-xs font-medium text-accent-emerald">
                      {t('departures.seatsLeft').replace('{n}', String(next.seats_left))}
                    </span>
                  </p>
                </div>
              </div>

              <Link
                to={`/location/${INDOOR_LOCATION_SLUG}`}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-accent-orange text-white text-sm font-semibold hover:bg-accent-orange/90 transition-colors whitespace-nowrap"
              >
                {t('departures.banner.cta')}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
