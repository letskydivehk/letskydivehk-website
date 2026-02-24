

## Integrate Airwallex $500 Deposit Payment into Booking Flow

### Overview

Add a payment step to the booking flow that collects a **HKD $500 deposit** via Airwallex before finalizing the booking. The new step sits between "Fill Details" and "Confirmation."

### Updated Booking Flow

```text
Location > Service > Details > Payment ($500) > Confirmation
```

The progress stepper updates from 4 steps to 5 steps.

### Architecture

```text
Browser                        Edge Function                 Airwallex API
  |                                |                              |
  |-- 1. Create Payment Intent --> |                              |
  |                                |-- 2. POST /payment_intents ->|
  |                                |<- 3. client_secret ----------|
  |<- 4. Return client_secret ----|                              |
  |                                                               |
  |-- 5. Airwallex Drop-in UI (card entry) ---------------------->|
  |<- 6. Payment confirmed -------|-------------------------------|
  |                                                               |
  |-- 7. Submit booking (existing RPC) -->                        |
  |-- 8. Show confirmation page                                   |
```

### Prerequisites -- Airwallex API Keys

Airwallex requires two secrets:
- **AIRWALLEX_API_KEY**: Your Airwallex API key
- **AIRWALLEX_CLIENT_ID**: Your Airwallex client ID

These will be stored as Supabase Edge Function secrets and used server-side only. The frontend only receives the `client_secret` to render the payment form.

You can obtain these from the [Airwallex Dashboard](https://www.airwallex.com/app/account/apiKeys) under Settings > API Keys.

### Changes

#### 1. New Edge Function: `supabase/functions/create-payment-intent/index.ts`

- Authenticates with Airwallex using `AIRWALLEX_CLIENT_ID` + `AIRWALLEX_API_KEY` to get a bearer token
- Creates a Payment Intent for HKD $500 (amount: 50000 in minor units)
- Returns `{ client_secret, payment_intent_id }` to the frontend
- Includes CORS headers and input validation

#### 2. New Edge Function: `supabase/functions/verify-payment/index.ts`

- Takes a `payment_intent_id` and verifies the payment status with Airwallex
- Returns `{ status, verified: true/false }` so the frontend can confirm payment before submitting the booking
- Prevents users from bypassing the payment step

#### 3. Update `supabase/config.toml`

- Add `verify_jwt = false` entries for both new edge functions

#### 4. Update `src/components/BookingSection.tsx`

- Add a new `"payment"` step between `"details"` and `"confirm"`
- Update the `Step` type: `"location" | "service" | "details" | "payment" | "confirm"`
- Update the steps array to include 5 steps (adding a Payment/CreditCard icon step)
- After user fills details and clicks "Next," they land on the payment step
- The payment step:
  - Calls the `create-payment-intent` edge function to get a `client_secret`
  - Loads the Airwallex Drop-in payment element using their JS SDK
  - On successful payment, stores the `payment_intent_id` in state
  - Calls `verify-payment` edge function to confirm server-side
  - Then proceeds to submit the booking via existing `create_booking` RPC and shows confirmation
- Update `handleNext`, `handleBack`, and `canProceed` to handle the new step

#### 5. Update `index.html`

- Add the Airwallex JS SDK script tag

#### 6. Update `src/contexts/LanguageContext.tsx`

- Add translation keys for the payment step (EN + ZH-TW):
  - `booking.step3b` (Payment), deposit amount label, payment processing messages, error messages

#### 7. Update `bookings` table (DB migration)

- Add `payment_intent_id` (text, nullable) column to store the Airwallex payment intent ID
- Add `deposit_amount` (integer, nullable, default 500) column
- Add `payment_status` (text, nullable, default null) column
- Update `create_booking` RPC to accept and store `p_payment_intent_id`

### Files to Create/Modify

| File | Action | Purpose |
|---|---|---|
| `supabase/functions/create-payment-intent/index.ts` | Create | Server-side Airwallex payment intent creation |
| `supabase/functions/verify-payment/index.ts` | Create | Server-side payment verification |
| `supabase/config.toml` | Modify | Add JWT config for new functions |
| `src/components/BookingSection.tsx` | Modify | Add payment step with Airwallex Drop-in |
| `src/contexts/LanguageContext.tsx` | Modify | Add payment-related translation keys |
| `index.html` | Modify | Add Airwallex SDK script |
| DB migration | Create | Add payment columns to bookings table |

### Security Considerations

- Airwallex API keys are stored server-side only (Supabase secrets)
- Payment intent is created server-side; frontend only receives `client_secret`
- Server-side verification ensures payment actually completed before booking is finalized
- The `payment_intent_id` is stored in the bookings table for reconciliation

