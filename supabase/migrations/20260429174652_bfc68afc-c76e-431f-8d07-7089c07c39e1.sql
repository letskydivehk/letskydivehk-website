-- ===== PATTAYA =====
UPDATE public.locations SET
  weather_lat = 12.9236, weather_lon = 100.8825,
  best_months = ARRAY[11,12,1,2,3],
  climate_summary = 'Tropical climate with warm temperatures year-round (25-33°C). The dry, sunny season from November to March offers the best skydiving conditions with calm winds and clear blue skies. Avoid June-October monsoon for fewer cancellations.',
  travel_tips = '{"currency":"Thai Baht (THB)","language":"Thai (English widely spoken)","visa":"30-day visa exemption for HK passport holders","plug":"Type A/B/C, 220V","tipping":"Optional, 10% appreciated"}'::jsonb,
  getting_there_from_hk = 'Direct flights from Hong Kong (HKG) to Bangkok (BKK or DMK) take ~3 hours. From Bangkok, Pattaya is a 1.5-hour drive via private transfer (~700 THB) or bus (~150 THB). Total travel time door-to-door: about 6 hours.'
WHERE slug = 'pattaya';

INSERT INTO public.location_accommodations (location_id, name, type, distance, price_tier, image_url, description, display_order) VALUES
  ('dc622a82-2ef6-42b6-bbb5-fc134572fdf6', 'Hilton Pattaya', 'Hotel', '15 min from dropzone', '$$$', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop', 'Luxury beachfront hotel with infinity pool, panoramic Gulf of Thailand views, and easy access to Walking Street.', 1),
  ('dc622a82-2ef6-42b6-bbb5-fc134572fdf6', 'Centara Mirage Beach Resort', 'Resort', '20 min from dropzone', '$$', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop', 'Family-friendly resort with lazy river, water park and direct beach access. Great for groups travelling together.', 2),
  ('dc622a82-2ef6-42b6-bbb5-fc134572fdf6', 'Lub d Pattaya', 'Hostel', '10 min from dropzone', '$', 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&h=600&fit=crop', 'Modern social hostel with private rooms and dorms. Pool, bar, and a vibrant backpacker community.', 3);

INSERT INTO public.location_attractions (location_id, name, category, distance, image_url, description, display_order) VALUES
  ('dc622a82-2ef6-42b6-bbb5-fc134572fdf6', 'Sanctuary of Truth', 'culture', '25 min', 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&h=600&fit=crop', 'Stunning all-wooden temple sculpture, hand-carved and over 100m tall. A masterpiece of Thai craftsmanship.', 1),
  ('dc622a82-2ef6-42b6-bbb5-fc134572fdf6', 'Coral Island (Koh Larn)', 'beach', '45 min by ferry', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop', 'Crystal-clear waters and white-sand beaches just off the coast. Perfect for snorkelling and chilling after your jump.', 2),
  ('dc622a82-2ef6-42b6-bbb5-fc134572fdf6', 'Nong Nooch Tropical Garden', 'nature', '30 min', 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800&h=600&fit=crop', '600-acre botanical garden with French-style topiary, Thai cultural shows and an elephant sanctuary.', 3),
  ('dc622a82-2ef6-42b6-bbb5-fc134572fdf6', 'Walking Street', 'nightlife', '15 min', 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&h=600&fit=crop', 'Pattaya''s legendary nightlife strip with bars, clubs, live music and street food. Comes alive after dark.', 4);

INSERT INTO public.location_food (location_id, dish_name, where_to_try, image_url, description, display_order) VALUES
  ('dc622a82-2ef6-42b6-bbb5-fc134572fdf6', 'Som Tam (Papaya Salad)', 'Mum Aroi Restaurant', 'https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?w=800&h=600&fit=crop', 'Spicy, tangy green papaya salad with lime, chilli and peanuts. The quintessential Thai street food.', 1),
  ('dc622a82-2ef6-42b6-bbb5-fc134572fdf6', 'Tom Yum Goong', 'Sketch Restaurant', 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&h=600&fit=crop', 'Hot and sour prawn soup with lemongrass, galangal and lime leaves. Fragrant and unforgettable.', 2),
  ('dc622a82-2ef6-42b6-bbb5-fc134572fdf6', 'Mango Sticky Rice', 'Naklua Market', 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=800&h=600&fit=crop', 'Sweet sticky rice paired with ripe mango and coconut cream. Thailand''s most beloved dessert.', 3);

-- ===== CHIANG MAI =====
UPDATE public.locations SET
  weather_lat = 18.7883, weather_lon = 98.9853,
  best_months = ARRAY[11,12,1,2],
  climate_summary = 'Cool, dry season runs November to February (15-28°C) — the absolute best time for skydiving with crisp visibility over mountains and temples. Hot season March-May can exceed 35°C; avoid the smoky burning season in March-April.',
  travel_tips = '{"currency":"Thai Baht (THB)","language":"Thai (English in tourist areas)","visa":"30-day visa exemption for HK passport holders","plug":"Type A/B/C, 220V","tipping":"Optional, 10% appreciated"}'::jsonb,
  getting_there_from_hk = 'Direct flights from Hong Kong to Chiang Mai (CNX) take ~3.5 hours. The dropzone is about 45 minutes from the airport by taxi (~400 THB) or pre-arranged transfer.'
WHERE slug = 'chiang-mai';

INSERT INTO public.location_accommodations (location_id, name, type, distance, price_tier, image_url, description, display_order) VALUES
  ('13533527-efe8-4863-8e54-40a5b094cb18', '137 Pillars House', 'Hotel', '40 min from dropzone', '$$$', 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop', 'Award-winning boutique luxury hotel blending colonial heritage with Lanna design. Pure indulgence.', 1),
  ('13533527-efe8-4863-8e54-40a5b094cb18', 'Tamarind Village', 'Hotel', '45 min from dropzone', '$$', 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop', 'Charming hotel inside the Old City walls, set around a 200-year-old tamarind tree.', 2),
  ('13533527-efe8-4863-8e54-40a5b094cb18', 'Stamps Backpackers', 'Hostel', '40 min from dropzone', '$', 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop', 'Friendly hostel in the heart of Old City with rooftop bar, pool, and easy access to night markets.', 3);

INSERT INTO public.location_attractions (location_id, name, category, distance, image_url, description, display_order) VALUES
  ('13533527-efe8-4863-8e54-40a5b094cb18', 'Doi Suthep Temple', 'culture', '1 hr', 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&h=600&fit=crop', 'Sacred mountaintop temple with golden chedi and panoramic views over Chiang Mai. A must-visit landmark.', 1),
  ('13533527-efe8-4863-8e54-40a5b094cb18', 'Elephant Nature Park', 'nature', '1.5 hr', 'https://images.unsplash.com/photo-1551845041-63e8e76836ea?w=800&h=600&fit=crop', 'Ethical elephant sanctuary where you can feed and bathe rescued elephants. No riding — just love.', 2),
  ('13533527-efe8-4863-8e54-40a5b094cb18', 'Old City Temples', 'culture', '40 min', 'https://images.unsplash.com/photo-1563492065-1a3dec891f47?w=800&h=600&fit=crop', 'Walk the moated Old City to discover Wat Chedi Luang, Wat Phra Singh and dozens of historic temples.', 3),
  ('13533527-efe8-4863-8e54-40a5b094cb18', 'Sunday Walking Street', 'shopping', '40 min', 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&h=600&fit=crop', 'Sprawling Sunday-evening market with handicrafts, street food and live music throughout the Old City.', 4);

INSERT INTO public.location_food (location_id, dish_name, where_to_try, image_url, description, display_order) VALUES
  ('13533527-efe8-4863-8e54-40a5b094cb18', 'Khao Soi', 'Khao Soi Khun Yai', 'https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?w=800&h=600&fit=crop', 'Northern Thailand''s signature dish: creamy coconut curry noodles topped with crispy egg noodles.', 1),
  ('13533527-efe8-4863-8e54-40a5b094cb18', 'Sai Oua (Northern Sausage)', 'Warorot Market', 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&h=600&fit=crop', 'Spicy grilled herb-and-pork sausage packed with lemongrass, kaffir lime and chilli. Pure Lanna flavour.', 2),
  ('13533527-efe8-4863-8e54-40a5b094cb18', 'Sticky Rice with Mango', 'Chang Phuak Night Market', 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=800&h=600&fit=crop', 'Warm sticky rice and ripe Nam Dok Mai mango with coconut cream — refreshing after a hot day jumping.', 3);

-- ===== HUIZHOU =====
UPDATE public.locations SET
  weather_lat = 23.1117, weather_lon = 114.4161,
  best_months = ARRAY[10,11,12,1,2,3],
  climate_summary = 'Subtropical climate with mild winters (12-20°C) and hot, humid summers (28-34°C). October through March offers the most stable, sunny weather for skydiving. Summer brings frequent typhoons and rain.',
  travel_tips = '{"currency":"Chinese Yuan (CNY)","language":"Mandarin & Cantonese","visa":"HK residents enter via Home Return Permit / mainland travel permit","plug":"Type A/C/I, 220V","tipping":"Not customary"}'::jsonb,
  getting_there_from_hk = 'Most direct: high-speed rail from West Kowloon to Huizhou South (~1.5 hours), then 45-minute taxi to dropzone. Alternative: drive via Shenzhen Bay or Hong Kong-Zhuhai-Macau Bridge (~3 hours total).'
WHERE slug = 'huizhou';

INSERT INTO public.location_accommodations (location_id, name, type, distance, price_tier, image_url, description, display_order) VALUES
  ('33f9a058-a564-416c-88ba-aa56c24df301', 'Sheraton Huizhou Beach Resort', 'Resort', '30 min from dropzone', '$$$', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop', 'Beachfront 5-star resort on Xunliao Bay with private beach, multiple pools and family suites.', 1),
  ('33f9a058-a564-416c-88ba-aa56c24df301', 'Holiday Inn Huizhou', 'Hotel', '25 min from dropzone', '$$', 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop', 'Reliable comfort in central Huizhou — modern rooms, good breakfast and easy taxi access to the dropzone.', 2),
  ('33f9a058-a564-416c-88ba-aa56c24df301', 'Hanting Hotel', 'Hotel', '20 min from dropzone', '$', 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&h=600&fit=crop', 'Clean, budget-friendly business hotel chain. Perfect for a one-night stay before or after your jump.', 3);

INSERT INTO public.location_attractions (location_id, name, category, distance, image_url, description, display_order) VALUES
  ('33f9a058-a564-416c-88ba-aa56c24df301', 'West Lake (Xihu)', 'nature', '30 min', 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&h=600&fit=crop', 'Scenic freshwater lake with pagodas, walking paths and pedal boats. A relaxing post-jump stroll.', 1),
  ('33f9a058-a564-416c-88ba-aa56c24df301', 'Xunliao Bay Beach', 'beach', '40 min', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop', 'One of Guangdong''s cleanest beaches — golden sand, gentle surf and beachside seafood shacks.', 2),
  ('33f9a058-a564-416c-88ba-aa56c24df301', 'Luofu Mountain', 'nature', '1 hr', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=600&fit=crop', 'Sacred Taoist mountain with hiking trails, ancient temples and waterfalls. Great half-day excursion.', 3),
  ('33f9a058-a564-416c-88ba-aa56c24df301', 'Huizhou Old Town', 'culture', '35 min', 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&h=600&fit=crop', 'Restored historic district with Qing-dynasty alleys, teahouses and craft shops. Best at dusk.', 4);

INSERT INTO public.location_food (location_id, dish_name, where_to_try, image_url, description, display_order) VALUES
  ('33f9a058-a564-416c-88ba-aa56c24df301', 'Hakka Salt-Baked Chicken', 'Lao Dong Jiang Restaurant', 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800&h=600&fit=crop', 'Huizhou''s most famous dish — whole chicken slow-baked in coarse salt for tender, fragrant meat.', 1),
  ('33f9a058-a564-416c-88ba-aa56c24df301', 'Stuffed Tofu (Niang Dofu)', 'Hakka Family Restaurant', 'https://images.unsplash.com/photo-1582450871972-ab5ca641643d?w=800&h=600&fit=crop', 'Silken tofu stuffed with seasoned pork, then braised in savoury broth. Comfort food at its finest.', 2),
  ('33f9a058-a564-416c-88ba-aa56c24df301', 'East River Steamed Fish', 'Local seafood restaurants', 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=600&fit=crop', 'Fresh river fish steamed Cantonese-style with ginger, scallion and a splash of soy. Delicate and clean.', 3);

-- ===== HAINAN =====
UPDATE public.locations SET
  weather_lat = 18.2528, weather_lon = 109.5119,
  best_months = ARRAY[11,12,1,2,3,4],
  climate_summary = 'Tropical island climate — warm year-round (22-32°C) with the dry season from November to April being ideal for skydiving. Summer (May-October) is hot, humid and prone to typhoons.',
  travel_tips = '{"currency":"Chinese Yuan (CNY)","language":"Mandarin (some Hainanese)","visa":"30-day visa-free entry for HK residents flying directly to Hainan","plug":"Type A/C/I, 220V","tipping":"Not customary"}'::jsonb,
  getting_there_from_hk = 'Direct flights from Hong Kong to Sanya (SYX) or Haikou (HAK) take ~1.5 hours. From Sanya airport, the dropzone is about 1 hour by taxi or pre-arranged transfer.'
WHERE slug = 'hainan';

INSERT INTO public.location_accommodations (location_id, name, type, distance, price_tier, image_url, description, display_order) VALUES
  ('a417b3cc-3141-4eda-b825-238c9b6a2b05', 'Atlantis Sanya', 'Resort', '1 hr from dropzone', '$$$', 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop', 'Iconic ocean-themed mega-resort with the largest aquarium in Asia, water park and stunning suites.', 1),
  ('a417b3cc-3141-4eda-b825-238c9b6a2b05', 'Mangrove Tree Resort World', 'Resort', '1 hr from dropzone', '$$', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop', 'Sprawling beachfront resort on Yalong Bay with multiple themed buildings, pools and restaurants.', 2),
  ('a417b3cc-3141-4eda-b825-238c9b6a2b05', 'Ji Hotel Sanya', 'Hotel', '50 min from dropzone', '$', 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&h=600&fit=crop', 'Modern, well-priced city hotel ideal for travellers prioritising convenience over luxury.', 3);

INSERT INTO public.location_attractions (location_id, name, category, distance, image_url, description, display_order) VALUES
  ('a417b3cc-3141-4eda-b825-238c9b6a2b05', 'Yalong Bay', 'beach', '1 hr', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop', 'Often called "the Oriental Hawaii" — 7km of pristine white sand and turquoise water. Snorkelling paradise.', 1),
  ('a417b3cc-3141-4eda-b825-238c9b6a2b05', 'Nanshan Buddhism Cultural Park', 'culture', '1.5 hr', 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&h=600&fit=crop', 'Home to the 108-metre Guanyin statue rising from the sea — one of the tallest in the world.', 2),
  ('a417b3cc-3141-4eda-b825-238c9b6a2b05', 'Wuzhizhou Island', 'beach', '1.5 hr', 'https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?w=800&h=600&fit=crop', 'Heart-shaped island with diving, glass-bottom boats and some of China''s clearest water.', 3),
  ('a417b3cc-3141-4eda-b825-238c9b6a2b05', 'Tianya Haijiao', 'nature', '1 hr', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=600&fit=crop', 'Romantic "Edge of the Sky, Corner of the Sea" coastal park with iconic boulders and ocean views.', 4);

INSERT INTO public.location_food (location_id, dish_name, where_to_try, image_url, description, display_order) VALUES
  ('a417b3cc-3141-4eda-b825-238c9b6a2b05', 'Wenchang Chicken', 'Sichuan & Hainanese Restaurants', 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800&h=600&fit=crop', 'Hainan''s most famous dish — free-range chicken poached to silky perfection, served with ginger-scallion oil.', 1),
  ('a417b3cc-3141-4eda-b825-238c9b6a2b05', 'Hele Crab', 'Local seafood markets', 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=600&fit=crop', 'Sweet, fatty crab from Wanning prized across China. Steamed simply to let the flavour shine.', 2),
  ('a417b3cc-3141-4eda-b825-238c9b6a2b05', 'Coconut Rice', 'Sanya street stalls', 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=800&h=600&fit=crop', 'Fragrant rice steamed inside a young coconut with chicken or seafood. Tropical comfort food.', 3);