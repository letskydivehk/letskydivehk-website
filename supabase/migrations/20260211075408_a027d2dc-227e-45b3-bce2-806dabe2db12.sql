
-- Drop the insecure 5-second window policy
DROP POLICY IF EXISTS "Allow reading newly inserted bookings" ON public.bookings;

-- Create a secure RPC function to insert bookings and return the result
-- This uses SECURITY DEFINER to bypass RLS for the return value,
-- but performs all validation inside the function
CREATE OR REPLACE FUNCTION public.create_booking(
  p_user_id uuid DEFAULT NULL,
  p_location_id uuid DEFAULT NULL,
  p_service_id uuid DEFAULT NULL,
  p_preferred_date date DEFAULT NULL,
  p_participants integer DEFAULT 1,
  p_first_name text DEFAULT NULL,
  p_last_name text DEFAULT NULL,
  p_email text DEFAULT NULL,
  p_phone text DEFAULT NULL,
  p_special_requests text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result json;
BEGIN
  -- Validate required fields
  IF p_first_name IS NULL OR length(trim(p_first_name)) < 1 OR length(p_first_name) > 100 THEN
    RAISE EXCEPTION 'Invalid first name';
  END IF;
  IF p_last_name IS NULL OR length(trim(p_last_name)) < 1 OR length(p_last_name) > 100 THEN
    RAISE EXCEPTION 'Invalid last name';
  END IF;
  IF p_email IS NULL OR p_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' OR length(p_email) > 255 THEN
    RAISE EXCEPTION 'Invalid email';
  END IF;
  IF p_phone IS NULL OR length(trim(p_phone)) < 6 OR length(p_phone) > 30 THEN
    RAISE EXCEPTION 'Invalid phone';
  END IF;
  IF p_participants < 1 OR p_participants > 20 THEN
    RAISE EXCEPTION 'Invalid participants count';
  END IF;
  IF p_preferred_date IS NULL OR p_preferred_date < CURRENT_DATE THEN
    RAISE EXCEPTION 'Invalid preferred date';
  END IF;
  IF p_special_requests IS NOT NULL AND length(p_special_requests) > 1000 THEN
    RAISE EXCEPTION 'Special requests too long';
  END IF;
  IF p_location_id IS NULL THEN
    RAISE EXCEPTION 'Location is required';
  END IF;
  IF p_service_id IS NULL THEN
    RAISE EXCEPTION 'Service is required';
  END IF;

  -- Ensure user_id matches auth.uid() if authenticated
  IF auth.uid() IS NOT NULL AND p_user_id IS NOT NULL AND auth.uid() != p_user_id THEN
    RAISE EXCEPTION 'User ID mismatch';
  END IF;
  IF auth.uid() IS NOT NULL THEN
    p_user_id := auth.uid();
  END IF;

  INSERT INTO public.bookings (
    user_id, location_id, service_id, preferred_date, participants,
    first_name, last_name, email, phone, special_requests, status
  ) VALUES (
    p_user_id, p_location_id, p_service_id, p_preferred_date, p_participants,
    p_first_name, p_last_name, p_email, p_phone, p_special_requests, 'pending'
  )
  RETURNING json_build_object(
    'id', id,
    'access_token', access_token,
    'status', status,
    'created_at', created_at,
    'preferred_date', preferred_date,
    'participants', participants
  ) INTO v_result;

  RETURN v_result;
END;
$$;
