
-- Fix 1: user_roles privilege escalation
-- Drop the ALL policy and replace with separate per-command policies with proper WITH CHECK

DROP POLICY IF EXISTS "Only admins can manage roles" ON public.user_roles;

CREATE POLICY "Admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Fix 2: bookings UPDATE policy - restrict what users can update
-- Drop existing permissive update policy and replace with one that restricts sensitive fields

DROP POLICY IF EXISTS "Users can update their own bookings" ON public.bookings;

CREATE POLICY "Users can update their own bookings"
ON public.bookings
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id
  AND status = 'pending'
  AND payment_status IS NOT DISTINCT FROM (SELECT payment_status FROM bookings WHERE id = bookings.id)
  AND payment_intent_id IS NOT DISTINCT FROM (SELECT payment_intent_id FROM bookings WHERE id = bookings.id)
  AND deposit_amount IS NOT DISTINCT FROM (SELECT deposit_amount FROM bookings WHERE id = bookings.id)
);
