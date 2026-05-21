import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Hotel, Bus, Utensils, Sparkles, ArrowRight, Compass } from 'lucide-react'
import { SEO } from '@/components/SEO'
import { PageNavbar } from '@/components/PageNavbar'
import { ServiceCTA } from '@/components/ServiceCTA'
import { Footer } from '@/components/Footer'
import { useBooking } from '@/contexts/BookingContext'
import { useLanguage } from '@/contexts/LanguageContext'

interface ItineraryDay {
  day: number
  title: string
  location: string
  accommodation: string
  transportation: string
  meals: string
  activities: string[]
}

interface TourPlan {
  slug: string
  title: string
  flag: string
  duration: string
  priceFrom: string
  heroImage: string
  summary: string
  days: ItineraryDay[]
}

type LangKey = 'en' | 'zh-TW' | 'zh-CN'

const itineraries: Record<LangKey, TourPlan[]> = {
  en: [
    {
      slug: 'pattaya-3d2n',
      title: 'Pattaya 3 Days 2 Nights',
      flag: '🇹🇭',
      duration: '3D2N',
      priceFrom: 'From $5,700',
      heroImage: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1200&q=80',
      summary: 'Tandem skydive over Thai Sky Adventures plus the best of Pattaya beach life.',
      days: [
        {
          day: 1,
          title: 'Arrival & Pattaya Beach',
          location: 'Hong Kong → Bangkok → Pattaya',
          accommodation: '4★ Beachfront hotel (Central Pattaya)',
          transportation: 'Flight HKG–BKK + private transfer to Pattaya',
          meals: 'Welcome seafood dinner',
          activities: ['Beach sunset', 'Walking Street stroll'],
        },
        {
          day: 2,
          title: 'Tandem Skydive Day',
          location: 'Thai Sky Adventures dropzone, Pattaya',
          accommodation: '4★ Beachfront hotel (Central Pattaya)',
          transportation: 'Hotel ⇄ dropzone shuttle',
          meals: 'Breakfast + celebratory dinner',
          activities: ['Briefing & gear-up', 'Tandem skydive from 13,000 ft', 'HD video & photos'],
        },
        {
          day: 3,
          title: 'Brunch & Departure',
          location: 'Pattaya → Bangkok → Hong Kong',
          accommodation: '—',
          transportation: 'Private transfer + flight BKK–HKG',
          meals: 'Beachside brunch',
          activities: ['Free morning', 'Souvenir shopping'],
        },
      ],
    },
    {
      slug: 'chiangmai-4d3n',
      title: 'Chiang Mai 4 Days 3 Nights',
      flag: '🇹🇭',
      duration: '4D3N',
      priceFrom: 'From $6,500',
      heroImage: 'https://images.unsplash.com/photo-1598935898639-81586f7d2129?w=1200&q=80',
      summary: 'Northern Thailand adventure: tandem skydive over rice fields plus temples, food and culture.',
      days: [
        {
          day: 1,
          title: 'Arrival & Old City',
          location: 'Hong Kong → Chiang Mai',
          accommodation: 'Boutique hotel inside Old City moat',
          transportation: 'Direct flight HKG–CNX + airport transfer',
          meals: 'Khao Soi welcome dinner',
          activities: ['Tha Phae Gate sunset', 'Sunday Night Market'],
        },
        {
          day: 2,
          title: 'Tandem Skydive Day',
          location: 'Chiang Mai Skydiving dropzone',
          accommodation: 'Boutique hotel inside Old City moat',
          transportation: 'Hotel ⇄ dropzone shuttle (45 min)',
          meals: 'Breakfast + farm-to-table lunch',
          activities: ['Tandem skydive over Doi Saket', 'HD video & photos', 'Riverside dinner'],
        },
        {
          day: 3,
          title: 'Temples & Mountains',
          location: 'Doi Suthep & Nimman',
          accommodation: 'Boutique hotel inside Old City moat',
          transportation: 'Private van',
          meals: 'Breakfast + street food tour',
          activities: ['Doi Suthep temple', 'Nimman café hopping', 'Night Bazaar'],
        },
        {
          day: 4,
          title: 'Cooking Class & Departure',
          location: 'Chiang Mai → Hong Kong',
          accommodation: '—',
          transportation: 'Airport transfer + flight CNX–HKG',
          meals: 'Thai cooking class lunch',
          activities: ['Half-day cooking class', 'Last-minute shopping'],
        },
      ],
    },
  ],
  'zh-tw': [
    {
      slug: 'pattaya-3d2n',
      title: '芭堤雅 3 日 2 夜',
      flag: '🇹🇭',
      duration: '3日2夜',
      priceFrom: '$5,700 起',
      heroImage: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1200&q=80',
      summary: '泰國 Thai Sky Adventures 雙人跳傘，加上芭堤雅海灘度假之旅。',
      days: [
        {
          day: 1,
          title: '抵達與芭堤雅海灘',
          location: '香港 → 曼谷 → 芭堤雅',
          accommodation: '4★ 海濱酒店（芭堤雅中區）',
          transportation: 'HKG–BKK 航班 + 私人專車接送至芭堤雅',
          meals: '迎賓海鮮晚餐',
          activities: ['海灘日落', '漫遊步行街'],
        },
        {
          day: 2,
          title: '雙人跳傘日',
          location: 'Thai Sky Adventures 跳傘場，芭堤雅',
          accommodation: '4★ 海濱酒店（芭堤雅中區）',
          transportation: '酒店 ⇄ 跳傘場專車接送',
          meals: '早餐 + 慶功晚餐',
          activities: ['課前簡報與裝備', '13,000 呎雙人跳傘', '高清影片與相片'],
        },
        {
          day: 3,
          title: '早午餐與回程',
          location: '芭堤雅 → 曼谷 → 香港',
          accommodation: '—',
          transportation: '私人專車 + BKK–HKG 航班',
          meals: '海邊早午餐',
          activities: ['自由活動', '手信採購'],
        },
      ],
    },
    {
      slug: 'chiangmai-4d3n',
      title: '清邁 4 日 3 夜',
      flag: '🇹🇭',
      duration: '4日3夜',
      priceFrom: '$6,500 起',
      heroImage: 'https://images.unsplash.com/photo-1598935898639-81586f7d2129?w=1200&q=80',
      summary: '北泰冒險之旅：稻田上空雙人跳傘，加上寺廟、美食與文化體驗。',
      days: [
        {
          day: 1,
          title: '抵達與古城漫遊',
          location: '香港 → 清邁',
          accommodation: '古城護城河內精品酒店',
          transportation: 'HKG–CNX 直航 + 機場接送',
          meals: '咖喱麵迎賓晚餐',
          activities: ['塔佩門日落', '週日夜市'],
        },
        {
          day: 2,
          title: '雙人跳傘日',
          location: 'Chiang Mai Skydiving 跳傘場',
          accommodation: '古城護城河內精品酒店',
          transportation: '酒店 ⇄ 跳傘場專車（約 45 分鐘）',
          meals: '早餐 + 田園午餐',
          activities: ['Doi Saket 上空雙人跳傘', '高清影片與相片', '河畔晚餐'],
        },
        {
          day: 3,
          title: '寺廟與山景',
          location: '素帖山 & 寧曼路',
          accommodation: '古城護城河內精品酒店',
          transportation: '私人專車',
          meals: '早餐 + 街頭美食之旅',
          activities: ['素帖山雙龍寺', '寧曼路咖啡店', '夜間市集'],
        },
        {
          day: 4,
          title: '泰菜烹飪與回程',
          location: '清邁 → 香港',
          accommodation: '—',
          transportation: '機場接送 + CNX–HKG 航班',
          meals: '泰菜烹飪課午餐',
          activities: ['半日泰菜烹飪課', '最後採購'],
        },
      ],
    },
  ],
  'zh-cn': [
    {
      slug: 'pattaya-3d2n',
      title: '芭提雅 3 日 2 夜',
      flag: '🇹🇭',
      duration: '3日2夜',
      priceFrom: '$5,700 起',
      heroImage: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1200&q=80',
      summary: '泰国 Thai Sky Adventures 双人跳伞，加上芭提雅海滩度假之旅。',
      days: [
        {
          day: 1,
          title: '抵达与芭提雅海滩',
          location: '香港 → 曼谷 → 芭提雅',
          accommodation: '4★ 海滨酒店（芭提雅中区）',
          transportation: 'HKG–BKK 航班 + 私人专车接送至芭提雅',
          meals: '迎宾海鲜晚餐',
          activities: ['海滩日落', '漫步步行街'],
        },
        {
          day: 2,
          title: '双人跳伞日',
          location: 'Thai Sky Adventures 跳伞场，芭提雅',
          accommodation: '4★ 海滨酒店（芭提雅中区）',
          transportation: '酒店 ⇄ 跳伞场专车接送',
          meals: '早餐 + 庆功晚餐',
          activities: ['课前简报与装备', '13,000 英尺双人跳伞', '高清影片与相片'],
        },
        {
          day: 3,
          title: '早午餐与回程',
          location: '芭提雅 → 曼谷 → 香港',
          accommodation: '—',
          transportation: '私人专车 + BKK–HKG 航班',
          meals: '海边早午餐',
          activities: ['自由活动', '手信采购'],
        },
      ],
    },
    {
      slug: 'chiangmai-4d3n',
      title: '清迈 4 日 3 夜',
      flag: '🇹🇭',
      duration: '4日3夜',
      priceFrom: '$6,500 起',
      heroImage: 'https://images.unsplash.com/photo-1598935898639-81586f7d2129?w=1200&q=80',
      summary: '北泰冒险之旅：稻田上空双人跳伞，加上寺庙、美食与文化体验。',
      days: [
        {
          day: 1,
          title: '抵达与古城漫游',
          location: '香港 → 清迈',
          accommodation: '古城护城河内精品酒店',
          transportation: 'HKG–CNX 直航 + 机场接送',
          meals: '咖喱面迎宾晚餐',
          activities: ['塔佩门日落', '周日夜市'],
        },
        {
          day: 2,
          title: '双人跳伞日',
          location: 'Chiang Mai Skydiving 跳伞场',
          accommodation: '古城护城河内精品酒店',
          transportation: '酒店 ⇄ 跳伞场专车（约 45 分钟）',
          meals: '早餐 + 田园午餐',
          activities: ['Doi Saket 上空双人跳伞', '高清影片与相片', '河畔晚餐'],
        },
        {
          day: 3,
          title: '寺庙与山景',
          location: '素帖山 & 宁曼路',
          accommodation: '古城护城河内精品酒店',
          transportation: '私人专车',
          meals: '早餐 + 街头美食之旅',
          activities: ['素帖山双龙寺', '宁曼路咖啡店', '夜间市集'],
        },
        {
          day: 4,
          title: '泰菜烹饪与回程',
          location: '清迈 → 香港',
          accommodation: '—',
          transportation: '机场接送 + CNX–HKG 航班',
          meals: '泰菜烹饪课午餐',
          activities: ['半日泰菜烹饪课', '最后采购'],
        },
      ],
    },
  ],
}

