
## Goal

Replace the current day-field layout (location/accommodation/transportation/meals/activities) with a clean **day-part timeline**: each day is split into Morning / Afternoon / Evening, and each segment holds a list of schedule items with a title and optional location. Build a polished admin editor with drag-to-reorder.

## New data shape

Each `ItineraryDay` becomes:

```
{
  day: 1,
  title?: "Arrival & Pattaya Beach",
  segments: [
    { period: "morning",   items: [{ title, location? }, ...] },
    { period: "afternoon", items: [...] },
    { period: "evening",   items: [...] }
  ]
}
```

Old fields (`location`, `accommodation`, `transportation`, `meals`, `activities`, `notes`) are dropped from the UI. They remain readable in the JSON column for backward compatibility but are no longer rendered or edited.

## Migration of existing tour data

A one-time data migration converts every existing day into the new shape:

- `activities[]` → afternoon items (title only)
- `location`, `accommodation`, `transportation`, `meals` → folded into a single afternoon/evening item each (with sensible defaults: transportation → morning, meals → evening, accommodation → evening, location → morning)
- Empty fields produce no items

This runs once via an `UPDATE` against `location_services` where `service_type = 'Tour'`.

## Frontend — `/services/skydiving-tour`

Rewrite the itinerary block in `TourCard` (`src/pages/ServiceSkydivingTour.tsx`):

- Vertical timeline with a left accent line in `accent-orange`.
- For each day: header pill "Day N — Title".
- Inside the day, three labeled segments (Morning ☀ / Afternoon ⛅ / Evening 🌙) with a small icon and translated label.
- Each item: dot marker + bold title + optional muted location (📍 prefix).
- Empty segments are hidden.
- All values go through `translateData('tour.item.<text>', text)` so Chinese translations keep working.

Add translation keys:

```
tour.morning / tour.afternoon / tour.evening  (en / zh-TW / zh-CN)
```

## Admin — `AdminToursPanel.tsx`

Rebuild the itinerary editor:

- Per day card: title input + "Add day" / delete day at top, day-reorder via up/down arrows on the card.
- Three segment blocks (Morning / Afternoon / Evening) inside each day.
- Each segment: a list of inline rows `[drag-handle | title input | location input | delete]`, plus "+ Add item" button at the bottom.
- Drag-to-reorder items within a segment using `@dnd-kit/core` + `@dnd-kit/sortable` (already lightweight; will be added as deps).
- Items can also be moved between segments by dragging across, OR via a small segment dropdown on the row (decision: keep cross-segment moves to a dropdown to keep DnD simple).
- "Save" button per tour writes the full new `itinerary` JSON back to Supabase.

## Technical details

Files touched:

```
src/hooks/useLocationServices.ts        ← new ItineraryDay/ItinerarySegment types
src/pages/ServiceSkydivingTour.tsx      ← new timeline renderer in TourCard
src/components/admin/AdminToursPanel.tsx ← new segmented editor with dnd-kit
src/contexts/LanguageContext.tsx        ← morning/afternoon/evening labels
```

DB migration (data-only, run via insert tool):

```sql
UPDATE public.location_services
SET itinerary = (
  SELECT jsonb_agg(
    jsonb_build_object(
      'day',   d->>'day',
      'title', d->>'title',
      'segments', jsonb_build_array(
        jsonb_build_object('period','morning',   'items', /* transportation+location items */),
        jsonb_build_object('period','afternoon', 'items', /* activities items */),
        jsonb_build_object('period','evening',   'items', /* meals+accommodation items */)
      )
    )
  )
  FROM jsonb_array_elements(itinerary) d
)
WHERE service_type = 'Tour';
```

New deps: `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`.

Type safety: `ItineraryDay.segments` is required after migration; renderer also tolerates legacy days (no `segments`) by treating them as empty so nothing crashes if older data sneaks in.

## Out of scope

- No changes to booking flow, deposit, or pricing.
- No changes to other service pages (Tandem, A-Licence).
- No new Chinese translations for individual schedule item text — they'll fall through `translateData` like today's tour fields, ready for admin-added translations later.
