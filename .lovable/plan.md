## Goal

1. On every Tandem service price, display the original "marked" price (current × 1.25) crossed out next to the current price, with a "-20% OFF" badge.
2. Introduce a new service type **Package Tour** for every location, includes Transportation / Meal / Accommodation / Jump ticket / Jump video; add-ons (Insurance, Flight ticket) shown as a small text note. Booking = inquiry only (Contact / WhatsApp).

---

## 1. Discount display on Tandem pricing

**Logic (UI only, no DB change):**
- Parse the numeric value from `price_display` (e.g. `$3399` → `3399`).
- If the row's `service_type === 'tandem'` and parsing succeeds, render:
  - Struck-through `$<original>` where `original = Math.round(current × 1.25)`
  - Current price in accent-orange
  - Small `-20%` badge
- If parsing fails (e.g. "Custom Quote"), render unchanged.

**Files to edit:**
- `src/components/ServicePricing.tsx` — wrap the existing `service.price_display` span with a small `<TandemPriceDisplay>` helper handling the strike-through + badge.
- `src/components/BookingSection.tsx` (and any other place tandem prices are shown) — same helper.
- Localize "OFF" label via `LanguageContext` (`pricing.off` → "85折" / "OFF" / "85折").

Format example (Trad Chinese): `$4249` (struck) · **$3399** · `8折`
Format example (English): ~~$4249~~ **$3399** `-20%`

---

## 2. New "Package Tour" service per location

**Schema change (migration):**

Add an enum-style value `'package'` to the allowed `service_type` set. Currently `service_type` is `text` with default `'tandem'`, no CHECK constraint visible — so a migration is only needed if we want to enforce values. **Plan: no schema migration needed.** Simply insert new rows via Supabase with `service_type = 'package'`.

**Data insertion (you'll fill prices in Supabase later):**

Insert one row per existing location with:
- `service_name`: `Package Tour`
- `service_type`: `package`
- `price_display`: `Contact for pricing` (placeholder until you update)
- `includes`: `['Transportation','Meal','Accommodation','Jump ticket','Jump videos']`
- `display_order`: place after Tandem rows (e.g. 5)

**Translations** (Trad Chinese / Simplified Chinese), added to `LanguageContext.tsx` under `service.*` and `include.*`:
- `service.Package Tour` → `套票行程` / `套票行程`
- `include.Transportation` → `來回交通` / `来回交通`
- `include.Meal` → `膳食` / `膳食`
- `include.Accommodation` → `住宿` / `住宿`
- `include.Jump ticket` → `跳傘門票` / `跳伞门票`
- `include.Jump videos` → `跳傘影片` / `跳伞影片`

**UI rendering — `src/components/ServicePricing.tsx`:**
- Already iterates all services for a location, so the new Package row appears automatically.
- For `service_type === 'package'`: replace the "Book Now" button with a smaller "Enquire" CTA that scrolls to `#contact` (no booking funnel).
- Below the `includes` list, render a muted line:
  - English: `+ Add-ons: Insurance, Flight ticket`
  - Trad Chinese: `加購選項：保險、機票`
  - Simplified Chinese: `加购选项：保险、机票`
  - Add `include.addons.insurance` / `include.addons.flight` translation keys.

**Booking funnel filter — `src/components/BookingSection.tsx`:**
- Silently filter out `service_type === 'package'` from the service selection step (same pattern used for A-Licence). Package Tour is inquiry-only.

---

## 3. Verification

- Visit `/` → Locations → click a location → Service Pricing section shows:
  - Tandem rows with strike-through marked price + -20% badge
  - New "Package Tour" card with the 5 includes, the add-ons note, and an Enquire CTA
- Open Booking section → Package Tour does NOT appear in the service dropdown
- Toggle language switcher → all labels render in Trad Chinese / English / Simplified Chinese

---

## Technical notes

- No new DB column. Discount math is pure UI on the existing `price_display` string. If a tandem `price_display` is non-numeric, the strike-through is skipped (graceful fallback).
- A small migration call will INSERT one `location_services` row per location with placeholder `price_display='Contact for pricing'`. You'll edit each row's price in Supabase admin afterward.
- Hook `useAllLocationServices` and per-location filtering remain unchanged.
