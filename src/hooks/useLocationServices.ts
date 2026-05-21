import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'

export interface ItineraryDay {
  day: number
  title?: string
  location?: string
  accommodation?: string
  transportation?: string
  meals?: string
  activities?: string[]
  notes?: string
}

export interface LocationService {
  id: string
  location_id: string
  service_name: string
  service_type: 'tandem' | 'aff' | 'group' | 'package'
  price_display: string
  description: string | null
  includes: string[]
  is_popular: boolean
  display_order: number
  deposit_amount: number
  itinerary: ItineraryDay[]
  photos: string[]
  created_at: string
  updated_at: string
}

export function useLocationServices(locationId?: string) {
  return useQuery({
    queryKey: ['location-services', locationId],
    queryFn: async () => {
      let query = supabase
        .from('location_services')
        .select('*')
        .order('display_order', { ascending: true })

      if (locationId) {
        query = query.eq('location_id', locationId)
      }

      const { data, error } = await query

      if (error) throw error
      return data as unknown as LocationService[]
    },
    enabled: locationId !== undefined
  })
}

export function useAllLocationServices() {
  return useQuery({
    queryKey: ['location-services', 'all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('location_services')
        .select('*')
        .order('display_order', { ascending: true })

      if (error) throw error
      return data as unknown as LocationService[]
    },
    staleTime: 1000 * 60 * 10, // 10 minutes - services rarely change
  })
}
