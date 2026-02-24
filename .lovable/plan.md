

## Minimize Airwallex Payment Intent Costs

### Problem

Every time the user reaches the payment step, a new Airwallex Payment Intent is created via the Edge Function. If the user navigates back and forward, or if the component re-renders/remounts, multiple intents can be created -- each potentially incurring Airwallex fees for pending transactions.

### Current Safeguard

There is already a guard (`if (paymentClientSecret) return;`) that prevents duplicate calls within the same render lifecycle. However, this is insufficient because:
- Going back to "details" and forward again calls `createPaymentIntent()` again, and while `paymentClientSecret` is still in state it works, the drop-in gets re-initialized
- A page refresh or component remount loses all state, creating a brand new intent
- Abandoned intents accumulate on the Airwallex side

### Solution: Reuse Existing Payment Intents

Two changes to minimize unnecessary intent creation:

#### 1. Cache the Payment Intent in `sessionStorage`

Store the `payment_intent_id` and `client_secret` in `sessionStorage` when first created. On subsequent visits to the payment step, check `sessionStorage` first and reuse the existing intent instead of creating a new one.

This covers:
- Back/forward navigation within the booking flow
- Accidental page refreshes during the booking process

#### 2. Skip re-initializing the Airwallex Drop-in if already mounted

Before calling `initAirwallexDropIn`, check if the payment container already has a mounted element. If the drop-in is already rendered, skip the re-initialization.

### Files to Modify

| File | Change |
|---|---|
| `src/components/BookingSection.tsx` | Add sessionStorage caching for payment intent; skip drop-in re-init if already mounted |

### Technical Detail

**`createPaymentIntent` updated logic:**

```typescript
const createPaymentIntent = async () => {
  // Check in-memory state first
  if (paymentClientSecret && paymentIntentId) {
    initAirwallexDropIn(paymentClientSecret, paymentIntentId);
    return;
  }

  // Check sessionStorage for a previously created intent
  const cached = sessionStorage.getItem('booking_payment_intent');
  if (cached) {
    const { client_secret, payment_intent_id } = JSON.parse(cached);
    setPaymentClientSecret(client_secret);
    setPaymentIntentId(payment_intent_id);
    initAirwallexDropIn(client_secret, payment_intent_id);
    return;
  }

  // Only now create a new intent
  setIsPaymentLoading(true);
  try {
    const { data, error } = await supabase.functions.invoke('create-payment-intent', {
      body: { amount: 500, currency: 'HKD' },
    });
    if (error) throw error;
    setPaymentClientSecret(data.client_secret);
    setPaymentIntentId(data.payment_intent_id);
    // Cache for reuse
    sessionStorage.setItem('booking_payment_intent', JSON.stringify({
      client_secret: data.client_secret,
      payment_intent_id: data.payment_intent_id,
    }));
    setTimeout(() => initAirwallexDropIn(data.client_secret, data.payment_intent_id), 100);
  } catch (error) { ... }
};
```

**Clear cache on successful booking or full reset:**

```typescript
// After successful booking submission
sessionStorage.removeItem('booking_payment_intent');
```

### What This Does NOT Change

- No database or Edge Function changes needed
- No changes to the payment verification flow
- The Airwallex Drop-in configuration stays the same

### Cost Impact

- Users who navigate back/forward or refresh will reuse the same intent instead of creating a new one
- Only one intent per booking session, regardless of how many times the payment step is visited
