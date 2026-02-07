-- Add token expiration column and update RLS policies for better security

-- 1. Add token_expires_at column with default 24-hour expiration
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS token_expires_at TIMESTAMP WITH TIME ZONE 
DEFAULT (now() + interval '24 hours');

-- 2. Update existing bookings to have expiration (if token_expires_at is null)
UPDATE public.bookings 
SET token_expires_at = created_at + interval '24 hours' 
WHERE token_expires_at IS NULL AND access_token IS NOT NULL;

-- 3. Drop the old anonymous token-based SELECT policy
DROP POLICY IF EXISTS "Anonymous users can view bookings via token" ON public.bookings;

-- 4. Create new token-based SELECT policy with expiration check
CREATE POLICY "Anonymous users can view bookings via unexpired token"
ON public.bookings
FOR SELECT
TO anon
USING (
  user_id IS NULL 
  AND access_token = COALESCE(
    (NULLIF(current_setting('app.booking_token', true), ''))::uuid, 
    '00000000-0000-0000-0000-000000000000'::uuid
  )
  AND (token_expires_at IS NULL OR token_expires_at > now())
);

-- 5. Drop the old anonymous token-based UPDATE policy  
DROP POLICY IF EXISTS "Anonymous users can update bookings via token" ON public.bookings;

-- 6. Create new token-based UPDATE policy with expiration check
CREATE POLICY "Anonymous users can update bookings via unexpired token"
ON public.bookings
FOR UPDATE
TO anon
USING (
  user_id IS NULL 
  AND access_token = COALESCE(
    (NULLIF(current_setting('app.booking_token', true), ''))::uuid, 
    '00000000-0000-0000-0000-000000000000'::uuid
  )
  AND (token_expires_at IS NULL OR token_expires_at > now())
);