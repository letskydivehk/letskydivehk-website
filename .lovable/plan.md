

## Fix: "Most Popular" Badge Clipping in Services Section

The badge uses `absolute -top-3` to position it above the card, but the card has `overflow-hidden` which clips the top half of the badge.

### Solution
Remove `overflow-hidden` from the service card container so the badge can extend above the card boundary without being clipped.

### Change
In `src/components/Services.tsx`, remove `overflow-hidden` from the card's className (around line 133).

