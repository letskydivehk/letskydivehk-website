## Goal

The homepage currently stacks ~18 full-height sections. Shorten it so the primary path (Hero → Locations → Services → Booking) dominates, and route the rest through compact teaser strips that click into dedicated pages.

## Current homepage sections (verified from `src/pages/Home.tsx`)

Hero → TrustBar/EligibilityChips → Promo ribbon → **QuizCTA → SocialProofTicker → ReferralBanner → RewardsTeaser** → Locations → WeatherForecast → Services → BookingSection → **SafetySection → JumpDayTimeline** → Testimonials → **AlumniPathway → SouvenirTeaser** → About → FAQ → Contact.

## Restructure

Keep as full sections (core conversion path):
- Hero, Trust/Eligibility band, Promo ribbon, **Locations, Services, BookingSection**, Testimonials, FAQ, Contact.

Collapse into a single compact "Explore more" strip near the top (one row of 4 clickable cards, ~one viewport tall):
- QuizCTA → link to `/quiz`
- ReferralBanner → link to `/referrals` (or existing referral route)
- RewardsTeaser → link to `/membership/tiers`
- SouvenirTeaser → link to `/souvenirs`

Collapse into a second compact "Your jump day" strip after Booking (two cards):
- SafetySection → link to `/safety` (or existing safety page)
- JumpDayTimeline → link to a dedicated timeline page / `/faq#jump-day`

Move lower-priority content off the homepage:
- WeatherForecast → keep only a slim "Check today's weather at each dropzone →" button that links to a new `/weather` page (or first location page). Full iframes stay off the home.
- AlumniPathway → link out from Testimonials footer ("See alumni stories →") instead of its own section.
- About → replace with a 1-paragraph founder blurb + "About us →" link to `/about`.
- SocialProofTicker → keep (it's already a thin ticker, low cost).

## New homepage order

```
Hero
Trust/Eligibility band
Promo ribbon
SocialProofTicker (thin)
"Explore more" 4-card strip (Quiz, Referrals, Rewards, Souvenirs)
Locations
Weather CTA button (1 line)
Services
BookingSection
"Your jump day" 2-card strip (Safety, Timeline)
Testimonials  (+ "See alumni stories →" link)
About blurb (compact, links to /about)
FAQ
Contact
```

That removes ~7 full sections from the homepage while preserving every entry point via a click.

## Implementation

1. **New component `src/components/home/ExploreMoreStrip.tsx`** — 4 clickable cards (icon + title + one-line sub + arrow) in a responsive grid (`grid-cols-2 md:grid-cols-4`). Cards link to `/quiz`, `/referrals`, `/membership/tiers`, `/souvenirs`. Reuse translation keys already present in QuizCTA / ReferralBanner / RewardsTeaser / SouvenirTeaser for titles/subs.
2. **New component `src/components/home/JumpDayStrip.tsx`** — 2 cards for Safety + Jump-day timeline, same visual language, linking to their dedicated pages (or `#faq`).
3. **New component `src/components/home/WeatherCta.tsx`** — a single-row CTA button ("查看各基地即時天氣 →") linking to a weather page or the locations page's weather anchor. Keep the existing `WeatherForecast` component available at that destination page (not deleted).
4. **New component `src/components/home/AboutBlurb.tsx`** — 2-3 sentences pulled from existing About copy, with an "About us →" link to `/about`. Keep the full `About` component available on `/about`.
5. **Edit `src/pages/Home.tsx`** — replace the six sections listed above with the four new strips in the new order. Remove the `LazySection` wrappers for the removed sections. Keep `Testimonials`, `FAQ`, `Contact`, `Locations`, `Services`, `BookingSection` as-is.
6. **Update `src/components/Testimonials.tsx`** (or add below it in `Home.tsx`) — a small "See alumni stories →" link to the alumni destination that `AlumniPathway` used to expose. If no dedicated alumni page exists, link to the blog category or an anchor on `/about`; verify the target route exists before wiring.
7. **Route audit** — before wiring links, confirm `/quiz`, `/referrals`, `/membership/tiers`, `/souvenirs`, `/about`, safety page, and weather destination exist in `App.tsx`. For any missing route, fall back to the closest existing anchor (e.g. `/#faq`) and note it in the diff.
8. **Localization** — reuse existing zh-TW / zh-CN / en strings from the collapsed components; add short new keys only for card sub-copy that doesn't already exist.
9. **No changes** to booking flow, business logic, DB, or the full-page destinations — this is a homepage composition change only.

## Verification

- Load `/` and confirm the visible section count drops from ~14 to ~10, with Locations/Services/Booking still the visual anchors.
- Click each strip card and confirm it navigates to the right route.
- Switch language to zh-TW, zh-CN, and en; confirm the new strips render without missing-key warnings.
- Check mobile viewport: strips stack 2×2, `MobileTabBar` still visible, no horizontal scroll.
