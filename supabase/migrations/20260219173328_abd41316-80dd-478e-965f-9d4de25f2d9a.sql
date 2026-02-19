
-- Add unique referral code to profiles
ALTER TABLE public.profiles ADD COLUMN referral_code TEXT UNIQUE;

-- Generate referral codes for existing profiles
UPDATE public.profiles 
SET referral_code = UPPER(SUBSTR(MD5(user_id::text || created_at::text), 1, 8))
WHERE referral_code IS NULL;

-- Make referral_code NOT NULL with default for new profiles
ALTER TABLE public.profiles ALTER COLUMN referral_code SET DEFAULT UPPER(SUBSTR(MD5(gen_random_uuid()::text), 1, 8));

-- Add status to credit_transactions (approved = usable, pending = waiting for admin)
ALTER TABLE public.credit_transactions ADD COLUMN status TEXT NOT NULL DEFAULT 'approved';

-- Add referral_code field to bookings
ALTER TABLE public.bookings ADD COLUMN referral_code TEXT;

-- Update get_credit_balance to only count approved transactions
CREATE OR REPLACE FUNCTION public.get_credit_balance(_user_id uuid)
RETURNS integer
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT COALESCE(SUM(amount), 0)::integer
  FROM public.credit_transactions
  WHERE user_id = _user_id AND status = 'approved'
$$;

-- Function to get pending credit balance
CREATE OR REPLACE FUNCTION public.get_pending_credit_balance(_user_id uuid)
RETURNS integer
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT COALESCE(SUM(amount), 0)::integer
  FROM public.credit_transactions
  WHERE user_id = _user_id AND status = 'pending'
$$;

-- Function to process referral on booking submission
CREATE OR REPLACE FUNCTION public.process_referral_credit(p_referral_code text, p_booking_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_referrer_id uuid;
  v_referrer_name text;
BEGIN
  IF p_referral_code IS NULL OR LENGTH(TRIM(p_referral_code)) = 0 THEN
    RETURN json_build_object('success', false, 'reason', 'no_code');
  END IF;

  -- Find the referrer
  SELECT user_id, full_name INTO v_referrer_id, v_referrer_name
  FROM public.profiles
  WHERE referral_code = UPPER(TRIM(p_referral_code));

  IF v_referrer_id IS NULL THEN
    RETURN json_build_object('success', false, 'reason', 'invalid_code');
  END IF;

  -- Don't allow self-referral
  IF auth.uid() IS NOT NULL AND auth.uid() = v_referrer_id THEN
    RETURN json_build_object('success', false, 'reason', 'self_referral');
  END IF;

  -- Create pending credit for the referrer
  INSERT INTO public.credit_transactions (user_id, amount, type, description, status)
  VALUES (
    v_referrer_id,
    100,
    'referral_bonus',
    'Referral bonus (pending admin approval) - Booking #' || LEFT(p_booking_id::text, 8),
    'pending'
  );

  RETURN json_build_object('success', true, 'referrer_name', v_referrer_name);
END;
$$;

-- Admin function to approve a pending credit
CREATE OR REPLACE FUNCTION public.admin_approve_credit(p_transaction_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_tx RECORD;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: admin role required';
  END IF;

  SELECT * INTO v_tx FROM public.credit_transactions WHERE id = p_transaction_id AND status = 'pending';
  
  IF v_tx IS NULL THEN
    RETURN json_build_object('success', false, 'reason', 'not_found_or_already_processed');
  END IF;

  UPDATE public.credit_transactions SET status = 'approved' WHERE id = p_transaction_id;

  RETURN json_build_object('success', true, 'new_balance', public.get_credit_balance(v_tx.user_id));
END;
$$;

-- Admin function to reject a pending credit
CREATE OR REPLACE FUNCTION public.admin_reject_credit(p_transaction_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_tx RECORD;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: admin role required';
  END IF;

  SELECT * INTO v_tx FROM public.credit_transactions WHERE id = p_transaction_id AND status = 'pending';
  
  IF v_tx IS NULL THEN
    RETURN json_build_object('success', false, 'reason', 'not_found_or_already_processed');
  END IF;

  UPDATE public.credit_transactions SET status = 'rejected' WHERE id = p_transaction_id;

  RETURN json_build_object('success', true);
END;
$$;

-- Update handle_new_user to generate referral code
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, avatar_url, referral_code)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url',
    UPPER(SUBSTR(MD5(NEW.id::text || NOW()::text), 1, 8))
  );
  RETURN NEW;
END;
$$;

-- Update create_booking to accept referral_code
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
  p_referral_code text DEFAULT NULL
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
    first_name, last_name, email, phone, special_requests, status, referral_code
  ) VALUES (
    p_user_id, p_location_id, p_service_id, p_preferred_date, p_participants,
    p_first_name, p_last_name, p_email, p_phone, p_special_requests, 'pending',
    CASE WHEN p_referral_code IS NOT NULL AND LENGTH(TRIM(p_referral_code)) > 0 THEN UPPER(TRIM(p_referral_code)) ELSE NULL END
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

-- Allow admins to update credit_transactions (for approving/rejecting)
CREATE POLICY "Admins can update credit transactions"
ON public.credit_transactions
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));
