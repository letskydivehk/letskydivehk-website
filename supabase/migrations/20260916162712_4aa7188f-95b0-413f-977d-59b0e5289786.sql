ALTER TABLE public.daily_broadcast_settings
  ADD COLUMN IF NOT EXISTS auto_send boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS recipients jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS template_name text,
  ADD COLUMN IF NOT EXISTS template_language text NOT NULL DEFAULT 'zh_HK';

CREATE TABLE IF NOT EXISTS public.daily_broadcast_sends (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  broadcast_id uuid NOT NULL REFERENCES public.daily_broadcasts(id) ON DELETE CASCADE,
  phone text NOT NULL,
  label text,
  status text NOT NULL DEFAULT 'sent',
  error text,
  provider_message_id text,
  sent_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.daily_broadcast_sends TO authenticated;
GRANT ALL ON public.daily_broadcast_sends TO service_role;

ALTER TABLE public.daily_broadcast_sends ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view broadcast sends"
ON public.daily_broadcast_sends
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS idx_daily_broadcast_sends_broadcast
  ON public.daily_broadcast_sends (broadcast_id, sent_at DESC);