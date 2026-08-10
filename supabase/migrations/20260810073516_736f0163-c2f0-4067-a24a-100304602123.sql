CREATE TABLE public.service_departures (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location_service_id uuid NOT NULL REFERENCES public.location_services(id) ON DELETE CASCADE,
  departure_date date NOT NULL,
  capacity integer NOT NULL DEFAULT 8,
  min_participants integer NOT NULL DEFAULT 3,
  cutoff_days integer NOT NULL DEFAULT 5,
  status text NOT NULL DEFAULT 'open',
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (location_service_id, departure_date)
);

GRANT SELECT ON public.service_departures TO anon;
GRANT SELECT ON public.service_departures TO authenticated;
GRANT ALL ON public.service_departures TO service_role;

ALTER TABLE public.service_departures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Departures are viewable by everyone"
  ON public.service_departures FOR SELECT USING (true);

CREATE POLICY "Admins can insert departures"
  ON public.service_departures FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update departures"
  ON public.service_departures FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete departures"
  ON public.service_departures FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_service_departures_updated_at
  BEFORE UPDATE ON public.service_departures
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

GRANT UPDATE (capacity, min_participants, cutoff_days, status, notes) ON public.service_departures TO authenticated;
GRANT INSERT, DELETE ON public.service_departures TO authenticated;

CREATE OR REPLACE FUNCTION public.get_departure_availability(_service_id uuid)
RETURNS TABLE(
  id uuid,
  departure_date date,
  capacity integer,
  min_participants integer,
  cutoff_days integer,
  status text,
  seats_taken integer,
  seats_left integer,
  is_full boolean,
  is_closed boolean
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    d.id,
    d.departure_date,
    d.capacity,
    d.min_participants,
    d.cutoff_days,
    d.status,
    COALESCE(b.taken, 0)::int AS seats_taken,
    GREATEST(0, d.capacity - COALESCE(b.taken, 0))::int AS seats_left,
    (COALESCE(b.taken, 0) >= d.capacity) AS is_full,
    (
      d.status <> 'open'
      OR d.departure_date - make_interval(days => d.cutoff_days) <= now()
    ) AS is_closed
  FROM public.service_departures d
  LEFT JOIN (
    SELECT service_id, preferred_date, SUM(participants) AS taken
    FROM public.bookings
    WHERE status <> 'cancelled'
    GROUP BY service_id, preferred_date
  ) b ON b.service_id = d.location_service_id AND b.preferred_date = d.departure_date
  WHERE d.location_service_id = _service_id
    AND d.status <> 'cancelled'
  ORDER BY d.departure_date ASC
$$;
