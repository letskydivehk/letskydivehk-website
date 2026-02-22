-- Backfill: create profiles for any auth.users missing a profile record
INSERT INTO public.profiles (user_id, email, full_name, avatar_url, referral_code)
SELECT 
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name'),
  u.raw_user_meta_data->>'avatar_url',
  UPPER(SUBSTR(MD5(u.id::text || NOW()::text), 1, 8))
FROM auth.users u
LEFT JOIN public.profiles p ON p.user_id = u.id
WHERE p.id IS NULL;