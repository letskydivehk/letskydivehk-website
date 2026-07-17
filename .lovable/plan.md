## Goal

Restructure the rewards program so the magnet ladder is presented as **part of the member tier rewards** (not a parallel program), and remove all video / photo / media package perks from the tier benefits.

## Current state (verified)

- `MembershipTiers.tsx` has 3 tabs: **Points / Magnets / Tiers** — Magnets and Tiers are separate.
- `membership_tiers` rows (queried live) contain these to-be-removed perks:
  - Gold: `Free photo package upgrade` / `免費相片套餐升級` / `免费相片套餐升级`
  - Platinum: `Free video package` / `免費影片套餐` / `免费影片套餐`
  - Diamond: `All media packages included` / `所有媒體套餐` / `所有媒体套餐`
- Tier names (Silver/Gold/Platinum/Diamond) and jump thresholds (0/3/5/10) already map 1-to-1 to the magnet ladder (1/3/5/10) → natural merge.
- `RewardsTeaser.tsx` on the homepage links to `?tab=points` and `?tab=magnets`.

## Changes

### 1. Database migration — clean & enrich tier perks
Update `membership_tiers.perks`, `perks_zh_tw`, `perks_zh_cn`:

- **Remove** the three media/photo/video lines listed above.
- **Add** a magnet-reward line to each tier so the ladder lives inside the tier perks:
  - Silver → "Exclusive Silver magnet (1st jump) + 5% off next jump coupon"
  - Gold → "Exclusive Gold magnet (3rd jump) + 10% off next jump coupon"
  - Platinum → "Exclusive Platinum magnet (5th jump) + 15% off next jump coupon"
  - Diamond → "Exclusive Diamond magnet (10th jump) + Hall of Fame + lifetime 20% off"

(Trilingual, wording drawn from existing `rewardsCopy.perkSilver…perkDiamond`.)

### 2. `src/pages/MembershipTiers.tsx` — collapse tabs to 2
- Remove the **Magnets** tab. Keep **Points** and **Tiers**.
- Inside each tier card, render a small magnet chip (using `magnetTiers` color + `Award` icon) above the perks list to visually anchor the reward.
- Redirect any incoming `?tab=magnets` to `?tab=tiers` for backward compat with old links / teaser cards.

### 3. `src/components/rewards/RewardsTeaser.tsx` — repoint the second card
- Change the "Collect the honour magnets" card link from `?tab=magnets` to `?tab=tiers`.
- Update `teaserMagnetsBody` copy slightly to make it clear the magnets come **with** each member tier.

### 4. `src/lib/rewardsCopy.ts` — copy tweaks only
- Update `teaserMagnetsBody` (trilingual) to reference tier rewards.
- No changes to magnet tier data (`magnetTiers`) or the standalone magnet visuals used on the member profile page (`MagnetShowcase` stays as personal collection view).

### Out of scope (unchanged)
- `MagnetLadder` component file — kept in repo but no longer routed to. (Not deleting to avoid churn; can remove later if you want.)
- Member profile page magnet showcase — remains as user's personal collection UI.
- Points program logic and edge functions.

## Result

The rewards page becomes: **Points** and **Tiers** (with magnets shown inline per tier). Photo/video/media packages disappear from all three languages. Magnet ladder is clearly framed as the reward you unlock by reaching the corresponding member tier.
