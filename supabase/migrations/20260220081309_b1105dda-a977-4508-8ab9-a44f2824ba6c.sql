
CREATE OR REPLACE FUNCTION public.sync_credit_tx_user_fields()
 RETURNS trigger
 LANGUAGE plpgsql
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
