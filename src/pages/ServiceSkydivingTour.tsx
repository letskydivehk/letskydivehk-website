import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Hotel, Bus, Utensils, Sparkles, ArrowRight, Compass, Loader2, Check } from 'lucide-react'
import { SEO } from '@/components/SEO'
import { PageNavbar } from '@/components/PageNavbar'
import { HowItWorks } from '@/components/HowItWorks'
import { ServiceFAQ } from '@/components/ServiceFAQ'
import { ServiceCTA } from '@/components/ServiceCTA'
import { Footer } from '@/components/Footer'
import { useBooking } from '@/contexts/BookingContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { useLocations } from '@/hooks/useLocations'
import { useAllLocationServices, type LocationService } from '@/hooks/useLocationServices'

const tourFAQItems = [
  { questionKey: 'servicePage.tour.faq.q1', answerKey: 'servicePage.tour.faq.a1' },
  { questionKey: 'servicePage.tour.faq.q2', answerKey: 'servicePage.tour.faq.a2' },
  { questionKey: 'servicePage.tour.faq.q3', answerKey: 'servicePage.tour.faq.a3' },
  { questionKey: 'servicePage.tour.faq.q4', answerKey: 'servicePage.tour.faq.a4' },
]

const EXCLUDED_SLUGS = new Set(['luoding'])

