# Add Tourism-Style Destination Details to Location Pages

Enrich each `LocationDetail` page so it feels like a mini travel guide — not just a dropzone listing. Visitors planning a skydive trip will see weather, where to stay, what to do nearby, and how to get there.

## Reference inspiration
- **Booking.com / Airbnb destination pages** — "Things to do nearby", curated stays, neighborhood blurbs
- **Lonely Planet / TripAdvisor** — climate chart, best time to visit, top attractions cards
- **Skydive Dubai / Skydive Hawaii** — they pair their dropzone with hotel + attraction recommendations

## New sections on `/location/:slug`

1. **Best Time to Jump & Weather**
   - Live current weather (temp, condition, wind) via Open-Meteo (free, no key)
   - "Best months" badge row (e.g. Nov–Feb green, Jun–Sep amber for monsoon)
   - Short climate summary

2. **Where to Stay** — 3–4 curated accommodation cards (name, type: Hotel/Resort/Hostel, distance from dropzone, price tier $/$$/$$$, booking link, image)

3. **Things to Do Nearby** — 4–6 attraction cards (name, category icon: Beach / Temple / Food / Nature, short description, distance, image)

4. **Local Food & Must-Try** — 3–4 food highlights (dish name, where to try it, image)

5. **Travel Tips** — Currency, language, visa note, plug type, tipping — compact icon grid

6. **Getting There (expanded)** — keep current Plane/Car cards, add "Recommended route from Hong Kong" text block

All sections only render if data exists (graceful degradation). Fully localized (EN / zh-TW / zh-CN) via existing `translateData` pattern.

## Technical implementation

### Database (new migration)
Add columns to `locations` table:
- `best_months` (int[]) — e.g. `{11,12,1,2}`
- `climate_summary` (text)
- `weather_lat` (numeric), `weather_lon` (numeric) — for Open-Meteo lookup
- `travel_tips` (jsonb) — `{currency, language, visa, plug, tipping}`
- `getting_there_from_hk` (text)

New tables:
- `location_accommodations` (id, location_id, name, type, distance, price_tier, booking_url, image_url, description, display_order)
- `location_attractions` (id, location_id, name, category, distance, image_url, description, display_order)
- `location_food` (id, location_id, dish_name, where_to_try, image_url, description, display_order)

All with RLS: public SELECT for `is_active` parent location; admin INSERT/UPDATE/DELETE via `has_role(auth.uid(),'admin')`.

### Frontend
- New hook `useLocationTourism.ts` — fetches accommodations / attractions / food in parallel via React Query
- New hook `useWeather.ts` — calls `https://api.open-meteo.com/v1/forecast?latitude=X&longitude=Y&current=temperature_2m,weather_code,wind_speed_10m` (no key, no edge function needed)
- New components in `src/components/location/`:
  - `LocationWeather.tsx` — current temp + best-months strip
  - `LocationAccommodations.tsx` — card grid
  - `LocationAttractions.tsx` — card grid with category icons
  - `LocationFood.tsx` — card grid
  - `LocationTravelTips.tsx` — icon grid
- Update `LocationDetail.tsx` to compose these new sections between existing "Distance & Transportation" and "Photo Gallery"

### Admin
- Extend `AdminLocationsPanel` (or create one if missing — I'll check) with tabs to manage accommodations / attractions / food per location, plus the new climate/tips fields

### Seed data
Seed Pattaya, Chiang Mai, Huizhou, Hainan with realistic placeholder content (3 hotels, 4 attractions, 3 dishes each) and Unsplash images so the pages look populated immediately. Luoding & Zhuhai stay sparse (coming soon).

### Localization
Add new translation keys to `LanguageContext.tsx` for all section headers (EN / zh-TW / zh-CN), e.g.:
- `locationDetail.weather`, `locationDetail.bestMonths`, `locationDetail.stay`, `locationDetail.thingsToDo`, `locationDetail.localFood`, `locationDetail.travelTips`, `locationDetail.gettingThereFromHK`

Content fields (hotel names, dish names, descriptions) translated via existing `translateData(key, fallback)` mechanism.

## Files to create / modify

| Action | File |
|---|---|
| Create | `supabase/migrations/<ts>_location_tourism.sql` |
| Create | `src/hooks/useLocationTourism.ts` |
| Create | `src/hooks/useWeather.ts` |
| Create | `src/components/location/LocationWeather.tsx` |
| Create | `src/components/location/LocationAccommodations.tsx` |
| Create | `src/components/location/LocationAttractions.tsx` |
| Create | `src/components/location/LocationFood.tsx` |
| Create | `src/components/location/LocationTravelTips.tsx` |
| Modify | `src/pages/LocationDetail.tsx` — wire in new sections |
| Modify | `src/contexts/LanguageContext.tsx` — new translation keys |
| Modify | Admin locations panel — manage new content (will locate during build) |
| Seed (insert) | Tourism data for Pattaya, Chiang Mai, Huizhou, Hainan |

## Out of scope (can be added later)
- User-submitted reviews of hotels/attractions
- Real-time hotel pricing/availability (would require Booking.com affiliate API)
- Multi-day itinerary builder
