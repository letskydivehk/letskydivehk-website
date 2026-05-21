## Skydiving Tour — fix routing, translations, and add dedicated page

### Problems found

1. **Wrong "View Details" route**: In `src/components/Services.tsx` the link is `service.type === 'tandem' ? '/services/tandem-skydive' : '/services/a-licence'`. Anything that isn't `tandem` (including the new `package`/Skydiving Tour card) falls through to the A‑Licence page.
2. **Missing tour translations**: `getServiceInfo()` in `Services.tsx` only maps `tandem` / `aff` / `group`. The `package` card renders with empty title/subtitle/description. There are no `services.tour.*` keys in `LanguageContext.tsx` for any of the 3 languages.
3. **No dedicated tour page** exists yet; itinerary content currently lives only inside the pricing card.

### Changes

**1. New page `src/pages/ServiceSkydivingTour.tsx`** (modeled on `ServiceTandem.tsx`)

Sections:
- `PageNavbar` + `SEO` (title + meta in 3 languages)
- Hero: title "Skydiving Tour / 跳傘團", subtitle, hero image, "Book Now" CTA scrolling to `#booking`
- Intro: what a tour package includes (skydive + accommodation + transport + sightseeing), 18+/100kg eligibility chip
- **"Featured Itineraries"** section — at least 2 sample itineraries hard-coded as content (admin can later replace via the Tours admin panel by editing `location_services.itinerary`). Each itinerary rendered as day-by-day cards (location / accommodation / transportation / meals / activities) with localized labels reusing existing `tour.*` keys:
  - **Pattaya 3D2N** — Day 1 arrival + Pattaya beach, Day 2 tandem skydive at Thai Sky Adventures + sunset on Walking Street, Day 3 brunch + departure.
  - **Chiang Mai 4D3N** — Day 1 arrival + Old City, Day 2 tandem skydive at Chiang Mai Skydiving, Day 3 Doi Suthep + night market, Day 4 cooking class + departure.
- Pricing teaser: "From $5,700 · $2,000 deposit"
- `ServiceCTA` reused at bottom
- `Footer`

Content is localized via a small in-file `itineraries` array keyed by `language` (mirrors how other service pages do it).

**2. Route registration** in `src/App.tsx`
- Lazy import `ServiceSkydivingTour`
- Add `<Route path="/services/skydiving-tour" element={<ServiceSkydivingTour />} />`

**3. Fix `src/components/Services.tsx`**
- Extend `iconMap` with `package: MapPin` (or `Compass`).
- Extend `AggregatedService['type']` union to include `'package'`.
- Add `package` entry to `getServiceInfo()` using new translation keys `services.tour.title|subtitle|description`.
- Update the View Details `Link` to a small map:
  ```ts
  const detailRoutes = { tandem: '/services/tandem-skydive', aff: '/services/a-licence', package: '/services/skydiving-tour' }
  ```
  Render the link for any type present in `detailRoutes` (so the tour card gets its own correct link, group stays without one).
- Sort order: add `package: 4` after group.

**4. Translations in `src/contexts/LanguageContext.tsx`** (en / zh-TW / zh-CN blocks)

Add:
- `services.tour.title` — "Skydiving Tour" / "跳傘團" / "跳伞团"
- `services.tour.subtitle` — "Multi-day jump + travel package" / "多日跳傘旅遊套票" / "多日跳伞旅游套票"
- `services.tour.description` — "An all-in-one trip: tandem skydive, hotel, transfers and local sightseeing — just show up." / 中文對應翻譯 / 中文对应翻译
- `tour.featuredItineraries` — "Featured Itineraries" / "精選行程" / "精选行程"
- `tour.bookTour` — "Book this Tour" / "預訂跳傘團" / "预订跳伞团"
- Per-itinerary content strings (title, day titles, location/accommodation/transportation/meals/activities text) — kept as plain content arrays in the page file rather than i18n keys to keep `LanguageContext.tsx` small; the page picks the array by current `language`.

### Files touched

- **New**: `src/pages/ServiceSkydivingTour.tsx`
- **Edited**: `src/App.tsx`, `src/components/Services.tsx`, `src/contexts/LanguageContext.tsx`

### Out of scope

- No DB changes (itinerary editor + `location_services.itinerary` already exist for per‑location detail).
- No change to `ServicePricing` card itinerary collapsible (stays as-is).
- Hero image: reuse an existing Unsplash URL already used elsewhere in the project rather than generating a new asset.
