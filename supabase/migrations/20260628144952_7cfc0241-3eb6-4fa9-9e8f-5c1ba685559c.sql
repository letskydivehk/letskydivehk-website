CREATE TABLE public.souvenir_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  souvenir_id uuid NOT NULL REFERENCES public.souvenirs(id) ON DELETE CASCADE,
  name_en text NOT NULL DEFAULT '',
  name_zh_tw text NOT NULL DEFAULT '',
  name_zh_cn text NOT NULL DEFAULT '',
  image_url text,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.souvenir_variants TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.souvenir_variants TO authenticated;
GRANT ALL ON public.souvenir_variants TO service_role;

ALTER TABLE public.souvenir_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active variants"
  ON public.souvenir_variants FOR SELECT
  USING (is_active = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert variants"
  ON public.souvenir_variants FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update variants"
  ON public.souvenir_variants FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete variants"
  ON public.souvenir_variants FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_souvenir_variants_updated_at
  BEFORE UPDATE ON public.souvenir_variants
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_souvenir_variants_souvenir_id ON public.souvenir_variants(souvenir_id);