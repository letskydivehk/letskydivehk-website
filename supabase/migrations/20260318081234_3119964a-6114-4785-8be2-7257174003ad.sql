
-- Fix pre-existing functions missing search_path
CREATE OR REPLACE FUNCTION public.propagate_profile_to_credit_tx()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
BEGIN
  UPDATE credit_transactions ct
  SET full_name = NEW.full_name,
      email = NEW.email
  WHERE ct.user_id = NEW.user_id
    AND (ct.full_name IS DISTINCT FROM NEW.full_name OR ct.email IS DISTINCT FROM NEW.email);
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.sync_credit_tx_user_fields()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.user_id IS NOT NULL THEN
    SELECT p.full_name, p.email
      INTO NEW.full_name, NEW.email
    FROM profiles p
    WHERE p.user_id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$function$;
