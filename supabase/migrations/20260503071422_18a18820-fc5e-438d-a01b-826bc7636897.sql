
-- Quiz tables
CREATE TABLE public.quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  display_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  text_en text NOT NULL DEFAULT '',
  text_zh_tw text NOT NULL DEFAULT '',
  text_zh_cn text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.quiz_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid NOT NULL REFERENCES public.quiz_questions(id) ON DELETE CASCADE,
  display_order int NOT NULL DEFAULT 0,
  label_en text NOT NULL DEFAULT '',
  label_zh_tw text NOT NULL DEFAULT '',
  label_zh_cn text NOT NULL DEFAULT '',
  service_weights jsonb NOT NULL DEFAULT '{}'::jsonb,
  location_weights jsonb NOT NULL DEFAULT '{}'::jsonb,
  pin_location_slug text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_quiz_options_question ON public.quiz_options(question_id, display_order);

ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_options ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Quiz questions are publicly viewable" ON public.quiz_questions
  FOR SELECT USING (true);
CREATE POLICY "Quiz options are publicly viewable" ON public.quiz_options
  FOR SELECT USING (true);

-- Admin write
CREATE POLICY "Admins can insert quiz questions" ON public.quiz_questions
  FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(),'admin'));
CREATE POLICY "Admins can update quiz questions" ON public.quiz_questions
  FOR UPDATE TO authenticated USING (has_role(auth.uid(),'admin'));
CREATE POLICY "Admins can delete quiz questions" ON public.quiz_questions
  FOR DELETE TO authenticated USING (has_role(auth.uid(),'admin'));

CREATE POLICY "Admins can insert quiz options" ON public.quiz_options
  FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(),'admin'));
CREATE POLICY "Admins can update quiz options" ON public.quiz_options
  FOR UPDATE TO authenticated USING (has_role(auth.uid(),'admin'));
CREATE POLICY "Admins can delete quiz options" ON public.quiz_options
  FOR DELETE TO authenticated USING (has_role(auth.uid(),'admin'));

