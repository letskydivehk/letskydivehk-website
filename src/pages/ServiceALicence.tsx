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
import heroALicence from '@/assets/hero-a-licence.jpg'
import affCurriculum from '@/assets/aff-training-curriculum.png'

const affFAQItems = [
  { questionKey: 'servicePage.aff.faq.q1', answerKey: 'servicePage.aff.faq.a1' },
  { questionKey: 'servicePage.aff.faq.q2', answerKey: 'servicePage.aff.faq.a2' },
  { questionKey: 'servicePage.aff.faq.q3', answerKey: 'servicePage.aff.faq.a3' },
  { questionKey: 'servicePage.aff.faq.q4', answerKey: 'servicePage.aff.faq.a4' },
]

export default function ServiceALicence() {
  const navigate = useNavigate()
  const { setPreselectedServiceType } = useBooking()
  const { t } = useLanguage()

  useEffect(() => { window.scrollTo(0, 0) }, [])

  const handleBookNow = () => {
    setPreselectedServiceType('aff')
    navigate('/#booking')
    setTimeout(() => {
      document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const steps = [
    { icon: '📝', title: t('servicePage.aff.step1.title'), description: t('servicePage.aff.step1.desc') },
    { icon: '📚', title: t('servicePage.aff.step2.title'), description: t('servicePage.aff.step2.desc') },
    { icon: '🪂', title: t('servicePage.aff.step3.title'), description: t('servicePage.aff.step3.desc') },
    { icon: '🎯', title: t('servicePage.aff.step4.title'), description: t('servicePage.aff.step4.desc') },
    { icon: '✈️', title: t('servicePage.aff.step5.title'), description: t('servicePage.aff.step5.desc') },
    { icon: '🏆', title: t('servicePage.aff.step6.title'), description: t('servicePage.aff.step6.desc') },
  ]

  const includes = [
    t('servicePage.aff.include1'),
    t('servicePage.aff.include2'),
    t('servicePage.aff.include3'),
    t('servicePage.aff.include4'),
    t('servicePage.aff.include5'),
  ]

  return (
    <>
      <SEO
        title="A-Licence (AFF Course)"
        description="Get your skydiving A-Licence with Let's Skydive HK. Accelerated Freefall program with 25 jumps to become a licensed solo skydiver."
        path="/services/a-licence"
      />
      <ServiceHero
        title={t('servicePage.aff.heroTitle')}
        subtitle={t('servicePage.aff.heroSubtitle')}
        tagline={t('servicePage.aff.heroTagline')}
        backgroundImage={heroALicence}
        onBookNow={handleBookNow}
      />
      <HowItWorks steps={steps} />

      {/* Training Curriculum Image */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-3 h-3 bg-accent-orange rounded-full animate-pulse" />
              <span className="text-sm font-semibold text-muted-foreground">
                {t('servicePage.aff.curriculumBadge')}
              </span>
              <div className="w-3 h-3 bg-accent-blue rounded-full animate-pulse" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-foreground mb-4">
              {t('servicePage.aff.curriculumTitle')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('servicePage.aff.curriculumDesc')}
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <img
              src={affCurriculum}
              alt={t('servicePage.aff.curriculumAlt')}
              className="w-full h-auto rounded-2xl shadow-lg"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <ServiceIncludes items={includes} />
      <ServicePricing serviceType="aff" />
      <ServiceSocialProof
        testimonialKey="servicePage.aff.testimonial"
        testimonialAuthorKey="servicePage.aff.testimonialAuthor"
      />
      <ServiceFAQ items={affFAQItems} />
      <ServiceCTA onBookNow={handleBookNow} />
      <Footer />
    </>
  )
}
