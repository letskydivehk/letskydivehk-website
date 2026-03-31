-- Fix self-referential subquery bug in bookings update policy
-- The bug: WHERE bookings_1.id = bookings_1.id (always true)
-- The fix: WHERE bookings_1.id = bookings.id (references the outer row)

DROP POLICY IF EXISTS "Users can update their own bookings" ON public.bookings;

CREATE POLICY "Users can update their own bookings"
ON public.bookings
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id
  AND status = 'pending'
  AND NOT (payment_status IS DISTINCT FROM (
    SELECT bookings_1.payment_status FROM bookings bookings_1 WHERE bookings_1.id = bookings.id
  ))
  AND NOT (payment_intent_id IS DISTINCT FROM (
    SELECT bookings_1.payment_intent_id FROM bookings bookings_1 WHERE bookings_1.id = bookings.id
  ))
  AND NOT (deposit_amount IS DISTINCT FROM (
    SELECT bookings_1.deposit_amount FROM bookings bookings_1 WHERE bookings_1.id = bookings.id
  ))
);