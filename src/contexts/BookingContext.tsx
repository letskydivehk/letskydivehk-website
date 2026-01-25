'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

interface BookingContextType {
  preselectedLocationId: string | null
  setPreselectedLocationId: (id: string | null) => void
  preselectedServiceType: string | null
  setPreselectedServiceType: (type: string | null) => void
  activeServiceTypeFilter: string | null
  setActiveServiceTypeFilter: (type: string | null) => void
}

const BookingContext = createContext<BookingContextType | undefined>(undefined)

export function BookingProvider({ children }: { children: ReactNode }) {
  const [preselectedLocationId, setPreselectedLocationId] = useState<string | null>(null)
  const [preselectedServiceType, setPreselectedServiceType] = useState<string | null>(null)
  const [activeServiceTypeFilter, setActiveServiceTypeFilter] = useState<string | null>(null)

  return (
    <BookingContext.Provider value={{ 
      preselectedLocationId, 
      setPreselectedLocationId,
      preselectedServiceType,
      setPreselectedServiceType,
      activeServiceTypeFilter,
      setActiveServiceTypeFilter
    }}>
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking() {
  const context = useContext(BookingContext)
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider')
  }
  return context
}
