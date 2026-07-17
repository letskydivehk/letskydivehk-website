## Problem (verified via DB query)

The `membership_tiers` row for Platinum has two data issues:

1. `name` is stored as `"Platinum "` (with a trailing space). `MembershipTiers.tsx` matches the magnet by `magnet.key.toLowerCase() === tier.name.toLowerCase()` — the space breaks the match, so the Platinum magnet image + "白金色 · 第 5 跳" chip never render.
2. `perks` array is missing the magnet/coupon reward and still contains `"Free video package"`:
   - Current: `["2x referral bonus", "VIP priority booking", "Free video package", "Birthday bonus credits", "Exclusive event invitations"]`

Silver / Gold / Diamond rows already follow the pattern `"Exclusive <Tier> magnet (Nth jump) + X% off next jump coupon"`, so Platinum should match.

Note: the user's message wrote "限量銀色磁石貼" for Platinum, but every other tier uses its own colour (Silver→silver, Gold→gold, Diamond→diamond) and `rewardsCopy.perkPlatinum` already reads "贈送磁石貼 ＋ 下次跳傘 85 折優惠券". I'll use the Platinum magnet to stay consistent with the pattern — please flag if you actually want the Silver magnet awarded at the Platinum tier.

## Change

Single data migration on `public.membership_tiers` for the Platinum row:

- Trim `name` → `"Platinum"` (fixes missing magnet image + name chip via the existing lookup).
- Replace `perks` with:
  ```
  [
    "2x referral bonus",
    "VIP priority booking",
    "Birthday bonus credits",
    "Exclusive event invitations",
    "Exclusive Platinum magnet (5th jump) + 15% off next jump coupon"
  ]
  ```
  (removes "Free video package"; adds the magnet/coupon perk in the same slot the other tiers use.)

No code changes — `MembershipTiers.tsx` already renders the magnet image from `magnetTiers` and localizes perk strings via `getLocalizedArray`, and `rewardsCopy.perkPlatinum` already provides the zh-TW / zh-CN translations.

## Verification

- Re-query `membership_tiers` after the migration to confirm `name = 'Platinum'` (no trailing space) and the updated `perks` array.
- Reload `/membership/tiers?tab=tiers` and confirm the Platinum card shows the Platinum magnet image, the "白金色 · 第 5 跳" chip, and the localized perk line, with no "免費影片套餐".
