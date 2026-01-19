'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, MapPin, User, Mail, Phone, Check, ArrowRight, ArrowLeft, Plane } from 'lucide-react'
import { locations, getActiveLocations, Location } from '@/data/locations'

interface BookingFormData {
  location: string
  date: string
  participants: number
  firstName: string
  lastName: string
  email: string
  phone: string
  notes: string
}

type Step = 'location' | 'details' | 'confirm'

export function BookingSection() {
  const [currentStep, setCurrentStep] = useState<Step>('location')
  const [formData, setFormData] = useState<BookingFormData>({
    location: '',
    date: '',
    participants: 1,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    notes: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const activeLocations = getActiveLocations()
  const selectedLocation = locations.find(l => l.id === formData.location)

  const steps: { id: Step; label: string; icon: React.ElementType }[] = [
    { id: 'location', label: 'Location & Date', icon: MapPin },
    { id: 'details', label: 'Your Details', icon: User },
    { id: 'confirm', label: 'Confirm', icon: Check }
  ]

  const currentStepIndex = steps.findIndex(s => s.id === currentStep)

  const canProceed = () => {
    switch (currentStep) {
      case 'location':
        return formData.location && formData.date && formData.participants > 0
      case 'details':
        return formData.firstName && formData.lastName && formData.email && formData.phone
      case 'confirm':
        return true
      default:
        return false
    }
  }

  const handleNext = () => {
    if (currentStep === 'location') setCurrentStep('details')
    else if (currentStep === 'details') setCurrentStep('confirm')
  }

  const handleBack = () => {
    if (currentStep === 'details') setCurrentStep('location')
    else if (currentStep === 'confirm') setCurrentStep('details')
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Simulate API call - will be replaced with Firebase
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    setIsComplete(true)
  }

  const handleReset = () => {
    setFormData({
      location: '',
      date: '',
      participants: 1,
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      notes: ''
    })
    setCurrentStep('location')
    setIsComplete(false)
  }

  // Get min date (tomorrow)
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  if (isComplete) {
    return (
      <section id="booking" className="relative py-24 bg-background">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="bg-card rounded-3xl p-12 clean-border elevated-shadow">
              <div className="w-20 h-20 bg-accent-emerald rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-black text-foreground mb-4">
                Booking Request Submitted!
              </h2>
              <p className="text-muted-foreground mb-8 text-lg">
                Thank you, {formData.firstName}! We've received your booking request for a tandem skydive at {selectedLocation?.name}. 
                We'll contact you within 24 hours to confirm your booking.
              </p>
              <div className="bg-accent-emerald/10 rounded-xl p-6 mb-8 text-left">
                <h3 className="font-bold text-foreground mb-3">Booking Summary</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p><span className="font-medium text-foreground">Location:</span> {selectedLocation?.name}</p>
                  <p><span className="font-medium text-foreground">Date:</span> {formData.date}</p>
                  <p><span className="font-medium text-foreground">Participants:</span> {formData.participants}</p>
                  <p><span className="font-medium text-foreground">Email:</span> {formData.email}</p>
                </div>
              </div>
              <button
                onClick={handleReset}
                className="bg-foreground text-background font-semibold px-8 py-3 rounded-lg hover:bg-foreground/90 transition-colors cursor-pointer"
              >
                Book Another Jump
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section id="booking" className="relative py-24 bg-background">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-3 h-3 bg-accent-emerald rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-muted-foreground">
              Book Your Adventure
            </span>
            <div className="w-3 h-3 bg-accent-blue rounded-full animate-pulse" />
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6 text-foreground">
            Book a Tandem Skydive
          </h2>
          
          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            Ready for the thrill of a lifetime? Book your tandem skydive in just a few simple steps.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStepIndex === index
              const isCompleted = currentStepIndex > index
              
              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                      isActive ? 'bg-accent-emerald text-white' :
                      isCompleted ? 'bg-accent-emerald/20 text-accent-emerald' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {isCompleted ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                    </div>
                    <span className={`text-sm mt-2 font-medium ${
                      isActive ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-1 mx-4 rounded ${
                      currentStepIndex > index ? 'bg-accent-emerald' : 'bg-muted'
                    }`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Form Container */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-card rounded-3xl p-8 lg:p-12 clean-border elevated-shadow">
            <AnimatePresence mode="wait">
              {currentStep === 'location' && (
                <motion.div
                  key="location"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  {/* Location Selection */}
                  <div>
                    <label className="block text-lg font-semibold text-foreground mb-4">
                      Select Location
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {activeLocations.map((location) => (
                        <button
                          key={location.id}
                          onClick={() => setFormData({ ...formData, location: location.id })}
                          className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                            formData.location === location.id
                              ? 'border-accent-emerald bg-accent-emerald/5'
                              : 'border-border hover:border-accent-emerald/50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <MapPin className={`w-5 h-5 ${
                              formData.location === location.id ? 'text-accent-emerald' : 'text-muted-foreground'
                            }`} />
                            <div>
                              <p className="font-semibold text-foreground">{location.city}</p>
                              <p className="text-sm text-muted-foreground">{location.country}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Date Selection */}
                  <div>
                    <label className="block text-lg font-semibold text-foreground mb-4">
                      Preferred Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="date"
                        min={minDate}
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full pl-12 pr-4 py-4 rounded-xl border border-border bg-background text-foreground focus:border-accent-emerald focus:ring-2 focus:ring-accent-emerald/20 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Participants */}
                  <div>
                    <label className="block text-lg font-semibold text-foreground mb-4">
                      Number of Jumpers
                    </label>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setFormData({ ...formData, participants: Math.max(1, formData.participants - 1) })}
                        className="w-12 h-12 rounded-xl border border-border hover:border-accent-emerald/50 flex items-center justify-center text-xl font-bold cursor-pointer transition-colors"
                      >
                        -
                      </button>
                      <span className="text-2xl font-bold text-foreground w-12 text-center">
                        {formData.participants}
                      </span>
                      <button
                        onClick={() => setFormData({ ...formData, participants: Math.min(10, formData.participants + 1) })}
                        className="w-12 h-12 rounded-xl border border-border hover:border-accent-emerald/50 flex items-center justify-center text-xl font-bold cursor-pointer transition-colors"
                      >
                        +
                      </button>
                      <span className="text-muted-foreground">jumper{formData.participants !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 'details' && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">First Name</label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:border-accent-emerald focus:ring-2 focus:ring-accent-emerald/20 outline-none transition-all"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Last Name</label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:border-accent-emerald focus:ring-2 focus:ring-accent-emerald/20 outline-none transition-all"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-background text-foreground focus:border-accent-emerald focus:ring-2 focus:ring-accent-emerald/20 outline-none transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-background text-foreground focus:border-accent-emerald focus:ring-2 focus:ring-accent-emerald/20 outline-none transition-all"
                        placeholder="+852 1234 5678"
                      />
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Special Requests (Optional)</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:border-accent-emerald focus:ring-2 focus:ring-accent-emerald/20 outline-none transition-all resize-none"
                      placeholder="Any special requirements or questions..."
                    />
                  </div>
                </motion.div>
              )}

              {currentStep === 'confirm' && (
                <motion.div
                  key="confirm"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-8">
                    <Plane className="w-16 h-16 text-accent-emerald mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-foreground">Confirm Your Booking</h3>
                    <p className="text-muted-foreground">Please review your details before submitting</p>
                  </div>

                  <div className="bg-accent-emerald/5 rounded-xl p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Location</p>
                        <p className="font-semibold text-foreground">{selectedLocation?.name}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Date</p>
                        <p className="font-semibold text-foreground">{formData.date}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Participants</p>
                        <p className="font-semibold text-foreground">{formData.participants} jumper{formData.participants !== 1 ? 's' : ''}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Service</p>
                        <p className="font-semibold text-foreground">Tandem Skydive</p>
                      </div>
                    </div>
                    <div className="border-t border-border pt-4">
                      <p className="text-muted-foreground text-sm">Contact</p>
                      <p className="font-semibold text-foreground">{formData.firstName} {formData.lastName}</p>
                      <p className="text-sm text-muted-foreground">{formData.email} • {formData.phone}</p>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground text-center">
                    By clicking submit, you agree to our booking terms. We'll contact you within 24 hours to confirm availability and finalize your booking.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
              {currentStep !== 'location' ? (
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
              ) : (
                <div />
              )}

              {currentStep !== 'confirm' ? (
                <button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all cursor-pointer ${
                    canProceed()
                      ? 'bg-accent-emerald text-white hover:bg-accent-emerald/90'
                      : 'bg-muted text-muted-foreground cursor-not-allowed'
                  }`}
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-8 py-3 rounded-lg font-semibold bg-accent-emerald text-white hover:bg-accent-emerald/90 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Booking
                      <Check className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
