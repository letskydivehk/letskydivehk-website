import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import type { Location } from './useLocations'

export interface LocationPhoto {
  id: string
  location_id: string
  file_url: string
  file_path: string
  caption: string | null
  display_order: number
  created_at: string
}

export function useLocationBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ['location', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .eq('slug', slug!)
        .eq('is_active', true)
        .single()

      if (error) throw error
      return data as Location & {
        airport_distance: string | null
        city_distance: string | null
        transportation: string | null
        google_maps_embed_url: string | null
        highlights: string[] | null
      }
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 10,
  })
}

export function useLocationPhotos(locationId: string | undefined) {
  return useQuery({
    queryKey: ['location-photos', locationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('location_photos')
        .select('*')
        .eq('location_id', locationId!)
        .order('display_order', { ascending: true })

      if (error) throw error
      return data as LocationPhoto[]
    },
    enabled: !!locationId,
  })
}
