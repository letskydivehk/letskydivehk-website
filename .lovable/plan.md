

# Maximize Website Interaction Interface

## Current Interactive Elements
The site already has: sticky booking bar, WhatsApp chat widget, jump quiz, video modal, animated counters, parallax hero, service hover cards, FAQ accordion, contact form, and social proof ticker.

## Proposed Enhancements

### 1. Add "Back to Top" Smooth Scroll Button
A floating button (bottom-left) that appears after scrolling past the hero, with a smooth scroll-to-top animation. Complements the existing sticky booking bar at the bottom.

**File**: New `src/components/BackToTopButton.tsx`
**File**: `src/pages/Home.tsx` — add the component

### 2. Add Hover Tooltip Previews on Location Cards
When hovering a location card, show a quick-info tooltip with key details (weather, altitude, available services) using the existing Tooltip component. Increases engagement before click-through.

**File**: `src/components/Locations.tsx` — wrap cards with tooltip

### 3. Add Animated Progress Indicator for Booking Steps
The booking form has multiple steps but no visual progress bar. Add an animated step indicator showing current progress (e.g., Step 2 of 4) with connecting lines that fill as users advance.

**File**: `src/components/BookingSection.tsx` — add progress bar UI above the form steps

### 4. Add Micro-Interaction Feedback on All CTA Buttons
Enhance all primary CTA buttons with ripple effects and haptic-style visual feedback on click. Currently some buttons have `whileTap` but not all — standardize across the site.

**File**: New `src/components/RippleButton.tsx` — reusable button with ripple effect
**Files**: `src/components/Services.tsx`, `src/components/Contact.tsx` — use RippleButton for primary CTAs

### 5. Add Section Navigation Dots (Scroll Spy)
A vertical dot navigation on the right edge that highlights the current section as the user scrolls. Clicking a dot smooth-scrolls to that section. Common on single-page marketing sites.

**File**: New `src/components/SectionNav.tsx`
**File**: `src/pages/Home.tsx` — add the component

### 6. Add "Shake to Book" / Auto-Open WhatsApp After Idle
After 60 seconds of inactivity on the page, gently animate the WhatsApp button with a bounce + notification badge to prompt engagement.

**File**: `src/components/WhatsAppButton.tsx` — add idle timer with attention animation

### 7. Add Parallax Tilt Effect on Service Cards
Service cards already have hover lift (`whileHover: y: -8`). Add a subtle 3D tilt effect that follows the cursor position on hover for a more premium interactive feel.

**File**: `src/components/Services.tsx` — add mouse-tracking tilt transform

---

## Summary of New Components
| Component | Purpose |
|-----------|---------|
| `BackToTopButton` | Floating scroll-to-top button |
| `SectionNav` | Vertical scroll-spy dot navigation |
| `RippleButton` | Reusable button with click ripple effect |

## Files Modified
| File | Change |
|------|--------|
| `src/pages/Home.tsx` | Add BackToTopButton + SectionNav |
| `src/components/WhatsAppButton.tsx` | Add idle attention animation |
| `src/components/Services.tsx` | Add 3D tilt effect on cards |
| `src/components/BookingSection.tsx` | Add animated step progress bar |
| `src/components/Contact.tsx` | Use RippleButton for submit |

## Translation Keys Added
- `nav.backToTop` (EN/zh-TW/zh-CN)
- Section labels for dot nav tooltips

All enhancements are non-breaking, purely additive, and fully localized.

