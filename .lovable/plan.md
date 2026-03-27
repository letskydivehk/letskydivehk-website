

# Update Hainan & Zhuhai for A-Licence Availability

## Changes Needed

### 1. Database Updates (via insert/update tool)

**Update `locations` table** — set `has_aff = true` for Hainan and Zhuhai:
```sql
UPDATE locations SET has_aff = true WHERE slug IN ('hainan', 'zhuhai');
```

**Insert new `location_services` records** — A-Licence packages with "Coming Soon" pricing:
```sql
INSERT INTO location_services (location_id, service_name, service_type, price_display, includes, display_order)
VALUES
  ('a417b3cc-3141-4eda-b825-238c9b6a2b05', 'A-License Package', 'aff', 'Coming Soon', 
   ARRAY['25 Jumps','Ground school training','All equipment provided','Personal instructor guidance','A free session of Shenzhen i-Fly experience'], 10),
  ('0973c412-ff97-411c-aab4-34bac1878490', 'A-License Package', 'aff', 'Coming Soon',
   ARRAY['25 Jumps','Ground school training','All equipment provided','Personal instructor guidance','A free session of Shenzhen i-Fly experience'], 10);
```

### 2. No Frontend Changes Needed

- The Locations section already reads `has_aff` dynamically and shows the A-Licence badge
- The A-Licence service page (`ServicePricing`) already pulls from `location_services` grouped by location — Hainan and Zhuhai will appear automatically
- The booking flow's A-Licence filter already checks `has_aff` — both locations will now appear when A-Licence is selected
- "Coming Soon" as the price_display string will show naturally in place of a dollar amount

### Summary

| What | Action |
|------|--------|
| `locations` table | UPDATE `has_aff = true` for Hainan + Zhuhai |
| `location_services` table | INSERT 2 new A-Licence rows with "Coming Soon" price |
| Frontend code | No changes needed — all dynamic |

