## Goal
Move the interactive map from the homepage Locations section into each individual location detail page.

## Changes

### 1. `src/components/Locations.tsx`
- Remove the `<LocationsMap />` render (line 154) and its import.

### 2. New `src/components/location/LocationMap.tsx`
- New single-location map component based on the existing `LocationsMap` logic.
- Accepts a `location` prop and renders:
  - OpenStreetMap iframe centered on that location's city coordinates (reuse the `cityCoordinates` lookup, extracted into a shared module or duplicated here).
  - "Open in Google Maps" button linking to that location's lat/lng.
  - Title/subtitle from existing `locations.map.title` / `locations.map.subtitle` translation keys.
- No country tabs / multi-location selector — this page is already scoped to one location.

### 3. `src/pages/LocationDetail.tsx`
- Import and render `<LocationMap location={location} />` in place of (or alongside) the existing `google_maps_embed_url` iframe block at ~line 364.
- Keep the existing `google_maps_embed_url` iframe as a fallback only when coordinates are missing, or replace it entirely with the new component (recommended — coordinates cover all five active dropzones).

### 4. `src/components/LocationsMap.tsx`
- Keep the file for now (referenced by translation copy). Optional cleanup: delete once nothing imports it. Confirmed only `Locations.tsx` imports it, so it can be deleted safely after step 1.

## Notes
- No DB/schema changes.
- No translation key changes — reusing `locations.map.title`, `locations.map.subtitle`, `locations.map.openGoogleMaps`.
- City coordinates stay hard-coded (same source of truth as today).