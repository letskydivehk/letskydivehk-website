

## Add Per-Service "Book Now" Buttons in Pricing Cards

### Current Problem
Each location pricing card has a single "Book Now" button at the bottom that only books the first service (`services[0].id`). Users cannot choose a specific package (e.g., "Solo Jump" vs "Full AFF Course") directly from the pricing card.

### Solution
Replace the single bottom "Book Now" button with individual "Book Now" buttons next to each service/package row. This lets users pick exactly the service they want and skip straight to the booking details form.

### Change (1 file)
**`src/components/ServicePricing.tsx`**
- In the "Packages" list (lines 100-108), add a small "Book Now" button next to each service row's price
- Remove the single bottom CTA button (lines 127-133)
- Each row button calls `handleBookAtLocation(locationId, service.id)` with that specific service's ID

### Visual Layout Change

Before:
```text
| Service Name         Price |
| Service Name         Price |
| [====== Book Now ========] |
```

After:
```text
| Service Name    Price [Book Now] |
| Service Name    Price [Book Now] |
```

