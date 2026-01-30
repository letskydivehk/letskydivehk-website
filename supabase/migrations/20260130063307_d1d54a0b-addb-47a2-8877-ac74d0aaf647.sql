-- Fix user_roles table to prevent authenticated users from viewing other users' roles
-- Add a deny-all SELECT policy first, then the existing owner policy will allow self-view

-- First drop the existing policy that allows viewing own roles (we'll recreate it as PERMISSIVE)
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

-- Create a restrictive deny-all policy for SELECT
CREATE POLICY "Deny viewing other users roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (false);

-- Re-create the policy to allow users to view their own roles as PERMISSIVE
-- The combination of RESTRICTIVE false + PERMISSIVE own-user check = only own roles visible
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Also add a policy for admins to view all roles
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));