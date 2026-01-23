-- Create locations table
CREATE TABLE public.locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  city TEXT NOT NULL,
  has_aff BOOLEAN NOT NULL DEFAULT false,
  has_group_events BOOLEAN NOT NULL DEFAULT true,
  coming_soon BOOLEAN NOT NULL DEFAULT false,
  image_url TEXT,
  description TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create services table
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  price_display TEXT NOT NULL,
  price_note TEXT,
  duration TEXT,
  includes TEXT[] DEFAULT '{}',
  icon_name TEXT NOT NULL DEFAULT 'parachute',
  is_popular BOOLEAN NOT NULL DEFAULT false,
  booking_type TEXT NOT NULL DEFAULT 'contact',
  available_everywhere BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Public read access for locations (anyone can view)
CREATE POLICY "Locations are publicly viewable"
ON public.locations
FOR SELECT
USING (true);

-- Public read access for services (anyone can view)
CREATE POLICY "Services are publicly viewable"
ON public.services
FOR SELECT
USING (true);

-- Create triggers for updated_at
CREATE TRIGGER update_locations_updated_at
BEFORE UPDATE ON public.locations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_services_updated_at
BEFORE UPDATE ON public.services
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial location data
INSERT INTO public.locations (slug, name, country, city, has_aff, has_group_events, coming_soon, image_url, description, display_order) VALUES
('pattaya', 'Thai Sky Adventures Pattaya', 'Thailand', 'Pattaya', true, true, false, 'https://images.unsplash.com/photo-1504150558240-0b4fd8946624?w=800&h=600&fit=crop', 'Experience breathtaking views of the Gulf of Thailand with our premier dropzone in Pattaya.', 1),
('chiang-mai', 'Northern Sky Chiang Mai', 'Thailand', 'Chiang Mai', true, true, false, 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&h=600&fit=crop', 'Jump over the stunning mountains and temples of Northern Thailand.', 2),
('huizhou', 'Huizhou Skydive Center', 'China', 'Huizhou', false, true, false, 'https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?w=800&h=600&fit=crop', 'Scenic coastal views and perfect weather conditions year-round.', 3),
('hainan', 'Hainan Island Skydive', 'China', 'Hainan', true, true, false, 'https://shorturl.at/s38IA', 'Tropical paradise skydiving with crystal clear ocean views.', 4),
('luoding', 'Luoding Sky Sports', 'China', 'Luoding', false, true, true, 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=600&fit=crop', 'Coming soon - A new adventure destination in Guangdong province.', 5),
('zhuhai', 'Zhuhai Coastal Skydive', 'China', 'Zhuhai', false, true, true, 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=600&fit=crop', 'Coming soon - Stunning coastal views near Macau.', 6);

-- Insert initial service data
INSERT INTO public.services (slug, title, subtitle, description, price_display, price_note, duration, includes, icon_name, is_popular, booking_type, available_everywhere, display_order) VALUES
('tandem-skydive', 'Tandem Skydive', 'First-time jumpers welcome', 'Experience the ultimate thrill of freefall attached to an experienced instructor. No prior experience needed - just bring your sense of adventure!', 'From $299', 'Price varies by location', '3-4 hours total (includes training)', ARRAY['15-minute ground training', '60 seconds of freefall', '5-7 minute canopy ride', 'Certificate of completion', 'Photos & video available'], 'parachute', true, 'direct', true, 1),
('aff-course', 'AFF Course', 'Learn to skydive solo', 'The Accelerated Freefall (AFF) program is your pathway to becoming a licensed skydiver. Master the skills to jump independently.', 'Contact for pricing', NULL, '7-10 days intensive program', ARRAY['Ground school training', '8 progressive jump levels', 'Personal instructor guidance', 'All equipment provided', 'License preparation'], 'graduation', false, 'contact', false, 2),
('group-events', 'Group Events', 'Team building & celebrations', 'Perfect for corporate team building, bachelor/bachelorette parties, birthdays, or any special occasion. Create unforgettable memories together!', 'Custom packages', 'Groups of 5+ receive special rates', 'Half day or full day options', ARRAY['Dedicated group coordinator', 'Private briefing session', 'Group photos & videos', 'Celebration area access', 'Catering options available'], 'users', false, 'contact', true, 3);