# Project Architecture Rules

- Keep homepage visual overrides scoped under `.sky-reflection-home` so service, location, legal, and admin pages retain their own presentation.
- Use native scrolling and Framer Motion for homepage cinematic sequences, with linear reduced-motion and short-viewport fallbacks; native anchors and booking navigation must remain usable.
- Do not wrap the homepage in a transformed route-transition container; it captures fixed navigation, while clipping horizontal page overflow preserves native sticky scrolling.
- Keep cinematic homepage presentation in focused home components and its localized copy in the shared language dictionary; this isolates motion from booking and data logic.