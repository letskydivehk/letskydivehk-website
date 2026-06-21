## Goal
Make the site feel more responsive, polished, and easier to act on — without changing business logic. Style: **subtle & premium** (Apple-like). Scope: tour page, homepage, booking flow, global nav.

## Design principles (locked across all areas)
- Motion: 150–250ms ease-out, spring only on primary CTAs; no bouncy/playful effects.
- Feedback within 100ms on every tap (haptic-style scale 0.97 + ring).
- Skeletons over spinners; toast confirmations on every async action.
- Mobile-first: tap targets ≥44px, thumb-reachable primary actions, safe-area aware.
- Reuse existing tokens in `index.css` — no hardcoded colors.

---

## Wave 1 — Zhuhai One-Day Tour page (`ServiceSkydivingTour.tsx`)
1. **Sticky mobile CTA bar** ("立即預訂 · $500 訂金") that slides up after scrolling past hero, with credit-aware label if signed in.
2. **Itinerary upgrade**: convert `TourItinerary` timeline to an animated vertical rail — segments fade/slide in on scroll (IntersectionObserver), active segment highlights as you scroll.
3. **Promo banner polish**: replace static gradient button with shimmer-on-idle + scale-on-press; add "限時推廣" chip with subtle pulse.
4. **Location pills**: active state gets soft glow + scale; popular pill shows ★ with gentle bobbing.
5. **Tour card**: hover lifts 4px with shadow ramp; popular ribbon gets diagonal shine sweep every 6s.

## Wave 2 — Homepage (`Hero`, `Services`, `Locations`)
1. **Hero**: refine existing parallax — add gentle scroll-cue chevron, animate headline words with stagger fade (one-time, not loop).
2. **Service cards** (`Services.tsx`): unified hover (lift + image zoom 1.03), clearer primary "View Details" button with arrow that translates 4px on hover.
3. **Locations grid**: card hover reveals "View" overlay with backdrop-blur; "popular" badge for Zhuhai.
4. **Section reveals**: wrap each homepage section in existing `Reveal` component for consistent on-scroll fades.

## Wave 3 — Booking flow (`BookingSection.tsx` + steps)
1. **Step indicator**: animated progress bar (filled segments + glow on current), step numbers scale on activation.
2. **Form feedback**: inline validation with green check icon on valid fields; shake + red ring on submit error.
3. **Async states**: skeleton placeholders for service/date loading; button shows spinner + "處理中…" without layout shift.
4. **Success state**: replace alert with full-card success animation (check-circle draw-in + confetti-lite single burst — still subtle).
5. **Mobile**: convert step navigation to bottom sheet with swipe-down to dismiss.

## Wave 4 — Global nav (`PageNavbar.tsx`, `MobileTabBar.tsx`, `CreditPill.tsx`)
1. **Navbar**: shrink on scroll (80→60px) with backdrop-blur ramp; active link gets underline grow animation.
2. **CreditPill**: number tweens up when balance increases; brief glow pulse on credit change event.
3. **MobileTabBar**: active tab icon scales + label fades in; haptic-style tap feedback; safe-area padding.
4. **AuthButton**: avatar dropdown with smooth height animation, not instant.

---

## Technical notes
- Animations via existing **framer-motion** (already in `Hero`, `CreditPill`); reuse `src/lib/motion.ts` variants where possible.
- Add 2 shared hooks: `useScrollDirection()` (for shrinking navbar / showing sticky CTA) and `useInViewOnce()` (for one-shot reveals).
- Skeletons: extend existing `CardSkeleton.tsx`; add `FormFieldSkeleton`.
- Toasts via existing `use-toast` — standardize success/error variants.
- All new strings added to `LanguageContext.tsx` (繁/簡/EN).
- No DB or business-logic changes.

## Out of scope
- New features, new pages, pricing/deposit changes, color palette overhaul, font swap.

## Rollout order
Wave 1 → Wave 4 → Wave 3 → Wave 2 (highest-impact / lowest-risk first: promoted tour page + global nav set the tone, then booking, then homepage breadth).

Tell me to proceed, or pick a single wave to start with.