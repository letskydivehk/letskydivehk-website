

# Polish Blog Content Page Design

## Current Issues
- Plain white layout with no visual hierarchy
- Markdown table renders as basic unstyled HTML table
- No visual separation between sections
- Cover image has no overlay or depth
- Content area looks like raw text with minimal styling
- Related posts and CTA sections are bland
- No reading progress indicator or table of contents

## Design Improvements

### 1. Hero-Style Cover Image
- Full-width cover image with gradient overlay at the bottom
- Title, meta info (date, author, category badge) overlaid on the image
- Creates a magazine-style header instead of the current flat layout

### 2. Enhanced Prose / Content Styling
- Add custom styles to `index.css` for the blog prose:
  - Styled `<h2>` headings with left accent border (orange primary color)
  - Styled `<blockquote>` with sky-blue left border and subtle background
  - Better table styling: rounded corners, alternating row colors, primary header
  - Styled list items with custom bullet/checkmark colors
  - Image styling within content (rounded, shadow)
  - Better spacing between sections

### 3. Table of Contents Sidebar
- Auto-generate a sticky TOC from h2/h3 headings in the markdown content
- Appears as a floating sidebar on desktop (hidden on mobile)
- Highlights current section on scroll

### 4. Reading Progress Bar
- Thin progress bar at the top of the page showing scroll position
- Uses the primary orange color

### 5. Enhanced Related Posts Section
- Cards with hover animations, gradient overlay on images
- Show category badge and date on each related card

### 6. Improved CTA Section
- Gradient background instead of flat color
- Add a skydiving icon or illustration
- Larger, more prominent button

## Files to Modify

| File | Action |
|------|--------|
| `src/pages/BlogPost.tsx` | Major rewrite — hero cover, TOC sidebar, progress bar, enhanced layout |
| `src/index.css` | Add `.blog-prose` custom styles for tables, headings, blockquotes, lists |

## Implementation Notes
- No database changes needed
- Uses existing Tailwind classes + custom CSS for prose enhancements
- TOC generated client-side by parsing heading elements after render
- Progress bar uses scroll event listener with `useEffect`
- Responsive: TOC hidden on mobile, full-width cover on all sizes

