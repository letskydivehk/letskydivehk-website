'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Plane, GraduationCap, Users, Check, ArrowRight, Loader2 } from 'lucide-react'
import { useAllLocationServices, type LocationService } from '@/hooks/useLocationServices'
import { SectionDecorations } from './SectionDecorations'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  tandem: Plane,
  aff: GraduationCap,
  group: Users
}

// Aggregate services by type for display
interface AggregatedService {
  type: 'tandem' | 'aff' | 'group'
  title: string
  subtitle: string
  description: string
  priceRange: string
  includes: string[]
  isPopular: boolean
}

const serviceInfo: Record<string, { title: string; subtitle: string; description: string }> = {
  tandem: {
    title: 'Tandem Skydive',
    subtitle: 'First-time jumpers',
    description: 'Experience the thrill of freefall safely strapped to an experienced instructor. No experience needed!'
  },
  aff: {
    title: 'AFF Course',
    subtitle: 'Learn to skydive solo',
    description: 'Accelerated Freefall program to become a licensed skydiver. Comprehensive training included.'
  },
  group: {
    title: 'Group Events',
    subtitle: 'Corporate & celebrations',
    description: 'Perfect for team building, birthdays, or any special occasion. Custom packages available.'
  }
}

export function Services() {
  const [hoveredService, setHoveredService] = useState<string | null>(null)
  const { data: locationServices, isLoading, error } = useAllLocationServices()

  // Aggregate location services by type
  const aggregatedServices = useMemo(() => {
    if (!locationServices) return []

    const grouped = locationServices.reduce((acc, service) => {
      if (!acc[service.service_type]) {
        acc[service.service_type] = {
          services: [],
          isPopular: false,
          includes: new Set<string>()
        }
      }
      acc[service.service_type].services.push(service)
      if (service.is_popular) acc[service.service_type].isPopular = true
      service.includes?.forEach(item => acc[service.service_type].includes.add(item))
      return acc
    }, {} as Record<string, { services: LocationService[]; isPopular: boolean; includes: Set<string> }>)

    // Calculate price ranges and create aggregated services
    return Object.entries(grouped).map(([type, data]) => {
      const prices = data.services
        .filter(s => !s.price_display.toLowerCase().includes('custom'))
        .map(s => parseInt(s.price_display.replace(/[^0-9]/g, '')) || 0)
        .filter(p => p > 0)
        .sort((a, b) => a - b)

      const info = serviceInfo[type] || { title: type, subtitle: '', description: '' }

      return {
        type: type as 'tandem' | 'aff' | 'group',
        title: info.title,
        subtitle: info.subtitle,
        description: info.description,
        priceRange: prices.length > 0 
          ? prices.length > 1 
            ? `From $${prices[0].toLocaleString()}` 
            : `$${prices[0].toLocaleString()}`
          : 'Custom Quote',
        includes: Array.from(data.includes).slice(0, 4),
        isPopular: data.isPopular
      } as AggregatedService
    }).sort((a, b) => {
      const order = { tandem: 1, aff: 2, group: 3 }
      return (order[a.type] || 99) - (order[b.type] || 99)
    })
  }, [locationServices])

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId)
    section?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="services" className="relative py-24 bg-background overflow-hidden">
      <SectionDecorations />
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-3 h-3 bg-accent-orange rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-muted-foreground">
              Choose Your Adventure
            </span>
            <div className="w-3 h-3 bg-accent-blue rounded-full animate-pulse" />
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6 text-foreground">
            Our Services
          </h2>
          
          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            From first-time tandem jumps to professional certification courses, we have the perfect experience for you.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-accent-orange" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <p className="text-destructive">Failed to load services. Please try again later.</p>
          </div>
        )}

        {/* Services Grid */}
        {!isLoading && !error && aggregatedServices && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
            {aggregatedServices.map((service, index) => {
              const IconComponent = iconMap[service.type] || Plane
              const isHovered = hoveredService === service.type
              
              return (
                <motion.div
                  key={service.type}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onMouseEnter={() => setHoveredService(service.type)}
                  onMouseLeave={() => setHoveredService(null)}
                  className={`relative bg-card rounded-2xl p-8 clean-border transition-all duration-300 ${
                    isHovered ? 'elevated-shadow scale-[1.02]' : 'subtle-shadow'
                  } ${service.isPopular ? 'ring-2 ring-accent-orange' : ''}`}
                >
                  {/* Popular Badge */}
                  {service.isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-accent-orange text-white text-xs font-bold px-4 py-1 rounded-full">
                        MOST POPULAR
                      </span>
                    </div>
                  )}

                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300 ${
                    isHovered ? 'bg-accent-orange' : 'bg-accent-orange/10'
                  }`}>
                    <IconComponent className={`w-8 h-8 transition-colors duration-300 ${
                      isHovered ? 'text-white' : 'text-accent-orange'
                    }`} />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {service.subtitle}
                  </p>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Price */}
                  <div className="mb-6">
                    <span className="text-3xl font-black text-foreground">
                      {service.priceRange}
                    </span>
                    <p className="text-sm text-muted-foreground mt-1">
                      Prices vary by location
                    </p>
                  </div>

                  {/* Includes */}
                  {service.includes.length > 0 && (
                    <div className="mb-8">
                      <p className="text-sm font-semibold text-foreground mb-3">What's included:</p>
                      <ul className="space-y-2">
                        {service.includes.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <Check className="w-4 h-4 text-accent-orange mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* CTA Button */}
                  <button
                    onClick={() => scrollToSection(service.type === 'group' ? 'contact' : 'booking')}
                    className={`w-full py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer ${
                      service.type !== 'group'
                        ? 'bg-accent-orange text-white hover:bg-accent-orange/90'
                        : 'bg-foreground text-background hover:bg-foreground/90'
                    }`}
                  >
                    {service.type !== 'group' ? 'Book Now' : 'Contact Us'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Safety Note */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-4 bg-card/50 rounded-2xl px-8 py-4 clean-border">
            <div className="w-3 h-3 bg-accent-orange rounded-full" />
            <p className="text-muted-foreground">
              <span className="font-semibold text-foreground">Safety First:</span> All jumps are conducted with certified instructors and modern equipment
            </p>
            <div className="w-3 h-3 bg-accent-orange rounded-full" />
          </div>
        </div>
      </div>
    </section>
  )
}