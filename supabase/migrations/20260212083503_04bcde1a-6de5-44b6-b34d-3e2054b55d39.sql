
-- Add detail columns to locations table
ALTER TABLE public.locations
  ADD COLUMN IF NOT EXISTS airport_distance text,
  ADD COLUMN IF NOT EXISTS city_distance text,
  ADD COLUMN IF NOT EXISTS transportation text,
  ADD COLUMN IF NOT EXISTS google_maps_embed_url text,
  ADD COLUMN IF NOT EXISTS highlights text[];

-- Create location_photos table
CREATE TABLE public.location_photos (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location_id uuid NOT NULL REFERENCES public.locations(id) ON DELETE CASCADE,
  file_url text NOT NULL,
  file_path text NOT NULL,
  caption text,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.location_photos ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Location photos are publicly viewable"
  ON public.location_photos FOR SELECT
  USING (true);

-- Admin-only write access
CREATE POLICY "Admins can insert location photos"
  ON public.location_photos FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update location photos"
  ON public.location_photos FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete location photos"
  ON public.location_photos FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Index for fast lookup
CREATE INDEX idx_location_photos_location_id ON public.location_photos(location_id);
