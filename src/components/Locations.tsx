'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Check, Clock, Users, GraduationCap } from 'lucide-react'
import { locations, getLocationsByCountry, Location } from '@/data/locations'

type Country = 'Thailand' | 'China'

export function Locations() {
  const [activeCountry, setActiveCountry] = useState<Country>('Thailand')

  const thailandLocations = getLocationsByCountry('Thailand')
  const chinaLocations = getLocationsByCountry('China')

  const currentLocations = activeCountry === 'Thailand' ? thailandLocations : chinaLocations

  const scrollToBooking = () => {
    const bookingSection = document.getElementById('booking')
    bookingSection?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="locations" className="relative py-24 bg-card/30">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-3 h-3 bg-accent-blue rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-muted-foreground">
              Our Dropzones
            </span>
            <div className="w-3 h-3 bg-accent-orange rounded-full animate-pulse" />
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6 text-foreground">
            Jump Locations
          </h2>
          
          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            Choose from our premium dropzones across Thailand and China, each offering unique scenery and world-class facilities.
          </p>
        </div>

        {/* Country Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-card rounded-full p-1 clean-border">
            {(['Thailand', 'China'] as Country[]).map((country) => (
              <button
                key={country}
                onClick={() => setActiveCountry(country)}
                className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 cursor-pointer ${
                  activeCountry === country
                    ? 'bg-accent-orange text-white'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {country === 'Thailand' ? '🇹🇭 Thailand' : '🇨🇳 China'}
              </button>
            ))}
          </div>
        </div>

        {/* Locations Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCountry}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            {currentLocations.map((location) => (
              <LocationCard 
                key={location.id} 
                location={location} 
                onBookClick={scrollToBooking}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Map Placeholder */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-card rounded-2xl clean-border overflow-hidden">
            <div className="aspect-[16/9] bg-gradient-to-br from-accent-blue/10 to-accent-orange/10 flex items-center justify-center">
              <div className="text-center px-8">
                <MapPin className="w-16 h-16 text-accent-blue mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-bold text-foreground mb-2">Interactive Map Coming Soon</h3>
                <p className="text-muted-foreground">
                  Explore all our locations with our interactive map feature
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

interface LocationCardProps {
  location: Location
  onBookClick: () => void
}

function LocationCard({ location, onBookClick }: LocationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`relative bg-card rounded-2xl overflow-hidden clean-border group hover:elevated-shadow transition-all duration-300 ${
        location.comingSoon ? 'opacity-75' : ''
      }`}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={location.imageUrl}
          alt={location.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Coming Soon Badge */}
        {location.comingSoon && (
          <div className="absolute top-4 right-4">
            <span className="bg-accent-blue text-white text-xs font-bold px-3 py-1 rounded-full">
              COMING SOON
            </span>
          </div>
        )}

        {/* Location Name Overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-2 text-white/80 text-sm mb-1">
            <MapPin className="w-4 h-4" />
            <span>{location.city}, {location.country}</span>
          </div>
          <h3 className="text-xl font-bold text-white">{location.name}</h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <p className="text-muted-foreground mb-4 leading-relaxed">
          {location.description}
        </p>

        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="inline-flex items-center gap-1 text-xs font-medium bg-accent-orange/10 text-accent-orange px-3 py-1 rounded-full">
            <Users className="w-3 h-3" />
            Tandem
          </span>
          {location.hasAFF && (
            <span className="inline-flex items-center gap-1 text-xs font-medium bg-accent-blue/10 text-accent-blue px-3 py-1 rounded-full">
              <GraduationCap className="w-3 h-3" />
              AFF
            </span>
          )}
          {location.hasGroupEvents && (
            <span className="inline-flex items-center gap-1 text-xs font-medium bg-accent-blue/10 text-accent-blue px-3 py-1 rounded-full">
              <Users className="w-3 h-3" />
              Groups
            </span>
          )}
        </div>

        {/* CTA */}
        {!location.comingSoon ? (
          <button
            onClick={onBookClick}
            className="w-full py-3 bg-accent-orange text-white font-semibold rounded-lg hover:bg-accent-orange/90 transition-colors cursor-pointer"
          >
            Book at this location
          </button>
        ) : (
          <button
            disabled
            className="w-full py-3 bg-muted text-muted-foreground font-semibold rounded-lg cursor-not-allowed"
          >
            Coming Soon
          </button>
        )}
      </div>
    </motion.div>
  )
}
