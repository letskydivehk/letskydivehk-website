# Light Apple-style sky homepage

## Direction

Keep the existing full-screen looping video hero completely unchanged. Redesign everything beneath it using the selected **Sky Reflection Light** direction: a bright high-altitude canvas, white translucent surfaces, crisp navy typography, cool blue details, and the existing orange action colour.

## What will change

### 1. Replace the dark homepage layer
- Replace the current homepage-only dark cinematic palette with pale sky blue, soft white, cool grey-blue borders, and subtle reflected-light transitions.
- Keep the treatment scoped below the hero so other pages and the video opening do not change.
- Carry the light treatment through the footer for one continuous homepage experience.

### 2. Refine the opening handoff
- Keep trust badges and age, weight, and health eligibility visible immediately below the hero on every screen size.
- Restyle the promotion, social proof, featured Shenzhen departure, and four quick links as a clean editorial sequence with translucent white surfaces and precise spacing.
- Preserve the current promotion timer, departure information, links, translations, and actions.

### 3. Apply the selected style throughout
- Restyle locations, services, booking, weather, jump-day links, testimonials, FAQ, safety, timeline, about, contact, and footer consistently.
- Use existing real location and service imagery as the main visual anchors.
- Use fewer floating containers: full-width light bands for sections, with glass cards reserved for actual selectable or repeated items.
- Keep section order and the current compact homepage length unchanged.

### 4. Apple-style polish
- Use restrained shadows, thin cool-blue separators, clear information hierarchy, and generous but controlled spacing.
- Add subtle image zoom, surface highlight, button lift, and scroll-reveal motion while respecting reduced-motion settings.
- Retain orange for primary booking actions, blue for information, and emerald for safety and eligibility.

### 5. Preserve all functionality
- Keep all navigation, language switching, account controls, booking and payment steps, date selection, weather controls, tabs, carousels, accordions, forms, WhatsApp links, and fixed mobile controls working as they do now.
- Preserve all three languages and all database-driven content.

## Technical approach

- Rename the below-hero styling wrapper to reflect the new light system and replace its scoped semantic colour variables in the global stylesheet.
- Add homepage-scoped surface, divider, shadow, image, and motion rules rather than changing global colours or unrelated pages.
- Adjust individual homepage sections only where their current dark-specific classes need a light-mode equivalent.
- Do not add external imagery, invented copy, packages, or new functionality.

## Validation

- Compare the complete homepage at desktop, tablet, and phone widths, including the transition directly below the hero.
- Verify readable contrast, long Chinese and English text, card alignment, forms, weather panels, footer, and fixed controls.
- Test navigation anchors and the main interactive flows, then confirm a clean build with no runtime errors.
