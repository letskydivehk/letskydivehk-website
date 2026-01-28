-- Add access_token column for anonymous booking retrieval
ALTER TABLE public.bookings ADD COLUMN access_token UUID DEFAULT gen_random_uuid();

-- Create index for efficient token lookups
CREATE INDEX idx_bookings_access_token ON public.bookings(access_token);

-- Create policy for anonymous users to view their bookings via token
CREATE POLICY "Anonymous users can view bookings via token"
ON public.bookings FOR SELECT
USING (
  user_id IS NULL 
  AND access_token = COALESCE(
    NULLIF(current_setting('app.booking_token', true), '')::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid
  )
);

-- Create policy for anonymous users to update their bookings via token
CREATE POLICY "Anonymous users can update bookings via token"
ON public.bookings FOR UPDATE
USING (
  user_id IS NULL 
  AND access_token = COALESCE(
    NULLIF(current_setting('app.booking_token', true), '')::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid
  )
);