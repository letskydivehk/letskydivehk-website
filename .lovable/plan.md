# Hero Video Background with Skydiver

Replace the Hero section's static Unsplash sky image with an autoplaying, looping, muted background video featuring a skydiver in freefall against a sky/cloud backdrop. All existing buttons, links, nav, copy, parallax, and scroll behavior stay exactly as-is.

## Changes

### 1. Generate hero video
- New asset: `src/assets/hero-skydiver.mp4` via `videogen--generate_video`.
- Prompt (draft): "Cinematic aerial footage of a tandem skydiver in freefall high above bright white clouds and a deep blue sky, arms spread, camera drifting slowly, natural sunlight, realistic, no text."
- Config: `aspect_ratio: "16:9"`, `resolution: "1080p"`, `duration: 10`, `camera_fixed: false`.
- Poster fallback: keep the current Unsplash URL as `poster` for instant first paint and reduced-motion users.

### 2. `src/components/Hero.tsx`
- Replace the parallax background `<motion.div>` (currently `backgroundImage: url(...unsplash...)`) with a `<motion.video>`:
  - `autoPlay`, `loop`, `muted`, `playsInline`, `preload="auto"`, `poster={unsplashUrl}`
  - Positioned `absolute inset-0`, `object-cover w-full h-full scale-110`
  - Same parallax transform (`style={{ y: bgY }}`)
  - `aria-hidden`, `tabIndex={-1}`
- Keep the dark gradient `<motion.div>` overlay on top (unchanged) so text stays legible.
- If `window.matchMedia('(prefers-reduced-motion: reduce)').matches`, render the poster image instead of the video.

### Explicitly unchanged
- "Book Now" button → still calls `scrollToLocations()`.
- "Take the Quiz" link → still routes to `/quiz`.
- "Watch Video" button → still opens `VideoModal` (separate YouTube embed, unrelated to background).
- Navbar, mobile menu, language switcher, auth button, credit pill, scroll indicator — untouched.

## Out of scope
- No changes to `VideoModal.tsx` or its YouTube source.
- No copy, layout, color, or animation-timing changes.
- No new dependencies.

## Files touched
- `src/assets/hero-skydiver.mp4` (new, generated)
- `src/components/Hero.tsx`
