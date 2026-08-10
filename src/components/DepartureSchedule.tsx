import { format } from 'date-fns'
import { zhTW, zhCN } from 'date-fns/locale'
import { CalendarDays, Users, Loader2, ArrowRight, MessageCircle } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import {
  useServiceDepartures,
  isBookable,
  isCutoffPassed,
  type DepartureAvailability,
} from '@/hooks/useServiceDepartures'

interface DepartureScheduleProps {
  serviceId: string
  locationName?: string
  onBook?: (departure: DepartureAvailability) => void
  limit?: number
}

export function DepartureSchedule({ serviceId, locationName, onBook, limit }: DepartureScheduleProps) {
  const { t, language } = useLanguage()
  const { data: departures, isLoading } = useServiceDepartures(serviceId)

  const dateLocale = language === 'zh-TW' ? zhTW : language === 'zh-CN' ? zhCN : undefined
  const list = limit ? (departures ?? []).slice(0, limit) : departures ?? []
  const meta = departures?.[0]

  return (
    <section className="py-10">
      <div className="flex items-start gap-3 mb-6">
        <div className="w-11 h-11 rounded-2xl bg-accent-orange/10 flex items-center justify-center flex-shrink-0">
          <CalendarDays className="w-5 h-5 text-accent-orange" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">{t('departures.title')}</h2>
          <p className="text-sm text-muted-foreground">{t('departures.subtitle')}</p>
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center py-10">
          <Loader2 className="w-6 h-6 animate-spin text-accent-orange" />
        </div>
      )}

      {!isLoading && list.length === 0 && (
        <p className="text-muted-foreground text-sm">{t('departures.none')}</p>
      )}

      {!isLoading && list.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {list.map((d) => {
              const bookable = isBookable(d)
              const label = d.is_closed
                ? t('departures.closed')
                : d.is_full
                  ? t('departures.full')
                  : isCutoffPassed(d)
                    ? t('departures.cutoffPassed')
                    : t('departures.seatsLeft').replace('{n}', String(d.seats_left))

              return (
                <div
                  key={d.id}
                  className={`rounded-2xl border p-4 sm:p-5 mobile-transparent-card transition-colors ${
                    bookable ? 'border-border bg-card/60 hover:border-accent-orange/50' : 'border-border/60 bg-muted/30 opacity-70'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div>
                      <p className="text-base sm:text-lg font-bold text-foreground">
                        {format(new Date(d.departure_date), 'PPP', { locale: dateLocale })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(d.departure_date), 'EEEE', { locale: dateLocale })}
                      </p>
                    </div>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${
                        bookable ? 'bg-accent-emerald/15 text-accent-emerald' : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {label}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                    <Users className="w-3.5 h-3.5" />
                    <span>
                      {d.seats_taken}/{d.capacity}
                    </span>
                  </div>

                  {bookable ? (
                    <button
                      onClick={() => onBook?.(d)}
                      className="w-full py-2.5 px-4 rounded-xl bg-accent-orange text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-accent-orange/90 transition-colors cursor-pointer"
                    >
                      {t('departures.book')}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <a
                      href={`https://wa.me/85269391570?text=${encodeURIComponent(
                        `${t('whatsapp.quick.indoor')}${locationName ? ` (${locationName})` : ''}`,
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 rounded-xl border border-border text-sm font-semibold flex items-center justify-center gap-2 text-foreground hover:bg-muted transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      {t('departures.whatsapp')}
                    </a>
                  )}
                </div>
              )
            })}
          </div>

          {meta && (
            <p className="mt-4 text-xs text-muted-foreground">
              {t('departures.minNotice')
                .replace('{n}', String(meta.min_participants))
                .replace('{d}', String(meta.cutoff_days))}
            </p>
          )}
        </>
      )}
    </section>
  )
}
