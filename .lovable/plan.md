## Goal
Let admins manage the T-shirt (photo, price, name, description in 3 languages) and the size chart (S–2XL height/weight ranges) from the admin hub — no code edits.

## Database (new migration)

**Table `souvenirs`** — one row per product (starts with the T-shirt)
- `name_en`, `name_zh_tw`, `name_zh_cn` (text)
- `description_en`, `description_zh_tw`, `description_zh_cn` (text)
- `price` (integer, HKD)
- `image_url` (text, nullable)
- `is_active` (boolean, default true)
- `display_order` (integer)
- standard `id`, `created_at`, `updated_at`

**Table `souvenir_sizes`** — size chart rows
- `souvenir_id` (FK → souvenirs)
- `size_label` (text, e.g. "S", "M", "L", "XL", "2XL")
- `height_range` (text, e.g. "160–170 cm")
- `weight_range` (text, e.g. "55–65 kg")
- `display_order` (integer)

**RLS**
- Public `SELECT` on both tables (anyone can view active souvenirs).
- Admin-only `INSERT/UPDATE/DELETE` via `has_role(auth.uid(), 'admin')`.
- Grants: `SELECT` to anon + authenticated; full to service_role + admin via policies.

**Storage** — reuse existing public `gallery` bucket under a `souvenirs/` prefix (no new bucket needed).

## Admin UI

New tab **"Souvenirs"** in the existing admin hub (`/admin/credits` page → add `<TabsTrigger value="souvenirs">`), backed by a new `AdminSouvenirsPanel.tsx` component:
- Product card form: name/description (3 langs), price, active toggle, image uploader (drag-drop → Supabase Storage `gallery/souvenirs/<uuid>.jpg`, saves public URL to `image_url`)
- Size chart editor: table with 5 editable rows (S, M, L, XL, 2XL) — height range + weight range text inputs, single "Save" button
- "Add new souvenir" button (future-proof for more products)

## Frontend changes

`src/pages/Souvenirs.tsx` — refactor to:
- Use new `useSouvenirs()` hook (`src/hooks/useSouvenirs.ts`) that fetches active souvenirs + sizes from Supabase
- Render product image from `image_url` (fallback placeholder if null)
- Render size chart rows from DB (fallback to "—" if empty)
- Keep current layout, WhatsApp CTA, translations

Seed the T-shirt row + 5 empty size rows in the migration so the page renders immediately.

## Files

- **New**: migration, `src/hooks/useSouvenirs.ts`, `src/components/admin/AdminSouvenirsPanel.tsx`
- **Edited**: `src/pages/Souvenirs.tsx`, `src/pages/AdminCredits.tsx` (add tab), `src/contexts/LanguageContext.tsx` (admin tab label)

## Out of scope
- Multi-product catalog UI on the public page (still shows one T-shirt; admin can add more later, just won't appear until we extend the public page)
- Image cropping/resizing (admin uploads at desired size)
- Order management — WhatsApp inquiry only, same as today
