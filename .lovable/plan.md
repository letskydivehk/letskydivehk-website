

# Phase 3 & 4: Blog 知識庫 + 會員忠誠度計劃

---

## Part A: Blog 知識庫

### Database

Create a `blog_posts` table:
- `id` uuid PK
- `slug` text unique (URL path)
- `title` text, `title_zh_tw` text, `title_zh_cn` text
- `content` text (markdown), `content_zh_tw` text, `content_zh_cn` text
- `excerpt` text, `excerpt_zh_tw` text, `excerpt_zh_cn` text
- `cover_image` text (URL)
- `category` text (e.g. `guide`, `tips`, `news`)
- `tags` text[]
- `is_published` boolean default false
- `published_at` timestamptz
- `author_name` text
- `created_at`, `updated_at`
- `display_order` integer default 0

RLS: publicly viewable (WHERE `is_published = true`), admin-only insert/update/delete.

### Pages & Components

1. **`/blog`** — Blog listing page with category filters (All / Guides / Tips / News), search, and cards showing cover image, title, excerpt, date
2. **`/blog/:slug`** — Blog detail page with markdown rendering (use `react-markdown`), SEO meta tags, related posts sidebar
3. **Admin blog editor** at `/admin/blog` — Create/edit posts with markdown preview, image URL input, publish toggle. Admin-only access via `has_role` check

### Navigation
- Add "Blog" link to `PageNavbar` between existing nav items

### SEO
- Each blog post gets its own `<SEO>` with title, description (excerpt), and cover image as og:image
- Add `BlogPostJsonLd` structured data

### Translations
- Blog content uses per-column translations (`title_zh_tw`, etc.)
- UI chrome (category labels, "Read more", etc.) added to LanguageContext

### Seed Data
- Insert 3-4 starter articles: "First Time Skydiving Guide", "What to Wear", "Tandem vs AFF", "Safety FAQ"

---

## Part B: 會員忠誠度計劃 (Loyalty Program)

### Database

Create a `membership_tiers` table (reference/config):
- `id` uuid PK
- `name` text (Bronze / Silver / Gold / VIP)
- `name_zh_tw` text, `name_zh_cn` text
- `min_jumps` integer (0 / 3 / 10 / 25)
- `credit_multiplier` numeric default 1.0 (1x / 1.5x / 2x / 3x)
- `perks` text[] (list of benefits)
- `perks_zh_tw` text[], `perks_zh_cn` text[]
- `display_order` integer

Add columns to `profiles`:
- `total_jumps` integer default 0
- `tier_id` uuid FK → membership_tiers

RLS: tiers publicly viewable; profiles already have user-only update.

### Tier Logic
- Tier is determined by `total_jumps` count
- Admin can update `total_jumps` via the existing admin dashboard
- Credit multiplier applies to referral bonuses (update `process_referral_credit` to check tier)

### UI Changes

1. **MemberProfile page** — Add a "Membership Tier" card showing:
   - Current tier name + badge icon (color-coded)
   - Progress bar to next tier
   - Jump count
   - List of current perks
   - Credit multiplier display

2. **Loyalty Program page** (`/membership/tiers`) — Public-facing page showing all tiers, benefits comparison table, and CTA to sign up

3. **Birthday bonus** — Add `date_of_birth` column to `profiles`; a DB function or edge function can check and auto-grant birthday credits (can be a future cron job)

### Translations
- Add tier names, perk descriptions, and UI labels to LanguageContext

---

## Implementation Order

1. Blog database + RLS + seed data
2. Blog listing page (`/blog`)
3. Blog detail page (`/blog/:slug`)
4. Admin blog editor
5. Membership tiers table + profile columns
6. Loyalty tier UI on MemberProfile
7. Public tiers comparison page
8. Nav updates + translations for both features

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `supabase/migrations/` | New migration for `blog_posts` + `membership_tiers` + profile columns |
| `src/pages/Blog.tsx` | New — blog listing |
| `src/pages/BlogPost.tsx` | New — blog detail |
| `src/pages/AdminBlog.tsx` | New — admin editor |
| `src/pages/MembershipTiers.tsx` | New — public tiers page |
| `src/pages/MemberProfile.tsx` | Edit — add tier card |
| `src/components/PageNavbar.tsx` | Edit — add Blog link |
| `src/App.tsx` | Edit — add routes |
| `src/contexts/LanguageContext.tsx` | Edit — add translations |
| `src/components/SEO.tsx` | Reuse for blog SEO |

