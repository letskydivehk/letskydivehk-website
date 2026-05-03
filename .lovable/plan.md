## Goal
Treat quiz lead submissions as account registrations so each new lead receives the existing $100 signup credit automatically.

## How it works today
- `auth.users` insert → trigger `handle_new_user` creates a `profiles` row → trigger `on_profile_created_grant_credit` runs `grant_signup_credit` and inserts a `+100` row in `credit_transactions`.
- Quiz lead form currently inserts into `quiz_leads` only — no auth user is created, so no credit is granted.

## Plan

### 1. New edge function: `register-quiz-lead`
Public function (verify_jwt = false). Validates `full_name`, `phone`, `email` (Zod) plus quiz fields, then:

1. Use the service-role client to look up an existing auth user by email (`auth.admin.listUsers` filtered by email).
2. If the user does NOT exist:
   - Call `supabase.auth.admin.createUser({ email, email_confirm: true, user_metadata: { full_name, phone, signup_method: 'quiz' } })`.
   - This fires `handle_new_user` → profile row → `grant_signup_credit` → $100 credit. No extra DB work needed.
   - Generate a magic-link / recovery link via `auth.admin.generateLink({ type: 'magiclink', email, options: { redirectTo: <site>/auth/callback } })` and email it through Resend so the user can claim the account and see their credit. Subject in current language ("Your $100 skydiving credit is ready").
   - If they sign up later through the normal flow with the same email, the trigger has already fired so no double credit.
3. If the user already exists: do not create, do not grant credit. Optionally send a "welcome back" magic link (same generateLink call) so they can log in and use whatever balance they have.
4. Insert the `quiz_leads` row (server-side, with the same validation we already have) including `user_id` resolved from step 1/2.
5. Return `{ ok: true, recommendation: { service, location_slug }, isNew: boolean }`.

Secrets: uses existing `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_URL`, `RESEND_API_KEY`. Add `verify_jwt = false` entry in `supabase/config.toml`.

### 2. Quiz.tsx changes
Replace the direct `supabase.from('quiz_leads').insert(...)` with `supabase.functions.invoke('register-quiz-lead', { body: { ...lead, answer_code, recommended_service, recommended_location_slug, language } })`.

Update the lead form copy to set expectations:
- Subtitle becomes (localized): "We'll email you a login link and credit your account with $100 to use on your first booking."
- A small note under the submit button: "By continuing you agree to create a Let's Skydive HK account."

After success, navigate to `/quiz/result` exactly as today. If the function returns `isNew: true`, show a toast: "Check your inbox — your $100 credit and login link are on the way."

### 3. No DB schema migration required
- The $100 grant is already wired through `handle_new_user` + `grant_signup_credit`.
- `quiz_leads` already accepts the same fields; we just keep inserting it from the edge function.

### 4. Anti-abuse
- Edge function rate-limits by email + IP (in-memory per cold start is fine for now; reuse pattern from `send-notification` if present, otherwise: simple Map with 1 submission / 60s per email).
- Email format + length checks duplicated server-side via Zod (defence in depth on top of the existing RLS check constraint).
- We do NOT grant a second credit for emails that already have an account — handled implicitly because we only call `createUser` when none exists.

### Files touched
- `supabase/functions/register-quiz-lead/index.ts` (new)
- `supabase/config.toml` (add `[functions.register-quiz-lead] verify_jwt = false`)
- `src/pages/Quiz.tsx` (swap insert for function invoke, update copy + toast)

### Out of scope
- Changing the credit amount or eligibility rules.
- Auto-signing-in the browser session (we deliberately email a magic link instead — the form is anonymous and we don't have a password).