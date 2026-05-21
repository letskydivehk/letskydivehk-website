-- Add itinerary and deposit_amount to location_services
ALTER TABLE public.location_services
  ADD COLUMN IF NOT EXISTS itinerary jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS deposit_amount integer NOT NULL DEFAULT 500;

-- Allow admins to insert/update/delete location_services (public select unchanged)
DROP POLICY IF EXISTS "Deny all inserts on location_services" ON public.location_services;
DROP POLICY IF EXISTS "Deny all updates on location_services" ON public.location_services;
DROP POLICY IF EXISTS "Deny all deletes on location_services" ON public.location_services;

CREATE POLICY "Admins can insert location_services"
ON public.location_services FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update location_services"
ON public.location_services FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete location_services"
ON public.location_services FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));