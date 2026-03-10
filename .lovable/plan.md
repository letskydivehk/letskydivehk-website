

## Fix: Dark navbar visibility on Gallery and Promotions pages

### Problem
The `PageNavbar` component uses theme-based colors (`bg-foreground`, `text-background`) and has `fixed` positioning with `z-[110]`. Both Gallery and Promotions wrap it in another `fixed` div at `z-50` with a `container` class that constrains width, creating z-index conflicts and layout issues. The navbar ends up barely visible against the light page background.

### Solution
Update `PageNavbar` to use explicit dark colors (`bg-black`, `text-white`) matching the homepage Hero navbar style, and remove the unnecessary wrapper divs in Gallery and Promotions pages.

### Changes

**1. `src/components/PageNavbar.tsx`**
- Change `bg-foreground/90` → `bg-black/90` and `bg-foreground/95` → `bg-black/95`
- Change all `text-background` → `text-white`
- Change `bg-background/10` → `bg-white/10` and `bg-background/20` → `bg-white/20`
- Change mobile panel `bg-foreground/95` → `bg-black/95`
- Change `border-background/10` → `border-white/10`

**2. `src/pages/Gallery.tsx`**
- Remove the wrapper `<div className="fixed top-0 left-0 right-0 z-50">` with its dark background layer
- Use `<PageNavbar />` directly (it already has its own fixed positioning)

**3. `src/pages/Promotions.tsx`**
- Same removal of wrapper div, use `<PageNavbar />` directly

