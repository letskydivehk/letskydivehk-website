import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'

export interface DepartureAvailability {
  id: string
  departure_date: string
  capacity: number
  seats_taken: number
  seats_left: number
  min_participants: number
  cutoff_days: number
  status: string
  is_full: boolean
  is_closed: boolean
}

export const INDOOR_LOCATION_SLUG = 'shenzhen-ifly'

/** Departures (with live availability) for a given location_service. */
export function useServiceDepartures(serviceId?: string) {
  return useQuery({
    queryKey: ['service-departures', serviceId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_departure_availability', {
        p_service_id: serviceId!,
      })
      if (error) throw error
      return (data ?? []) as unknown as DepartureAvailability[]
    },
    enabled: !!serviceId,
    staleTime: 1000 * 60 * 5,
  })
}

/** Resolves the Shenzhen iFLY indoor service (id + location) for site-wide use. */
export function useIndoorService() {
  return useQuery({
    queryKey: ['indoor-service', INDOOR_LOCATION_SLUG],
    queryFn: async () => {
      const { data: location, error: locError } = await supabase
        .from('locations')
        .select('id, slug, Name')
        .eq('slug', INDOOR_LOCATION_SLUG)
        .maybeSingle()
      if (locError) throw locError
      if (!location) return null

      const { data: service, error: svcError } = await supabase
        .from('location_services')
        .select('id, service_name, price_display, deposit_amount, service_type')
        .eq('location_id', location.id)
        .eq('service_type', 'indoor')
        .order('display_order', { ascending: true })
        .limit(1)
        .maybeSingle()
      if (svcError) throw svcError
      if (!service) return null

      return { location, service }
    },
    staleTime: 1000 * 60 * 10,
  })
}

/** First bookable departure from a list (open, not full, cutoff not passed). */
export function useNextDeparture(departures?: DepartureAvailability[]) {
  return useMemo(() => {
    if (!departures?.length) return null
    return (
      departures.find((d) => !d.is_full && !d.is_closed && !isCutoffPassed(d)) ?? null
    )
  }, [departures])
}

export function isCutoffPassed(d: DepartureAvailability) {
  const cutoff = new Date(d.departure_date)
  cutoff.setDate(cutoff.getDate() - (d.cutoff_days ?? 0))
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return cutoff <= today
}

export function isBookable(d: DepartureAvailability) {
  return !d.is_full && !d.is_closed && !isCutoffPassed(d)
}
