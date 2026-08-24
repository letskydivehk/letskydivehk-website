CREATE TABLE public.daily_broadcasts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  broadcast_date date NOT NULL UNIQUE,
  topic text,
  body_zh_tw text NOT NULL DEFAULT '',
  body_en text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'draft',
  posted_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.daily_broadcasts TO authenticated;
GRANT ALL ON public.daily_broadcasts TO service_role;

ALTER TABLE public.daily_broadcasts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage daily broadcasts"
ON public.daily_broadcasts FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_daily_broadcasts_updated_at
BEFORE UPDATE ON public.daily_broadcasts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.daily_broadcast_settings (
  id integer NOT NULL PRIMARY KEY DEFAULT 1,
  weekday_topics jsonb NOT NULL DEFAULT '{}'::jsonb,
  enabled boolean NOT NULL DEFAULT true,
  include_en boolean NOT NULL DEFAULT false,
  send_hour integer NOT NULL DEFAULT 8,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT daily_broadcast_settings_single_row CHECK (id = 1)
);

GRANT SELECT, INSERT, UPDATE ON public.daily_broadcast_settings TO authenticated;
GRANT ALL ON public.daily_broadcast_settings TO service_role;

ALTER TABLE public.daily_broadcast_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage daily broadcast settings"
ON public.daily_broadcast_settings FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_daily_broadcast_settings_updated_at
BEFORE UPDATE ON public.daily_broadcast_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.daily_broadcast_settings (id, weekday_topics)
VALUES (1, '{
  "0": "學員故事與跳傘體驗分享",
  "1": "跳傘安全知識與裝備解構",
  "2": "第一次跳傘的準備與心理建設",
  "3": "出團提醒：下次深圳 iFLY 與各基地檔期",
  "4": "天氣與適跳指數小知識",
  "5": "優惠、推薦碼與會員獎勵提醒",
  "6": "週末跳傘號召與拍攝小貼士"
}'::jsonb)
ON CONFLICT (id) DO NOTHING;