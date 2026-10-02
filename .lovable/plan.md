# Advanced Apple-style light-sky homepage

## Goal
Elevate every homepage section below the existing video opening into a more cinematic, editorial Apple-style experience. Preserve the hero, all real content, translations, navigation, booking flows, and section order.

## Design direction
- Use the selected **Apple-style light sky** concept: bright atmospheric backgrounds, crisp white surfaces, deep navy typography, sky-blue highlights, and restrained orange conversion accents.
- Replace the current repeated small-box rhythm with larger visual landmarks, selective bento compositions, stronger image presence, and more deliberate whitespace.
- Keep glass effects subtle and functional rather than applying blur to every surface.
- Retain the current typefaces and semantic colour system while refining scale, weight, spacing, borders, and shadows.

## Planned improvements

### 1. Smooth transition from the video opening
- Keep the existing hero implementation and controls unchanged.
- Refine the trust and eligibility area into a clean confidence band that visually bridges the video sky into the light homepage.
- Preserve trust and eligibility visibility on every viewport and in reduced-motion mode.

### 2. Create a clear editorial opening below the hero
- Combine the promotion, social proof, and featured Shenzhen iFLY departure into a stronger featured-story sequence.
- Give the next departure one prominent focal surface with date, availability, supporting details, and its existing action.
- Keep promotional copy, countdown behavior, and destinations unchanged.

### 3. Simplify exploration links
- Restyle the four exploration shortcuts as a concise editorial navigation row instead of four equally weighted utility boxes.
- Use hierarchy, icon treatment, and motion to emphasize the most useful next actions without removing any destination.

### 4. Turn locations into the visual centerpiece
- Keep China first, the country selector, live data, badges, and existing actions.
- Introduce an adaptive bento-style location layout on larger screens, using real location photography as the dominant visual material.
- Preserve a simple single-column card flow on phones with readable overlays and stable controls.
- Remove excessive tilt and zoom in favor of calm image parallax and precise elevation.

### 5. Refine services and booking progression
- Rework service cards into a cleaner product-selection system with stronger price hierarchy and less decorative repetition.
- Visually connect locations → services → booking as one continuous decision journey.
- Preserve every service type, price, inclusion, WhatsApp action, details link, and booking preselection behavior.

### 6. Upgrade supporting sections
- Weather: make current conditions and jump readiness the primary information, with forecast details progressively revealed.
- Testimonials and safety: use larger editorial statements and focused proof points rather than dense card collections.
- FAQ, timeline, about, and contact: alternate calm white and pale-sky bands to improve pacing while keeping the compact homepage structure.
- Footer: retain the verified light treatment and accessible blue hover states.

### 7. Add restrained premium motion
- Use viewport reveals, gentle image depth, and coordinated section transitions.
- Replace constant pulsing and pronounced card tilting with quieter Apple-like easing.
- Keep hover effects pointer-specific and provide complete reduced-motion fallbacks.

## Responsive and quality checks
- Verify the full homepage at desktop and phone sizes, including long Traditional Chinese labels.
- Confirm no content overlaps, inaccessible controls, unexpected blank areas, or horizontal scrolling.
- Exercise country switching, location details, service selection, booking scroll, promotion links, weather actions, FAQ, language switching, and footer links.
- Confirm only the active hero video plays and that the hero remains visually and functionally unchanged.
- Check console/runtime output and the final build.

## Technical notes
- Scope the visual system to the homepage wrapper so other pages retain their current appearance.
- Extend semantic design tokens and shared homepage classes rather than introducing hardcoded component colours.
- Refactor repeated homepage presentation patterns into focused shared styles/components where useful, without changing backend data or business logic.
