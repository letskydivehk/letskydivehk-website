

# Website Improvement Analysis & Plan

## Issues Found

### 1. Performance — Render-Blocking Fonts (High Impact)
Four Google Fonts are loaded via CSS `@import` in `src/index.css`, which blocks rendering until all fonts download. The same Bagel Fat One font is also loaded in `index.html` via `<link>`, creating a duplicate request.

**Fix**: Move all font loads to `index.html` as `<link rel="preconnect">` + `<link>` tags with `display=swap`. Remove CSS `@import` lines and the duplicate Bagel Fat One link.

### 2. Performance — No Route-Level Code Splitting (Medium Impact)
All 15+ pages are bundled eagerly in `src/App.tsx`. Users downloading the homepage also download Blog, Gallery, Admin, etc.

**Fix**: Use `React.lazy()` + `<Suspense>` for all routes except Home. This significantly reduces initial bundle size.

### 3. Performance — Airwallex Script Loaded on Every Page (Medium Impact)
`index.html` loads `checkout.airwallex.com/assets/elements.bundle.min.js` synchronously on every page, even when no payment is needed.

**Fix**: Add `async` attribute to the script tag, or better, load it only on booking pages.

### 4. SEO — Duplicate/Conflicting Meta Tags (Medium Impact)
`index.html` has hardcoded OG/Twitter meta tags that conflict with the dynamic `<Helmet>` tags in `SEO.tsx`. Crawlers may pick up the wrong ones.

**Fix**: Remove all OG/Twitter meta tags from `index.html` and let `react-helmet-async` handle them dynamically per page.

### 5. SEO — "Scroll to explore" Not Translated (Low Impact)
In `Hero.tsx` line 306, the text `"Scroll to explore"` is hardcoded in English instead of using `t()`.

**Fix**: Add translation key and use `t('hero.scrollToExplore')`.

### 6. UX — `'use client'` Directives (Cosmetic)
Multiple components have `'use client'` at the top. This is a Next.js directive and has no effect in Vite/React — it's just noise.

**Fix**: Remove `'use client'` from all files.

---

## Summary of Changes

| File | Change |
|------|--------|
| `index.html` | Consolidate font preloads, remove duplicate OG/Twitter meta, add `async` to Airwallex script |
| `src/index.css` | Remove 4 `@import url()` lines for Google Fonts |
| `src/App.tsx` | Add `React.lazy()` + `Suspense` for all routes except Home |
| `src/components/Hero.tsx` | Translate "Scroll to explore", remove `'use client'` |
| `src/contexts/LanguageContext.tsx` | Add `hero.scrollToExplore` translation key (EN/zh-TW/zh-CN) |
| ~10 other components | Remove `'use client'` directive |

These changes focus on faster page loads, better SEO, and cleaner code — no visual changes to the site.

