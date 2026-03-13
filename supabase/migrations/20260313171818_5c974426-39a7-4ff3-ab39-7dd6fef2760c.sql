
-- Update all "Tandem Skydive with Handicam" services to have consistent includes
UPDATE location_services
SET includes = ARRAY['Handicam video recording', 'Certificate of completion', '60 seconds of freefall', '5-7 minute canopy ride']
WHERE service_type = 'tandem'
  AND service_name ILIKE '%Handicam%'
  AND service_name NOT ILIKE '%Ultimate Combo%';

-- Update all "Tandem Skydive with Ultimate Combo (Handicam + Wide shot)" services
UPDATE location_services
SET includes = ARRAY['Handicam video recording', 'Wide shot video', 'Certificate of completion', '60 seconds of freefall', '5-7 minute canopy ride']
WHERE service_type = 'tandem'
  AND service_name ILIKE '%Ultimate Combo%'
  AND service_name ILIKE '%Handicam + Wide shot%';

-- Update Pattaya "Tandem Skydive with Video"
UPDATE location_services
SET includes = ARRAY['Video recording', 'Certificate of completion', '60 seconds of freefall', '5-7 minute canopy ride']
WHERE service_type = 'tandem'
  AND service_name = 'Tandem Skydive with Video';

-- Update Pattaya "Tandem Skydive with Ultimate Combo (Video + Photos)"
UPDATE location_services
SET includes = ARRAY['Video recording', 'Photos', 'Certificate of completion', '60 seconds of freefall', '5-7 minute canopy ride']
WHERE service_type = 'tandem'
  AND service_name ILIKE '%Ultimate Combo%'
  AND service_name ILIKE '%Video + Photos%';
