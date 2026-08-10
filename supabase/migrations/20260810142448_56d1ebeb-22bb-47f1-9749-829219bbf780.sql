-- 1) Remove redundant PII copies on credit_transactions
DROP TRIGGER IF EXISTS trg_sync_credit_tx_user_fields ON public.credit_transactions;
DROP TRIGGER IF EXISTS trg_profiles_to_credit_tx ON public.profiles;
DROP FUNCTION IF EXISTS public.sync_credit_tx_user_fields();
DROP FUNCTION IF EXISTS public.propagate_profile_to_credit_tx();
ALTER TABLE public.credit_transactions DROP COLUMN IF EXISTS full_name;
ALTER TABLE public.credit_transactions DROP COLUMN IF EXISTS email;

-- 2) Owner-scoped policies for souvenir-uploads bucket
DROP POLICY IF EXISTS "Users can view their own souvenir uploads" ON storage.objects;
CREATE POLICY "Users can view their own souvenir uploads"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'souvenir-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Users can update their own souvenir uploads" ON storage.objects;
CREATE POLICY "Users can update their own souvenir uploads"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'souvenir-uploads' AND auth.uid()::text = (storage.foldername(name))[1])
WITH CHECK (bucket_id = 'souvenir-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Users can delete their own souvenir uploads" ON storage.objects;
CREATE POLICY "Users can delete their own souvenir uploads"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'souvenir-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);