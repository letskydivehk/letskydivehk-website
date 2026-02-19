
-- Fix search_path for process_referral_credit
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

  SELECT user_id, full_name INTO v_referrer_id, v_referrer_name
  FROM public.profiles
  WHERE referral_code = UPPER(TRIM(p_referral_code));

  IF v_referrer_id IS NULL THEN
    RETURN json_build_object('success', false, 'reason', 'invalid_code');
  END IF;

  IF auth.uid() IS NOT NULL AND auth.uid() = v_referrer_id THEN
    RETURN json_build_object('success', false, 'reason', 'self_referral');
  END IF;

  INSERT INTO public.credit_transactions (user_id, amount, type, description, status)
  VALUES (
    v_referrer_id, 100, 'referral_bonus',
    'Referral bonus (pending admin approval) - Booking #' || LEFT(p_booking_id::text, 8),
    'pending'
  );

  RETURN json_build_object('success', true, 'referrer_name', v_referrer_name);
END;
$$;

-- Fix search_path for admin_approve_credit
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

-- Fix search_path for admin_reject_credit
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
