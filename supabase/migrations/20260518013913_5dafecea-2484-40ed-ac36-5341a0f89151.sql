INSERT INTO public.location_services (location_id, service_name, service_type, price_display, includes, display_order, is_popular)
SELECT id, 'Package Tour', 'package', 'Contact for pricing',
  ARRAY['Transportation','Meal','Accommodation','Jump ticket','Jump videos']::text[],
  10, false
FROM public.locations
WHERE NOT EXISTS (
  SELECT 1 FROM public.location_services ls
  WHERE ls.location_id = locations.id AND ls.service_type = 'package'
);