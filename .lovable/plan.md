## Souvenirs Page Plan

### Route
- New page at `/souvenirs` — add lazy route in `src/App.tsx`.
- Create `src/pages/Souvenirs.tsx` using existing page conventions (PageNavbar, Footer, SEO, BackgroundDecorations, framer-motion reveal).

### Page Content
1. **Hero** — title "Souvenirs" / 「紀念品」/ 「纪念品」, short subtitle ("Take home a piece of the sky").
2. **Product card — Skydive HK T-shirt**
   - Placeholder image (`/placeholder.svg`) ready to swap later.
   - Price: **HK$150**.
   - Short description (one sentence per language).
   - Size selector chips: S / M / L / XL / 2XL.
   - Primary CTA: **Order via WhatsApp** — opens `https://wa.me/<existing number>?text=...` pre-filled with product name, selected size, and price (localized text per language). Reuses the WhatsApp number already used by `WhatsAppButton`/`Contact`.
3. **Size Chart**
   - shadcn `Table`, columns: Size | Height (cm) | Weight (kg).
   - Rows S, M, L, XL, 2XL with placeholder dashes (`—`) so you can fill values later by editing one array constant `SIZE_CHART` at the top of `Souvenirs.tsx`.
   - Note line: "Measurements are guidelines; contact us if unsure."
4. **Back link** to home.

### Navigation Links
- **Main navbar** (`src/components/PageNavbar.tsx`): add "Souvenirs" link (all 3 languages).
- **Footer** (`src/components/Footer.tsx`): add to Quick Links (all 3 languages).

### Translations
Add keys to `src/contexts/LanguageContext.tsx` for en / zh-TW / zh-CN:
- `souvenirs.title`, `souvenirs.subtitle`, `souvenirs.seoTitle`, `souvenirs.seoDesc`
- `souvenirs.tshirt.name`, `souvenirs.tshirt.desc`, `souvenirs.price`
- `souvenirs.selectSize`, `souvenirs.orderWhatsapp`, `souvenirs.whatsappMsg` (template with `{size}`)
- `souvenirs.sizeChart`, `souvenirs.size`, `souvenirs.height`, `souvenirs.weight`, `souvenirs.sizeNote`
- `nav.souvenirs`, `footer.souvenirs`

Traditional Chinese remains authoritative.

### Files Touched
- new: `src/pages/Souvenirs.tsx`
- edit: `src/App.tsx` (route), `src/components/PageNavbar.tsx`, `src/components/Footer.tsx`, `src/contexts/LanguageContext.tsx`

### Out of Scope
- No payment integration, no DB table (single static product).
- Real product image and size measurements to be filled in later by editing `SIZE_CHART` constant and replacing the image import.
