
-- Credit transactions ledger
CREATE TABLE public.credit_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount integer NOT NULL, -- positive = credit, negative = debit
  type text NOT NULL CHECK (type IN ('signup_bonus', 'admin_adjustment', 'redemption', 'refund', 'promotion')),
  description text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;

-- Users can view their own transactions
CREATE POLICY "Users can view own credit transactions"
  ON public.credit_transactions FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can view all transactions
CREATE POLICY "Admins can view all credit transactions"
  ON public.credit_transactions FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can insert (except via trigger)
CREATE POLICY "Admins can insert credit transactions"
  ON public.credit_transactions FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Function to get user's credit balance
CREATE OR REPLACE FUNCTION public.get_credit_balance(_user_id uuid)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(SUM(amount), 0)::integer
  FROM public.credit_transactions
  WHERE user_id = _user_id
$$;

-- Auto-grant $100 signup bonus when profile is created
CREATE OR REPLACE FUNCTION public.grant_signup_credit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.credit_transactions (user_id, amount, type, description)
  VALUES (NEW.user_id, 100, 'signup_bonus', 'Welcome bonus - $100 credit');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_profile_created_grant_credit
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.grant_signup_credit();

-- Admin function to adjust credits (bypasses RLS)
CREATE OR REPLACE FUNCTION public.admin_adjust_credit(
  p_target_user_id uuid,
  p_amount integer,
  p_type text DEFAULT 'admin_adjustment',
  p_description text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_new_balance integer;
BEGIN
  -- Verify caller is admin
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: admin role required';
  END IF;

  -- Validate type
  IF p_type NOT IN ('admin_adjustment', 'redemption', 'refund', 'promotion') THEN
    RAISE EXCEPTION 'Invalid transaction type';
  END IF;

  INSERT INTO public.credit_transactions (user_id, amount, type, description, created_by)
  VALUES (p_target_user_id, p_amount, p_type, p_description, auth.uid());

  SELECT public.get_credit_balance(p_target_user_id) INTO v_new_balance;

  RETURN json_build_object('success', true, 'new_balance', v_new_balance);
END;
$$;

-- Admin policy: allow admins to view all profiles for credit management
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));
