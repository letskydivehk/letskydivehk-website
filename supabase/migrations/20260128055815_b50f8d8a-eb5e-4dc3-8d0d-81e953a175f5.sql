-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Anyone can create bookings" ON public.bookings;

-- Create a more restrictive policy with validation checks
CREATE POLICY "Anyone can create validated bookings"
ON public.bookings
FOR INSERT
WITH CHECK (
  -- Ensure required fields are not empty and within length limits
  first_name IS NOT NULL AND length(trim(first_name)) >= 1 AND length(first_name) <= 100
  AND last_name IS NOT NULL AND length(trim(last_name)) >= 1 AND length(last_name) <= 100
  AND email IS NOT NULL AND email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' AND length(email) <= 255
  AND phone IS NOT NULL AND length(trim(phone)) >= 6 AND length(phone) <= 30
  AND participants >= 1 AND participants <= 20
  AND preferred_date >= current_date
  -- Limit special_requests length to prevent abuse
  AND (special_requests IS NULL OR length(special_requests) <= 1000)
  -- Ensure location_id and service_id are provided (FK constraints handle validity)
  AND location_id IS NOT NULL
  AND service_id IS NOT NULL
);