-- Grant retroactive signup bonus to existing members who don't have one
INSERT INTO public.credit_transactions (user_id, amount, type, description)
SELECT p.user_id, 100, 'signup_bonus', 'Welcome bonus - $100 credit (retroactive)'
FROM public.profiles p
WHERE NOT EXISTS (
  SELECT 1 FROM public.credit_transactions ct 
  WHERE ct.user_id = p.user_id AND ct.type = 'signup_bonus'
);