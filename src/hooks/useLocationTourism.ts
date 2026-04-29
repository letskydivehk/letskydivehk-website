import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'

export interface LocationAccommodation {
  id: string
  location_id: string
  name: string
  type: string
  distance: string | null
  price_tier: string
  image_url: string | null
  description: string | null
  display_order: number
}

export interface LocationAttraction {
  id: string
  location_id: string
  name: string
  category: string
  distance: string | null
  image_url: string | null
  description: string | null
  display_order: number
}

export interface LocationFood {
  id: string
  location_id: string
  dish_name: string
  where_to_try: string | null
  image_url: string | null
  description: string | null
  display_order: number
}

export function useLocationTourism(locationId: string | undefined) {
  return useQuery({
    queryKey: ['location-tourism', locationId],
    enabled: !!locationId,
    staleTime: 1000 * 60 * 10,
    queryFn: async () => {
      const [accom, attr, food] = await Promise.all([
        supabase
          .from('location_accommodations')
          .select('*')
          .eq('location_id', locationId!)
          .order('display_order', { ascending: true }),
        supabase
          .from('location_attractions')
          .select('*')
          .eq('location_id', locationId!)
          .order('display_order', { ascending: true }),
        supabase
          .from('location_food')
          .select('*')
          .eq('location_id', locationId!)
          .order('display_order', { ascending: true }),
      ])
      if (accom.error) throw accom.error
      if (attr.error) throw attr.error
      if (food.error) throw food.error
      return {
        accommodations: (accom.data || []) as LocationAccommodation[],
        attractions: (attr.data || []) as LocationAttraction[],
        food: (food.data || []) as LocationFood[],
      }
    },
  })
}
