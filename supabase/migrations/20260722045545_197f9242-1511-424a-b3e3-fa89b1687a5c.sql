CREATE OR REPLACE FUNCTION public.trg_renew_credit_expiry()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'approved' AND NEW.user_id IS NOT NULL THEN
    UPDATE public.credit_transactions
    SET expires_at = now() + INTERVAL '365 days',
        expiry_notified_at = NULL
    WHERE user_id = NEW.user_id
      AND status = 'approved'
      AND expired_at IS NULL
      AND expires_at IS NOT NULL
      AND id <> NEW.id;

    IF NEW.expires_at IS NOT NULL AND NEW.expired_at IS NULL THEN
      NEW.expires_at := now() + INTERVAL '365 days';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS credit_tx_renew_expiry ON public.credit_transactions;
CREATE TRIGGER credit_tx_renew_expiry
BEFORE INSERT ON public.credit_transactions
FOR EACH ROW EXECUTE FUNCTION public.trg_renew_credit_expiry();