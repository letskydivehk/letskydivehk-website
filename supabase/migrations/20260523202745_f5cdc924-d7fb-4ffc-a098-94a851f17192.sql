UPDATE public.location_services
SET price_display = '$5,899起',
    includes = ARRAY['Local transportation (incl. airport / dropzone transfer)','Hotel accommodation','Meals','Tandem skydive','HD video & photos','Cantonese/English-speaking guide'],
    add_ons = '[{"name":"Round-trip flights","price":null},{"name":"Travel insurance","price":null}]'::jsonb
WHERE id = 'def00f1a-16e4-4267-b3c8-6dfb2e94198c';

UPDATE public.location_services
SET price_display = '$6,799起',
    includes = ARRAY['Local transportation (incl. airport / dropzone transfer)','Hotel accommodation','Meals','Tandem skydive','HD video & photos','Cantonese/English-speaking guide'],
    add_ons = '[{"name":"Round-trip flights","price":null},{"name":"Travel insurance","price":null}]'::jsonb
WHERE service_type = 'Tour' AND id <> 'def00f1a-16e4-4267-b3c8-6dfb2e94198c';