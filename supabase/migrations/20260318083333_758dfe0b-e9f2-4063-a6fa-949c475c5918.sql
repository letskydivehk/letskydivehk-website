
CREATE OR REPLACE FUNCTION public.admin_update_profile(
  p_target_user_id uuid,
  p_full_name text DEFAULT NULL,
  p_phone text DEFAULT NULL,
  p_total_jumps integer DEFAULT NULL,
  p_tier_id uuid DEFAULT NULL,
  p_date_of_birth date DEFAULT NULL,
  p_emergency_contact_name text DEFAULT NULL,
  p_emergency_contact_phone text DEFAULT NULL,
  p_emergency_contact_relationship text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Verify caller is admin
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: admin role required';
  END IF;

  UPDATE public.profiles SET
    full_name = COALESCE(p_full_name, full_name),
    phone = COALESCE(p_phone, phone),
    total_jumps = COALESCE(p_total_jumps, total_jumps),
    tier_id = COALESCE(p_tier_id, tier_id),
    date_of_birth = COALESCE(p_date_of_birth, date_of_birth),
    emergency_contact_name = COALESCE(p_emergency_contact_name, emergency_contact_name),
    emergency_contact_phone = COALESCE(p_emergency_contact_phone, emergency_contact_phone),
    emergency_contact_relationship = COALESCE(p_emergency_contact_relationship, emergency_contact_relationship),
    updated_at = now()
  WHERE user_id = p_target_user_id;

  RETURN json_build_object('success', true);
END;
$$;
