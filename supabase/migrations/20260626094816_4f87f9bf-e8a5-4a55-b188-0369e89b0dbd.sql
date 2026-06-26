
CREATE POLICY "Anyone can upload souvenir order photos"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'souvenir-uploads');

CREATE POLICY "Admins can read souvenir order photos"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'souvenir-uploads' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete souvenir order photos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'souvenir-uploads' AND public.has_role(auth.uid(), 'admin'));
