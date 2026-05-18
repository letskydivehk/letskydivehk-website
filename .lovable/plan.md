## Findings: Booking notification flow

I traced the entire booking flow and tested the email function live against Resend. Here is what I found.

### Flow today (src/components/BookingSection.tsx, handleSubmit)
1. `verify-payment` (pre-check)
2. `create_booking` RPC inserts the booking row
3. `verify-payment` again to write `payment_status` onto the row — **NOT wrapped in try/catch**
4. `send-notification` (wrapped in its own try/catch, fire-and-forget)

### What I tested
- Called the deployed `send-notification` function with a real booking row (id `2cd5aefe...`, customer `sputnik5866@gmail.com`).
- Response: **HTTP 200**, Resend returned message IDs for both the admin email (`letskydivehk@gmail.com`) and the customer email. Resend accepted the sends. `RESEND_API_KEY` is configured.
- So the edge function and Resend pipeline are working when reached with valid data.

### Why the admin inbox may still look empty
There are two distinct issues. They are likely both contributing.

**A. Emails are being sent but not landing in the inbox**
- Sends from `noreply@letskydivehk.com` will be rejected or junked by Gmail if `letskydivehk.com` is not fully verified in Resend (SPF/DKIM/DMARC). Resend's API still returns 200 + id even if the actual SMTP delivery later fails — delivery failures only show in the Resend dashboard.
- Even when verified, mail from your own domain landing in your own Gmail often goes to **Spam** or **All Mail**, not Inbox. Worth checking those folders and Resend's "Logs" / "Emails" tab to see delivery vs bounce status.

**B. The code path can silently skip the notification**
- Step 3 (`verify-payment` post-booking write) is `await`ed with **no try/catch**. If that call throws (network blip, 5xx, CORS, etc.), execution jumps to the outer catch on line 519 and `send-notification` (step 4) is never invoked. The booking row already exists, so from the user's perspective everything looks fine, but no email ever fires.
- `send-notification` also requires `bookingData?.id` AND `bookingData?.access_token` to validate. If the RPC ever returns a shape without `access_token`, the function returns 404 "Booking not found" and the email is dropped. (Today the rows do have `access_token`, so this is not currently the cause, but it's fragile.)

### Proposed fix (for the next build step, not applied yet)
1. **Wrap the post-booking `verify-payment` call in try/catch** so a failure there cannot prevent `send-notification` from running.
2. **Move the `send-notification` call so it runs regardless of the post-booking verify result** (it already has its own try/catch).
3. **Check Resend dashboard** (`Logs` and `Domains`) to confirm `letskydivehk.com` is verified and that recent admin sends were actually delivered, not bounced/blocked. If the domain is not verified, finish DNS verification — that alone explains a silent failure to receive in `letskydivehk@gmail.com`.
4. **Check `letskydivehk@gmail.com` Spam, All Mail, and Gmail filters** for messages from `noreply@letskydivehk.com` — Gmail very often junks self-domain mail.
5. Optional hardening: log the Resend message id into `email_send_log` (or a simple `booking_notifications` table) so future "did the email send?" questions are answerable from the DB instead of guessing.

### What I need from you before I implement
- Can you confirm in the Resend dashboard whether `letskydivehk.com` shows as **Verified** and whether recent admin emails show as **Delivered** or **Bounced/Blocked**?
- Did you check Spam and All Mail in `letskydivehk@gmail.com`?

Once you confirm those, I'll apply the code hardening in step 1–2 (and optionally 5) in one pass.
