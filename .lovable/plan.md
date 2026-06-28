## Goal
Three changes to the souvenir magnet product:
1. Replace the magnet product photo with the uploaded `magnet-sample.jpeg` asset.
2. Let any visitor (signed-in or not) upload a photo and see the draft preview.
3. Communicate the magnet is 5cm × 5cm, and that members get 10% off (sign-in required).

## Changes

### 1. Product photo
- Update the magnet row in the `souvenirs` table so `image_url` points to the CDN URL from `src/assets/magnet-sample.jpeg.asset.json` (`/__l5e/assets-v1/93f1aaca-7a06-43cd-ab2f-f190605aceb1/magnet-sample.jpeg`).
- The existing `ProductCard` already renders `item.image_url`, so no UI change needed for the product image.

### 2. Anonymous upload + draft preview
Right now `PhotoUpload` requires sign-in because the storage RLS policy locks `souvenir-uploads` INSERT to `authenticated` with an `auth.uid()/...` folder prefix. To allow guests to preview without weakening security:

- Skip the Supabase storage upload entirely for guests. Render the draft preview from a local `URL.createObjectURL(file)` only.
- When the customer hits **Order on WhatsApp**:
  - If signed in → upload to `souvenir-uploads` under `${auth.uid()}/${itemId}/...`, create a 1-year signed URL, and include it in the WhatsApp message (current behavior).
  - If not signed in → open WhatsApp with a message that says the customer will send the photo directly in the chat (no URL placeholder).
- The strict RLS policy from the recent migration stays as-is; no policy change.

### 3. Copy updates (EN / zh-TW / zh-CN)
Add/extend translation keys used on the magnet card:
- `souvenirs.magnetSize` — "Size: 5 × 5 cm fridge magnet".
- `souvenirs.memberDiscount` — "Members get 10% off — sign in to your account to apply."
- `souvenirs.magnetWhatsappMsgNoPhoto` — variant of the WhatsApp message for guests that asks them to send the photo in the chat.
- Update the preview card subtitle to mention the 5×5 cm finished size.

UI placement on the magnet `ProductCard`:
- Show a small "5 × 5 cm" chip near the price.
- Show the member-discount line (with a subtle "Sign in" link to open the existing auth modal/route) under the price block, only for the magnet (`item.customisation_required`) and only when the user is not signed in. When signed in, show "Member 10% off applied at checkout".

### 4. Adjust `handleOrder`
- Pick the WhatsApp template based on signed-in state and whether a `photoUrl` was uploaded.
- For guests with a local preview only, send `magnetWhatsappMsgNoPhoto`.

## Technical Notes
- Files touched: `src/pages/Souvenirs.tsx`, `src/contexts/LanguageContext.tsx`.
- Data change: one `UPDATE` on `public.souvenirs` to set `image_url` for the magnet item (run via the data tool, not a migration).
- No schema or RLS changes; the hardened `souvenir-uploads` policy is preserved because guests never write to storage.
- The auth modal/sign-in link reuses the existing `AuthButton` / `AuthModal` flow already in the app.

## Out of Scope
- No changes to other souvenir products (t-shirts, etc.).
- No new tables, buckets, or edge functions.
- No automatic discount engine — the 10% member discount is communicated in copy and applied manually by staff over WhatsApp (matches the current order flow). Let me know if you want it auto-calculated instead.
