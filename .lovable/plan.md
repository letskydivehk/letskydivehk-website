# UI/UX Upgrade Plan — Friendlier Homepage, Navigation & Polish

Three coordinated workstreams. All changes are frontend-only — no schema, no business logic. Builds on the existing motion system (`src/lib/motion.ts`, `PageTransition`, `MotionCard`) and design tokens in `index.css`.

---

## 1. Homepage Information Architecture

The homepage currently stacks ~15 sections before the user reaches Booking. Goals: reduce noise, get to conversion faster, speed up first paint.

**Section reorder** (`src/pages/Home.tsx`):

```text
BEFORE                          AFTER
─────────                       ─────────
Hero                            Hero
Trust strip                     Trust strip (merged)
Promo banner                    Promo ribbon (slim)
QuizCTA                         Locations
SocialProofTicker               Services
SafetySection                   Booking            ← moved up
JumpDayTimeline                 SafetySection      ← reassure after intent
Locations                       JumpDayTimeline
Services                        Testimonials
Booking                         QuizCTA            ← secondary path
Testimonials                    SocialProofTicker  ← merged into footer band
Referral + Alumni               Referral + Alumni
About / FAQ / Contact           About / FAQ / Contact
```

**Trust signal consolidation**:
- Merge `TrustBar` + `EligibilityChips` + `SocialProofTicker` headline stats into a single compact band under the hero.
- Move full ticker into a thin strip above the footer.

**Promo banner**: shrink from full-bleed orange block to a single-line ribbon (~40px), keep countdown + CTA, lower visual weight (memory `style/homepage-promotion-banner` already prefers compact).

**Lazy-mount below-fold**:
- Wrap `Testimonials`, `Referral`, `Alumni`, `About`, `FAQ`, `Contact` in a small `<LazySection>` using IntersectionObserver to defer mount until ~200px before viewport. Keeps initial bundle execution lighter.

---

## 2. Navigation & Sticky Bars

**Sticky top navbar on homepage** (currently only sub-pages have `PageNavbar`):
- New `HomeNavbar`: transparent over hero, gains `backdrop-blur` + subtle border after 80px scroll.
- Logo left, anchor links centre (Locations, Services, Booking, Blog), Language + Auth right.
- Mobile: hamburger sheet (reuse shadcn `Sheet`).

**Smarter `StickyBookingBar`**:
- Hide while hero is in view; slide up after.
- Show: "從 $X,XXX 起 · Tandem 體驗" + primary "立即預訂" + secondary WhatsApp icon.
- On mobile becomes a true bottom action bar (full-width, safe-area-inset padding).

**Mobile bottom tab bar** (new, mobile-only):
- 4 tabs: 預訂 / 地點 / 會員 / 聯絡. Always visible, glassmorphism, 56px tall, respects iOS safe area.
- Hides on scroll-down, reveals on scroll-up.

**Breadcrumbs**: add to `ServiceTandem`, `ServiceALicence`, `ServiceSkydivingTour`, `LocationDetail`, `BlogPost` (shadcn `Breadcrumb`). Improves orientation and SEO.

**`SectionNav` enhancement**: add active-section indicator (already tracks scroll — surface as a filled dot vs ring).

---

## 3. Polish: Microinteractions, A11y, Empty States

**Skeleton loaders** (replace spinners):
- `Locations`, `Services`, `Gallery`, `Blog`, `MemberProfile.bookings`: use shadcn `Skeleton` matched to final card shape during `useQuery` `isLoading`.

**Empty states**:
- `MemberProfile` no-bookings → friendly illustration + "Book your first jump" CTA.
- `Gallery` no-media-in-language → "Switch language to see more" hint.
- `Blog` no-posts-in-language → fallback to English with banner.

**A11y pass**:
- Add visible `:focus-visible` ring tokens in `index.css` (2px primary ring + 2px offset).
- Audit icon-only buttons across `Hero`, `StickyBookingBar`, `WhatsAppButton`, gallery controls, admin panels — add `aria-label`.
- Replace `h-screen` with `h-dvh` where present (mobile viewport).
- Ensure `<main>` is single per route (verify on Home + sub-pages).

**Microinteractions** (extend existing motion system):
- Toast: bottom-centre on mobile, top-right on desktop (configure `Toaster`).
- Button press: add haptic vibration on touch devices (5ms) — guard with `'vibrate' in navigator`.
- Form fields: animate label float on focus, success checkmark on valid blur.

**Perceived perf**:
- `<link rel="preload">` for hero image + Bagel Fat One subset in `index.html`.
- Defer `WhatsAppButton` mount until `requestIdleCallback`.

---

## Files (technical)

**New**:
- `src/components/HomeNavbar.tsx` — sticky top nav for homepage
- `src/components/MobileTabBar.tsx` — bottom tabs (mobile only)
- `src/components/LazySection.tsx` — IntersectionObserver-based lazy mount
- `src/components/empty/` — `EmptyBookings.tsx`, `EmptyGallery.tsx`, `EmptyBlog.tsx`
- `src/components/skeletons/` — `LocationCardSkeleton.tsx`, `ServiceCardSkeleton.tsx`, `BlogCardSkeleton.tsx`

**Edited**:
- `src/pages/Home.tsx` — reorder sections, wrap below-fold in `LazySection`, add `HomeNavbar` + `MobileTabBar`
- `src/components/TrustBar.tsx` + `EligibilityChips.tsx` — merge into one compact band
- `src/components/StickyBookingBar.tsx` — hero-aware visibility, mobile bottom-bar styling
- `src/components/SectionNav.tsx` — active-state indicator
- `src/components/Locations.tsx`, `Services.tsx`, `LatestBlog.tsx`, `Testimonials.tsx`, `pages/MemberProfile.tsx`, `pages/Gallery.tsx`, `pages/Blog.tsx` — skeleton + empty states
- `src/components/ui/sonner.tsx` (Toaster) — responsive position
- `src/index.css` — focus-visible tokens, slim promo ribbon class, safe-area utilities
- `src/components/WhatsAppButton.tsx` — idle-mount deferral
- `index.html` — preload hero image + font
- Sub-pages (`ServiceTandem`, `ServiceALicence`, `ServiceSkydivingTour`, `LocationDetail`, `BlogPost`) — `Breadcrumb` insert

## Out of scope (for follow-up)

- Booking funnel UX (inline validation, draft auto-save, smarter date picker) — separate plan.
- Visual redesign of cards/hero — current Apple-like motion + glass aesthetic kept.
- Backend/schema/translation copy changes.
