

## Fix Multiple Gateway Fees for FPS/QR Code Payments

### Root Cause

The 5x gateway fee issue stems from multiple problems in the payment initialization flow:

1. **`Airwallex.createElement('dropIn', ...)` is called every time** the user navigates to the payment step -- even when reusing a cached intent. Each `createElement` call may register as a new payment attempt with Airwallex, incurring fees.

2. **Event listeners accumulate**: `onSuccess` and `onError` listeners are added on every call to `initAirwallexDropIn` but never removed. This causes duplicate event handling.

3. **No concurrency guard**: Rapid double-clicks on "Next" can trigger multiple simultaneous `createPaymentIntent` calls before the state updates.

### Solution

#### 1. Only call `initAirwallexDropIn` once per intent

Track whether the drop-in has already been initialized for the current intent using a `ref`. Skip the entire `createElement` + `mount` + event listener setup if the drop-in is already active for this intent.

#### 2. Clean up event listeners properly

Store event listener references and remove them before adding new ones (or skip adding if already attached).

#### 3. Add a concurrency lock to `createPaymentIntent`

Use a `ref`-based lock (`isCreatingIntent`) to prevent concurrent calls from double-clicks or rapid navigation.

### Files to Modify

| File | Change |
|---|---|
| `src/components/BookingSection.tsx` | Add drop-in initialization tracking ref, event listener cleanup, and concurrency lock |

### Technical Detail

**New refs:**

```typescript
const airwallexInitializedForIntent = useRef<string | null>(null);
const isCreatingIntent = useRef(false);
```

**Updated `createPaymentIntent`:**

```typescript
const createPaymentIntent = async () => {
  // Concurrency lock
  if (isCreatingIntent.current) return;

  // Check in-memory state -- skip if drop-in already initialized for this intent
  if (paymentClientSecret && paymentIntentId) {
    if (airwallexInitializedForIntent.current === paymentIntentId) return;
    initAirwallexDropIn(paymentClientSecret, paymentIntentId);
    return;
  }

  // Check sessionStorage
  const cached = sessionStorage.getItem('booking_payment_intent');
  if (cached) { ... same logic but also check airwallexInitializedForIntent ... }

  // Lock before creating
  isCreatingIntent.current = true;
  // ... create intent ...
  // Unlock in finally block
  isCreatingIntent.current = false;
};
```

**Updated `initAirwallexDropIn`:**

```typescript
const initAirwallexDropIn = async (clientSecret, intentId) => {
  // Skip if already initialized for this exact intent
  if (airwallexInitializedForIntent.current === intentId) return;

  // ... existing createElement + mount logic ...

  // Mark as initialized
  airwallexInitializedForIntent.current = intentId;

  // Remove previous listeners before adding new ones
  window.removeEventListener('onSuccess', successHandler);
  window.removeEventListener('onError', errorHandler);
  window.addEventListener('onSuccess', successHandler);
  window.addEventListener('onError', errorHandler);
};
```

**Reset tracking on form reset:**

```typescript
airwallexInitializedForIntent.current = null;
isCreatingIntent.current = false;
```

### Result

- Only **one** `createElement` call per payment intent, no matter how many times the user navigates back/forward
- No duplicate event listeners
- No race conditions from rapid clicks
- Combined with the existing `sessionStorage` cache, this ensures exactly one payment intent and one drop-in initialization per booking session

