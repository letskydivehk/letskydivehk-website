# Apple-style cinematic homepage, preserving the original hero

## Direction

Restore the previous full-screen, continuously looping skydiver video hero exactly as the opening experience, including its existing navigation, three-video crossfade, parallax, language/member controls, mobile menu, video modal, and button destinations. The Apple-style cinematic treatment will begin below the hero and continue cohesively through the full homepage.

## What will change

### 1. Restore and protect the hero

- Restore the previous 30-second looping skydiver hero instead of the new pinned scroll sequence.
- Preserve all current hero actions and destinations, including locations, booking, quiz/video, gallery, blog, promotions, souvenirs, member controls, and language switching.
- Preserve autoplay recovery, reduced-motion poster fallback, mobile navigation, and the existing full-screen height.
- Remove the separate cinematic hero components and hero-only telemetry/story translations that are no longer used.

### 2. Create a cinematic visual system below the hero

- Apply a premium dark, high-contrast visual direction to every homepage section after the hero, using deep charcoal surfaces, electric cyan information accents, warm orange actions, restrained glass panels, and crisp large typography.
- Replace the current alternating light-sky blocks with one continuous cinematic page canvas and controlled tonal transitions between sections.
- Keep the established Let’s Skydive HK identity and semantic design tokens; do not rename the experience or apply this redesign to other pages.
- Suppress the current decorative cloud background on the homepage body below the hero where it conflicts with the cinematic treatment.

### 3. Restyle the complete homepage journey

- Restyle the promotion ribbon, social proof, next departure, quiz/referral/rewards/souvenirs strip, locations, services, booking, weather, jump-day links, testimonials, FAQ, safety, timeline, about, contact, and footer.
- Use editorial section spacing, oversized headings, fine divider lines, selective glass surfaces, image-led location cards, and subtle cyan/orange instrumentation details.
- Keep real database-driven locations, services, prices, departures, weather, testimonials, and booking information unchanged.
- Keep the compact homepage structure; the redesign will not add long duplicate sections or another pinned sequence.

### 4. Refine interaction and motion

- Add restrained scroll reveals, subtle depth and hover responses, animated progress/divider details, and polished section transitions.
- Keep existing tabs, carousels, accordions, weather controls, safety expansions, forms, date selection, and booking/payment flow fully functional.
- Use touch-friendly alternatives on mobile and respect reduced-motion preferences throughout.

### 5. Responsive and accessibility treatment

- Ensure glass panels, grids, form controls, weather content, location imagery, and fixed booking controls fit cleanly across mobile, tablet, and desktop.
- Maintain semantic headings, keyboard focus, readable contrast, and stable dimensions without overlapping the sticky booking controls.
- Preserve all three languages and verify long Chinese and English text fits the redesigned layouts.

## Technical approach

- Restore `Hero` from its previous working implementation and remove its dependency on the new cinematic hero/navigation components.
- Introduce homepage-scoped cinematic tokens and reusable section/card styles so other routes keep their current appearance.
- Update the existing homepage components in place rather than duplicating their data or business logic.
- Use the existing Framer Motion setup for lightweight reveal and interaction effects; no canvas frame bundle or additional video downloads below the hero.

## Validation

- Verify the restored hero autoplays, loops continuously, crossfades all three clips, and retains every button’s behavior.
- Review the entire homepage at desktop, tablet, and mobile sizes in all three languages.
- Test locations, services, booking, weather, carousel, FAQ, safety, contact, navigation anchors, and fixed controls.
- Verify reduced-motion behavior, keyboard access, contrast, page performance, and a clean production build.
