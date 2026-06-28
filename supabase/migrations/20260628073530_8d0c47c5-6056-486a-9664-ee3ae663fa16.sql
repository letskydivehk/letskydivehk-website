DROP POLICY IF EXISTS "Anyone can upload souvenir order photos" ON storage.objects;

CREATE POLICY "Authenticated users upload to own folder in souvenir-uploads"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'souvenir-uploads'
  AND (storage.foldername(name))[1] = auth.uid()::text
);