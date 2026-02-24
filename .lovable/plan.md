

## Mobile-Friendly Payment for WeChat Pay, FPS, and AlipayHK

### Problem

When a customer is on a mobile device, QR-code-based payment methods (WeChat Pay, FPS, AlipayHK) don't work because the user cannot scan a code displayed on the same screen they're using.

### Solution

Configure the Airwallex Drop-in element to use **redirect/deep-link flows** on mobile devices instead of displaying QR codes. Airwallex supports this via the `autoRedirect` and `methods` configuration options. On mobile, the SDK can open the payment app directly (e.g., WeChat, AlipayHK) using a URL scheme redirect, then return the user to the booking page after payment.

### How It Works

```text
Mobile User clicks "WeChat Pay"
  --> Airwallex redirects to WeChat app (deep link)
  --> User confirms in WeChat
  --> Browser returns to booking page with payment result
  --> Booking proceeds to confirmation
```

### Changes

#### 1. Update `src/components/BookingSection.tsx`

- Detect mobile using the existing `useIsMobile()` hook
- Pass mobile-specific configuration to the Airwallex `createElement('dropIn', ...)` call:
  - Set `autoRedirect: true` so wallet-based methods open via deep link instead of QR
  - Set `successUrl` and `failUrl` to redirect back to the booking page after payment
  - Add `environment` detection to ensure proper redirect handling
- Add a `useEffect` to handle the return from a redirect flow: check URL params for payment status on mount, and if found, verify the payment and advance to confirmation

#### 2. Update `src/components/BookingSection.tsx` -- redirect return handling

- On component mount, check for Airwallex redirect query parameters (`?payment_intent_id=...&status=...`)
- If present, call the `verify-payment` edge function to confirm, then auto-advance to the confirmation step
- Clean the URL params after processing

#### 3. Update `src/contexts/LanguageContext.tsx`

- Add translation for a mobile payment redirect notice, e.g. "You will be redirected to complete payment in your app"

### Technical Detail

Key configuration change in `initAirwallexDropIn`:

```typescript
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

const element = Airwallex.createElement('dropIn', {
  intent_id: intentId,
  client_secret: clientSecret,
  currency: 'HKD',
  mode: 'payment',
  autoCapture: true,
  // Mobile: redirect to payment app instead of showing QR
  ...(isMobile && {
    autoRedirect: true,
    successUrl: `${window.location.origin}/#booking?payment_status=success&payment_intent_id=${intentId}`,
    failUrl: `${window.location.origin}/#booking?payment_status=failed`,
  }),
});
```

### Files to Modify

| File | Purpose |
|---|---|
| `src/components/BookingSection.tsx` | Add mobile detection, redirect config, and return-from-redirect handling |
| `src/contexts/LanguageContext.tsx` | Add redirect notice translation strings |

