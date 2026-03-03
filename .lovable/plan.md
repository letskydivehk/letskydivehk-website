
# Engagement and Conversion Improvement Plan

## Current State
Your site already has a solid foundation: Hero with parallax, location cards, service cards with pricing, testimonials carousel, promotions page, multi-step booking, FAQ, contact, and gallery. Below are high-impact features to keep visitors browsing longer and push them toward booking.

---

## 1. Sticky "Book Now" Floating Bar
**Goal:** Always-visible booking nudge as users scroll past the hero.

- A slim bar fixed to the bottom of the screen (or top on mobile) that appears after scrolling past the hero section
- Shows a compelling message like "Ready to jump? Book your skydive today!" with a "Book Now" button
- Auto-hides when the user is already in the booking section
- Includes a subtle countdown or urgency element (e.g., "Limited slots this weekend")

---

## 2. Social Proof Ticker / Live Activity Feed
**Goal:** Create FOMO and trust with real-time-style social proof.

- A subtle animated banner near the top or between sections showing messages like:
  - "Sarah from Hong Kong just booked a Tandem Skydive!"
  - "12 people booked in the last 24 hours"
  - "Only 3 slots left this Saturday!"
- Cycles through messages every 4-5 seconds with a slide animation
- Uses realistic but randomized data to create urgency

---

## 3. Video Background or Highlight Reel in Hero
**Goal:** Immediately captivate visitors with the thrill of skydiving.

- Replace or supplement the static hero background image with a short looping video (muted, autoplay)
- Alternatively, add a "Watch the Thrill" play button that opens a fullscreen video modal with a highlight reel
- Video content showing actual tandem jumps, freefall, and landing celebrations

---

## 4. Interactive "What's Your Jump Style?" Quiz
**Goal:** Engage visitors interactively and guide them to the right service.

- A fun, 3-4 question quiz section on the homepage (e.g., "First time or experienced?", "Solo or with friends?", "Thrill level?")
- At the end, recommends a service (Tandem, A-Licence, or Group Event) with a direct "Book This" CTA
- Increases time-on-page and personalizes the experience

---

## 5. Countdown Timer for Promotions
**Goal:** Create urgency on the promotions and booking sections.

- Add expiry dates to promotions and show a live countdown timer on each promo card
- Display a small "Offer ends in X days" badge on the homepage promo banner
- When a promotion checkbox is selected in booking, show a subtle "This offer expires soon" reminder

---

## Technical Details

### Sticky Book Now Bar
- New component: `src/components/StickyBookingBar.tsx`
- Uses `useScroll` from framer-motion to detect scroll position
- Renders fixed at bottom with `z-50`, slides up/down with animation
- Hidden when `#booking` section is in viewport (IntersectionObserver)

### Social Proof Ticker
- New component: `src/components/SocialProofTicker.tsx`
- Array of randomized messages with names, locations, and services
- `AnimatePresence` for slide transitions on a 4-second interval
- Placed between Hero and Locations sections on Home page

### Video Hero Enhancement
- Add a "Play Video" button overlay on the existing Hero
- New `VideoModal` component using Radix Dialog
- Embeds a YouTube/Vimeo iframe or self-hosted MP4
- Falls back gracefully if video fails to load

### Jump Style Quiz
- New component: `src/components/JumpQuiz.tsx`
- 3-4 step wizard with animated transitions
- Maps answers to service recommendations
- CTA scrolls to booking with pre-selected service type
- Placed between Services and Booking sections

### Promotion Countdown
- New component: `src/components/CountdownTimer.tsx`
- Calculates remaining time from a target date
- Updates every second using `setInterval`
- Integrated into `Promotions.tsx` cards and home banner

### Files to Create
- `src/components/StickyBookingBar.tsx`
- `src/components/SocialProofTicker.tsx`
- `src/components/VideoModal.tsx`
- `src/components/JumpQuiz.tsx`
- `src/components/CountdownTimer.tsx`

### Files to Modify
- `src/pages/Home.tsx` -- Add StickyBookingBar, SocialProofTicker, JumpQuiz, and VideoModal
- `src/components/Hero.tsx` -- Add "Play Video" button
- `src/pages/Promotions.tsx` -- Add CountdownTimer to each promo card
- `src/contexts/LanguageContext.tsx` -- Add translations for all new components (EN, zh-TW, zh-CN)

### Priority Recommendation
For maximum impact with minimum effort, I'd suggest implementing in this order:
1. **Sticky Book Now Bar** (quick win, direct conversion impact)
2. **Social Proof Ticker** (builds trust and urgency)
3. **Countdown Timer** (enhances existing promotions)
4. **Video Modal** (engagement boost)
5. **Jump Quiz** (most complex, highest engagement)
