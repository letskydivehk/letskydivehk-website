## Goal
Treat Chiang Mai as "Coming Soon" everywhere — since the location is shut down, it should be hidden from booking flows and shown with a Coming Soon badge instead of the orange "Closing Soon" notice.

## Approach
Since the `locations` table in Supabase has `coming_soon = false` for Chiang Mai and we can't write to it from the client (no UPDATE policy), use a frontend override helper that treats Chiang Mai as effectively `coming_soon`.

Add a tiny helper in `src/data/locationNotices.ts`:
- `SHUT_DOWN_SLUGS = new Set(["chiang-mai"])`
- `isEffectivelyComingSoon(location)` → returns `true` if `location.coming_soon` OR `SHUT_DOWN_SLUGS.has(location.slug)`

Then replace every `location.coming_soon` check (and the closing-notice branch for Chiang Mai) with this helper.

## Files to edit
1. **`src/data/locationNotices.ts`** — add `SHUT_DOWN_SLUGS` + `isEffectivelyComingSoon()` helper. Remove the `chiang-mai` entry from `LOCATION_NOTICES` so the orange "Closing Soon" badge/banner no longer renders.
2. **`src/components/Locations.tsx`** — use helper in `LocationCard` for badge + CTA (Coming Soon button, disabled).
3. **`src/components/LocationsMap.tsx`** — use helper for the Coming Soon pill (drop the closing-badge branch for Chiang Mai automatically via step 1).
4. **`src/components/BookingSection.tsx`** — replace `!l.coming_soon` filters (lines 142, 180, 183) with `!isEffectivelyComingSoon(l)` so Chiang Mai is removed from booking location pickers.
5. **`src/pages/ServiceSkydivingTour.tsx`** — update the filter (line 38) so Chiang Mai is removed from the tour location picker.
6. **`src/pages/LocationDetail.tsx`** — replace the closing banner block with a Coming Soon banner when `isEffectivelyComingSoon(location)`; hide booking/services CTAs (line 344 area).
7. **`src/pages/LocationCompare.tsx`** — use helper in the active filter (line 13).

## Out of scope
- No DB migration (admin can later flip `coming_soon` in Supabase to remove the override).
- No copy changes beyond swapping "Closing Soon" → existing "Coming Soon" translations already in `LanguageContext`.
- No changes to admin panels, booking funnel logic, payments, or other locations.

## Verification
Load homepage on mobile (430px): Chiang Mai card shows Coming Soon badge + disabled button. Open booking section: Chiang Mai not listed. Visit `/location/chiang-mai`: Coming Soon banner shown, booking CTA hidden.