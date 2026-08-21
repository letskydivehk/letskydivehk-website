# Preview sent newsletters from history

## Goal
In the admin newsletter panel, clicking a record in the "History" (sent) list opens a preview of exactly what was emailed.

## What changes
- Each sent record becomes clickable (row hover + cursor), opening a dialog.
- Dialog shows:
  - Subject (Traditional Chinese + English)
  - Sent date and recipient count
  - Hero image
  - Rendered body content for both languages, in the same email layout/styling
- Close button; read-only (no editing of sent articles).
- Same preview is also available for queued drafts via a "Preview" button, so admins can check appearance before approving.

## Technical notes
- File: `src/components/admin/AdminNewsletterPanel.tsx`
  - Add local state `previewArticle` and a shadcn `Dialog` rendering the email preview.
  - Fetch already includes `select("*")`, so `hero_image_url` and bodies are available; add these fields to the local `Article` interface.
- Rendering: mirror the email markup from `supabase/functions/_shared/newsletter-email.ts` in a small React preview component (`NewsletterPreview`) inside the admin folder — paragraphs, `- ` bullets, `**bold**` — displayed inside a scrollable white card so it looks like the delivered email. No edge function or database changes.
- New translation keys (zh-TW / zh-CN / en) for "Preview" and dialog title, added following the existing `admin.newsletter.*` pattern with full trilingual parity.
