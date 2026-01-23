-- Insert all location-specific services using service role (bypasses RLS)

-- Chiang Mai services
INSERT INTO public.location_services (location_id, service_name, service_type, price_display, is_popular, display_order)
VALUES 
  ('13533527-efe8-4863-8e54-40a5b094cb18', 'Tandem Skydive with Handicam', 'tandem', '$3499', true, 1),
  ('13533527-efe8-4863-8e54-40a5b094cb18', 'Tandem Skydive with Ultimate Combo', 'tandem', '$4299', false, 2),
  ('13533527-efe8-4863-8e54-40a5b094cb18', 'A-License Package', 'aff', '$31999', false, 3),
  ('13533527-efe8-4863-8e54-40a5b094cb18', 'Group Events', 'group', 'Custom Quote', false, 4);

-- Huizhou services
INSERT INTO public.location_services (location_id, service_name, service_type, price_display, is_popular, display_order)
VALUES 
  ('33f9a058-a564-416c-88ba-aa56c24df301', 'Tandem Skydive with Handicam', 'tandem', '$2499', true, 1),
  ('33f9a058-a564-416c-88ba-aa56c24df301', 'Tandem Skydive with Ultimate Combo', 'tandem', '$3399', false, 2),
  ('33f9a058-a564-416c-88ba-aa56c24df301', 'Group Events', 'group', 'Custom Quote', false, 3);

-- Luoding services
INSERT INTO public.location_services (location_id, service_name, service_type, price_display, is_popular, display_order)
VALUES 
  ('968bd056-da27-4cac-a608-067b8bbbfc9d', 'Tandem Skydive with Handicam', 'tandem', '$2499', true, 1),
  ('968bd056-da27-4cac-a608-067b8bbbfc9d', 'Tandem Skydive with Ultimate Combo', 'tandem', '$3699', false, 2),
  ('968bd056-da27-4cac-a608-067b8bbbfc9d', 'A-License Package', 'aff', '$41999', false, 3),
  ('968bd056-da27-4cac-a608-067b8bbbfc9d', 'Group Events', 'group', 'Custom Quote', false, 4);

-- Hainan services
INSERT INTO public.location_services (location_id, service_name, service_type, price_display, is_popular, display_order)
VALUES 
  ('a417b3cc-3141-4eda-b825-238c9b6a2b05', 'Tandem Skydive with Handicam', 'tandem', '$3399', true, 1),
  ('a417b3cc-3141-4eda-b825-238c9b6a2b05', 'Tandem Skydive with Ultimate Combo', 'tandem', '$5199', false, 2),
  ('a417b3cc-3141-4eda-b825-238c9b6a2b05', 'Group Events', 'group', 'Custom Quote', false, 3);

-- Pattaya services
INSERT INTO public.location_services (location_id, service_name, service_type, price_display, is_popular, display_order)
VALUES 
  ('dc622a82-2ef6-42b6-bbb5-fc134572fdf6', 'Tandem Skydive with Video', 'tandem', '$3199', true, 1),
  ('dc622a82-2ef6-42b6-bbb5-fc134572fdf6', 'Tandem Skydive with Ultimate Combo', 'tandem', '$3399', false, 2),
  ('dc622a82-2ef6-42b6-bbb5-fc134572fdf6', 'Group Events', 'group', 'Custom Quote', false, 3);

-- Zhuhai services (Group Events only since it's coming soon)
INSERT INTO public.location_services (location_id, service_name, service_type, price_display, is_popular, display_order)
VALUES 
  ('0973c412-ff97-411c-aab4-34bac1878490', 'Group Events', 'group', 'Custom Quote', false, 1);