import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import type { Tables } from '@/integrations/supabase/types'

export type Location = Tables<'locations'>

export function useLocations() {
  return useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })

      if (error) throw error
      return data as Location[]
    },
    staleTime: 1000 * 60 * 10, // 10 minutes - locations rarely change
  })
}

export function useLocationsByCountry(country: string) {
  return useQuery({
    queryKey: ['locations', country],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .eq('is_active', true)
        .eq('country', country)
        .order('display_order', { ascending: true })

      if (error) throw error
      return data as Location[]
    }
  })
}
