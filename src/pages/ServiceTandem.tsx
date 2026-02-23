import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { SEO } from '@/components/SEO'
import { ServiceHero } from '@/components/ServiceHero'
import { HowItWorks } from '@/components/HowItWorks'
import { ServiceIncludes } from '@/components/ServiceIncludes'
import { ServicePricing } from '@/components/ServicePricing'
import { ServiceFAQ } from '@/components/ServiceFAQ'
import { ServiceSocialProof } from '@/components/ServiceSocialProof'
import { ServiceCTA } from '@/components/ServiceCTA'
import { Footer } from '@/components/Footer'
import { useBooking } from '@/contexts/BookingContext'
import { useLanguage } from '@/contexts/LanguageContext'
import heroTandem from '@/assets/hero-tandem.jpg'

const tandemFAQItems = [
  { questionKey: 'servicePage.tandem.faq.q1', answerKey: 'servicePage.tandem.faq.a1' },
  { questionKey: 'servicePage.tandem.faq.q2', answerKey: 'servicePage.tandem.faq.a2' },
  { questionKey: 'servicePage.tandem.faq.q3', answerKey: 'servicePage.tandem.faq.a3' },
  { questionKey: 'servicePage.tandem.faq.q4', answerKey: 'servicePage.tandem.faq.a4' },
]

export default function ServiceTandem() {
  const navigate = useNavigate()
  const { setPreselectedServiceType } = useBooking()
  const { t } = useLanguage()

  useEffect(() => { window.scrollTo(0, 0) }, [])

  const handleBookNow = () => {
    setPreselectedServiceType('tandem')
    navigate('/#booking')
    setTimeout(() => {
      document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const steps = [
    { icon: '📍', title: t('servicePage.tandem.step1.title'), description: t('servicePage.tandem.step1.desc') },
    { icon: '📋', title: t('servicePage.tandem.step2.title'), description: t('servicePage.tandem.step2.desc') },
    { icon: '✈️', title: t('servicePage.tandem.step3.title'), description: t('servicePage.tandem.step3.desc') },
    { icon: '🪂', title: t('servicePage.tandem.step4.title'), description: t('servicePage.tandem.step4.desc') },
    { icon: '🌤️', title: t('servicePage.tandem.step5.title'), description: t('servicePage.tandem.step5.desc') },
    { icon: '🎉', title: t('servicePage.tandem.step6.title'), description: t('servicePage.tandem.step6.desc') },
  ]

  const includes = [
    t('servicePage.tandem.include1'),
    t('servicePage.tandem.include2'),
    t('servicePage.tandem.include3'),
    t('servicePage.tandem.include4'),
    t('servicePage.tandem.include5'),
    t('servicePage.tandem.include6'),
  ]

  return (
    <>
      <SEO
        title="Tandem Skydive"
        description="Experience the thrill of tandem skydiving with Let's Skydive HK. No experience needed - jump with a certified instructor across Asia's best dropzones."
        path="/services/tandem-skydive"
      />
      <ServiceHero
        title={t('servicePage.tandem.heroTitle')}
        subtitle={t('servicePage.tandem.heroSubtitle')}
        tagline={t('servicePage.tandem.heroTagline')}
        backgroundImage={heroTandem}
        onBookNow={handleBookNow}
      />
      <HowItWorks steps={steps} />
      <ServiceIncludes items={includes} />
      <ServicePricing serviceType="tandem" />
      <ServiceSocialProof
        testimonialKey="servicePage.tandem.testimonial"
        testimonialAuthorKey="servicePage.tandem.testimonialAuthor"
      />
      <ServiceFAQ items={tandemFAQItems} />
      <ServiceCTA onBookNow={handleBookNow} />
      <Footer />
    </>
  )
}
