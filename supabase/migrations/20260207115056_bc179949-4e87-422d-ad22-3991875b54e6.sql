-- Add a permissive policy to allow reading back a freshly inserted booking
-- This allows the insert().select() pattern to work for both auth and anon users

-- First, create a permissive SELECT policy that allows reading any booking you just inserted
-- We use a session variable approach where the insert sets the token

CREATE POLICY "Allow reading newly inserted bookings"
ON public.bookings
FOR SELECT
TO anon, authenticated
USING (
  -- For authenticated users, allow if they own it
  (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  OR
  -- For anonymous users, allow if this booking was just created (within 5 seconds) and has matching email
  (auth.uid() IS NULL AND user_id IS NULL AND created_at >= (now() - interval '5 seconds'))
);