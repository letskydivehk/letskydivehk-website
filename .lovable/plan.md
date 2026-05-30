## Goal

When a user selects a tour service at Hainan, Huizhou, Zhuhai, or Pattaya, route them to a dedicated tour detail page (hero + price + book CTA + day‑by‑day itinerary) instead of jumping straight to the booking section. Content will be filled in later by you.

## New route

`/tour/:locationSlug/:serviceId` → `src/pages/TourDetail.tsx`

Why `serviceId`: each of the 4 locations may have multiple Tour rows in `location_services`. Slug + id keeps URLs readable and unambiguous.

Whitelist on the page: `pattaya`, `huizhou`, `hainan`, `zhuhai`. Other slugs fall back to the existing behaviour.

## Page sections (TourDetail.tsx)

1. **PageNavbar** + back link to the location page.
2. **Hero**
   - Full‑width tour photo (first item from `location_services.photos`, fallback to location image).
   - Location name + city/country.
   - Tour name (`service_name`), price (`price_display`), deposit chip.
   - Primary **Book This Tour** button → existing booking flow (sets `preselectedLocationId` + `preselectedServiceId`, navigates `/#booking`).
3. **Quick facts strip** — price, deposit (HKD $500), duration (derived from itinerary length, e.g. "3 Day Tour").
4. **Day‑by‑day itinerary** — reuse the morning/afternoon/evening timeline already built in `ServiceSkydivingTour.tsx`'s `TourCard` (extract into `src/components/tour/TourItinerary.tsx` so both pages share it).
5. **Sticky bottom Book CTA** on mobile, inline CTA on desktop.
6. **Footer**.

Empty‑state copy when itinerary is empty: "Detailed itinerary coming soon — contact us on WhatsApp for the latest plan."

## Routing & entry-point changes

- **`src/App.tsx`** — add lazy route `/tour/:locationSlug/:serviceId` → `TourDetail`.
- **`src/pages/LocationDetail.tsx`** — `handleServiceClick`: if `service.service_type === 'Tour'` and location slug is in the whitelist, `navigate(\`/tour/${slug}/${serviceId}\`)` instead of jumping to `#booking`. All other service types unchanged.
- **`src/pages/ServiceSkydivingTour.tsx`** — `TourCard` gets a new "View Tour Details" link (next to the existing Book button) that routes to `/tour/:slug/:id`. Book button keeps current behaviour.
- **`src/components/Services.tsx`** (homepage Services grid) — for the Skydiving Tour card, change the secondary "View Details" CTA to open `/services/skydiving-tour` (already its detail page); no new homepage link per tour is needed since location is selected there. We will simply make sure the existing "View Details" CTA is prominent. *(If you want individual location quick‑links here, say so and I'll add a 4‑pill picker.)*

## Data source

Already in `location_services` table — no schema changes. Fields used: `service_name`, `price_display`, `deposit_amount`, `description`, `includes`, `photos`, `itinerary`, `add_ons`. New hook helper: `useLocationService(serviceId)` in `src/hooks/useLocationServices.ts`.

## Files

New
- `src/pages/TourDetail.tsx`
- `src/components/tour/TourItinerary.tsx` (extracted timeline)
- `src/components/tour/TourHero.tsx`

Edited
- `src/App.tsx` (new route)
- `src/pages/LocationDetail.tsx` (conditional navigation)
- `src/pages/ServiceSkydivingTour.tsx` (use shared `TourItinerary`, add "View Details" link)
- `src/hooks/useLocationServices.ts` (add single-service hook)
- `src/contexts/LanguageContext.tsx` (a handful of new keys: `tour.viewDetails`, `tour.detailsComingSoon`, `tour.bookThisTour`, `tour.duration`)

## Out of scope

- No DB migrations, no admin editor changes — content will be edited via existing `location_services` rows.
- No changes to booking funnel, payments, or other service pages.
- No new copywriting; pages render whatever is in the DB (with friendly empty states).

## Open follow‑up (after this lands)

Once the page exists, tell me the tour content per location (name, hero photo URL, price, day‑by‑day itinerary) and I'll seed `location_services` rows via a data migration.
