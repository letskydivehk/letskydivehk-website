
-- Add photos column to location_services
ALTER TABLE public.location_services
  ADD COLUMN IF NOT EXISTS photos text[] NOT NULL DEFAULT '{}';

-- Seed package rows for tours (skip Luoding). Use DO block for readability.
DO $$
DECLARE
  v_pattaya uuid;
  v_chiangmai uuid;
  v_hainan uuid;
  v_zhuhai uuid;
  v_huizhou uuid;
  v_std_includes text[] := ARRAY['Local transportation','Hotel accommodation','Meals','Tandem skydive from 13,000 ft','HD video & photos','English/Cantonese-speaking guide'];
  v_cn_includes text[] := ARRAY['Multiple meals','Hotel accommodation','Dropzone transfers','Tandem skydive','HD video & photos','Cantonese-speaking guide'];
BEGIN
  SELECT id INTO v_pattaya FROM public.locations WHERE slug='pattaya';
  SELECT id INTO v_chiangmai FROM public.locations WHERE slug='chiang-mai';
  SELECT id INTO v_hainan FROM public.locations WHERE slug='hainan';
  SELECT id INTO v_zhuhai FROM public.locations WHERE slug='zhuhai';
  SELECT id INTO v_huizhou FROM public.locations WHERE slug='huizhou';

  -- Pattaya 3D2N + 4D3N
  INSERT INTO public.location_services (location_id, service_name, service_type, price_display, deposit_amount, includes, photos, display_order, itinerary)
  VALUES
  (v_pattaya, 'Pattaya 3D2N Tour', 'package', '$5,700', 2000, v_std_includes,
   ARRAY['https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1200&q=80','https://images.unsplash.com/photo-1528181304800-259b08848526?w=1200&q=80','https://images.unsplash.com/photo-1504457047772-27faf1c00561?w=1200&q=80'],
   1,
   '[{"day":1,"title":"Arrival & Pattaya Beach","location":"Hong Kong → Bangkok → Pattaya","accommodation":"4★ Beachfront hotel (Central Pattaya)","transportation":"Flight HKG–BKK + private transfer","meals":"Welcome seafood dinner","activities":["Beach sunset","Walking Street stroll"]},{"day":2,"title":"Tandem Skydive Day","location":"Thai Sky Adventures dropzone","accommodation":"4★ Beachfront hotel","transportation":"Hotel ⇄ dropzone shuttle","meals":"Breakfast + celebratory dinner","activities":["Briefing & gear-up","Tandem skydive from 13,000 ft","HD video & photos"]},{"day":3,"title":"Brunch & Departure","location":"Pattaya → Bangkok → Hong Kong","accommodation":"—","transportation":"Private transfer + flight BKK–HKG","meals":"Beachside brunch","activities":["Free morning","Souvenir shopping"]}]'::jsonb),
  (v_pattaya, 'Pattaya 4D3N Tour', 'package', '$6,800', 2000, v_std_includes,
   ARRAY['https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1200&q=80','https://images.unsplash.com/photo-1528181304800-259b08848526?w=1200&q=80'],
   2,
   '[{"day":1,"title":"Arrival","location":"HK → Bangkok → Pattaya","accommodation":"4★ Beachfront hotel","transportation":"Flight + transfer","meals":"Welcome dinner","activities":["Beach sunset"]},{"day":2,"title":"Island Hopping","location":"Koh Larn","accommodation":"4★ Beachfront hotel","transportation":"Speedboat","meals":"Breakfast + seafood lunch","activities":["Snorkeling","Beach time"]},{"day":3,"title":"Tandem Skydive Day","location":"Thai Sky Adventures","accommodation":"4★ Beachfront hotel","transportation":"Hotel ⇄ dropzone","meals":"Breakfast + dinner","activities":["Tandem skydive","HD video & photos"]},{"day":4,"title":"Departure","location":"Pattaya → HK","accommodation":"—","transportation":"Transfer + flight","meals":"Brunch","activities":["Shopping"]}]'::jsonb),

  -- Chiang Mai 3D2N + 4D3N
  (v_chiangmai, 'Chiang Mai 3D2N Tour', 'package', '$5,500', 2000, v_std_includes,
   ARRAY['https://images.unsplash.com/photo-1598935898639-81586f7d2129?w=1200&q=80','https://images.unsplash.com/photo-1528181304800-259b08848526?w=1200&q=80'],
   1,
   '[{"day":1,"title":"Arrival & Old City","location":"HK → Chiang Mai","accommodation":"Boutique hotel in Old City","transportation":"Direct flight HKG–CNX + transfer","meals":"Khao Soi welcome dinner","activities":["Tha Phae Gate sunset","Night Market"]},{"day":2,"title":"Tandem Skydive Day","location":"Chiang Mai Skydiving dropzone","accommodation":"Boutique hotel","transportation":"Hotel ⇄ dropzone (45 min)","meals":"Breakfast + farm-to-table lunch","activities":["Tandem skydive over Doi Saket","HD video & photos","Riverside dinner"]},{"day":3,"title":"Departure","location":"Chiang Mai → HK","accommodation":"—","transportation":"Transfer + flight","meals":"Breakfast","activities":["Souvenir shopping"]}]'::jsonb),
  (v_chiangmai, 'Chiang Mai 4D3N Tour', 'package', '$6,500', 2000, v_std_includes,
   ARRAY['https://images.unsplash.com/photo-1598935898639-81586f7d2129?w=1200&q=80'],
   2,
   '[{"day":1,"title":"Arrival & Old City","location":"HK → Chiang Mai","accommodation":"Boutique hotel","transportation":"Flight + transfer","meals":"Welcome dinner","activities":["Tha Phae Gate sunset"]},{"day":2,"title":"Tandem Skydive Day","location":"Chiang Mai Skydiving","accommodation":"Boutique hotel","transportation":"Hotel ⇄ dropzone","meals":"Breakfast + lunch","activities":["Tandem skydive","Video & photos"]},{"day":3,"title":"Temples & Mountains","location":"Doi Suthep & Nimman","accommodation":"Boutique hotel","transportation":"Private van","meals":"Street food tour","activities":["Doi Suthep","Night Bazaar"]},{"day":4,"title":"Cooking Class & Departure","location":"Chiang Mai → HK","accommodation":"—","transportation":"Transfer + flight","meals":"Cooking class lunch","activities":["Half-day cooking class"]}]'::jsonb),

  -- Hainan 3D2N + 4D3N
  (v_hainan, 'Hainan 3D2N Tour', 'package', '$4,800', 2000, v_cn_includes,
   ARRAY['https://images.unsplash.com/photo-1528181304800-259b08848526?w=1200&q=80'],
   1,
   '[{"day":1,"title":"Arrival in Sanya","location":"HK → Sanya","accommodation":"Beachfront resort","transportation":"Flight + transfer","meals":"Welcome dinner","activities":["Beach walk"]},{"day":2,"title":"Tandem Skydive Day","location":"Weland Hainan dropzone","accommodation":"Beachfront resort","transportation":"Hotel ⇄ dropzone","meals":"Breakfast + dinner","activities":["Tandem skydive","Video & photos"]},{"day":3,"title":"Departure","location":"Sanya → HK","accommodation":"—","transportation":"Transfer + flight","meals":"Breakfast","activities":["Free morning"]}]'::jsonb),
  (v_hainan, 'Hainan 4D3N Tour', 'package', '$5,800', 2000, v_cn_includes,
   ARRAY['https://images.unsplash.com/photo-1528181304800-259b08848526?w=1200&q=80'],
   2,
   '[{"day":1,"title":"Arrival","location":"HK → Sanya","accommodation":"Beachfront resort","transportation":"Flight + transfer","meals":"Welcome dinner","activities":["Beach sunset"]},{"day":2,"title":"Tandem Skydive Day","location":"Weland Hainan","accommodation":"Beachfront resort","transportation":"Hotel ⇄ dropzone","meals":"Breakfast + lunch","activities":["Tandem skydive","Video & photos"]},{"day":3,"title":"Yalong Bay & Wuzhizhou","location":"Sanya coast","accommodation":"Beachfront resort","transportation":"Private van","meals":"Seafood lunch","activities":["Island day trip","Snorkeling"]},{"day":4,"title":"Departure","location":"Sanya → HK","accommodation":"—","transportation":"Transfer + flight","meals":"Brunch","activities":["Shopping"]}]'::jsonb),

  -- Zhuhai 2D1N
  (v_zhuhai, 'Zhuhai 2D1N Tour', 'package', '$3,200', 2000, v_cn_includes,
   ARRAY['https://images.unsplash.com/photo-1528181304800-259b08848526?w=1200&q=80'],
   1,
   '[{"day":1,"title":"HK → Zhuhai & Skydive","location":"Weland Zhuhai dropzone","accommodation":"4★ city hotel","transportation":"HK–Zhuhai bridge coach + dropzone transfer","meals":"Lunch + dinner","activities":["Briefing","Tandem skydive","Video & photos"]},{"day":2,"title":"City Tour & Return","location":"Zhuhai → HK","accommodation":"—","transportation":"Coach back to HK","meals":"Breakfast","activities":["Lovers Road walk","Duty-free shopping"]}]'::jsonb),

  -- Huizhou 2D1N
  (v_huizhou, 'Huizhou 2D1N Tour', 'package', '$3,000', 2000, v_cn_includes,
   ARRAY['https://images.unsplash.com/photo-1528181304800-259b08848526?w=1200&q=80'],
   1,
   '[{"day":1,"title":"HK → Huizhou & Skydive","location":"Yingfei Huizhou dropzone","accommodation":"4★ city hotel","transportation":"HK–Huizhou coach + dropzone transfer","meals":"Lunch + dinner","activities":["Briefing","Tandem skydive","Video & photos"]},{"day":2,"title":"West Lake & Return","location":"Huizhou → HK","accommodation":"—","transportation":"Coach back to HK","meals":"Breakfast","activities":["Huizhou West Lake stroll"]}]'::jsonb);
END $$;
