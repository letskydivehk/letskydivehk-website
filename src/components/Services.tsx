'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plane, GraduationCap, Users, Check, ArrowRight } from 'lucide-react'
import { services, Service } from '@/data/services'

const iconMap = {
  parachute: Plane,
  graduation: GraduationCap,
  users: Users
}

export function Services() {
  const [hoveredService, setHoveredService] = useState<string | null>(null)

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId)
    section?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="services" className="relative py-24 bg-background">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        
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

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((service) => {
            const IconComponent = iconMap[service.iconName]
            const isHovered = hoveredService === service.id
            
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: service.displayOrder * 0.1 }}
                onMouseEnter={() => setHoveredService(service.id)}
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
                    {service.priceDisplay}
                  </span>
                  {service.priceNote && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {service.priceNote}
                    </p>
                  )}
                </div>

                {/* Duration */}
                <div className="text-sm text-muted-foreground mb-6">
                  <span className="font-medium">Duration:</span> {service.duration}
                </div>

                {/* Includes */}
                <div className="mb-8">
                  <p className="text-sm font-semibold text-foreground mb-3">What's included:</p>
                  <ul className="space-y-2">
                    {service.includes.slice(0, 4).map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-accent-orange mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => scrollToSection(service.bookingType === 'direct' ? 'booking' : 'contact')}
                  className={`w-full py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer ${
                    service.bookingType === 'direct'
                      ? 'bg-accent-orange text-white hover:bg-accent-orange/90'
                      : 'bg-foreground text-background hover:bg-foreground/90'
                  }`}
                >
                  {service.bookingType === 'direct' ? 'Book Now' : 'Contact Us'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )
          })}
        </div>

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
