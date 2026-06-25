# Update Zhuhai Packages

Replace Zhuhai's existing tandem offerings with the 3 finalized packages. Group Events and A-License entries stay untouched.

## Mapping


| New package                       | Action                      | Existing row                                                                                                              |
| --------------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Basic — $3399 (was $3999)         | Update in place             | "Tandem Skydive with Handicam"                                                                                            |
| Video — $4799 (was $5599)         | Update in place             | "Tandem Skydive with Ultimate Combo (Handicam + Wide shot)"                                                               |
| Comprehensive — $5999 (was $6999) | Repurpose existing tour row | "Zhuhai One-Day Skydive Tour" (change `service_type` from `Tour` → `tandem`, rename, update price/includes, mark popular) |


## New includes (English source; auto-translated via `translateData`)

**Basic**

- Ground briefing (~15 min)
- 1-on-1 coach
- 40–60 seconds freefall
- 5–7 minute canopy ride
- Equipment rental
- Skydiving certificate

**Video** — Basic items + GoPro close shot, 360° wide shot

**Comprehensive** — Video items + exclusive ground photographer photo & video, round-trip transportation, post-jump meal, travel insurance, personal guide for whole trip

## Technical changes

1. **Schema migration** — add `original_price_display TEXT` column to `public.location_services` so the strike-through original price can be authored explicitly (current code auto-computes `current × 1.25`, which doesn't match the user's stated originals like $3999→$3399).
2. **Data update** (`location_services` table, via insert tool, scoped to the 3 row IDs above):
  - Update `service_name`, `service_type` (Comprehensive only), `price_display`, `original_price_display`, `includes`, `is_popular` (Comprehensive = true), `display_order` (1 Basic / 2 Video / 3 Comprehensive).
  - Keep existing `itinerary`, `photos`, `deposit_amount`, `add_ons`, `location_id`.
3. `**src/components/ServicePricing.tsx**` — `TandemPriceDisplay` reads `original_price_display` from the service when present and falls back to the current `×1.25` heuristic otherwise. Pass the field through from the parent map.
4. No code changes needed for Chinese — `translateData` handles dynamic translation of `service_name` and `includes` strings.

## Out of scope

- Group Events and A-License Package rows for Zhuhai (untouched).
- Other locations' services.
- Booking flow, deposit, or itinerary editing.