CREATE TRIGGER quiz_questions_updated_at BEFORE UPDATE ON public.quiz_questions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER quiz_options_updated_at BEFORE UPDATE ON public.quiz_options
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed: 7 questions matching current src/lib/quiz.ts
DO $$
DECLARE q1 uuid; q2 uuid; q3 uuid; q4 uuid; q5 uuid; q6 uuid; q7 uuid;
BEGIN
  INSERT INTO public.quiz_questions (slug,display_order,text_en,text_zh_tw,text_zh_cn) VALUES
    ('experience',1,'Have you skydived before?','你有跳傘經驗嗎？','你有跳伞经验吗？') RETURNING id INTO q1;
  INSERT INTO public.quiz_questions (slug,display_order,text_en,text_zh_tw,text_zh_cn) VALUES
    ('with_who',2,'Who are you jumping with?','你和誰一起跳？','你和谁一起跳？') RETURNING id INTO q2;
  INSERT INTO public.quiz_questions (slug,display_order,text_en,text_zh_tw,text_zh_cn) VALUES
    ('thrill',3,'What''s your thrill level?','你的刺激程度？','你的刺激程度？') RETURNING id INTO q3;
  INSERT INTO public.quiz_questions (slug,display_order,text_en,text_zh_tw,text_zh_cn) VALUES
    ('travel',4,'How far are you willing to travel?','你願意走多遠？','你愿意走多远？') RETURNING id INTO q4;
  INSERT INTO public.quiz_questions (slug,display_order,text_en,text_zh_tw,text_zh_cn) VALUES
    ('budget',5,'What''s your budget vibe?','你的預算偏好？','你的预算偏好？') RETURNING id INTO q5;
  INSERT INTO public.quiz_questions (slug,display_order,text_en,text_zh_tw,text_zh_cn) VALUES
    ('scenery',6,'What scenery excites you most?','你最愛哪種風景？','你最爱哪种风景？') RETURNING id INTO q6;
  INSERT INTO public.quiz_questions (slug,display_order,text_en,text_zh_tw,text_zh_cn) VALUES
    ('season',7,'When are you hoping to jump?','你打算何時跳？','你打算何时跳？') RETURNING id INTO q7;

  INSERT INTO public.quiz_options (question_id,display_order,label_en,label_zh_tw,label_zh_cn,service_weights,location_weights) VALUES
    (q1,1,'🆕 No, this is my first time!','🆕 沒有，這是第一次！','🆕 没有，这是第一次！','{"tandem":3}','{}'),
    (q1,2,'✅ Yes, I''ve jumped before','✅ 有，我之前跳過','✅ 有，我之前跳过','{"tandem":1,"alicence":2}','{}'),
    (q1,3,'🎓 Yes, and I want my own licence','🎓 有，我想考自己的執照','🎓 有，我想考自己的执照','{"alicence":4}','{}'),
    (q2,1,'🙋 Just me, solo adventure','🙋 獨自冒險','🙋 独自冒险','{"tandem":1,"alicence":2}','{}'),
    (q2,2,'👫 With friends or partner','👫 和朋友或伴侶','👫 和朋友或伴侣','{"tandem":3}','{}'),
    (q2,3,'🏢 Corporate / team building event','🏢 企業/團隊建設活動','🏢 企业/团队建设活动','{"group":4,"tandem":1}','{"needsGroup":true}'),
    (q2,4,'👨‍👩‍👧 Family who''ll watch me jump','👨‍👩‍👧 家人來看我跳','👨‍👩‍👧 家人来看我跳','{"alicence":3}','{}'),
    (q3,1,'😊 Casual — enjoy the view','😊 輕鬆——享受風景','😊 轻松——享受风景','{"tandem":2}','{}'),
    (q3,2,'🔥 Full-on adrenaline rush','🔥 全力腎上腺素飆升','🔥 全力肾上腺素飙升','{"tandem":3,"group":1}','{}'),
    (q3,3,'🚀 Life-changing — I want my own licence!','🚀 改變人生——我要考執照！','🚀 改变人生——我要考执照！','{"alicence":4}','{}'),
    (q4,1,'🚄 Short trip — same-day or overnight from HK','🚄 短途——當日或過夜從香港出發','🚄 短途——当日或过夜从香港出发','{}','{"proximity":3,"country":"China","budget":1}'),
    (q4,2,'✈️ A weekend getaway is fine','✈️ 週末小旅行也可以','✈️ 周末小旅行也可以','{}','{"proximity":1,"scenery":2}'),
    (q4,3,'🌴 Full holiday — I want to make a trip of it','🌴 完整假期——想好好玩','🌴 完整假期——想好好玩','{}','{"proximity":0,"scenery":3,"country":"Thailand"}'),
    (q5,1,'💰 Best value — keep it affordable','💰 高性價比——經濟實惠','💰 高性价比——经济实惠','{}','{"budget":3,"country":"China"}'),
    (q5,2,'⚖️ Balanced — quality at a fair price','⚖️ 平衡——品質與價格兼具','⚖️ 平衡——品质与价格兼具','{}','{"budget":1}'),
    (q5,3,'✨ Premium — splurge on the experience','✨ 高端——盡情享受','✨ 高端——尽情享受','{}','{"budget":0,"scenery":2}'),
    (q6,1,'🏖️ Tropical beaches and turquoise sea','🏖️ 熱帶海灘和碧藍海水','🏖️ 热带海滩和碧蓝海水','{}','{"scenery":3,"country":"Thailand"}'),
    (q6,2,'⛰️ Mountains and lush countryside','⛰️ 山脈與翠綠田園','⛰️ 山脉与翠绿田园','{}','{"scenery":2}'),
    (q6,3,'🏙️ Modern coastal cities','🏙️ 現代沿海城市','🏙️ 现代沿海城市','{}','{"proximity":2,"country":"China"}'),
    (q6,4,'🌅 Iconic island landscapes','🌅 標誌性島嶼風光','🌅 标志性岛屿风光','{}','{"scenery":3}'),
    (q7,1,'🍂 Oct – Dec','🍂 10月 – 12月','🍂 10月 – 12月','{}','{"monthPref":[10,11,12]}'),
    (q7,2,'🌸 Jan – Mar','🌸 1月 – 3月','🌸 1月 – 3月','{}','{"monthPref":[1,2,3]}'),
    (q7,3,'☀️ Apr – Sep','☀️ 4月 – 9月','☀️ 4月 – 9月','{}','{"monthPref":[4,5,6,7,8,9]}'),
    (q7,4,'🤷 Flexible — any time','🤷 彈性——任何時間','🤷 弹性——任何时间','{}','{}');
END $$;
