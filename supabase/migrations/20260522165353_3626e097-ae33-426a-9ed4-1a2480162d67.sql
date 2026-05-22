UPDATE public.location_services
SET itinerary = (
  SELECT jsonb_agg(
    jsonb_build_object(
      'day', (d->>'day')::int,
      'title', d->>'title',
      'segments', jsonb_build_array(
        jsonb_build_object('period', 'morning', 'items',
          COALESCE(
            (CASE WHEN d->>'transportation' IS NOT NULL AND d->>'transportation' <> '' AND d->>'transportation' <> '—'
                  THEN jsonb_build_array(jsonb_build_object('title', d->>'transportation', 'location', NULLIF(d->>'location','—'))) ELSE '[]'::jsonb END), '[]'::jsonb)
        ),
        jsonb_build_object('period', 'afternoon', 'items',
          COALESCE(
            (SELECT jsonb_agg(jsonb_build_object('title', a, 'location', NULL))
             FROM jsonb_array_elements_text(COALESCE(d->'activities','[]'::jsonb)) a), '[]'::jsonb)
        ),
        jsonb_build_object('period', 'evening', 'items',
          (CASE WHEN d->>'meals' IS NOT NULL AND d->>'meals' <> '' AND d->>'meals' <> '—'
                THEN jsonb_build_array(jsonb_build_object('title', d->>'meals', 'location', NULL)) ELSE '[]'::jsonb END)
          ||
          (CASE WHEN d->>'accommodation' IS NOT NULL AND d->>'accommodation' <> '' AND d->>'accommodation' <> '—'
                THEN jsonb_build_array(jsonb_build_object('title', d->>'accommodation', 'location', NULL)) ELSE '[]'::jsonb END)
        )
      )
    )
    ORDER BY (d->>'day')::int
  )
  FROM jsonb_array_elements(itinerary) d
)
WHERE service_type = 'Tour' AND jsonb_typeof(itinerary) = 'array';