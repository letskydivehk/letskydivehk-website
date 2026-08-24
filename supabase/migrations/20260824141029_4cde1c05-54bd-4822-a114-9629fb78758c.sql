DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;
CREATE POLICY "Users can view their own bookings"
ON public.bookings FOR SELECT TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own bookings" ON public.bookings;
CREATE POLICY "Users can delete their own bookings"
ON public.bookings FOR DELETE TO authenticated
USING (auth.uid() = user_id);