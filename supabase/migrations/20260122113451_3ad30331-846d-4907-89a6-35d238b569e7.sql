-- Fix 1: Add restrictive write policies for services table
-- These policies deny all write operations from regular users
-- Admin operations should use service role key through secure backend

CREATE POLICY "Deny all inserts on services"
ON public.services FOR INSERT
WITH CHECK (false);

CREATE POLICY "Deny all updates on services"
ON public.services FOR UPDATE
USING (false);

CREATE POLICY "Deny all deletes on services"
ON public.services FOR DELETE
USING (false);

-- Fix 2: Add similar write protection for locations table (same pattern)
CREATE POLICY "Deny all inserts on locations"
ON public.locations FOR INSERT
WITH CHECK (false);

CREATE POLICY "Deny all updates on locations"
ON public.locations FOR UPDATE
USING (false);

CREATE POLICY "Deny all deletes on locations"
ON public.locations FOR DELETE
USING (false);

-- Fix 3: Add explicit deny policy for anonymous access to profiles
-- This prevents any anonymous role from accessing profiles even if auth is misconfigured
CREATE POLICY "Deny anonymous access to profiles"
ON public.profiles FOR SELECT
TO anon
USING (false);

-- Also add delete policy for profiles (currently missing)
CREATE POLICY "Users can delete their own profile"
ON public.profiles FOR DELETE
USING (auth.uid() = user_id);