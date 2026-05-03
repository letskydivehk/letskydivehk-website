CREATE TABLE public.quiz_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  answer_code TEXT,
  recommended_service TEXT,
  recommended_location_slug TEXT,
  language TEXT,
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.quiz_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a quiz lead"
ON public.quiz_leads
FOR INSERT
TO public
WITH CHECK (
  length(trim(full_name)) BETWEEN 1 AND 100
  AND length(trim(phone)) BETWEEN 6 AND 30
  AND email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND length(email) <= 255
);

CREATE POLICY "Admins can view quiz leads"
ON public.quiz_leads
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete quiz leads"
ON public.quiz_leads
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_quiz_leads_created_at ON public.quiz_leads(created_at DESC);