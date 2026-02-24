
-- Fix referral fraud: update process_referral_credit to:
-- 1. Check booking email vs referrer email (block anonymous self-referral)
-- 2. Only award credit if booking has payment (payment_intent_id IS NOT NULL)
-- 3. Prevent duplicate referral credits for same booking email
-- 4. Cap referrals per user (max 10 pending/approved per month)

CREATE OR REPLACE FUNCTION public.process_referral_credit(p_referral_code text, p_booking_id uuid)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_referrer_id uuid;
  v_referrer_name text;
  v_referrer_email text;
  v_booking_email text;
  v_booking_payment text;
  v_monthly_count integer;
  v_duplicate_count integer;
BEGIN
  IF p_referral_code IS NULL OR LENGTH(TRIM(p_referral_code)) = 0 THEN
    RETURN json_build_object('success', false, 'reason', 'no_code');
  END IF;

  -- Look up referrer
  SELECT user_id, full_name, email INTO v_referrer_id, v_referrer_name, v_referrer_email
  FROM public.profiles
  WHERE referral_code = UPPER(TRIM(p_referral_code));

  IF v_referrer_id IS NULL THEN
    RETURN json_build_object('success', false, 'reason', 'invalid_code');
  END IF;

  -- Get booking details
  SELECT email, payment_intent_id INTO v_booking_email, v_booking_payment
  FROM public.bookings
  WHERE id = p_booking_id;

  IF v_booking_email IS NULL THEN
    RETURN json_build_object('success', false, 'reason', 'booking_not_found');
  END IF;

  -- Block authenticated self-referral
  IF auth.uid() IS NOT NULL AND auth.uid() = v_referrer_id THEN
    RETURN json_build_object('success', false, 'reason', 'self_referral');
  END IF;

  -- Block anonymous self-referral: check if booking email matches referrer email
  IF LOWER(TRIM(v_booking_email)) = LOWER(TRIM(COALESCE(v_referrer_email, ''))) THEN
    RETURN json_build_object('success', false, 'reason', 'self_referral');
  END IF;

  -- Require payment before awarding referral credit
  IF v_booking_payment IS NULL THEN
    RETURN json_build_object('success', false, 'reason', 'payment_required');
  END IF;

  -- Check for duplicate: same booking email already generated a referral credit for this referrer
  SELECT COUNT(*) INTO v_duplicate_count
  FROM public.credit_transactions ct
  JOIN public.bookings b ON ct.description LIKE '%' || LEFT(b.id::text, 8) || '%'
  WHERE ct.user_id = v_referrer_id
    AND ct.type = 'referral_bonus'
    AND LOWER(b.email) = LOWER(TRIM(v_booking_email))
    AND ct.status IN ('pending', 'approved');

  IF v_duplicate_count > 0 THEN
    RETURN json_build_object('success', false, 'reason', 'duplicate_email');
  END IF;

  -- Cap referrals: max 10 per month per referrer
  SELECT COUNT(*) INTO v_monthly_count
  FROM public.credit_transactions
  WHERE user_id = v_referrer_id
    AND type = 'referral_bonus'
    AND status IN ('pending', 'approved')
    AND created_at >= date_trunc('month', NOW());

  IF v_monthly_count >= 10 THEN
    RETURN json_build_object('success', false, 'reason', 'monthly_limit_reached');
  END IF;

  INSERT INTO public.credit_transactions (user_id, amount, type, description, status)
  VALUES (
    v_referrer_id, 100, 'referral_bonus',
    'Referral bonus (pending admin approval) - Booking #' || LEFT(p_booking_id::text, 8),
    'pending'
  );

  RETURN json_build_object('success', true, 'referrer_name', v_referrer_name);
END;
$function$;
