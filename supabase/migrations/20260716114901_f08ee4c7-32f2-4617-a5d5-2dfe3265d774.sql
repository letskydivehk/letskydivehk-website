
-- 1. Extend credit_transactions
ALTER TABLE public.credit_transactions
  ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS expiry_notified_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS expired_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS related_booking_id UUID;

-- Backfill expires_at for existing earning-type approved transactions (12 months from created_at)
UPDATE public.credit_transactions
SET expires_at = created_at + INTERVAL '12 months'
WHERE expires_at IS NULL
  AND amount > 0
  AND type IN ('signup_bonus','referral_bonus','promotion','admin_adjustment');

-- 2. Update balance function to exclude expired
CREATE OR REPLACE FUNCTION public.get_credit_balance(_user_id uuid)
RETURNS integer
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT COALESCE(SUM(amount), 0)::integer
  FROM public.credit_transactions
  WHERE user_id = _user_id
    AND status = 'approved'
    AND (expires_at IS NULL OR expires_at > now())
    AND expired_at IS NULL
$$;

-- 3. Helper: expiring credits within N days
CREATE OR REPLACE FUNCTION public.get_expiring_credits(_user_id uuid, _days integer DEFAULT 30)
RETURNS TABLE(amount integer, expires_at timestamptz, days_remaining integer)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT
    ct.amount,
    ct.expires_at,
    GREATEST(0, EXTRACT(DAY FROM (ct.expires_at - now()))::int) AS days_remaining
  FROM public.credit_transactions ct
  WHERE ct.user_id = _user_id
    AND ct.status = 'approved'
    AND ct.amount > 0
    AND ct.expires_at IS NOT NULL
    AND ct.expired_at IS NULL
    AND ct.expires_at > now()
    AND ct.expires_at <= now() + make_interval(days => _days)
  ORDER BY ct.expires_at ASC
$$;

GRANT EXECUTE ON FUNCTION public.get_expiring_credits(uuid, integer) TO authenticated, service_role;

-- 4. Update signup credit trigger to set expiry
CREATE OR REPLACE FUNCTION public.grant_signup_credit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.credit_transactions (user_id, amount, type, description, expires_at)
  VALUES (NEW.user_id, 200, 'signup_bonus', '歡迎獎金 - $200 現金券', now() + INTERVAL '12 months');
  RETURN NEW;
END;
$$;

-- 5. Update referral function to set expiry on new pending referral transactions
CREATE OR REPLACE FUNCTION public.process_referral_credit(p_referral_code text, p_booking_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
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

  SELECT user_id, full_name, email INTO v_referrer_id, v_referrer_name, v_referrer_email
  FROM public.profiles WHERE referral_code = UPPER(TRIM(p_referral_code));
  IF v_referrer_id IS NULL THEN
    RETURN json_build_object('success', false, 'reason', 'invalid_code');
  END IF;

  SELECT email, payment_intent_id INTO v_booking_email, v_booking_payment
  FROM public.bookings WHERE id = p_booking_id;
  IF v_booking_email IS NULL THEN
    RETURN json_build_object('success', false, 'reason', 'booking_not_found');
  END IF;

  IF auth.uid() IS NOT NULL AND auth.uid() = v_referrer_id THEN
    RETURN json_build_object('success', false, 'reason', 'self_referral');
  END IF;
  IF LOWER(TRIM(v_booking_email)) = LOWER(TRIM(COALESCE(v_referrer_email, ''))) THEN
    RETURN json_build_object('success', false, 'reason', 'self_referral');
  END IF;
  IF v_booking_payment IS NULL THEN
    RETURN json_build_object('success', false, 'reason', 'payment_required');
  END IF;

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

  SELECT COUNT(*) INTO v_monthly_count
  FROM public.credit_transactions
  WHERE user_id = v_referrer_id
    AND type = 'referral_bonus'
    AND status IN ('pending','approved')
    AND created_at >= date_trunc('month', NOW());
  IF v_monthly_count >= 10 THEN
    RETURN json_build_object('success', false, 'reason', 'monthly_limit_reached');
  END IF;

  INSERT INTO public.credit_transactions (user_id, amount, type, description, status, expires_at, related_booking_id)
  VALUES (
    v_referrer_id, 100, 'referral_bonus',
    'Referral bonus (pending admin approval) - Booking #' || LEFT(p_booking_id::text, 8),
    'pending', now() + INTERVAL '12 months', p_booking_id
  );

  RETURN json_build_object('success', true, 'referrer_name', v_referrer_name);
END;
$$;

-- 6. user_magnets table
CREATE TABLE IF NOT EXISTS public.user_magnets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('silver','gold','platinum','diamond')),
  jumps_at_award INT NOT NULL,
  coupon_code TEXT,
  coupon_discount NUMERIC(4,3),
  coupon_expires_at TIMESTAMPTZ,
  coupon_used_at TIMESTAMPTZ,
  awarded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, tier)
);

