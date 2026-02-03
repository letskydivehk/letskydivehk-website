INSERT INTO public.user_roles (user_id, role) 
VALUES ('f9069341-f478-4a17-a664-d65c513dae84', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;