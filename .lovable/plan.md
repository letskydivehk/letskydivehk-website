## Skydiving Tour rework

### 1. Database

**Schema migration (`location_services` + `bookings`):**

- Add `itinerary jsonb` column to `location_services` (default `'[]'`). Shape per day:
  ```json
  { "day": 1, "title": "", "location": "", "accommodation": "",
    "transportation": "", "meals": "", "activities": [], "notes": "" }
  ```
- Add `deposit_amount integer` column to `location_services` (default 500). Tours rows = 2000.
- Add admin RLS policies on `location_services` so admins can `INSERT/UPDATE/DELETE` (currently locked). Public SELECT stays unchanged.
- `bookings.deposit_amount` already exists (default 500) — booking flow will read the service's `deposit_amount` and pass it through.

**Data update (insert tool, separate step):**

- For all 6 `service_type='package'` rows:
  - `service_name` → `"Skydiving Tour"`
  - `price_display` → `"From $5699"`
  - `deposit_amount` → `2000`
  - `itinerary` → `[]` (placeholder, admin fills later)

### 2. Translations (`src/contexts/LanguageContext.tsx`)

- `service.Skydiving Tour` → `Skydiving Tour` / `跳傘團` / `跳伞团`
- `serviceType.package` → already `Package Tour` / `套票行程` — change to `Skydiving Tour` / `跳傘團` / `跳伞团`
- `price.From $5700` → `From $5699` / `$5699起` / `$5699起`
- Itinerary section labels: `tour.itinerary`, `tour.day`, `tour.location`, `tour.accommodation`, `tour.transportation`, `tour.meals`, `tour.activities`, `tour.notes`, `tour.itineraryComingSoon`.

### 3. ServicePricing card (`src/components/ServicePricing.tsx`)

- For `service_type === 'package'`:
  - Replace "Enquire" button with **Book Now** (same handler as tandem → `handleBookAtLocation`).
  - Drop the `pricing.addons` line; replace with a collapsible **Itinerary** section. If `itinerary.length === 0` show `t('tour.itineraryComingSoon')`. Otherwise render day cards with location / accommodation / transportation / meals / activities.

### 4. Booking flow deposit

- Extend `useLocationServices`/types to include `deposit_amount` and `itinerary`.
- In booking summary + Airwallex call (`supabase/functions/create-payment-intent`), use `service.deposit_amount` instead of hardcoded 500. Display the dynamic amount on the deposit step.
- Server-side: `create-payment-intent` reads `deposit_amount` from `location_services` for the chosen service (do not trust client amount). `verify-payment` already keys off intent id, no change needed.

### 5. Admin panel — "Tours" tab

New file `src/components/admin/AdminToursPanel.tsx`, mounted as a new tab inside the unified admin hub at `/admin/credits`.

Per-row editor for each `package` service (one per location):

- Editable fields: `service_name`, `price_display`, `deposit_amount`, `includes[]` (chip editor), `itinerary[]` (day-by-day editor with add/remove/reorder).
- Itinerary day editor inputs: day #, title, location, accommodation, transportation, meals, activities (list), notes.
- Save via `supabase.from('location_services').update(...).eq('id', …)` (now permitted by new admin RLS).
- React Query invalidation for `['location-services', ...]` so the public site refreshes.

### 6. Out of scope (for this change)

- No dedicated `/services/skydiving-tour` landing page — itinerary lives inside the existing pricing card. Can be added later once content is ready.
- No multilingual itinerary fields yet (single-language jsonb). When real content lands we can add `_zh_tw` / `_zh_cn` mirrors.

### Files touched

- migration (schema only) + insert tool (data rewrite)
- `src/hooks/useLocationServices.ts` (type)
- `src/contexts/LanguageContext.tsx` (3 languages)
- `src/components/ServicePricing.tsx` (button + itinerary block)
- `src/components/BookingSection.tsx` or relevant booking step (read dynamic deposit)
- `supabase/functions/create-payment-intent/index.ts` (dynamic deposit)
- `src/components/admin/AdminToursPanel.tsx` (new)
- `src/pages/AdminCredits.tsx` (mount new tab)
- `public/llms.txt` (rename Package Tour → Skydiving Tour entry, if listed)