GRANT SELECT ON public.user_magnets TO authenticated;
GRANT ALL ON public.user_magnets TO service_role;

ALTER TABLE public.user_magnets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own magnets"
  ON public.user_magnets FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all magnets"
  ON public.user_magnets FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage magnets"
  ON public.user_magnets FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 7. Award magnets function + trigger
CREATE OR REPLACE FUNCTION public.award_magnets_for_user(_user_id uuid, _total_jumps int)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_short text := UPPER(SUBSTR(REPLACE(_user_id::text,'-',''),1,6));
  v_now timestamptz := now();
BEGIN
  IF _total_jumps >= 1 THEN
    INSERT INTO public.user_magnets(user_id,tier,jumps_at_award,coupon_code,coupon_discount,coupon_expires_at)
    VALUES (_user_id,'silver',_total_jumps,'MAGNET-SILVER-'||v_short,0.05, v_now + INTERVAL '12 months')
    ON CONFLICT (user_id,tier) DO NOTHING;
  END IF;
  IF _total_jumps >= 3 THEN
    INSERT INTO public.user_magnets(user_id,tier,jumps_at_award,coupon_code,coupon_discount,coupon_expires_at)
    VALUES (_user_id,'gold',_total_jumps,'MAGNET-GOLD-'||v_short,0.10, v_now + INTERVAL '12 months')
    ON CONFLICT (user_id,tier) DO NOTHING;
  END IF;
  IF _total_jumps >= 5 THEN
    INSERT INTO public.user_magnets(user_id,tier,jumps_at_award,coupon_code,coupon_discount,coupon_expires_at)
    VALUES (_user_id,'platinum',_total_jumps,'MAGNET-PLATINUM-'||v_short,0.15, v_now + INTERVAL '12 months')
    ON CONFLICT (user_id,tier) DO NOTHING;
  END IF;
  IF _total_jumps >= 10 THEN
    INSERT INTO public.user_magnets(user_id,tier,jumps_at_award,coupon_code,coupon_discount,coupon_expires_at)
    VALUES (_user_id,'diamond',_total_jumps,'MAGNET-DIAMOND-'||v_short,0.20, NULL)
    ON CONFLICT (user_id,tier) DO NOTHING;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.trg_award_magnets_on_jumps()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.total_jumps IS NOT NULL AND NEW.total_jumps > COALESCE(OLD.total_jumps,0) THEN
    PERFORM public.award_magnets_for_user(NEW.user_id, NEW.total_jumps);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS award_magnets_after_jumps ON public.profiles;
CREATE TRIGGER award_magnets_after_jumps
  AFTER UPDATE OF total_jumps ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.trg_award_magnets_on_jumps();

-- 8. Cron: daily expire-credits
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Remove any prior schedule with the same name (idempotent)
DO $$
BEGIN
  PERFORM cron.unschedule('expire-credits-daily')
  WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'expire-credits-daily');
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

SELECT cron.schedule(
  'expire-credits-daily',
  '0 1 * * *',
  $cron$
  SELECT net.http_post(
    url := 'https://xmelqjnxllsqofvkoccd.supabase.co/functions/v1/expire-credits',
    headers := '{"Content-Type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtZWxxam54bGxzcW9mdmtvY2NkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMDM1MjgsImV4cCI6MjA4NDU3OTUyOH0.Crzs4c7x-fnlrcIdF7U46cuFed7FnB6Kpo6Gje5_Ymo"}'::jsonb,
    body := jsonb_build_object('scheduled_at', now())
  );
  $cron$
);
