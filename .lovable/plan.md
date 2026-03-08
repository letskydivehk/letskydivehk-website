

# Issue Analysis & Fix Plan

## What You Already Have

1. **Payment collection** — Yes, Step 5 of your booking flow already has the Airwallex Drop-in widget collecting HKD $500 deposits. This is working.

2. **Confirmation emails** — The `send-notification` edge function already sends:
   - Admin notification email (working)
   - Customer booking confirmation email (working, but may hit rate limits)
   - Welcome email to new members (failing due to rate limits)

## Issues Found

### Issue 1: Welcome email fails due to Resend rate limit (429)
The logs show:
```
rate_limit_exceeded: Too many requests. You can only make 2 requests per second.
```
The edge function sends the admin email and welcome email simultaneously, hitting Resend's free-tier limit of 2 req/sec. The same happens for booking emails (admin + customer fire at once).

### Issue 2: Registration notification fires on every login
The `AuthContext.tsx` triggers `send-notification` with `type: 'registration'` on every `SIGNED_IN` event — not just the first registration. This means every Google sign-in sends duplicate welcome emails and admin notifications.

### Issue 3: `getClaims()` may not exist
The edge function uses `supabaseClient.auth.getClaims(token)` which is not a standard Supabase JS method. This could silently fail, blocking registration emails.

## Fix Plan

### 1. Fix AuthContext — only send registration notification on first sign-up
- Check if the profile already exists before sending the registration notification
- Only invoke `send-notification` for `type: 'registration'` when the profile is newly created (INSERT, not UPDATE)

### 2. Fix edge function — add delay between emails to avoid rate limiting
- Add a small delay (e.g., 1 second) between sending the admin email and the customer/welcome email
- Replace `getClaims()` with `supabase.auth.getUser()` which is the standard method

### 3. Add `send-notification` to config.toml
- Currently missing from `supabase/config.toml`, which means JWT verification defaults may block booking notifications (sent without auth for anonymous bookings)
- Add `[functions.send-notification]` with `verify_jwt = false` (the function handles its own auth logic internally)

## Files to Modify
- `src/contexts/AuthContext.tsx` — Only send registration email on first sign-up
- `supabase/functions/send-notification/index.ts` — Add delay between emails, fix auth method
- `supabase/config.toml` — Add `send-notification` function config

