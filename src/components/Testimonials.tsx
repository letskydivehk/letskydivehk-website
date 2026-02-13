'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

interface Testimonial {
  id: number
  nameKey: string
  locationKey: string
  quoteKey: string
  rating: number
  serviceKey: string
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    nameKey: 'testimonials.review1.name',
    locationKey: 'testimonials.review1.location',
    quoteKey: 'testimonials.review1.quote',
    rating: 5,
    serviceKey: 'testimonials.review1.service',
  },
  {
    id: 2,
    nameKey: 'testimonials.review2.name',
    locationKey: 'testimonials.review2.location',
    quoteKey: 'testimonials.review2.quote',
    rating: 5,
    serviceKey: 'testimonials.review2.service',
  },
  {
    id: 3,
    nameKey: 'testimonials.review3.name',
    locationKey: 'testimonials.review3.location',
    quoteKey: 'testimonials.review3.quote',
    rating: 5,
    serviceKey: 'testimonials.review3.service',
  },
  {
    id: 4,
    nameKey: 'testimonials.review4.name',
    locationKey: 'testimonials.review4.location',
    quoteKey: 'testimonials.review4.quote',
    rating: 4,
    serviceKey: 'testimonials.review4.service',
  },
  {
    id: 5,
    nameKey: 'testimonials.review5.name',
    locationKey: 'testimonials.review5.location',
    quoteKey: 'testimonials.review5.quote',
    rating: 5,
    serviceKey: 'testimonials.review5.service',
  },
  {
    id: 6,
    nameKey: 'testimonials.review6.name',
    locationKey: 'testimonials.review6.location',
    quoteKey: 'testimonials.review6.quote',
    rating: 5,
    serviceKey: 'testimonials.review6.service',
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating
              ? 'text-accent-orange fill-accent-orange'
              : 'text-muted-foreground/30'
          }`}
        />
      ))}
    </div>
  )
}

export function Testimonials() {
  const { t } = useLanguage()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  // Show 1 on mobile, 2 on tablet, 3 on desktop
  const getVisibleCount = () => {
    if (typeof window === 'undefined') return 3
    if (window.innerWidth < 768) return 1
    if (window.innerWidth < 1024) return 2
    return 3
  }

  const [visibleCount, setVisibleCount] = useState(3)

  useEffect(() => {
    const updateCount = () => setVisibleCount(getVisibleCount())
    updateCount()
    window.addEventListener('resize', updateCount)
    return () => window.removeEventListener('resize', updateCount)
  }, [])

  const maxIndex = Math.max(0, testimonials.length - visibleCount)

  const next = useCallback(() => {
    setDirection(1)
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
  }, [maxIndex])

  const prev = useCallback(() => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))
  }, [maxIndex])

  // Auto-advance every 5 seconds
  useEffect(() => {
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next])

  const visibleTestimonials = testimonials.slice(
    currentIndex,
    currentIndex + visibleCount
  )

  return (
    <section className="relative py-24 bg-card/30">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-3 h-3 bg-accent-orange rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-muted-foreground">
              {t('testimonials.badge')}
            </span>
            <div className="w-3 h-3 bg-accent-blue rounded-full animate-pulse" />
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6 text-foreground">
            {t('testimonials.title')}
          </h2>

          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            {t('testimonials.subtitle')}
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative max-w-6xl mx-auto">
          {/* Navigation Buttons */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-card rounded-full clean-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:elevated-shadow transition-all duration-300 cursor-pointer hidden md:flex"
            aria-label="Previous testimonials"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-card rounded-full clean-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:elevated-shadow transition-all duration-300 cursor-pointer hidden md:flex"
            aria-label="Next testimonials"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Cards Grid */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 60 : -60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -60 : 60 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className={`grid gap-6 ${
                visibleCount === 1
                  ? 'grid-cols-1'
                  : visibleCount === 2
                  ? 'grid-cols-2'
                  : 'grid-cols-3'
              }`}
            >
              {visibleTestimonials.map((testimonial) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} t={t} />
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setDirection(idx > currentIndex ? 1 : -1)
                  setCurrentIndex(idx)
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentIndex
                    ? 'bg-accent-orange w-8'
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                aria-label={`Go to testimonial group ${idx + 1}`}
              />
            ))}
          </div>

          {/* Mobile Navigation */}
          <div className="flex justify-center gap-4 mt-4 md:hidden">
            <button
              onClick={prev}
              className="w-10 h-10 bg-card rounded-full clean-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-all cursor-pointer"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              className="w-10 h-10 bg-card rounded-full clean-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-all cursor-pointer"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

interface TestimonialCardProps {
  testimonial: Testimonial
  t: (key: string) => string
}

function TestimonialCard({ testimonial, t }: TestimonialCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -4, transition: { duration: 0.3 } }}
      className="bg-card rounded-2xl p-6 lg:p-8 clean-border hover:elevated-shadow transition-all duration-300 mobile-transparent-card flex flex-col h-full group overflow-hidden relative"
    >
      {/* Hover gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-orange/0 to-accent-blue/0 group-hover:from-accent-orange/5 group-hover:to-accent-blue/5 transition-all duration-500" />
      
      {/* Quote Icon */}
      <div className="relative z-10 mb-4">
        <Quote className="w-8 h-8 text-accent-orange/30 group-hover:text-accent-orange/60 transition-colors duration-500" />
      </div>

      {/* Rating */}
      <div className="relative z-10"><StarRating rating={testimonial.rating} /></div>

      {/* Quote */}
      <p className="relative z-10 text-muted-foreground leading-relaxed mt-4 mb-6 flex-1 italic">
        "{t(testimonial.quoteKey)}"
      </p>

      {/* Author */}
      <div className="relative z-10 border-t border-border pt-4 mt-auto">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-foreground text-sm">
              {t(testimonial.nameKey)}
            </p>
            <p className="text-xs text-muted-foreground">
              {t(testimonial.locationKey)}
            </p>
          </div>
          <span className="text-xs font-medium bg-accent-orange/10 text-accent-orange px-3 py-1 rounded-full">
            {t(testimonial.serviceKey)}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
