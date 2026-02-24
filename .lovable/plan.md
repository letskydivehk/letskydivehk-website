

## Reorder Booking Steps: Preview Before Payment

### Current Flow
Location > Service > Details > Payment > Confirmation (submit to DB)

### New Flow
Location > Service > Details > **Preview** > **Payment** (saves to DB + sends email after payment)

### What Changes

#### 1. Swap step order in `src/components/BookingSection.tsx`

- Rename step IDs: the current "confirm" step becomes "preview" (step 4), and "payment" becomes the final step (step 5)
- Update the `Step` type to: `"location" | "service" | "details" | "preview" | "payment"`
- Update the `steps` array so Preview (with Check icon) is step 4 and Payment (with CreditCard icon) is step 5
- Update `handleNext` navigation: details -> preview -> payment
- Update `handleBack` navigation: payment -> preview -> details
- Validation happens when moving from details to preview (same as current details -> payment)
- Payment intent is created when entering the payment step (step 5 now)

#### 2. Move booking submission into the payment success handler

Currently, `handleSubmit` is called on the confirm step's button. In the new flow:
- The **preview step** shows the booking summary (the current confirm step UI) with a "Proceed to Payment" button that advances to the payment step
- The **payment step** is the last step -- after successful payment (`onSuccess` event), the system automatically:
  1. Verifies payment server-side via `verify-payment`
  2. Calls `create_booking` RPC to save to the database
  3. Fires `send-notification` to email the admin
  4. Shows the success screen
- No separate "Confirm Booking" button needed -- payment completion triggers everything

#### 3. Update navigation buttons

- On the preview step: show "Next" button leading to payment
- On the payment step: no "Next" button (payment widget handles completion). Show a "Back" button to return to preview
- The bottom nav bar on the payment step only shows "Back" (no submit button needed since `onSuccess` handles it)

#### 4. Update `canProceed` logic

- Preview step: always true (it's just a review)
- Payment step: remove from `canProceed` since there's no manual "Next" from payment

#### 5. Update translation keys in `src/contexts/LanguageContext.tsx`

- Rename step labels: step 4 becomes "Preview" / "預覽", step 5 becomes "Payment" / "付款"
- Add any new keys needed (e.g., "booking.proceedToPayment")

### Technical Details

**Updated step definitions:**
```typescript
type Step = "location" | "service" | "details" | "preview" | "payment";

const steps = [
  { id: "location", label: t("booking.step1"), icon: MapPin },
  { id: "service", label: t("booking.step2"), icon: Plane },
  { id: "details", label: t("booking.step3"), icon: User },
  { id: "preview", label: t("booking.step4"), icon: Check },      // was "payment"
  { id: "payment", label: t("booking.step5"), icon: CreditCard },  // was "confirm"
];
```

**Payment success handler -- auto-submit booking:**
```typescript
const successHandler = async (event: any) => {
  setIsPaymentComplete(true);
  toast.success(t('booking.paymentSuccess'));
  
  // Auto-submit booking to database
  await handleSubmit();
};
```

**`handleSubmit` changes:**
- Remove the manual "Confirm Booking" button on the last step
- `handleSubmit` is called automatically from the payment success handler
- On success, set `isComplete = true` to show the success screen

**Mobile redirect return handling:**
- On successful redirect return, after verifying payment, also auto-submit the booking (same as `onSuccess`)

### Files to Modify

| File | Change |
|---|---|
| `src/components/BookingSection.tsx` | Swap preview/payment step order, move DB submission into payment success handler, update navigation logic |
| `src/contexts/LanguageContext.tsx` | Update step 4/5 label translations |
