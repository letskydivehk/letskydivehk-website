

# Show Per-Package Includes in Service Pricing

## Current Behavior
The `ServicePricing` component merges all `includes` from every package at a location into one combined list (deduped, max 5 items). This means users cannot see what's specifically included in each package.

## Desired Behavior
Show includes **per service** instead of merged, so each package row displays its own inclusions:

- **Tandem Skydive with Handicam**: 手持攝影錄影, 完成證書, 45-60秒自由落體, 5-7分鐘傘下飛行
- **Tandem Skydive with Video** (Pattaya): 錄影, 完成證書, 45-60秒自由落體, 5-7分鐘傘下飛行
- **Ultimate Combo**: same as Handicam + Wide shot video

The DB already has all the correct data and translations exist. No database changes needed.

## Changes

### `src/components/ServicePricing.tsx`

Restructure the card layout so each service row expands to show its own includes below the service name/price/button row:

```
┌─────────────────────────────────┐
│ 🇹🇭 Pattaya, Thailand           │
│                                 │
│ Tandem with Video    $7,200 [Book]│
│   ✓ 錄影                        │
│   ✓ 完成證書                     │
│   ✓ 45-60秒自由落體              │
│   ✓ 5-7分鐘傘下飛行              │
│                                 │
│ Ultimate Combo       $9,500 [Book]│
│   ✓ 錄影                        │
│   ✓ 照片                        │
│   ✓ 完成證書                     │
│   ✓ 45-60秒自由落體              │
│   ✓ 5-7分鐘傘下飛行              │
└─────────────────────────────────┘
```

- Remove the merged "What's Included" section at the bottom of each card
- Add per-service includes list directly below each service row
- Each include item uses `translateData('include.${item}', item)` (already working)

### File Changes

| File | Action |
|------|--------|
| `src/components/ServicePricing.tsx` | Restructure to show per-package includes |

No database or translation changes needed — all data and translations already exist.

