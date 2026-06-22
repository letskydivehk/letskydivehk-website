
CREATE TABLE public.souvenirs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name_en TEXT NOT NULL DEFAULT '',
  name_zh_tw TEXT NOT NULL DEFAULT '',
  name_zh_cn TEXT NOT NULL DEFAULT '',
  description_en TEXT NOT NULL DEFAULT '',
  description_zh_tw TEXT NOT NULL DEFAULT '',
  description_zh_cn TEXT NOT NULL DEFAULT '',
  price INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.souvenirs TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.souvenirs TO authenticated;
GRANT ALL ON public.souvenirs TO service_role;

ALTER TABLE public.souvenirs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active souvenirs"
ON public.souvenirs FOR SELECT
USING (is_active = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert souvenirs"
ON public.souvenirs FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update souvenirs"
ON public.souvenirs FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete souvenirs"
ON public.souvenirs FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_souvenirs_updated_at
BEFORE UPDATE ON public.souvenirs
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


CREATE TABLE public.souvenir_sizes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  souvenir_id UUID NOT NULL REFERENCES public.souvenirs(id) ON DELETE CASCADE,
  size_label TEXT NOT NULL,
  height_range TEXT NOT NULL DEFAULT '',
  weight_range TEXT NOT NULL DEFAULT '',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX souvenir_sizes_souvenir_id_idx ON public.souvenir_sizes(souvenir_id);

GRANT SELECT ON public.souvenir_sizes TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.souvenir_sizes TO authenticated;
GRANT ALL ON public.souvenir_sizes TO service_role;

ALTER TABLE public.souvenir_sizes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view souvenir sizes"
ON public.souvenir_sizes FOR SELECT
USING (true);

CREATE POLICY "Admins can insert souvenir sizes"
ON public.souvenir_sizes FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update souvenir sizes"
ON public.souvenir_sizes FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete souvenir sizes"
ON public.souvenir_sizes FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_souvenir_sizes_updated_at
BEFORE UPDATE ON public.souvenir_sizes
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- Seed T-shirt and empty size rows
DO $$
DECLARE
  v_tshirt_id UUID;
BEGIN
  INSERT INTO public.souvenirs (
    name_en, name_zh_tw, name_zh_cn,
    description_en, description_zh_tw, description_zh_cn,
    price, display_order
  ) VALUES (
    'Skydive HK T-Shirt', 'Skydive HK T恤', 'Skydive HK T恤',
    'Premium cotton tee with the Let''s Skydive HK logo. Take home a piece of the sky.',
    '優質純棉T恤,印有 Let''s Skydive HK 標誌。把天空的回憶帶回家。',
    '优质纯棉T恤,印有 Let''s Skydive HK 标志。把天空的回忆带回家。',
    150, 0
  ) RETURNING id INTO v_tshirt_id;

  INSERT INTO public.souvenir_sizes (souvenir_id, size_label, display_order) VALUES
    (v_tshirt_id, 'S', 1),
    (v_tshirt_id, 'M', 2),
    (v_tshirt_id, 'L', 3),
    (v_tshirt_id, 'XL', 4),
    (v_tshirt_id, '2XL', 5);
END $$;
