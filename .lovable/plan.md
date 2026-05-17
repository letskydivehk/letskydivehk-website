## What's wrong now

On mobile (430×697), the hero shows only the sky background — the H1, subtitle, trust bar, eligibility chips, three CTAs and the scroll arrow all stack taller than the viewport, so `justify-center` crops them off both top and bottom. That's the "panel blocking the content" — too much stuff stuffed into the hero pane.

Also, the section order pushes the promotion banner and quiz CTA way below SocialProofTicker, SafetySection and JumpDayTimeline.

## Changes

### 1. `src/components/Hero.tsx` — slim the hero
- Keep inside the hero: H1, subtitle, primary CTA (Book), secondary CTA (Quiz), Watch Video, scroll indicator.
- Remove `<TrustBar />` and `<EligibilityChips />` from inside the hero (they're the main overflow culprits on mobile).
- Tighten mobile spacing (`mb-6` → `mb-4` between heading/subtitle/CTAs; reduce H1 to `text-4xl` on mobile).

### 2. `src/pages/Home.tsx` — reorder
New order, top to bottom:

```text
Hero
TrustStrip            (new compact wrapper: TrustBar + EligibilityChips side by side)
Promotion banner      (the orange Link to /promotions, already exists)
QuizCTA
SocialProofTicker
SafetySection
JumpDayTimeline
Locations
Services
InstructorTeam
Booking
Testimonials
ReferralBanner
AlumniPathway
About
FAQ
Contact
```

The TrustStrip is just a small section wrapping the existing `<TrustBar />` + `<EligibilityChips />` on a light background so the reassurance signals still show — they just live below the hero instead of inside it.

### 3. No changes
- StickyBookingBar, SectionNav, business logic, translations — all untouched.
- Mobile menu, navbar, parallax behavior unchanged.

## Verification
After the edits, re-screenshot at 430×697 to confirm: hero headline + subtitle + both CTAs are fully visible, and the promotion banner / quiz CTA appear immediately after scrolling past the hero.
