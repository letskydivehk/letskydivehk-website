Add Dedicated Service Pages: Tandem Skydive & A-Licence

## Overview

Create two new dedicated service pages (`/services/tandem-skydive` and `/services/a-licence`) designed to convert visitors into bookers. Each page will act as a comprehensive landing page with persuasion elements, and we'll add "View Details" buttons on the homepage service cards to funnel users into these pages.

## Page Design (Both Pages Share This Structure)

### 1. Hero Banner

- Full-width hero with a gradient overlay background
- Service title, subtitle, and a compelling tagline
- Primary CTA: "Book Now" button (scrolls to booking or navigates to homepage booking)
- Secondary CTA: "View Locations" (scrolls to locations section on the page)

### 2. "How It Works" Timeline

- Step-by-step visual timeline showing the experience:
  - **Tandem**: Arrival > Ground Training (15 min) > Board the Plane > Freefall (60s) > Canopy Ride (5-7 min) > Landing & Celebration
  - **A-Licence**: Enroll > Ground School > AFF Levels 1-9 (progressive jumps) > Solo Jumps > Total 25 Jumps > Get Licensed
- Each step with an icon and short description

### 3. What's Included Section

- Clean checklist grid showing everything included in the service
- Pulled dynamically from the `location_services` database (aggregated across locations)

### 4. Location-Specific Pricing Table

- Cards for each location offering this service, showing:
  - Location name & country flag
  - Packages available with prices
  - "Book Now" button per card
- Data fetched from `location_services` filtered by service type

### 5. FAQ Section (Service-Specific)

- Tandem: "Do I need experience?", "What's the age/weight limit?", "Can I bring my camera?", "What if the weather is bad?"
- A-Licence: "How long does the course take?", "What are the prerequisites?", "Is the licence internationally recognized?", "What happens after I get my A-Licence?"

### 6. Social Proof Strip

- Key stats: jumps completed, safety record, years of experience
- Testimonial quote relevant to that service

### 7. Final CTA Banner

- Bold call-to-action at the bottom: "Ready to Jump?" with Book Now button

## Changes to Existing Code

### Homepage Service Cards

- Add a "View Details" link/button below or alongside the existing "Book Now" button
- Tandem card: links to `/services/tandem-skydive`
- A-Licence card: links to `/services/a-licence`
- Group Events card: keeps current "Contact Us" behavior (no dedicated page)

## Files to Create/Modify


| File                                | Action | Purpose                                                             |
| ----------------------------------- | ------ | ------------------------------------------------------------------- |
| `src/pages/ServiceTandem.tsx`       | Create | Tandem Skydive detail page                                          |
| `src/pages/ServiceALicence.tsx`     | Create | A-Licence detail page                                               |
| `src/components/ServiceHero.tsx`    | Create | Reusable hero banner for service pages                              |
| `src/components/HowItWorks.tsx`     | Create | Step-by-step timeline component                                     |
| `src/components/ServicePricing.tsx` | Create | Location-specific pricing cards                                     |
| `src/components/ServiceFAQ.tsx`     | Create | Service-specific FAQ accordion                                      |
| `src/components/ServiceCTA.tsx`     | Create | Bottom CTA banner                                                   |
| `src/components/Services.tsx`       | Modify | Add "View Details" button to tandem & A-Licence cards               |
| `src/App.tsx`                       | Modify | Add routes for `/services/tandem-skydive` and `/services/a-licence` |
| `src/contexts/LanguageContext.tsx`  | Modify | Add translation keys for new page content                           |


## Technical Details

- Service pages use the existing `useAllLocationServices()` hook filtered by `service_type` to show real pricing per location
- "Book Now" buttons use the existing `BookingContext` to preselect location + service type and navigate to `/#booking`
- SEO component added to each page with service-specific title, description, and JSON-LD `Service` schema
- Pages follow the existing design system (same fonts, colors, `clean-border`, `elevated-shadow`, motion animations)
- Translation keys added for both EN and ZH-TW
- Mobile-responsive layout throughout