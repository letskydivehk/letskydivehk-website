## Goal
Merge the magnet souvenirs into a single section. The "Skydiving Edition" designs are demoted to **examples** of what magnets can look like (shown inside the one magnet card), not a separate product. Replace the main magnet hero image with a newly generated **square fridge-mosaic** photo.

## Changes

### 1. Generate new hero image
- New asset: `src/assets/magnet-fridge-mosaic.jpg` (square, 1024×1024).
- Prompt: a stainless-steel fridge door covered with multiple square 5×5 cm skydiving photo magnets arranged in a tidy grid — tandem freefall shots, canopy shots, group jumps, beach landings. Warm natural light, slight perspective, realistic.
- Used as the single magnet product image (replaces current `magnet-sample.jpeg`-style hero in the magnet card).

### 2. `src/pages/Souvenirs.tsx` — one magnet section
- Remove the standalone "Skydiving Edition Magnets" card (`EditionMagnetCard`) and its separate WhatsApp flow.
- In the remaining magnet card:
  - Show the new square mosaic image at the top.
  - Below the description, add an **"Examples / 範例"** strip: the 4 active variants from `souvenir_variants` rendered as small square thumbnails in a row (2×2 on mobile, 1×4 on desktop) with the variant name underneath. Purely illustrative — no select state, no per-variant quantity.
  - Keep the existing custom-photo upload, quantity stepper, bulk pricing table, and WhatsApp order button exactly as today.
- WhatsApp message: revert to the single custom-magnet template (`souvenirs.magnetWhatsappMsg*` with `{qty}`); drop the edition-specific `{lines}` template usage on the customer side.

### 3. `src/contexts/LanguageContext.tsx`
- Add `souvenirs.examplesTitle` ("Examples" / "範例" / "范例") and `souvenirs.examplesHint` ("These are sample designs — upload any photo you like" / etc.).
- Keep `souvenirs.editionWhatsappMsg*` keys unused for now (harmless) — no rename needed.

### 4. Admin (`AdminSouvenirsPanel.tsx`)
- Keep the variant editor as-is so you can still upload/manage the 4 example designs that appear in the new "Examples" strip.

## Out of scope
- No DB migration (the `souvenir_variants` table stays; it now powers the examples strip instead of a separate product).
- No changes to t-shirts or other souvenirs.
- No pricing logic changes.

## Files touched
- `src/assets/magnet-fridge-mosaic.jpg` (new, generated)
- `src/pages/Souvenirs.tsx`
- `src/contexts/LanguageContext.tsx`
