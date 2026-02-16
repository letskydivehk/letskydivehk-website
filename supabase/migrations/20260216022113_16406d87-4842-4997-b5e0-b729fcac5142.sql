-- Mark Zhuhai as no longer coming soon
UPDATE locations SET coming_soon = false WHERE id = '0973c412-ff97-411c-aab4-34bac1878490';

-- Insert Tandem Skydive with Handicam
INSERT INTO location_services (location_id, service_name, service_type, price_display, is_popular, display_order, includes)
VALUES (
  '0973c412-ff97-411c-aab4-34bac1878490',
  'Tandem Skydive with Handicam',
  'tandem',
  '$3199',
  false,
  1,
  ARRAY['Handicam video recording', 'Certificate of completion', '60 seconds of freefall', '5-7 minute canopy ride']
);

-- Insert Tandem Skydive with Ultimate Combo (Handicam + Wide shot)
INSERT INTO location_services (location_id, service_name, service_type, price_display, is_popular, display_order, includes)
VALUES (
  '0973c412-ff97-411c-aab4-34bac1878490',
  'Tandem Skydive with Ultimate Combo (Handicam + Wide shot)',
  'tandem',
  '$4499',
  true,
  2,
  ARRAY['Handicam video recording', 'Wide shot video', 'Certificate of completion', '60 seconds of freefall', '5-7 minute canopy ride']
);

-- Insert Group Events
INSERT INTO location_services (location_id, service_name, service_type, price_display, is_popular, display_order, includes)
VALUES (
  '0973c412-ff97-411c-aab4-34bac1878490',
  'Group Events',
  'group',
  'Custom Quote',
  false,
  3,
  ARRAY['Dedicated group coordinator', 'Private briefing session', 'Group photos & videos', 'Celebration area access']
);