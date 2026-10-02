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
    <section className="home-featured-departure py-10 sm:py-16">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="group relative overflow-hidden rounded-[2rem] border border-border bg-card p-6 shadow-xl sm:p-10 lg:p-14 mobile-transparent-card">
          <div className="absolute inset-y-0 right-0 hidden w-2/5 bg-gradient-to-l from-accent-blue/10 to-transparent lg:block" aria-hidden="true" />
          <div className="relative flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-12">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-14 h-14 rounded-2xl bg-accent-orange flex items-center justify-center flex-shrink-0 shadow-lg">
                <Wind className="w-7 h-7 text-accent-foreground" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-accent-orange">
                    {t('departures.featured')}
                  </span>
                  <h3 className="w-full text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                    {t('departures.banner.title')}
                  </h3>
                </div>
                <p className="mt-3 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">{t('departures.banner.desc')}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 lg:gap-6">
              <div className="flex items-center gap-3 rounded-2xl bg-background/70 px-4 py-3 border border-border">
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
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-foreground text-background text-sm font-semibold hover:bg-accent-blue hover:text-accent-foreground transition-all whitespace-nowrap"
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
