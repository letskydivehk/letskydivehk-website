
-- 1. Add selected_promos column
ALTER TABLE public.bookings ADD COLUMN selected_promos text[] DEFAULT '{}'::text[];

-- 2. Drop all 3 overloaded create_booking functions and recreate with selected_promos support

-- Drop the 3 overloads (by parameter signature)
DROP FUNCTION IF EXISTS public.create_booking(uuid, uuid, uuid, date, integer, text, text, text, text, text);
DROP FUNCTION IF EXISTS public.create_booking(uuid, uuid, uuid, date, integer, text, text, text, text, text, text);
DROP FUNCTION IF EXISTS public.create_booking(uuid, uuid, uuid, date, integer, text, text, text, text, text, text, text);

-- Recreate the main function with selected_promos parameter
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
  p_special_requests text DEFAULT NULL,
  p_referral_code text DEFAULT NULL,
  p_payment_intent_id text DEFAULT NULL,
  p_selected_promos text[] DEFAULT '{}'::text[]
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_result json;
  v_booking_id uuid;
  v_referral_result json;
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
    first_name, last_name, email, phone, special_requests, status, referral_code,
    payment_intent_id, payment_status, selected_promos
  ) VALUES (
    p_user_id, p_location_id, p_service_id, p_preferred_date, p_participants,
    p_first_name, p_last_name, p_email, p_phone, p_special_requests, 'pending',
    CASE WHEN p_referral_code IS NOT NULL AND LENGTH(TRIM(p_referral_code)) > 0 THEN UPPER(TRIM(p_referral_code)) ELSE NULL END,
    p_payment_intent_id,
    CASE WHEN p_payment_intent_id IS NOT NULL THEN 'paid' ELSE NULL END,
    COALESCE(p_selected_promos, '{}'::text[])
  )
  RETURNING id, json_build_object(
    'id', id,
    'access_token', access_token,
    'status', status,
    'created_at', created_at,
    'preferred_date', preferred_date,
    'participants', participants
  ) INTO v_booking_id, v_result;

  -- Process referral if code provided
  IF p_referral_code IS NOT NULL AND LENGTH(TRIM(p_referral_code)) > 0 THEN
    v_referral_result := public.process_referral_credit(p_referral_code, v_booking_id);
  END IF;

  RETURN v_result;
END;
$$;
