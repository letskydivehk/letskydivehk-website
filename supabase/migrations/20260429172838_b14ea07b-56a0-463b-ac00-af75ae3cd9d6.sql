-- Extend locations table
ALTER TABLE public.locations
  ADD COLUMN IF NOT EXISTS best_months integer[],
  ADD COLUMN IF NOT EXISTS climate_summary text,
  ADD COLUMN IF NOT EXISTS weather_lat numeric,
  ADD COLUMN IF NOT EXISTS weather_lon numeric,
  ADD COLUMN IF NOT EXISTS travel_tips jsonb,
  ADD COLUMN IF NOT EXISTS getting_there_from_hk text;

-- Accommodations
CREATE TABLE IF NOT EXISTS public.location_accommodations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location_id uuid NOT NULL,
  name text NOT NULL,
  type text NOT NULL DEFAULT 'Hotel',
  distance text,
  price_tier text NOT NULL DEFAULT '$$',
  image_url text,
  description text,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE public.location_accommodations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Accommodations are publicly viewable"
  ON public.location_accommodations FOR SELECT USING (true);
CREATE POLICY "Admins can insert accommodations"
  ON public.location_accommodations FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update accommodations"
  ON public.location_accommodations FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete accommodations"
  ON public.location_accommodations FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_location_accommodations_updated_at
  BEFORE UPDATE ON public.location_accommodations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_location_accommodations_location_id
  ON public.location_accommodations(location_id);

-- Attractions
CREATE TABLE IF NOT EXISTS public.location_attractions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location_id uuid NOT NULL,
  name text NOT NULL,
  category text NOT NULL DEFAULT 'sightseeing',
  distance text,
  image_url text,
  description text,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE public.location_attractions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Attractions are publicly viewable"
  ON public.location_attractions FOR SELECT USING (true);
CREATE POLICY "Admins can insert attractions"
  ON public.location_attractions FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update attractions"
  ON public.location_attractions FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete attractions"
  ON public.location_attractions FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_location_attractions_updated_at
  BEFORE UPDATE ON public.location_attractions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_location_attractions_location_id
  ON public.location_attractions(location_id);

-- Food
CREATE TABLE IF NOT EXISTS public.location_food (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location_id uuid NOT NULL,
  dish_name text NOT NULL,
  where_to_try text,
  image_url text,
  description text,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE public.location_food ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Food items are publicly viewable"
  ON public.location_food FOR SELECT USING (true);
CREATE POLICY "Admins can insert food items"
  ON public.location_food FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update food items"
  ON public.location_food FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete food items"
  ON public.location_food FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_location_food_updated_at
  BEFORE UPDATE ON public.location_food
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_location_food_location_id
  ON public.location_food(location_id);