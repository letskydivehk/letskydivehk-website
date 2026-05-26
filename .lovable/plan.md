## Goal
Announce that Chiang Mai dropzone stops operating from **1 July 2026**, and that **June 2026 is the last chance to jump there**.

## Where to show the announcement

1. **Locations grid card (Chiang Mai)** — `src/components/Locations.tsx` / via data
   - Add a prominent "Closing Soon" badge (amber/red) replacing the area where "Coming Soon" sits.
   - Add a short banner line on the card: "Last jumps: June 2026".

2. **Chiang Mai Location Detail page** — `src/pages/LocationDetail.tsx`
   - Add a highlighted alert banner at the top: "Operations end 1 July 2026 — book your jump before 30 June 2026."

3. **Locations Map info panel** — `src/components/LocationsMap.tsx`
   - When Chiang Mai is selected, show the same closing notice chip next to the feature tags.

4. **Booking flow** — soft notice when Chiang Mai is selected for a date ≥ 1 July 2026 (disable / warn). Keep simple: filter out Chiang Mai from selectable locations if preferred date is on/after 2026-07-01.

5. **Homepage promo strip (optional)** — small dismissible banner above hero or under navbar for ~1 month leading up to closure. Skipping unless you want it.

## Data / flag

Add a soft flag rather than a schema migration:
- Use existing `coming_soon` style pattern but introduce a derived `closingNotice` constant in a single config file `src/data/locationNotices.ts`:
  ```ts
  export const LOCATION_NOTICES = {
    'chiang-mai': {
      type: 'closing',
      lastOperatingDate: '2026-06-30',
      message: { en: '...', 'zh-TW': '...', 'zh-CN': '...' }
    }
  }
  ```
- Components import and check by slug. No DB change needed — fastest, fully reversible.

## Translations (add to `src/contexts/LanguageContext.tsx`)

- `location.closing.badge` → "Closing Soon" / 即將結束營運 / 即将结束营运
- `location.closing.lastJumps` → "Last jumps: June 2026" / 最後跳傘月份：2026 年 6 月 / 最后跳伞月份：2026 年 6 月
- `location.closing.banner` → "Chiang Mai operations end 1 July 2026. Book before 30 June to secure your jump." (+ zh-TW / zh-CN)

## Files to touch

- `src/data/locationNotices.ts` (new)
- `src/components/Locations.tsx` — badge + last-jump line on Chiang Mai card
- `src/components/LocationsMap.tsx` — chip in info panel
- `src/pages/LocationDetail.tsx` — top alert banner
- `src/components/BookingSection.tsx` (or wherever location select lives) — guard for dates ≥ 2026-07-01
- `src/contexts/LanguageContext.tsx` — translation keys

## Questions before I build

1. Confirm the **final operating date**: 30 June 2026 (last jump) → closed from 1 July 2026?
2. Do you want the **homepage banner** (dismissible strip) too, or only on the location card / detail page?
3. Should the booking calendar **block Chiang Mai for dates ≥ 1 July 2026**, or just show a warning?
