## Goal
Add a "Skydiving Edition Magnets" preset series (4 designs) alongside the existing customisable magnet. Customers pick which design(s) and quantity; you also keep the option to upload a custom photo and still see which photo + quantity over WhatsApp.

## What the customer sees on `/souvenirs`

A new card above (or beside) the custom magnet:

- Title: "Skydiving Edition Magnets" with the same 5 × 5 cm chip and member-discount banner.
- A 2×2 grid of the 4 design thumbnails (loaded from admin). Each is selectable; multi-select supported.
- For every selected design, a quantity stepper (− / number / +, min 1).
- Live order summary: per-design quantity + total magnets + subtotal using the same bulk-pricing tiers (price per magnet picks the matching tier by *total* quantity across all selected designs, matching today's pricing logic).
- "Order on WhatsApp" button. The message lists each chosen design name + quantity, total count, total price, and the same member 10%-off note.

The existing custom-photo magnet card stays as-is. Its WhatsApp message already includes the uploaded photo URL (for signed-in users) or asks the guest to send it in chat.

## What the admin sees on the souvenirs admin panel

A new "Edition designs" section inside the magnet product card:

- Up to 4 design slots (Design 1–4), each with: name (EN / 繁 / 简), image upload, active toggle, display order.
- Same upload flow as the existing product image (uses the `gallery` public bucket).
- Save persists per-design rows.

## Data model

New table `public.souvenir_variants`:
- `souvenir_id` → souvenirs.id (cascade)
- `name_en`, `name_zh_tw`, `name_zh_cn`
- `image_url`
- `display_order`, `is_active`

Grants + RLS:
- `anon` + `authenticated`: SELECT where `is_active = true`.
- Admin: full CRUD via `has_role(auth.uid(),'admin')`.
- `service_role`: ALL.

`useSouvenirs` is extended to also fetch variants and attach them as `item.variants` (parallel to `item.sizes`).

## WhatsApp message templates (EN / 繁 / 简)

New key `souvenirs.editionWhatsappMsg` with placeholders:
```
Hi! I'd like to order Skydiving Edition Magnets (5 × 5 cm):
{lines}
Total: {totalQty} magnet(s) — HK${totalPrice}
```
where `{lines}` is built client-side as `- {designName} × {qty}` per selected design. Guest vs member uses the same template; the member-discount note is appended for signed-in users so you can apply 10% off manually, same pattern as today.

For the existing custom-photo magnet, also surface the quantity in the message (today it's hard-coded to `1`) so you always see the count next to the uploaded photo. Templates `souvenirs.magnetWhatsappMsg*` get a `{qty}` that reflects the new quantity stepper added to that card.

## Files touched

- `supabase/migrations/...` — new `souvenir_variants` table + grants + RLS (via migration tool).
- `src/hooks/useSouvenirs.ts` — fetch + type variants.
- `src/pages/Souvenirs.tsx` — new edition section UI, quantity stepper on both magnet cards, updated WhatsApp builders.
- `src/components/admin/AdminSouvenirsPanel.tsx` — manage 4 variant slots (upload, names, active, order).
- `src/contexts/LanguageContext.tsx` — new translation keys.

## Out of scope

- No payment/checkout; ordering still goes through WhatsApp.
- No automatic 10% member-discount calculation; the line is shown as today and applied manually in chat.
- No changes to the t-shirts or other souvenirs.