export default function ServiceSkydivingTour() {
  const navigate = useNavigate()
  const { setPreselectedServiceType } = useBooking()
  const { t, language } = useLanguage()

  useEffect(() => { window.scrollTo(0, 0) }, [])

  const lang = (language as LangKey) in itineraries ? (language as LangKey) : 'en'
  const tours = itineraries[lang]

  const handleBookNow = () => {
    setPreselectedServiceType('package')
    navigate('/#booking')
    setTimeout(() => {
      document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

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
            <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
              <span className="px-3 py-1 rounded-full bg-card border border-border text-sm text-foreground">From $5,700</span>
              <span className="px-3 py-1 rounded-full bg-card border border-border text-sm text-foreground">$2,000 deposit</span>
              <span className="px-3 py-1 rounded-full bg-card border border-border text-sm text-foreground">18+ · ≤100kg</span>
            </div>
            <button
              onClick={handleBookNow}
              className="inline-flex items-center gap-2 bg-accent-orange text-white font-semibold py-3 px-8 rounded-lg hover:bg-accent-orange/90 transition-all"
            >
              {t('tour.bookTour')} <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Featured Itineraries */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-foreground mb-3">
              {t('tour.featuredItineraries')}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('services.tour.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {tours.map((tour, idx) => (
              <motion.article
                key={tour.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-card rounded-2xl overflow-hidden clean-border mobile-transparent-card subtle-shadow hover:elevated-shadow transition-all flex flex-col"
              >
                <div className="relative h-48 overflow-hidden">
                  <img src={tour.heroImage} alt={tour.title} className="w-full h-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
                    <div>
                      <div className="text-2xl">{tour.flag}</div>
                      <h3 className="text-xl font-bold">{tour.title}</h3>
                    </div>
                    <div className="text-right">
                      <div className="text-xs opacity-80">{tour.duration}</div>
                      <div className="text-base font-bold text-accent-orange bg-white/90 px-2 py-0.5 rounded">{tour.priceFrom}</div>
                    </div>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <p className="text-sm text-muted-foreground mb-5">{tour.summary}</p>

                  <ol className="space-y-3 flex-1">
                    {tour.days.map((day) => (
                      <li key={day.day} className="rounded-lg bg-muted/40 p-4">
                        <div className="font-bold text-foreground mb-2">
                          {t('tour.day')} {day.day} — {day.title}
                        </div>
                        <ul className="space-y-1.5 text-xs">
                          <li className="flex items-start gap-2 text-muted-foreground">
                            <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-accent-orange" />
                            <span><span className="font-semibold text-foreground">{t('tour.location')}:</span> {day.location}</span>
                          </li>
                          <li className="flex items-start gap-2 text-muted-foreground">
                            <Hotel className="w-3.5 h-3.5 mt-0.5 shrink-0 text-accent-orange" />
                            <span><span className="font-semibold text-foreground">{t('tour.accommodation')}:</span> {day.accommodation}</span>
                          </li>
                          <li className="flex items-start gap-2 text-muted-foreground">
                            <Bus className="w-3.5 h-3.5 mt-0.5 shrink-0 text-accent-orange" />
                            <span><span className="font-semibold text-foreground">{t('tour.transportation')}:</span> {day.transportation}</span>
                          </li>
                          <li className="flex items-start gap-2 text-muted-foreground">
                            <Utensils className="w-3.5 h-3.5 mt-0.5 shrink-0 text-accent-orange" />
                            <span><span className="font-semibold text-foreground">{t('tour.meals')}:</span> {day.meals}</span>
                          </li>
                          <li className="flex items-start gap-2 text-muted-foreground">
                            <Sparkles className="w-3.5 h-3.5 mt-0.5 shrink-0 text-accent-orange" />
                            <span><span className="font-semibold text-foreground">{t('tour.activities')}:</span> {day.activities.join(' · ')}</span>
                          </li>
                        </ul>
                      </li>
                    ))}
                  </ol>

                  <button
                    onClick={handleBookNow}
                    className="mt-6 w-full bg-accent-orange text-white font-semibold py-3 px-6 rounded-lg hover:bg-accent-orange/90 transition-all flex items-center justify-center gap-2"
                  >
                    {t('tour.bookTour')} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <ServiceCTA onBookNow={handleBookNow} />
      <Footer />
    </>
  )
}
