# Tours admin + pricing + includes revamp

## 1. Data model — add Add-ons
Add a new `add_ons` JSONB column on `location_services` (default `[]`). Shape:
```
[{ "name": "Round-trip flights", "price": null }, { "name": "Travel insurance", "price": null }]
```
`price` optional (string) so admin can leave blank or enter "$1,200".

## 2. Seed/update existing Tour rows
For every Tour row, set:
- **Includes** (replaces current list):
  - Local transportation (incl. airport / dropzone transfer)
  - Hotel accommodation
  - Meals
  - Tandem skydive
  - HD video & photos
  - Cantonese/English-speaking guide
- **Add-ons**: Round-trip flights, Travel insurance
- **Pricing** (replaces `price_display`):
  - Huizhou 2D1N → `$5,899起`
  - All others (Pattaya 3D2N/4D3N, Chiang Mai 3D2N/4D3N, Hainan 3D2N/4D3N, Zhuhai 2D1N) → `$6,799起`

## 3. Admin panel (`AdminToursPanel.tsx`) — better UI
Reorganize collapsed editor into clean tabbed sections inside each tour card:
```
[ Overview ] [ Pricing ] [ Included & Add-ons ] [ Photos ] [ Itinerary ]
```
- **Overview**: service name, short description.
- **Pricing**: price display, deposit (HKD), with helper hint "use `$X,XXX起` format".
- **Included & Add-ons**: two side-by-side editable lists with add / remove / drag-reorder rows (reuse the dnd-kit sortable row used in itinerary). Add-ons rows have an optional price input.
- **Photos**: existing URL list, but rendered as a thumbnail grid with per-thumb remove + add-URL field (no more raw textarea).
- **Itinerary**: keep the current Morning/Afternoon/Evening timeline editor (already good), just move it under its own tab.
Sticky Save bar at the bottom of the open card with unsaved-change indicator.

## 4. Frontend — Service Skydiving Tour page
- Rename the "What's Included" section to show two columns: **Included in package** and **Optional add-ons** (uses new `add_ons` data, hidden if empty).
- Pricing section pulls from updated `price_display` directly — no code change needed besides translations.
- Add translation keys for `tour.included`, `tour.addOns`, `tour.addOnsHint` in `LanguageContext.tsx` (en / zh-TW / zh-CN).

## Technical
- Migration: `ALTER TABLE location_services ADD COLUMN add_ons jsonb NOT NULL DEFAULT '[]';`
- Data update via insert tool for the 8 Tour rows above.
- Update `LocationService` type in `useLocationServices.ts` with `add_ons: { name: string; price?: string | null }[]`.
- Files touched: `useLocationServices.ts`, `AdminToursPanel.tsx`, `ServiceSkydivingTour.tsx`, `LanguageContext.tsx`, plus migration + data update.
