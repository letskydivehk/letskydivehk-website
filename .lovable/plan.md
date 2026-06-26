## Goal
Add a second souvenir — **Custom Magnet** (collaboration with Bingomagnetic) — to the shop, with bulk-discount display, photo-upload customisation, and admin editability. No pack-option selector on the storefront (single product card).

## Pricing (base $40/each, bulk discount)
| Qty | Original | Sale | Discount |
|---|---|---|---|
| 1 | $40 | $40 | — |
| 4 | $160 | $100 | ~37% off |
| 8 | $320 | $192 | 40% off |
| 24 | $960 | $552 | ~42% off |

Single-unit price ($40) is the product's headline price. Bulk tiers render as a small comparison table inside the product card, each row showing original (strike-through) → sale → "Save $X".

## Schema changes
Migration on `public.souvenirs`:
- Add `original_price numeric` (nullable) — for future products needing a strike-through on the headline price.
- Add `bulk_pricing jsonb default '[]'` — array of `{ qty, original_price, sale_price }` rows powering the bulk-tier table.
- Add `customisation_required boolean default false` — gates the photo-upload step on the storefront.
- Add `vendor_note_en/zh_tw/zh_cn text` (nullable) — for the "In collaboration with Bingomagnetic" line.

Create storage bucket `souvenir-uploads` (private). RLS on `storage.objects`: anyone can `INSERT` into this bucket (anonymous orders allowed); only the uploader / admins can `SELECT`/`DELETE`.

## Data seed (via insert tool, after migration approves)
One new row in `souvenirs`:
- `name_*`: Custom Photo Magnet / 客製化磁石貼 / 客制化磁石贴
- `description_*`: explains 5×5 cm magnet, send your own photo, perfect for trips/gifts
- `vendor_note_*`: "In collaboration with Bingomagnetic" / "與 Bingomagnetic 聯乘出品" / "与 Bingomagnetic 联乘出品"
- `price`: 40, `original_price`: null
- `customisation_required`: true
- `bulk_pricing`: the 4 tiers above
- `display_order`: 1, `is_active`: true
- no rows in `souvenir_sizes`

## Frontend changes
**`src/hooks/useSouvenirs.ts`** — extend `Souvenir` interface with the new fields.

**`src/pages/Souvenirs.tsx`** —
- `ProductCard`: if `vendor_note` present, show a small badge under the name. If `bulk_pricing.length > 0`, render a "Bulk pricing" table with original (strike) → sale → savings. If `customisation_required`, swap the "Order via WhatsApp" CTA for a two-step flow:
  1. File input (accept image/*, max 10 MB) → upload to `souvenir-uploads/<uuid>/<filename>` via supabase-js → get signed URL.
  2. WhatsApp deep-link pre-fills message with product, qty, and the signed URL.
- `SizeChartCard`: skip rendering when `sizes.length === 0` (magnet has no size chart).

**`src/components/admin/AdminSouvenirsPanel.tsx`** — add inputs for `original_price`, `vendor_note_*`, `customisation_required` toggle, and an editable bulk-pricing tier list (add/remove rows with qty/original/sale). Save these alongside existing fields.

**`src/contexts/LanguageContext.tsx`** — add keys: `souvenirs.bulkPricing`, `souvenirs.savePrefix`, `souvenirs.uploadPhoto`, `souvenirs.uploadHint`, `souvenirs.uploading`, `souvenirs.collabWith`, in en / zh-TW / zh-CN.

## Out of scope
- Selectable pack/quantity dropdown on the storefront (user explicitly chose "Single product, no pack options").
- Server-side order persistence — checkout continues to hand off to WhatsApp.