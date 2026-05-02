-- 1. Remove credit_transactions from Realtime publication (contains sensitive email/amount data)
ALTER PUBLICATION supabase_realtime DROP TABLE public.credit_transactions;

-- 2. Fix bookings anonymous-token policies: require token setting to be present.
DROP POLICY IF EXISTS "Anonymous users can view bookings via unexpired token" ON public.bookings;
DROP POLICY IF EXISTS "Anonymous users can update bookings via unexpired token" ON public.bookings;

CREATE POLICY "Anonymous users can view bookings via unexpired token"
ON public.bookings
FOR SELECT
TO anon
USING (
  user_id IS NULL
  AND NULLIF(current_setting('app.booking_token', true), '') IS NOT NULL
  AND access_token = (NULLIF(current_setting('app.booking_token', true), ''))::uuid
  AND (token_expires_at IS NULL OR token_expires_at > now())
);

CREATE POLICY "Anonymous users can update bookings via unexpired token"
ON public.bookings
FOR UPDATE
TO anon
USING (
  user_id IS NULL
  AND NULLIF(current_setting('app.booking_token', true), '') IS NOT NULL
  AND access_token = (NULLIF(current_setting('app.booking_token', true), ''))::uuid
  AND (token_expires_at IS NULL OR token_expires_at > now())
);

-- 3. Revoke EXECUTE on internal/trigger SECURITY DEFINER functions from anon and authenticated.
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.grant_signup_credit() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.process_referral_credit(text, uuid) FROM anon, authenticated, PUBLIC;

-- Admin RPCs: drop anon access; authenticated users may call but functions verify has_role internally.
REVOKE EXECUTE ON FUNCTION public.admin_adjust_credit(uuid, integer, text, text) FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.admin_update_profile(uuid, text, text, integer, uuid, date, text, text, text) FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.admin_approve_credit(uuid) FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.admin_reject_credit(uuid) FROM anon, PUBLIC;