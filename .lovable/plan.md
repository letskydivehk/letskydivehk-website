## Audit Summary

I tested the site at mobile (390×844), tablet (820×1180), and inspected key pages. The codebase is mostly solid — translations, quiz lead form, promotions, and location detail all render. Below are the real bugs I found.

### Issues found

**1. "AFF" / "Accelerated Freefall" wording violates the project rule**
The memory rule says always use "A-Licence" and never "AFF Course". 30+ user-facing strings still say "AFF" or "Accelerated Freefall (AFF)" in all 3 languages. Examples:
- Hero description (EN/zh-TW/zh-CN): "AFF (Accelerated Freefall) 加速自由落體認證課程"
- Footer description: "AFF課程及團體活動"
- Services / locations pills: "AFF", "AFF課程"
- ServiceALicence page: hero, steps, FAQs, testimonial all say "AFF"
- Quiz result description: "AFF program will take you from student to licensed skydiver"
- Gallery video tab: "AFF Course Videos"
- SEO meta tags

Internal identifiers (route keys, DB column `has_aff`, asset `aff-training-curriculum.png`, gallery sub-tab key `aff_videos`, translation keys `servicePage.aff.*`) will be left as-is — those are not user-visible.

**2. Tablet navbar (768–1024px) overflows badly**
At 820px width, the desktop nav (`md:flex`) becomes visible with 8 nav links + logo + lang switcher + auth + (no mobile button). Each Chinese link wraps to 2–3 lines, producing a tall, broken header.

**Fix**: Raise the desktop-nav breakpoint to `lg:` (1024px) and keep the hamburger visible until `lg:`. Apply the same in `Hero.tsx` if it has its own top nav.

**3. Location detail page has no top navbar**
`/location/:slug` renders only a "返回首頁" back link — no `PageNavbar`, no language switcher, no auth button. Inconsistent with every other route.

**Fix**: Add `<PageNavbar />` to `src/pages/LocationDetail.tsx` and adjust the top spacing.

**4. Mobile hero text overlaps the parachuter image**
On 390px width, the Chinese description spans 3 lines and visually crashes into the falling skydiver illustration behind it. Adding a stronger backdrop (slight dark gradient under the text block, mobile only) restores readability.

**5. Footer text clipped by floating WhatsApp button on mobile**
The fixed WhatsApp bubble overlaps footer copy at the bottom of short pages (Quiz, Promotions). Add `pr-16` (or extra bottom padding on `<Footer>` on mobile) so text never sits beneath the button.

### Plan

1. **Replace AFF copy in `src/contexts/LanguageContext.tsx`** for EN, zh-TW, zh-CN:
   - "AFF (Accelerated Freefall)" / "Accelerated Freefall (AFF)" / "AFF course" / "AFF program" → "A-Licence course" / "A 級執照課程" / "A级执照课程"
   - Sentinel locations: lines 35, 49, 99, 341, 400, 402, 754, 757, 761, 764, 782, 789, 815, 828, 875, 1107, 1166, 1168, 1496, 1499, 1502, 1504, 1519, 1524, 1549, 1562, 1609, 1841, 1900, 1902, 2230, 2233, 2236, 2238, 2253, 2258, 2507, 2554, 2601, 2832, 2856, 2879
   - Also `src/pages/ServiceALicence.tsx` lines 59–60 (hardcoded SEO title/description)

2. **Tablet navbar fix** in `src/components/PageNavbar.tsx` and `src/components/Hero.tsx` (if it has nav):
   - Change `hidden md:flex` → `hidden lg:flex` for desktop links
   - Change `md:hidden` → `lg:hidden` for the hamburger button + mobile drawer
   - Verify mobile drawer still appears at 820px

3. **Add `PageNavbar` to LocationDetail**:
   - Import and render `<PageNavbar />` at top of `src/pages/LocationDetail.tsx`
   - Add `pt-24` (or matching) to the main content wrapper to clear the fixed nav
   - Move/remove the standalone "返回首頁" link if redundant (or keep below nav)

4. **Mobile hero readability** in `src/components/Hero.tsx`:
   - Add a subtle dark overlay or text shadow behind the description paragraph on `sm:` and below

5. **Footer/WhatsApp clearance**:
   - Add bottom padding to `<Footer>` (`pb-20 md:pb-12`) so text isn't covered by the floating WhatsApp bubble

6. **Verify** in preview at 390px and 820px after changes; spot-check zh-TW, zh-CN, EN.

### Out of scope
- Renaming DB columns / asset filenames / translation keys containing `aff` (internal only)
- Adding new translations beyond the AFF wording fix
- Restructuring quiz flow or recommendations
