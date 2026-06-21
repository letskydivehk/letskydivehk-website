## Goal
Add a "Quick highlights" section to each day in the tour itinerary that is visible at a glance and tap-to-expand for full detail. Improves scanability on both mobile and desktop without losing the existing morning/afternoon/evening structure.

## What changes for the user
- Each day card shows 2–4 highlight chips right under the day title (e.g. "Tandem skydive", "Sanctuary of Truth", "Walking Street").
- A "Highlights" header is tappable — collapses/expands the chips to keep the card compact on small screens.
- On first load, highlights are expanded; the existing morning/afternoon/evening segments remain below, unchanged.
- Localized via the existing `translateData("tour.highlight.<key>", ...)` pattern, so EN/繁中/简中 all work.

## Data model
Extend `ItineraryDay` with one optional field — no schema migration needed (`itinerary` is already a JSONB array):

```ts
interface ItineraryDay {
  ...
  highlights?: string[]   // 2-4 short labels per day
}
```

Backfill the 4 agency-style tours (Hainan 3D2N, Hainan 4D3N, Pattaya 3D2N, Pattaya 4D3N) via a single `UPDATE` on `location_services.itinerary` to add a `highlights` array per day. Example for Pattaya 3D2N Day 2: `["Tandem skydive", "Nong Nooch Garden", "Alcazar Cabaret"]`.

For tours without `highlights`, the component falls back to auto-deriving the first item from each populated period — so older itineraries still get a highlights strip.

## UI changes (single file: `src/components/tour/TourItinerary.tsx`)
Inside the active-day card, between the day title and the segments list:

```text
┌───────────────────────────────────────────────┐
│ [Day 2]  Sky & Culture                        │
│                                               │
│ ✨ Quick highlights              [chevron]    │  ← tap to collapse
│ ┌─────────┐ ┌──────────────┐ ┌────────────┐  │
│ │ Tandem  │ │ Nong Nooch   │ │ Alcazar    │  │
│ └─────────┘ └──────────────┘ └────────────┘  │
│                                               │
│ ☀ Morning  · Tandem skydive over Haitang …   │
│ ☀ Afternoon · Nong Nooch Tropical Garden     │
│ 🌙 Evening · Alcazar Cabaret                  │
└───────────────────────────────────────────────┘
```

- Chips use accent-orange tinted background, rounded-full, `text-xs md:text-sm`, wrap on mobile.
- Header row: Sparkles icon + "Quick highlights" label + count badge + animated chevron. Whole row is the toggle button (large tap target).
- Smooth height/opacity transition via `framer-motion` `AnimatePresence` (matches existing segment transitions).
- Collapsed state persists per day via local state keyed by day number.
- Sparkles icon import from `lucide-react`.

## Localization
- Add 3 translation keys: `tour.quickHighlights`, used in EN/繁中/简中 (`快速亮點` / `快速亮点` / `Quick highlights`).
- Highlight labels are passed through `translateData("tour.highlight.<label>", label)` so future translations can be added without code changes.

## Implementation steps
1. Update `ItineraryDay` type in `src/hooks/useLocationServices.ts` to add `highlights?: string[]`.
2. Update `TourItinerary.tsx`:
   - Derive `highlights` for the active day (use `current.highlights` or fall back to first item of each non-empty segment, capped at 3).
   - Insert a collapsible "Quick highlights" block above the segments map.
   - Per-day collapse state stored in a `Record<number, boolean>`.
3. Add `tour.quickHighlights` translations in the language context's strings file.
4. Run an `UPDATE` on `location_services` to attach `highlights` arrays to the 4 agency-style tours (data-only, no schema change).

## Out of scope
- No DB schema migration (JSONB already supports the new field).
- No changes to `AdminItineraryComparePanel` or `previousItineraries.ts`.
- No design changes to the day tab selector or segment rows.
