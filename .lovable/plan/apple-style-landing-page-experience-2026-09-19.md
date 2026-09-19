# Apple-style landing-page experience

## Direction

Retain **Let’s Skydive HK** as the only brand. Redesign the opening experience as a cinematic dark sequence using the existing skydiver footage, electric cyan instrumentation, warm orange actions, restrained glass surfaces, and large clean typography. After this opening, transition back into the existing light-sky homepage so the booking content remains familiar and readable.

## What will change

### 1. Scroll-driven opening experience

- Replace the current single-screen hero with a desktop/tablet pinned sequence spanning roughly `300vh`.
- Reuse the three existing skydiver video clips as the visual story: aircraft exit, terminal-velocity freefall, and canopy/landing.
- Tie local scroll progress to the sequence with smooth request-animation-frame interpolation, without downloading hundreds of image frames.
- Keep the existing Let’s Skydive HK navigation, language selector, member controls, quiz, video, and booking actions working.
- Preserve autoplay looping when the user is not actively scrubbing the story.

### 2. Three localized story moments

Add Traditional Chinese, English, and Simplified Chinese copy for:

1. **Step to the Edge** — jump from up to 14,000 feet above striking scenery.
2. **200 KPH Terminal Velocity** — around 60 seconds of freefall on eligible packages.
3. **Soft Touchdown** — a smooth canopy flight and panoramic landing approach.

Each moment will fade and scale with its own scroll range. Claims will be phrased as experience highlights rather than guarantees, because altitude and freefall duration vary by location and package.

### 3. Live experience HUD

- Add a compact translucent control bar within the pinned experience.
- Show simulated altitude descending from 15,000 FT to 2,500 FT, phase-aware speed, current story phase, and scroll progress.
- Clearly treat the figures as experience visualization rather than live customer telemetry.
- Prevent clashes with the existing mobile booking bar and desktop sticky booking bar.

### 4. Mobile and accessibility behavior

- On mobile, use a shorter cinematic story with the existing autoplay/crossfade videos and scroll-triggered copy rather than aggressive video seeking, which is unreliable on iOS.
- Load later clips progressively instead of preloading the full current video set at once.
- For reduced-motion users, show a static poster with all essential copy and actions in a normal-height section—no pinned scrolling.
- Maintain keyboard focus, readable contrast, semantic headings, and stable layout at all supported viewport sizes.

### 5. Integrate existing content instead of inventing packages

- Restyle the existing location-driven services as the “Choose Your Jump” area; do not add unavailable products such as a Night Jump.
- Keep the real current offerings: Shenzhen indoor skydiving, tandem, A-Licence, tours, and groups, with live pricing from the existing service data.
- Refine the existing Safety section into an interactive expandable gear-and-safety grid using current translated safety content.
- Keep the existing five-step booking form and real date picker as the conversion destination; hero actions will scroll into this established flow rather than create a second booking system.

### 6. Homepage flow and visual transition

- Place trust and eligibility signals inside the end of the dark opening sequence so they support conversion without adding another tall block.
- Transition cleanly from the dark experience into the current promotion, departures, locations, services, and booking content.
- Preserve the compact strips introduced to shorten the homepage and avoid duplicating Safety, Jump Day, or booking content.
- Limit the new dark tokens and glass styling to the opening experience so other pages and the established light-sky design remain unchanged.

## Technical approach

- Split the oversized hero into focused navigation, media-sequence, story-copy, and HUD components.
- Use Framer Motion’s scoped scroll progress plus requestAnimationFrame smoothing; no Three.js and no large frame-by-frame image bundle.
- Use the existing semantic design tokens and add only scoped cinematic tokens in the global design system.
- Add all new copy in the existing three-language translation system and verify key parity.
- Preserve current booking context, service queries, video modal, authentication, and navigation behavior.

## Validation

- Check the full sequence at desktop and mobile widths, including iOS-safe fallback behavior.
- Verify all navigation, language, quiz, video, service, and booking actions.
- Verify reduced-motion mode, keyboard access, video load behavior, and no overlapping fixed controls.
- Confirm the page builds without errors and that the opening transitions cleanly into the existing light homepage.