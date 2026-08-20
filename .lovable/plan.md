# Bi-weekly Skydiving Knowledge Newsletter

An automated email that goes out to membership accounts every 2 weeks with skydiving knowledge (safety, gear, first-jump tips) plus a booking invitation. Articles are drafted by AI, but nothing is sent until you approve it. Each email contains both Traditional Chinese and English in one message, and every email has an unsubscribe link.

## How it works

```text
AI drafts 5 upcoming articles  ->  Admin reviews / edits / approves
                                        |
                        every 2 weeks (Tue 10:00 HKT, pg_cron)
                                        |
              picks the next APPROVED article, not yet sent
                                        |
        sends TC+EN email to all subscribed profiles (batched)
                                        |
                 marks it sent, logs recipient count
```

If no approved article is queued, the run does nothing and flags it in the admin panel — it never sends an unapproved draft.

## What you will see in the admin area

A new **Newsletter** tab in `/admin/credits`:
- **Queue**: the next 5 upcoming articles with status badges (Draft / Approved / Sent), scheduled send date, subject and body in both languages.
- **Edit**: inline editing of subject and body (TC and EN) before approving.
- **Approve / Unapprove** and **Reorder** buttons.
- **Generate drafts with AI**: one click tops the queue back up to 5 drafts from a rotating topic list; you can also type your own topic hint.
- **Send test to me**: sends the selected article to one address so you can check it before approving.
- **History**: past sends with date and recipient count.
- **Subscriber count**: how many members will receive the next one.

## Member-facing changes

- Unsubscribe link in every email footer -> a public `/unsubscribe` page that confirms the opt-out using a signed token (no login needed).
- A "Skydiving knowledge emails" toggle on the member profile page, so members can opt back in.

## Technical details

**Database (migration)**
- `newsletter_articles`: id, `queue_position`, `status` (draft/approved/sent), `subject_zh_tw`, `subject_en`, `body_zh_tw`, `body_en`, `topic`, `hero_image_url`, `scheduled_for`, `sent_at`, `recipients_count`, `created_by`, timestamps. Admin-only RLS via `has_role(auth.uid(),'admin')`; grants to `authenticated` + `service_role`.
- `newsletter_sends`: article_id, user_id, email, sent_at, status — idempotent per (article_id, email) unique key so a re-run never double-sends.
- `profiles`: add `newsletter_opt_in boolean not null default true` and `unsubscribe_token uuid default gen_random_uuid()`.
- `newsletter_job_state`: single row with `lease_expires_at`, `paused`, `pause_reason` — single-flight lock + circuit breaker.

**Edge functions**
- `newsletter-generate` (admin JWT checked in code): calls Lovable AI Gateway (`google/gemini-2.5-flash`) to produce TC+EN subject/body JSON for a topic, inserts as `draft`. Handles 402/403/429 per gateway semantics and surfaces the message.
- `newsletter-send`: cron entry point. Acquires the lease, exits if paused or already leased, picks the oldest approved unsent article, sends via Resend in bounded batches (e.g. 50 per run, resumable), writes a `newsletter_sends` row per recipient in the same step, marks the article `sent` when the recipient list is exhausted. Pauses the job on repeated failures.
- `newsletter-unsubscribe` (public): validates the token, sets `newsletter_opt_in = false`.
- Email HTML reuses the branded layout already in `expire-credits` (logo + hero image, `no-reply@letskydivehk.com`, reply-to `letskydivehk@gmail.com`), with a TC block, a divider, then the EN block, a "立即預約 / Book now" CTA, and the unsubscribe footer.

**Schedule**
- `pg_cron` job every 2 weeks (runs weekly, function itself enforces the 14-day gap so odd/even week drift can't double-send).

**Frontend**
- `src/components/admin/AdminNewsletterPanel.tsx` + new tab in `src/pages/AdminCredits.tsx`.
- `src/pages/Unsubscribe.tsx` route, lazy-loaded via `lazyWithRetry`.
- Newsletter toggle in `ProfileModal` / member profile.
- New translation keys added to `src/contexts/translationsMissing.ts` for all three languages.
