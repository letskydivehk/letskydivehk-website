## Goal

Rewrite the itineraries for the 4 tour packages (Hainan 3D2N, Hainan 4D3N, Pattaya 3D2N, Pattaya 4D3N) stored in `location_services.itinerary`. Each tour gets at least one free day, EGL-style sightseeing flavor, and no specific hotel names (just generic descriptions like "hotel check-in").

## Scope

- Data-only update via `supabase--insert` on the 4 rows in `location_services`.
- No code changes — `TourItinerary.tsx` already renders this JSON structure (`day → segments[morning/afternoon/evening] → items[title, location?]`).
- No translations needed; itinerary strings render as stored (matching current English-style entries already in DB).

## New Itineraries

### Hainan 3D2N (Sanya)

- **Day 1 — Arrival in Sanya**
  - Morning: Flight HKG → Sanya, private transfer
  - Afternoon: Check-in, Dadonghai Beach stroll
  - Evening: Welcome Hainanese seafood dinner
- **Day 2 — Tandem Skydive Day**
  - Morning: Shuttle to Weland dropzone, safety briefing
  - Afternoon: Tandem skydive + HD video & photos
  - Evening: Celebration dinner at Sanya Bay
- **Day 3 — Free Day & Departure**
  - Morning: Free time (optional: Yalong Bay, Luhuitou Park, duty-free shopping)
  - Afternoon: Private transfer to Sanya airport
  - Evening: Flight Sanya → HKG

### Hainan 4D3N (Sanya)

- **Day 1 — Arrival**
  - Morning: Flight HKG → Sanya, private transfer
  - Afternoon: Coconut-lined Sanya Bay sunset walk
  - Evening: Welcome seafood dinner
- **Day 2 — Tandem Skydive Day**
  - Morning: Shuttle to Weland dropzone, briefing & gear-up
  - Afternoon: Tandem skydive + HD video & photos
  - Evening: Celebration dinner
- **Day 3 — Free Day in Sanya**
  - Morning: Free — suggested Wuzhizhou Island or Yalong Bay
  - Afternoon: Free — spa, shopping, or beach time
  - Evening: Free dinner at own pace
- **Day 4 — Departure**
  - Morning: Brunch, last-minute shopping
  - Afternoon: Private transfer to Sanya airport
  - Evening: Flight Sanya → HKG

### Pattaya 3D2N

- **Day 1 — Arrival in Pattaya**
  - Morning: Flight HKG → BKK, private transfer to Pattaya
  - Afternoon: Beachfront check-in, Pattaya Beach sunset
  - Evening: Welcome Thai seafood dinner, Walking Street stroll
- **Day 2 — Tandem Skydive Day**
  - Morning: Shuttle to Thai Sky Adventures dropzone, briefing
  - Afternoon: Tandem skydive from 13,000 ft + HD video & photos
  - Evening: Celebration dinner
- **Day 3 — Free Day & Departure**
  - Morning: Free time (optional: Koh Larn, Sanctuary of Truth, Terminal 21)
  - Afternoon: Private transfer BKK
  - Evening: Flight BKK → HKG

### Pattaya 4D3N

- **Day 1 — Arrival**
  - Morning: Flight HKG → BKK, private transfer to Pattaya
  - Afternoon: Beachfront check-in
  - Evening: Welcome Thai dinner
- **Day 2 — Tandem Skydive Day**
  - Morning: Shuttle to Thai Sky Adventures dropzone, briefing
  - Afternoon: Tandem skydive + HD video & photos
  - Evening: Celebration dinner
- **Day 3 — Free Day in Pattaya**
  - Morning: Free — suggested Koh Larn snorkeling or Nong Nooch Garden
  - Afternoon: Free — Thai massage, beach time, or shopping
  - Evening: Free dinner at own pace
- **Day 4 — Departure**
  - Morning: Brunch, souvenir shopping
  - Afternoon: Private transfer BKK
  - Evening: Flight BKK → HKG

## Technical Notes

- One `UPDATE location_services SET itinerary = '<json>'::jsonb WHERE id = '<uuid>'` per tour (4 total), wrapped in a single insert-tool call.
- IDs:
  - Hainan 3D2N `b7b4784f-a5d2-46ac-afc2-9dc9ce2170de`
  - Hainan 4D3N `3ad0903a-b4a5-43f4-b072-84f3e9df52b3`
  - Pattaya 3D2N `14f0dbbb-f186-46d7-b742-94f92e8da94f`
  - Pattaya 4D3N `d77f6091-45d4-46d2-9c9c-aaeb2894c10e`
- JSON shape preserved: `[{day, title, segments:[{period, items:[{title, location?}]}]}]`.
- Hotel names dropped; transfers/dropzones retained as `location` (useful map context, not lodging).

## Out of Scope

- Pricing, deposit, includes, photos.
- Zhuhai one-day tour (recently redesigned).
- Frontend rendering tweaks.