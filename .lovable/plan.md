# Make Zhuhai One-Day Skydive the Main Tour & Promote It

## Why the site still shows "珠海 2 日 1 夜跳傘團"

The earlier itinerary update was written onto the two **tandem** services for Zhuhai, not onto the **Tour** service. The only row of type `Tour` for Zhuhai is still `Zhuhai 2D1N Tour` (`a5c3a019-…`), itinerary = HK→Zhuhai+hotel / City Tour & Return. That's what `/services/skydiving-tour` renders.

## What I'll change

### 1. Convert the Zhuhai Tour record to the one-day trip (data only)
Update `location_services` row `a5c3a019-f09e-4990-b586-7ea3ef9ddbc5`:
- `service_name` → `Zhuhai One-Day Skydive Tour`
- `is_popular` → `true`
- `price_display` → keep current ($6,799起) unless you give a new price
- `deposit_amount` → keep `2000` (or change — see open question)
- `includes` → HK↔Zhuhai golden bus + dropzone transfer, tandem skydive, certificate, short video, lunch
- `itinerary` → single-day segments matching your schedule:
  - **Morning** — 09:00 集合 @ HK-Zhuhai-Macao Bridge HK Port · 金巴 (40m) · 過關 (20m) · 10:10 包車往跳傘基地 (1h15m)
  - **Afternoon** — 11:25 抵達基地、報到、培訓 @ Weland Zhuhai Dropzone · 跳傘活動 · 13:45 領證書+短片 · 14:30 午餐 · 16:30 乘車返珠海口岸
  - **Evening** — 17:40 金巴返港 · 18:30 抵達香港口岸

All `tour.item.*` / `tour.dayTitle.*` translation keys for these strings already exist in `LanguageContext.tsx` from the previous round, so no i18n work needed beyond a new `tour.name.Zhuhai One-Day Skydive Tour` key (EN / 繁 / 簡).

### 2. Promotion & easier access (frontend)

**a. "Most Popular" / "1-Day Express" badge on the tour card**
`ServiceSkydivingTour.tsx → TourCard`: when `tour.is_popular`, render a ribbon badge top-left over the hero image (`MOST POPULAR · 1-DAY EXPRESS`, accent-orange, animated pulse).

**b. Auto-select Zhuhai on the tour landing page**
In `ServiceSkydivingTour.tsx`, change the default `selectedLocId` logic to prefer the location that has a `is_popular` Tour, falling back to first. Lands users straight on the promoted itinerary.

**c. Highlight banner above the location pills**
Compact gradient banner: "🪂 香港出發 · 一日往返 · 即日完成跳傘" with a "View itinerary" anchor that scrolls to the Zhuhai card.

**d. Homepage exposure**
- `Services.tsx`: add a small "NEW · 1-Day Zhuhai Tour" chip on the Tour service card linking to `/services/skydiving-tour#tour-itineraries`.
- `HomepagePromotionBanner` (existing): add an optional copy variant pointing at the one-day tour (single line, dismissible — uses existing styling per memory `mem://style/homepage-promotion-banner`).

**e. Dedicated detail page already exists**
`/tour/zhuhai/:id` (`TourDetail.tsx`) is already routed and `TOUR_DETAIL_SLUGS` already includes `zhuhai`, so the "View Details" button on the tour card will open the full one-day itinerary page automatically after the data update — no routing changes.

**f. Footer Quick Links**
Add "珠海一日跳傘團" under Services in `Footer.tsx` linking to `/services/skydiving-tour#tour-itineraries`.

### 3. Translations to add
- `tour.name.Zhuhai One-Day Skydive Tour` → `珠海一日跳傘團` / `珠海一日跳伞团` / `Zhuhai One-Day Skydive Tour`
- `tour.badge.popular` → `最受歡迎` / `最受欢迎` / `Most Popular`
- `tour.badge.oneDay` → `一日往返` / `一日往返` / `1-Day Express`
- `tour.promoBanner.oneDay` → `🪂 香港出發 · 一日往返 · 即日完成跳傘體驗`
- `services.tour.newChip` → `新推出` / `新推出` / `NEW`

## Files touched
- Supabase `location_services` (data update via insert tool — not a migration)
- `src/contexts/LanguageContext.tsx` (new keys)
- `src/pages/ServiceSkydivingTour.tsx` (badge, auto-select, banner)
- `src/components/Services.tsx` (NEW chip on Tour card)
- `src/components/Footer.tsx` (quick link)
- (optional) homepage promo banner copy variant

## Out of scope
- Pricing/deposit change (kept as-is unless you tell me otherwise)
- Other locations' tours
- Creating a separate 2D1N variant — the existing row is converted in-place. If you want to **keep** 2D1N as a secondary option instead of replacing it, say so and I'll add a new row instead.

## Open questions (optional — I have safe defaults)
1. Keep $6,799起 / $2,000 deposit, or new numbers?
2. Replace the 2D1N entry (default) **or** keep both and just mark the 1-day as primary?
