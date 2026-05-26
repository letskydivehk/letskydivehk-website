# Animated UI Upgrade — Apple-like Premium Motion

Scope: Homepage sections, global buttons & cards, and page transitions. Motion intensity 4/5 — confident and cinematic, but smooth easing and restrained timing (no bouncy springs). Respects `prefers-reduced-motion`.

## 1. Motion foundation

- Add `framer-motion` (already commonly used in project; reuse if present).
- Create `src/lib/motion.ts` with shared presets:
  - Easing: `[0.22, 1, 0.36, 1]` (Apple-style ease-out-expo)
  - Durations: `fast 0.35s`, `base 0.6s`, `slow 0.9s`
  - Variants: `fadeUp`, `fadeIn`, `scaleIn`, `staggerContainer`, `revealMask`
- Add a `useReducedMotion` guard so all variants fall back to instant transitions.
- Extend `index.css` with utility classes: `.tilt-card`, `.glow-on-hover`, `.shimmer`, `.magnetic` and a soft radial spotlight that follows the cursor on hero/cards.

## 2. Homepage sections (`src/components/...`)

Reveal-on-scroll using `whileInView` with `once: true`, 20% threshold, staggered children.

- **Hero** — Headline split into words with a mask reveal (clip-path), subhead fade-up, CTA scale-in with subtle glow pulse. Background image gets a slow parallax (translateY on scroll, max 60px) and a vignette layer that fades in.
- **Services** — Cards enter with staggered fade-up (80ms gap). On hover: 3D tilt (max 6°), inner image zoom 1.04, gradient border glow, CTA arrow slides right. Click: brief scale-down then route.
- **Locations** — Grid items reveal in staggered waves. Hover: image Ken-Burns zoom, label slides up from bottom with overlay gradient deepening. "Closing Soon" badge gets a soft pulsing ring.
- **About / Testimonials / FAQ / Contact** — Section headers use mask reveal; body content fades up. Testimonials carousel transitions cross-fade with slight scale instead of hard slide.
- **Stats / numbers** (if any) — Count-up animation when in view.

## 3. Global buttons & cards

- **Button**: extend the shadcn `Button` with a `motion` wrapper. Hover: lift `-2px`, soft shadow grow, gradient sheen sweep (shimmer). Active: scale 0.97. Primary CTAs get a subtle outer glow on hover.
- **Card**: shared `MotionCard` wrapper (used by Services, Locations, Blog, Promotions). Cursor-tracking spotlight (radial gradient following mouse), 3D tilt via `useMotionValue` + `useTransform`, border-gradient highlight.
- **Links / nav items**: animated underline (already partially via `.story-link`), refined with easing.
- **Icons**: hover micro-rotation / translate for arrows, chevrons.

## 4. Page transitions

- Wrap routes in `AnimatePresence mode="wait"` inside `App.tsx` around the `<Routes>` block, keyed by `location.pathname`.
- Page wrapper variant: fade + 12px upward translate, 0.45s ease-out-expo on enter; fade + 8px down on exit. Scroll-to-top on route change preserved.
- Sub-page navbar appearance unchanged (per existing memory).

## 5. Accessibility & performance

- All motion respects `prefers-reduced-motion: reduce` — replaced with instant opacity transitions.
- Animations use `transform` and `opacity` only (GPU-friendly), no layout thrash.
- Lazy-mount heavy effects (cursor spotlight) only on `pointer: fine` devices to keep mobile light.
- Mobile: simpler variants (no 3D tilt, no spotlight), keep scroll reveals and button shimmer.

## Files (technical)

- New: `src/lib/motion.ts`, `src/components/ui/motion-card.tsx`, `src/components/ui/reveal.tsx`, `src/components/PageTransition.tsx`
- Edited: `src/App.tsx` (AnimatePresence), `src/components/Hero.tsx`, `Services.tsx`, `Locations.tsx`, `About.tsx`, `Testimonials.tsx`, `FAQ.tsx`, `Contact.tsx`, `ui/button.tsx`, `index.css`, `tailwind.config.ts` (extra keyframes: shimmer, mask-reveal, glow-pulse)

No backend, schema, or business-logic changes.
