
-- LUODING
UPDATE public.locations SET
  weather_lat = 22.7692, weather_lon = 111.5697,
  best_months = ARRAY[10,11,12,1,2,3],
  climate_summary = 'Luoding has a humid subtropical climate with mild dry winters and hot rainy summers. October to March is ideal for skydiving — pleasant temperatures (15-25°C), low humidity, and clear skies.',
  getting_there_from_hk = 'From Hong Kong: take the high-speed train from West Kowloon to Zhaoqing East (about 1.5 hours), then a 1.5-hour taxi or coach transfer to Luoding. Alternatively, drive via the HZMB and G55 expressway (around 4 hours).',
  travel_tips = '{"currency":"Chinese Yuan (CNY)","language":"Mandarin / Cantonese","visa":"Mainland Travel Permit for HK residents required","plug":"Type A / I, 220V","tipping":"Not customary"}'::jsonb
WHERE slug = 'luoding';

INSERT INTO public.location_accommodations (location_id, name, type, distance, price_tier, image_url, description, display_order)
SELECT id, v.name, v.type, v.distance, v.price_tier, v.image_url, v.description, v.display_order
FROM public.locations, (VALUES
  ('Luoding International Hotel','Hotel','20 min from dropzone','$$$','https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800','Modern 4-star hotel in central Luoding with comfortable rooms and on-site restaurants.',1),
  ('Yacheng Holiday Inn','Hotel','15 min from dropzone','$$','https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800','Mid-range hotel with clean rooms and local hospitality, popular with weekend travelers.',2),
  ('Luoding City Inn','Guesthouse','10 min from dropzone','$','https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800','Budget-friendly guesthouse with simple rooms — perfect for short overnight stays.',3)
) AS v(name,type,distance,price_tier,image_url,description,display_order)
WHERE slug = 'luoding';

INSERT INTO public.location_attractions (location_id, name, category, distance, image_url, description, display_order)
SELECT id, v.name, v.category, v.distance, v.image_url, v.description, v.display_order
FROM public.locations, (VALUES
  ('Longwan Eco Tourist Area','Nature','30 min','https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800','Lush valley with waterfalls, hiking trails, and natural pools — a refreshing escape after your jump.',1),
  ('Jinyin Lake','Nature','25 min','https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800','Scenic reservoir surrounded by mountains, great for boat rides and lakeside walks.',2),
  ('Luoding Confucian Temple','Culture','15 min','https://images.unsplash.com/photo-1542640244-7e672d6cef4e?w=800','Historic Ming-dynasty temple showcasing classical Chinese architecture.',3),
  ('Cangzu Mountain','Nature','40 min','https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800','Sacred mountain offering panoramic views and Taoist temple sites.',4)
) AS v(name,category,distance,image_url,description,display_order)
WHERE slug = 'luoding';

INSERT INTO public.location_food (location_id, dish_name, where_to_try, image_url, description, display_order)
SELECT id, v.dish_name, v.where_to_try, v.image_url, v.description, v.display_order
FROM public.locations, (VALUES
  ('Luoding Pickled Vegetables','Local Cantonese restaurants','https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800','A signature Luoding specialty — fragrant, tangy pickles served with rice or stir-fries.',1),
  ('Roasted Goose','Yacheng District eateries','https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=800','Cantonese-style roasted goose with crispy skin and tender meat.',2),
  ('Rice Noodle Rolls (Cheung Fun)','Morning markets','https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=800','Silky steamed rice rolls with sweet soy sauce — a classic local breakfast.',3)
) AS v(dish_name,where_to_try,image_url,description,display_order)
WHERE slug = 'luoding';

-- ZHUHAI
UPDATE public.locations SET
  weather_lat = 22.2710, weather_lon = 113.5767,
  best_months = ARRAY[10,11,12,1,2,3,4],
  climate_summary = 'Zhuhai enjoys a mild subtropical maritime climate. October to April brings comfortable temperatures (15-25°C) and lower humidity — perfect for skydiving with stunning coastal views.',
  getting_there_from_hk = 'From Hong Kong: cross the Hong Kong-Zhuhai-Macau Bridge by shuttle bus (about 45 minutes), or take the TurboJET ferry from Sheung Wan to Zhuhai Jiuzhou Port (around 75 minutes). The dropzone is a 30-45 minute drive from the border.',
  travel_tips = '{"currency":"Chinese Yuan (CNY)","language":"Mandarin / Cantonese","visa":"Mainland Travel Permit for HK residents required","plug":"Type A / I, 220V","tipping":"Not customary"}'::jsonb
WHERE slug = 'zhuhai';

INSERT INTO public.location_accommodations (location_id, name, type, distance, price_tier, image_url, description, display_order)
SELECT id, v.name, v.type, v.distance, v.price_tier, v.image_url, v.description, v.display_order
FROM public.locations, (VALUES
  ('Sheraton Zhuhai Hotel','Hotel','25 min from dropzone','$$$','https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800','Luxury seafront hotel with elegant rooms, multiple restaurants, and full spa facilities.',1),
  ('Zhuhai Holiday Inn Express','Hotel','20 min from dropzone','$$','https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800','Modern mid-range hotel close to the city center with great value and reliable service.',2),
  ('Gongbei Port Hostel','Hostel','30 min from dropzone','$','https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800','Budget-friendly hostel near the Macau border — convenient for cross-border travelers.',3)
) AS v(name,type,distance,price_tier,image_url,description,display_order)
WHERE slug = 'zhuhai';

INSERT INTO public.location_attractions (location_id, name, category, distance, image_url, description, display_order)
SELECT id, v.name, v.category, v.distance, v.image_url, v.description, v.display_order
FROM public.locations, (VALUES
  ('Zhuhai Fisher Girl Statue','Culture','30 min','https://images.unsplash.com/photo-1528127269322-539801943592?w=800','Iconic 8.7m granite statue overlooking Xianglu Bay — the symbol of Zhuhai.',1),
  ('Lovers'' Road','Beach','25 min','https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800','Scenic 28km coastal road perfect for cycling, sunset walks, and seaside dining.',2),
  ('Hengqin Chimelong Ocean Kingdom','Nature','45 min','https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800','One of the world''s largest marine theme parks — great for families.',3),
  ('New Yuan Ming Palace','Culture','35 min','https://images.unsplash.com/photo-1545569310-12bdaaab1ddf?w=800','A scaled replica of Beijing''s Old Summer Palace with cultural performances.',4)
) AS v(name,category,distance,image_url,description,display_order)
WHERE slug = 'zhuhai';

INSERT INTO public.location_food (location_id, dish_name, where_to_try, image_url, description, display_order)
SELECT id, v.dish_name, v.where_to_try, v.image_url, v.description, v.display_order
FROM public.locations, (VALUES
  ('Wanzai Seafood','Wanzai Seafood Street','https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=800','Fresh seafood market with restaurants cooking your pick to order — try the steamed prawns and clams.',1),
  ('Doumen Cantonese Cuisine','Doumen District restaurants','https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800','Traditional Cantonese village dishes featuring river fish and rural specialties.',2),
  ('Portuguese-style Egg Tarts','Gongbei bakeries','https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800','Macau-influenced egg tarts with a flaky crust and creamy custard center.',3)
) AS v(dish_name,where_to_try,image_url,description,display_order)
WHERE slug = 'zhuhai';