export default function ServiceSkydivingTour() {
  const navigate = useNavigate()
  const { setPreselectedServiceType, setPreselectedLocationId } = useBooking()
  const { t, translateData } = useLanguage()
  const { data: locations, isLoading: locLoading } = useLocations()
  const { data: services, isLoading: svcLoading } = useAllLocationServices()

  useEffect(() => { window.scrollTo(0, 0) }, [])

  // Build location -> tours map (filtered)
  const locationTours = useMemo(() => {
    if (!locations || !services) return []
    return locations
      .filter((l) => !EXCLUDED_SLUGS.has(l.slug) && l.is_active && !l.coming_soon)
      .map((l) => ({
        location: l,
        tours: services
          .filter((s) => s.location_id === l.id && s.service_type === 'Tour')
          .sort((a, b) => a.display_order - b.display_order),
      }))
      .filter((g) => g.tours.length > 0)
  }, [locations, services])

  const [selectedLocId, setSelectedLocId] = useState<string | null>(null)

  useEffect(() => {
    if (!selectedLocId && locationTours.length > 0) {
      setSelectedLocId(locationTours[0].location.id)
    }
  }, [locationTours, selectedLocId])

  const selectedGroup = locationTours.find((g) => g.location.id === selectedLocId)

  const handleBookNow = (locationId?: string) => {
    setPreselectedServiceType('Tour')
    if (locationId) setPreselectedLocationId(locationId)
    navigate('/#booking')
    setTimeout(() => {
      document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const steps = [
    { icon: '📍', title: t('servicePage.tour.step1.title'), description: t('servicePage.tour.step1.desc') },
    { icon: '🗓️', title: t('servicePage.tour.step2.title'), description: t('servicePage.tour.step2.desc') },
    { icon: '💳', title: t('servicePage.tour.step3.title'), description: t('servicePage.tour.step3.desc') },
    { icon: '✈️', title: t('servicePage.tour.step4.title'), description: t('servicePage.tour.step4.desc') },
    { icon: '🪂', title: t('servicePage.tour.step5.title'), description: t('servicePage.tour.step5.desc') },
    { icon: '🌴', title: t('servicePage.tour.step6.title'), description: t('servicePage.tour.step6.desc') },
  ]

  return (
    <>
      <SEO
        title={t('services.tour.title')}
        description={t('services.tour.description')}
        path="/services/skydiving-tour"
      />
      <PageNavbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-b from-sky-100 via-background to-background">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-accent-orange/10 text-accent-orange text-sm font-semibold">
              <Compass className="w-4 h-4" /> {t('services.tour.subtitle')}
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-foreground mb-6">
              {t('services.tour.title')}
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              {t('services.tour.description')}
            </p>
            <button
              onClick={() => handleBookNow()}
              className="inline-flex items-center gap-2 bg-accent-orange text-white font-semibold py-3 px-8 rounded-lg hover:bg-accent-orange/90 transition-all"
            >
              {t('tour.bookTour')} <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </section>

      <HowItWorks steps={steps} />

      {/* Location picker + itineraries */}
      <section id="tour-itineraries" className="py-20 bg-card/30">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-black text-foreground mb-3">{t('tour.chooseLocation')}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">{t('tour.chooseLocationDesc')}</p>
          </div>

          {(locLoading || svcLoading) && (
            <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-accent-orange" /></div>
          )}

          {!locLoading && !svcLoading && locationTours.length === 0 && (
            <p className="text-center text-muted-foreground py-12">{t('tour.noTours')}</p>
          )}

          {locationTours.length > 0 && (
            <>
              {/* Location pills */}
              <div className="flex flex-wrap justify-center gap-3 mb-12">
                {locationTours.map(({ location }) => {
                  const active = selectedLocId === location.id
                  return (
                    <button
                      key={location.id}
                      onClick={() => setSelectedLocId(location.id)}
                      className={`px-5 py-2.5 rounded-full font-semibold transition-all border ${
                        active
                          ? 'bg-accent-orange text-white border-accent-orange shadow-md'
                          : 'bg-card text-foreground border-border hover:border-accent-orange'
                      }`}
                    >
                      {translateData(`location.${location.slug}`, location.Name)}
                    </button>
                  )
                })}
              </div>

              {/* Itineraries */}
              <AnimatePresence mode="wait">
                {selectedGroup && (
                  <motion.div
                    key={selectedGroup.location.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto"
                  >
                    {selectedGroup.tours.map((tour) => (
                      <TourCard
                        key={tour.id}
                        tour={tour}
                        locationName={translateData(`location.${selectedGroup.location.slug}`, selectedGroup.location.Name)}
                        onBook={() => handleBookNow(selectedGroup.location.id)}
                        t={t}
                        translateData={translateData}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

            </>
          )}
        </div>
      </section>

      <ServiceFAQ items={tourFAQItems} />
      <ServiceCTA onBookNow={() => handleBookNow()} />
      <Footer />
    </>
  )
}

function TourCard({
  tour,
  locationName,
  onBook,
  t,
  translateData,
}: {
  tour: LocationService
  locationName: string
  onBook: () => void
  t: (key: string) => string
  translateData: (key: string, fallback: string) => string
}) {

  const [photoIdx, setPhotoIdx] = useState(0)
  const photos = tour.photos?.length ? tour.photos : ['https://images.unsplash.com/photo-1528181304800-259b08848526?w=1200&q=80']

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-card rounded-2xl overflow-hidden clean-border mobile-transparent-card subtle-shadow hover:elevated-shadow transition-all flex flex-col"
    >
      {/* Photo gallery */}
      <div className="relative h-56 overflow-hidden bg-muted">
        <img src={photos[photoIdx]} alt={tour.service_name} className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
          <span className="text-base font-bold text-white bg-accent-orange px-3 py-1 rounded">{tour.price_display}</span>
          <span className="text-xs text-white/90 bg-black/40 px-2 py-0.5 rounded">{t('tour.deposit')}: HKD ${tour.deposit_amount}</span>
        </div>
        <div className="absolute bottom-3 left-4 right-4 text-white">
          <div className="text-xs opacity-80">{locationName}</div>
          <h3 className="text-xl font-bold">{translateData(`tour.name.${tour.service_name}`, tour.service_name)}</h3>
        </div>
        {photos.length > 1 && (
          <div className="absolute bottom-3 right-3 flex gap-1">
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={() => setPhotoIdx(i)}
                aria-label={`Photo ${i + 1}`}
                className={`w-2 h-2 rounded-full transition-all ${i === photoIdx ? 'bg-white w-5' : 'bg-white/50'}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="p-6 flex-1 flex flex-col">
        {tour.includes?.length > 0 && (
          <div className="mb-5">
            <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase">{t('services.whatsIncluded')}</div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1.5">
              {tour.includes.map((item, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                  <Check className="w-3.5 h-3.5 text-accent-orange mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <ol className="space-y-3 flex-1">
          {tour.itinerary.map((day) => (
            <li key={day.day} className="rounded-lg bg-muted/40 p-4">
              <div className="font-bold text-foreground mb-2">
                {t('tour.day')} {day.day}{day.title ? ` — ${day.title}` : ''}
              </div>
              <ul className="space-y-1.5 text-xs">
                {day.location && (
                  <li className="flex items-start gap-2 text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-accent-orange" />
                    <span><span className="font-semibold text-foreground">{t('tour.location')}:</span> {day.location}</span>
                  </li>
                )}
                {day.accommodation && (
                  <li className="flex items-start gap-2 text-muted-foreground">
                    <Hotel className="w-3.5 h-3.5 mt-0.5 shrink-0 text-accent-orange" />
                    <span><span className="font-semibold text-foreground">{t('tour.accommodation')}:</span> {day.accommodation}</span>
                  </li>
                )}
                {day.transportation && (
                  <li className="flex items-start gap-2 text-muted-foreground">
                    <Bus className="w-3.5 h-3.5 mt-0.5 shrink-0 text-accent-orange" />
                    <span><span className="font-semibold text-foreground">{t('tour.transportation')}:</span> {day.transportation}</span>
                  </li>
                )}
                {day.meals && (
                  <li className="flex items-start gap-2 text-muted-foreground">
                    <Utensils className="w-3.5 h-3.5 mt-0.5 shrink-0 text-accent-orange" />
                    <span><span className="font-semibold text-foreground">{t('tour.meals')}:</span> {day.meals}</span>
                  </li>
                )}
                {day.activities && day.activities.length > 0 && (
                  <li className="flex items-start gap-2 text-muted-foreground">
                    <Sparkles className="w-3.5 h-3.5 mt-0.5 shrink-0 text-accent-orange" />
                    <span><span className="font-semibold text-foreground">{t('tour.activities')}:</span> {day.activities.join(' · ')}</span>
                  </li>
                )}
              </ul>
            </li>
          ))}
        </ol>

        <button
          onClick={onBook}
          className="mt-6 w-full py-3 bg-accent-orange text-white font-semibold rounded-lg hover:bg-accent-orange/90 transition-all inline-flex items-center justify-center gap-2"
        >
          {t('tour.bookTour')} <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.article>
  )
}
