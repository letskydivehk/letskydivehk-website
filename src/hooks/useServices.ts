import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import type { Tables } from '@/integrations/supabase/types'

export type Service = Tables<'services'>

export function useServices() {
  return useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('display_order', { ascending: true })

      if (error) throw error
      return data as Service[]
    }
  })
}

export function useDirectBookingServices() {
  return useQuery({
    queryKey: ['services', 'direct'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('booking_type', 'direct')
        .order('display_order', { ascending: true })

      if (error) throw error
      return data as Service[]
    }
  })
}
