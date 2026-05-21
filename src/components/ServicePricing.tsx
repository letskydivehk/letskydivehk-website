import { motion } from 'framer-motion'
import { ArrowRight, MapPin, Loader2, MessageCircle, Calendar, Hotel, Bus, Utensils, Sparkles } from 'lucide-react'

// Parse "$3399" / "HK$3,399" / "3399" → 3399; returns null when not parseable
function parsePrice(display: string): number | null {
  if (!display) return null
  const cleaned = display.replace(/[^0-9.]/g, '')
  if (!cleaned) return null
  const n = parseFloat(cleaned)
  return Number.isFinite(n) && n > 0 ? n : null
}

function TandemPriceDisplay({ priceDisplay, offLabel }: { priceDisplay: string; offLabel: string }) {
  const current = parsePrice(priceDisplay)
  if (current === null) {
    return <span className="text-lg font-bold text-accent-orange whitespace-nowrap">{priceDisplay}</span>
  }
  const original = Math.round(current * 1.25)
  // Preserve prefix (e.g. "$") from original display
  const prefixMatch = priceDisplay.match(/^[^\d]+/)
  const prefix = prefixMatch ? prefixMatch[0] : '$'
  return (
    <span className="flex flex-col items-end leading-tight whitespace-nowrap">
      <span className="flex items-center gap-1.5">
        <span className="text-xs text-muted-foreground line-through">{prefix}{original.toLocaleString()}</span>
        <span className="text-[10px] font-bold bg-accent-orange text-white px-1.5 py-0.5 rounded">{offLabel}</span>
      </span>
      <span className="text-lg font-bold text-accent-orange">{priceDisplay}</span>
    </span>
  )
}
import { useAllLocationServices } from '@/hooks/useLocationServices'
import { useLocations } from '@/hooks/useLocations'
import { useBooking } from '@/contexts/BookingContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { useNavigate } from 'react-router-dom'

interface ServicePricingProps {
  serviceType: 'tandem' | 'aff'
}

const countryFlags: Record<string, string> = {
  Thailand: '🇹🇭',
  China: '🇨🇳',
}

