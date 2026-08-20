-- profiles: opt-in + unsubscribe token
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS newsletter_opt_in boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS unsubscribe_token uuid NOT NULL DEFAULT gen_random_uuid();

CREATE UNIQUE INDEX IF NOT EXISTS profiles_unsubscribe_token_key ON public.profiles(unsubscribe_token);

-- Articles
CREATE TABLE public.newsletter_articles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  topic text,
  subject_zh_tw text NOT NULL DEFAULT '',
  subject_en text NOT NULL DEFAULT '',
  body_zh_tw text NOT NULL DEFAULT '',
  body_en text NOT NULL DEFAULT '',
  hero_image_url text,
  queue_position integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'draft',
  scheduled_for date,
  sent_at timestamp with time zone,
  recipients_count integer NOT NULL DEFAULT 0,
  created_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.newsletter_articles TO authenticated;
GRANT ALL ON public.newsletter_articles TO service_role;
ALTER TABLE public.newsletter_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage newsletter articles"
ON public.newsletter_articles FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_newsletter_articles_updated_at
BEFORE UPDATE ON public.newsletter_articles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.newsletter_validate_article()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.status NOT IN ('draft','approved','sent') THEN
    RAISE EXCEPTION 'Invalid newsletter status: %', NEW.status;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER newsletter_articles_validate
BEFORE INSERT OR UPDATE ON public.newsletter_articles
FOR EACH ROW EXECUTE FUNCTION public.newsletter_validate_article();

CREATE INDEX idx_newsletter_articles_status_pos ON public.newsletter_articles(status, queue_position);

-- Sends log
CREATE TABLE public.newsletter_sends (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id uuid NOT NULL REFERENCES public.newsletter_articles(id) ON DELETE CASCADE,
  user_id uuid,
  email text NOT NULL,
  status text NOT NULL DEFAULT 'sent',
  error text,
  sent_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX newsletter_sends_article_email_key
  ON public.newsletter_sends(article_id, lower(email));

GRANT SELECT ON public.newsletter_sends TO authenticated;
GRANT ALL ON public.newsletter_sends TO service_role;
ALTER TABLE public.newsletter_sends ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view newsletter sends"
ON public.newsletter_sends FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Job state (single row)
CREATE TABLE public.newsletter_job_state (
  id integer NOT NULL PRIMARY KEY DEFAULT 1,
  lease_expires_at timestamp with time zone,
  paused boolean NOT NULL DEFAULT false,
  pause_reason text,
  last_run_at timestamp with time zone,
  last_sent_article_at timestamp with time zone,
  consecutive_failures integer NOT NULL DEFAULT 0,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT newsletter_job_state_single_row CHECK (id = 1)
);

INSERT INTO public.newsletter_job_state (id) VALUES (1) ON CONFLICT DO NOTHING;

GRANT SELECT, UPDATE ON public.newsletter_job_state TO authenticated;
GRANT ALL ON public.newsletter_job_state TO service_role;
ALTER TABLE public.newsletter_job_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage newsletter job state"
ON public.newsletter_job_state FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_newsletter_job_state_updated_at
BEFORE UPDATE ON public.newsletter_job_state
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Subscriber count helper for admin UI
CREATE OR REPLACE FUNCTION public.newsletter_subscriber_count()
RETURNS integer
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::int FROM public.profiles
  WHERE newsletter_opt_in = true AND email IS NOT NULL AND email <> ''
$$;

-- Unsubscribe by token (no auth required)
CREATE OR REPLACE FUNCTION public.newsletter_unsubscribe(_token uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_email text;
BEGIN
  UPDATE public.profiles
  SET newsletter_opt_in = false
  WHERE unsubscribe_token = _token
  RETURNING email INTO v_email;

  IF v_email IS NULL THEN
    RETURN json_build_object('success', false, 'reason', 'invalid_token');
  END IF;

  RETURN json_build_object('success', true, 'email', v_email);
END;
$$;

GRANT EXECUTE ON FUNCTION public.newsletter_unsubscribe(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.newsletter_subscriber_count() TO authenticated;