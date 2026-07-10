CREATE OR REPLACE FUNCTION public.grant_signup_credit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.credit_transactions (user_id, amount, type, description)
  VALUES (NEW.user_id, 200, 'signup_bonus', '歡迎獎金 - $200 現金券');
  RETURN NEW;
END;
$function$;