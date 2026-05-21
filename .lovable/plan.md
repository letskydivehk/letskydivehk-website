
## Why the "View Details" button is missing

The Skydiving Tour service card is built by aggregating `location_services` rows with `service_type = 'package'`. The DB currently has **zero** package rows, so the card never renders → no "View Details" button. Seeding tour packages will make it appear automatically (the route + button code already exists in `Services.tsx`).

## 1. Database changes

Add a `photos` column to `location_services` (so admins can attach a gallery per tour package):

```sql
ALTER TABLE location_services
  ADD COLUMN photos text[] NOT NULL DEFAULT '{}';
```

Seed one or two `package` rows per location (except Luoding):

| Location | Packages |
|---|---|
| Pattaya | 3D2N, 4D3N |
| Chiang Mai (Wefly) | 3D2N, 4D3N |
| Hainan (Weland) | 3D2N, 4D3N |
| Zhuhai (Weland) | 2D1N |
| Huizhou (Yingfei) | 2D1N |
| Luoding | — (excluded) |

Each row gets `service_type='package'`, a placeholder `price_display`, `deposit_amount=2000`, an `includes[]` list, an `itinerary` JSONB seeded from the current hardcoded plans (Pattaya/Chiang Mai keep existing content; Hainan/Zhuhai/Huizhou get a starter template that admins can refine), and `photos[]` with 2–3 Unsplash placeholders.

## 2. `src/pages/ServiceSkydivingTour.tsx` — rewrite

Replace the hardcoded itinerary block with a data-driven flow:

1. **Hero** — keep current hero (intro + price chips + CTA).
2. **New intro sections** (matching `ServiceTandem`):
   - `HowItWorks` (6 steps: choose location → consult → book deposit → fly → jump → return)
   - `ServiceIncludes` (flights, hotel, transfers, tandem jump, video, guide…)
   - `ServiceSocialProof` (testimonial)
   - `ServiceFAQ` (4 tour-specific Q&As)
   - `ServiceCTA`
3. **Location picker** — pills of all active, non–coming-soon locations that have at least one `service_type='package'` row, **Luoding excluded**. Selecting a pill scrolls to the itinerary panel below.
4. **Itinerary panel** — for the selected location, render one card per `package` row (1 for Zhuhai/Huizhou, 2 for Pattaya/Chiang Mai/Hainan), showing:
   - Photo gallery (from `photos[]`, with lightbox or simple carousel)
   - Title, duration, price, deposit
   - Includes list
   - Day-by-day itinerary (existing layout)
   - "Book this tour" button → preselects service type `package` + the location, then navigates to `#booking`.
5. Translation keys added for new section copy (en / zh-TW / zh-CN).

Data source: extend `useLocationServices` query to also return the joined location name/slug (or fetch via `useLocations()` and zip in component).

## 3. Admin panel — `src/components/admin/AdminToursPanel.tsx`

Add a **Photos** editor per tour row:
- Textarea (one URL per line) bound to `photos[]`, OR a small uploader using the existing `gallery` storage bucket (URL-list textarea is simpler and matches current `includes` UX — recommend this for v1).
- Persist alongside existing fields in the `update` call.

Everything else (price, deposit, includes, itinerary days) is already editable.

## 4. `src/components/Services.tsx`

No code change needed — once package rows exist in DB the card renders with the existing "View Details" link to `/services/skydiving-tour`.

## 5. Translations (`LanguageContext.tsx`)

Add keys for: `tour.chooseLocation`, `tour.selectPlan`, `tour.bookThisTour`, `tour.photos`, plus the new HowItWorks/Includes/FAQ strings (`servicePage.tour.*`).

## Files touched

- new migration: add `photos` column + seed package rows
- `src/pages/ServiceSkydivingTour.tsx` (rewrite body, keep hero shell)
- `src/components/admin/AdminToursPanel.tsx` (add photos editor)
- `src/hooks/useLocationServices.ts` (add `photos: string[]` to interface)
- `src/contexts/LanguageContext.tsx` (new keys)

## Open question

For photo management in admin: **(A)** simple textarea of URLs (fast, ship now) or **(B)** drag-and-drop uploader to the existing `gallery` bucket (nicer UX, more code). I'll go with **(A)** unless you prefer (B).
