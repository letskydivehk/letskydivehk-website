
DROP POLICY IF EXISTS "Anyone can create validated bookings" ON public.bookings;

CREATE POLICY "Validated bookings insert (anon and authenticated)"
ON public.bookings
FOR INSERT
TO anon, authenticated
WITH CHECK (
  -- Basic field validation (same as before)
  first_name IS NOT NULL
  AND length(btrim(first_name)) >= 1
  AND length(first_name) <= 100
  AND last_name IS NOT NULL
  AND length(btrim(last_name)) >= 1
  AND length(last_name) <= 100
  AND email IS NOT NULL
  AND email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND length(email) <= 255
  AND phone IS NOT NULL
  AND length(btrim(phone)) >= 6
  AND length(phone) <= 30
  AND participants >= 1
  AND participants <= 20
  AND preferred_date >= CURRENT_DATE
  AND (special_requests IS NULL OR length(special_requests) <= 1000)
  AND location_id IS NOT NULL
  AND service_id IS NOT NULL
  -- Prevent privilege/payment escalation via direct INSERT
  AND payment_status IS NULL
  AND payment_intent_id IS NULL
  AND deposit_amount IS NOT DISTINCT FROM 500
  AND status = 'pending'
  AND (
    -- Anonymous: must not attach to a user
    (auth.uid() IS NULL AND user_id IS NULL)
    OR
    -- Authenticated: may only attach to self (or leave null)
    (auth.uid() IS NOT NULL AND (user_id IS NULL OR user_id = auth.uid()))
  )
);
