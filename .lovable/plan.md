# Plan: Maximize Membership System Usage

Goal: turn the existing membership/credits/tiers/referral infrastructure into a daily-driver loyalty engine that pulls users back into booking, sharing, and upgrading tiers.

## Diagnosis (what we already have)
- Tiers: `membership_tiers` with credit multipliers + perks.
- Credits: `credit_transactions` (signup bonus 100, referral 100 pending approval, admin adjustments).
- Referrals: unique `referral_code` per profile, anti-fraud + monthly cap.
- Profile page (`/membership`), Tiers page, Admin hub.
- Bookings linked to user + selected_promos.

What's underused: visibility of credits, tier progression, referral sharing, re-engagement loops, and credit-driven upsells in the booking funnel.

---

## Phase 1 — Visibility & Activation (highest ROI, low effort)

1. **Global credit pill in navbar** (signed-in only): shows balance + tier badge; click → /membership. Makes credits feel like real money.
2. **Post-signup welcome modal**: celebrates the $100 signup bonus and shows "$X off your first jump" math + one-click "Book now".
3. **Booking funnel credit upsell**:
   - Show "Apply X credits = save $X" toggle at checkout (already partially via promos — formalize as line item).
   - Show tier multiplier preview: "You'll earn 1.5× credits = +$Y on this booking."
4. **Sticky tier-progress bar** on /membership: "2 more jumps to Gold — unlock 2× credits."

## Phase 2 — Referral Amplification

1. **Share sheet on /membership**: native share + WhatsApp/IG/copy-link with pre-filled Trad-Chinese / EN message and `?ref=CODE` deep link.
2. **Referral landing treatment**: when `?ref=` present, show banner "Your friend gave you $100 + extra $50 first-jump bonus" and auto-fill code in booking.
3. **Two-sided reward**: keep referrer $100, add $50 first-booking credit for referee (new `credit_transactions` type `referee_bonus`, granted on first paid booking).
4. **Referral leaderboard** (monthly, opt-in) on /membership — top 10 referrers win bonus credits; drives virality.
5. **Email/WhatsApp nudge** via existing Resend function: "You're 1 referral away from a free tandem video upgrade."

## Phase 3 — Retention & Re-engagement

1. **Credit expiry policy** (soft): credits expire 12 months after issuance. Show "Expiring soon: $X by DD/MM" → forces re-booking. Implement via `expires_at` column + scheduled edge function reminder.
2. **Birthday bonus**: $50 credit on `date_of_birth` month (already collected). Cron edge function.
3. **Win-back campaign**: any user inactive 90 days → email with personal credit code (e.g. $100 one-time).
4. **Jump anniversary**: 1 year since last jump → "Welcome back" $150 credit.
5. **Streak rewards**: 3 bookings in 6 months → free handicam upgrade.

## Phase 4 — Tier-Driven Upsell

1. **Tier perks made tangible** on every service card: "Gold members save HK$300 on this package."
2. **Tier-gated promos**: certain promo codes only valid for Silver+; surfaces aspiration to upgrade.
3. **Fast-track upgrades**: "Buy A-Licence → instant Gold for 12 months" — converts course buyers into loyalty.
4. **Member-only inventory**: early-access weekend slots for Gold/Platinum at Zhuhai dropzone.

## Phase 5 — Social Proof & Identity

1. **Public member badge**: shareable card "I'm a Gold Skydiver at Let's Skydive HK" (image gen + OG meta) — viral loop.
2. **Member wall**: avatar grid on homepage of recent jumpers (opt-in) → social proof + member pride.
3. **Logbook on /membership**: chronological jumps with location photo + downloadable PDF certificate per jump.

## Phase 6 — Measurement

Add analytics events (PostHog-style or simple table):
- `credit_pill_clicked`, `share_link_copied`, `referral_signup`, `credit_applied_at_checkout`, `tier_upgraded`.
Track KPIs: % signed-in bookings, credits-applied rate, referrals/month, repeat-booking rate, tier distribution shift.

---

## Suggested execution order (build mode)

| Wave | Items | Why first |
|------|-------|-----------|
| 1 | Credit pill, welcome modal, checkout credit upsell, tier progress bar | Unlocks value of existing $100 bonus immediately |
| 2 | Share sheet, ?ref banner, two-sided reward | Compounding growth loop |
| 3 | Birthday + win-back + expiry reminders (edge functions) | Retention with minimal UI |
| 4 | Tier-gated promos, fast-track upgrades, member-only slots | Revenue per member |
| 5 | Shareable badge, logbook, member wall | Brand & identity |

## Technical notes
- New columns: `credit_transactions.expires_at timestamptz`, `profiles.last_jump_at date`.
- New tx types: `referee_bonus`, `birthday_bonus`, `winback_bonus`, `streak_bonus`, `expiry_adjustment`.
- New edge functions (cron via pg_cron + supabase scheduled): `expire-credits`, `birthday-credits`, `winback-emails`.
- Reuse Resend for all emails; reuse `send-notification` pattern.
- Keep all RLS — only admin functions write credits; user reads own via existing policy.
- i18n: every new string in EN / 繁中 / 簡中 (繁中 authoritative).

## Out of scope (won't touch)
- Payment provider (Airwallex stays).
- Existing booking deposit flow.
- Admin role model.

Reply "go" with any wave number(s) and I'll start building.
