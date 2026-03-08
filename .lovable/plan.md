

# Record Selected Promotions in Supabase

## What We Need

Currently, `formData.selectedPromos` (an array of promo codes like `["BUDDY100", "STUDENT100"]`) is collected during booking but never saved to the database. We need to persist this data for follow-up.

## Approach

### 1. Add `selected_promos` column to `bookings` table
- New column: `selected_promos text[] DEFAULT '{}'::text[]`
- A text array storing the selected promo code IDs

### 2. Update `create_booking` RPC function
- Add a new parameter `p_selected_promos text[] DEFAULT '{}'::text[]`
- Insert the value into the new column
- Update all 3 overloaded versions of the function (or the primary one used)

### 3. Update BookingSection.tsx
- Pass `p_selected_promos: formData.selectedPromos` in the `supabase.rpc("create_booking", ...)` call

### 4. Update notification email
- Include selected promos in the notification body so admin can see them

## Files to Modify
- **Database migration**: Add column + update RPC function
- `src/components/BookingSection.tsx`: Pass `p_selected_promos` to RPC call

## Technical Detail
The migration SQL will:
1. `ALTER TABLE bookings ADD COLUMN selected_promos text[] DEFAULT '{}'::text[];`
2. `CREATE OR REPLACE FUNCTION create_booking(...)` — add the new parameter and include it in the INSERT

No RLS changes needed since the existing INSERT policy doesn't restrict specific columns, and the RPC uses `SECURITY DEFINER`.

