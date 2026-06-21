# Improve Hainan & Pattaya Tour Itineraries (Travel-Agency Style)

Rewrite the four tour itineraries in `location_services` using attractions and pacing from HK travel agency packages (EGL, Wing On, Goldjoy, WWPKG). Keeps the existing JSON shape — no code changes. Skydive stays on Day 2 morning. Each tour has one fully free day. No hotel names.

## What's new vs current itineraries
- Adds **agency-favorite landmarks** instead of generic placeholders
- Adds a curated **evening segment** to each day (night markets, shows, viewpoints)
- Free day reframed as **"Free & Easy"** with 3–4 suggested attractions (mirrors EGL/Wing On format)
- Skydive day pairs jump with a complementary nearby attraction so the afternoon isn't empty

---

## Hainan 3D2N (`b7b4784f-…`)
- **Day 1 — Arrival & Sanya Bay Sunset**
  - Morning: Flight HKG → Sanya (SYX) · Private transfer to hotel
  - Afternoon: Coconut Dream Corridor stroll · Dadonghai Beach
  - Evening: First Market (第一市場) seafood dinner · Luhuitou Park night view
- **Day 2 — Tandem Skydive & Cultural Icons**
  - Morning: Tandem skydive over Haitang Bay coastline
  - Afternoon: Nanshan Cultural Zone (108m Guanyin) · Tianya Haijiao
  - Evening: Optional *Sanya Romance Show* (千古情) · seaside BBQ
- **Day 3 — Free & Easy + Departure**
  - Morning: Free time — choose from Haitang Bay Duty-Free Mall, Yalong Bay Tropical Forest Park (glass bridge), or Atlantis Sanya day-pass
  - Afternoon: Hainan coffee/snack shopping · transfer to Sanya Phoenix Airport
  - Evening: Flight SYX → HKG

## Hainan 4D3N (`3ad0903a-…`)
- **Day 1 — Arrival & Phoenix Island Lights**
  - Morning: Flight HKG → Sanya · Private transfer
  - Afternoon: Check-in · Yalong Bay beach walk
  - Evening: Phoenix Island light show · welcome seafood dinner
- **Day 2 — Tandem Skydive & Island Day**
  - Morning: Tandem skydive over Haitang Bay
  - Afternoon: Wuzhizhou Island (the "Maldives of China") — snorkeling / water sports
  - Evening: Dadonghai night stroll · local Hainanese dinner
- **Day 3 — Free & Easy in Sanya**
  - Morning: Free — Atlantis Aquaventure Waterpark *or* Yanoda Rainforest *or* Binglang Valley (Li & Miao village)
  - Afternoon: Haitang Bay Duty-Free Mall shopping · spa
  - Evening: Free dinner at hotel beach or West Island sunset
- **Day 4 — Final Views & Departure**
  - Morning: Nanshan Temple *or* Luhuitou Park 360° viewpoint
  - Afternoon: Last-minute Hainan coffee shopping · airport transfer
  - Evening: Flight SYX → HKG

## Pattaya 3D2N (`14f0dbbb-…`)
- **Day 1 — Arrival, Sanctuary & Walking Street**
  - Morning: Flight HKG → BKK · Private transfer to Pattaya (~1.5h)
  - Afternoon: Sanctuary of Truth (wood-carved seaside temple)
  - Evening: Terminal 21 Pattaya dinner · Walking Street
- **Day 2 — Tandem Skydive & Cultural Pattaya**
  - Morning: Tandem skydive over Pattaya coast
  - Afternoon: Nong Nooch Tropical Garden (Dinosaur Valley + cultural show)
  - Evening: Tiffany / Alcazar Cabaret Show · Thai seafood dinner
- **Day 3 — Free & Easy + Departure**
  - Morning: Free — Big Buddha (Wat Phra Yai) viewpoint, Pattaya Floating Market, or Art in Paradise 3D
  - Afternoon: Transfer to Bangkok · Erawan Shrine / Central World quick stop
  - Evening: Flight BKK → HKG

## Pattaya 4D3N (`d77f6091-…`)
- **Day 1 — Arrival & Alcazar Night**
  - Morning: Flight HKG → BKK · Private transfer to Pattaya
  - Afternoon: Art in Paradise 3D museum · Pattaya Beach
  - Evening: Alcazar Cabaret Show · Walking Street
- **Day 2 — Tandem Skydive & Coral Island**
  - Morning: Tandem skydive
  - Afternoon: Koh Larn (Coral Island) — snorkeling / parasailing / jet ski
  - Evening: Pattaya Floating Market dinner & street food
- **Day 3 — Free & Easy in Pattaya**
  - Morning: Free — Nong Nooch Garden, Khao Kheow Open Zoo, or Frost Magical Ice
  - Afternoon: Thai massage · beach time · Terminal 21 Pattaya
  - Evening: Free seafood dinner (Mimosa / Lan Po seafood market)
- **Day 4 — Bangkok Shopping & Departure**
  - Morning: Transfer to Bangkok · Siam / IconSiam shopping
  - Afternoon: Asiatique or Jodd Fairs · Big C souvenir run
  - Evening: Flight BKK → HKG

---

## Technical notes
- Single tool call: `supabase--insert` (UPDATE) on 4 rows of `location_services.itinerary` (JSONB column)
- JSON shape preserved: `[{day, title, segments:[{period, items:[{title, location?}]}]}]`
- `location` field kept on transfer / skydive / specific venue items so the existing `TourItinerary.tsx` map pins still work
- No frontend code changes — `TourItinerary.tsx` already renders day pills + expandable segments
- No translation/i18n keys added (free-text titles, same as today)
- Pricing, deposits, includes, photos untouched
- Zhuhai one-day tour untouched