export function ServicePricing({ serviceType }: ServicePricingProps) {
  const { t, translateData } = useLanguage()
  const { data: allServices, isLoading } = useAllLocationServices()
  const { data: locations } = useLocations()
  const { setPreselectedLocationId, setPreselectedServiceId } = useBooking()
  const navigate = useNavigate()

  // Filter services by type and group by location
  const locationGroups = (() => {
    if (!allServices || !locations) return []
    const filtered = allServices.filter(s => s.service_type === serviceType)
    const grouped: Record<string, typeof filtered> = {}
    filtered.forEach(s => {
      if (!grouped[s.location_id]) grouped[s.location_id] = []
      grouped[s.location_id].push(s)
    })
    return Object.entries(grouped).map(([locationId, services]) => {
      const location = locations.find(l => l.id === locationId)
      return { locationId, location, services }
    }).filter(g => g.location)
  })()

  const handleBookAtLocation = (locationId: string, serviceId: string) => {
    setPreselectedLocationId(locationId)
    setPreselectedServiceId(serviceId)
    navigate('/#booking')
    setTimeout(() => {
      document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  if (isLoading) {
    return (
      <section id="pricing" className="py-24 bg-background">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-accent-orange" />
        </div>
      </section>
    )
  }

  return (
    <section id="pricing" className="py-24 bg-background">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-3 h-3 bg-accent-orange rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-muted-foreground">
              {t('servicePage.pricingBadge')}
            </span>
            <div className="w-3 h-3 bg-accent-blue rounded-full animate-pulse" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-foreground mb-4">
            {t('servicePage.pricingTitle')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('servicePage.pricingSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {locationGroups.map(({ locationId, location, services }, index) => (
            <motion.div
              key={locationId}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card rounded-2xl p-6 clean-border mobile-transparent-card subtle-shadow hover:elevated-shadow transition-all"
            >
              {/* Location header */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">{countryFlags[location!.country] || '📍'}</span>
                <div>
                  <h3 className="text-lg font-bold text-foreground">{translateData(`location.${location!.slug}`, location!.Name)}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {translateData(`country.${location!.country}`, location!.country)}
                  </p>
                </div>
              </div>

              {/* Packages with per-service includes */}
              <div className="space-y-4 mb-6">
                {services.map(service => (
                  <div key={service.id} className="py-3 border-b border-border/50 last:border-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm text-foreground font-medium flex-1">
                        {translateData(`service.${service.service_name}`, service.service_name)}
                      </span>
                      {service.service_type === 'tandem' ? (
                        <TandemPriceDisplay priceDisplay={service.price_display} offLabel={t('pricing.off')} />
                      ) : (
                        <span className="text-lg font-bold text-accent-orange whitespace-nowrap">{translateData(`price.${service.price_display}`, service.price_display)}</span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleBookAtLocation(locationId, service.id)}
                        className="ml-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-accent-orange text-white hover:bg-accent-orange/90 transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap"
                      >
                        {t('common.bookNow')} <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                    {service.includes && service.includes.length > 0 && (
                      <ul className="mt-2 space-y-1 pl-1">
                        {service.includes.map((item, idx) => (
                          <li key={idx} className="text-xs text-muted-foreground flex items-start gap-1.5">
                            <span className="text-accent-orange mt-0.5">✓</span> {translateData(`include.${item}`, item)}
                          </li>
                        ))}
                      </ul>
                    )}
                    {service.service_type === 'package' && (
                      <div className="mt-3 pl-1">
                        <details className="group">
                          <summary className="text-xs font-semibold text-accent-blue cursor-pointer flex items-center gap-1.5 hover:text-accent-blue/80">
                            <Calendar className="w-3.5 h-3.5" /> {t('tour.itinerary')}
                          </summary>
                          <div className="mt-2 space-y-2">
                            {(!service.itinerary || service.itinerary.length === 0) ? (
                              <p className="text-xs text-muted-foreground italic">{t('tour.itineraryComingSoon')}</p>
                            ) : (
                              service.itinerary.map((day, idx) => (
                                <div key={idx} className="rounded-lg bg-muted/40 p-2.5 text-xs space-y-1">
                                  <div className="font-bold text-foreground">
                                    {t('tour.day')} {day.day}{day.title ? ` — ${day.title}` : ''}
                                  </div>
                                  {day.location && (
                                    <div className="flex items-start gap-1.5 text-muted-foreground"><MapPin className="w-3 h-3 mt-0.5 shrink-0" /><span>{day.location}</span></div>
                                  )}
                                  {day.accommodation && (
                                    <div className="flex items-start gap-1.5 text-muted-foreground"><Hotel className="w-3 h-3 mt-0.5 shrink-0" /><span>{day.accommodation}</span></div>
                                  )}
                                  {day.transportation && (
                                    <div className="flex items-start gap-1.5 text-muted-foreground"><Bus className="w-3 h-3 mt-0.5 shrink-0" /><span>{day.transportation}</span></div>
                                  )}
                                  {day.meals && (
                                    <div className="flex items-start gap-1.5 text-muted-foreground"><Utensils className="w-3 h-3 mt-0.5 shrink-0" /><span>{day.meals}</span></div>
                                  )}
                                  {day.activities && day.activities.length > 0 && (
                                    <div className="flex items-start gap-1.5 text-muted-foreground">
                                      <Sparkles className="w-3 h-3 mt-0.5 shrink-0" />
                                      <span>{day.activities.join(' · ')}</span>
                                    </div>
                                  )}
                                  {day.notes && <p className="text-muted-foreground italic">{day.notes}</p>}
                                </div>
                              ))
                            )}
                          </div>
                        </details>
                      </div>
                    )}
                  </div>
                ))}
              </div>

            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
