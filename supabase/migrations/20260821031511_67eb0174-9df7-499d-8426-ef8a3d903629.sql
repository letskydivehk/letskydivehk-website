-- 1) Guest token booking updates: add WITH CHECK mirroring authenticated policy
DROP POLICY IF EXISTS "Anonymous users can update bookings via unexpired token" ON public.bookings;
CREATE POLICY "Anonymous users can update bookings via unexpired token"
ON public.bookings
FOR UPDATE
TO anon
USING (
  (user_id IS NULL)
  AND (NULLIF(current_setting('app.booking_token', true), '') IS NOT NULL)
  AND (access_token = (NULLIF(current_setting('app.booking_token', true), ''))::uuid)
  AND ((token_expires_at IS NULL) OR (token_expires_at > now()))
)
WITH CHECK (
  (user_id IS NULL)
  AND (NULLIF(current_setting('app.booking_token', true), '') IS NOT NULL)
  AND (access_token = (NULLIF(current_setting('app.booking_token', true), ''))::uuid)
  AND ((token_expires_at IS NULL) OR (token_expires_at > now()))
  AND (status = 'pending')
  AND NOT (payment_status IS DISTINCT FROM (SELECT b.payment_status FROM public.bookings b WHERE b.id = bookings.id))
  AND NOT (payment_intent_id IS DISTINCT FROM (SELECT b.payment_intent_id FROM public.bookings b WHERE b.id = bookings.id))
  AND NOT (deposit_amount IS DISTINCT FROM (SELECT b.deposit_amount FROM public.bookings b WHERE b.id = bookings.id))
);

-- 2) newsletter_sends: explicitly deny all client writes (service_role bypasses RLS)
REVOKE INSERT, UPDATE, DELETE ON public.newsletter_sends FROM anon, authenticated;
GRANT ALL ON public.newsletter_sends TO service_role;

CREATE POLICY "No client inserts on newsletter sends"
ON public.newsletter_sends FOR INSERT TO anon, authenticated WITH CHECK (false);
CREATE POLICY "No client updates on newsletter sends"
ON public.newsletter_sends FOR UPDATE TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY "No client deletes on newsletter sends"
ON public.newsletter_sends FOR DELETE TO anon, authenticated USING (false);

-- 3) Remove profiles (sensitive PII) from realtime publication
ALTER PUBLICATION supabase_realtime DROP TABLE public.profiles;