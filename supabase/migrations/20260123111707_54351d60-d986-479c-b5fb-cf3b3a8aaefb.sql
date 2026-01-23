-- Create location_services table for location-specific pricing
CREATE TABLE public.location_services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location_id UUID NOT NULL REFERENCES public.locations(id) ON DELETE CASCADE,
  service_name TEXT NOT NULL,
  service_type TEXT NOT NULL DEFAULT 'tandem', -- 'tandem', 'aff', 'group'
  price_display TEXT NOT NULL,
  description TEXT,
  includes TEXT[] DEFAULT '{}',
  is_popular BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.location_services ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Location services are publicly viewable"
ON public.location_services
FOR SELECT
USING (true);

-- Deny all writes for regular users
CREATE POLICY "Deny all inserts on location_services"
ON public.location_services
FOR INSERT
WITH CHECK (false);

CREATE POLICY "Deny all updates on location_services"
ON public.location_services
FOR UPDATE
USING (false);

CREATE POLICY "Deny all deletes on location_services"
ON public.location_services
FOR DELETE
USING (false);

-- Create index for faster lookups
CREATE INDEX idx_location_services_location_id ON public.location_services(location_id);

-- Add trigger for updated_at
CREATE TRIGGER update_location_services_updated_at
BEFORE UPDATE ON public.location_services
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();