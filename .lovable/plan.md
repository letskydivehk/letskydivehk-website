## Add 4 New Promotions to the Promotions Page

### Overview

Add four new promotion cards to the existing Promotions page, alongside the current "Buddy Deal". Each promotion will follow the same card pattern and include full trilingual translations (EN, zh-TW, zh-CN).

### New Promotions

| #   | Promotion        | Discount | Condition                       |
| --- | ---------------- | -------- | ------------------------------- |
| 1   | Student Discount | $100 off | Show valid student ID           |
| 2   | Birthday Special | $100 off | Jump during your birthday month |
| 3   | Early Bird       | 10% off  | Book 90+ days in advance        |
| 4   | Repeat Jumper    | $150 off | Returning customers             |

### Files to Modify

| File                               | Change                                                                                                                      |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `src/pages/Promotions.tsx`         | Add 4 new entries to the `promotions` array with appropriate icons                                                          |
| `src/contexts/LanguageContext.tsx` | Add translation keys for all 4 promotions in EN, zh-TW, and zh-CN                                                           |
| `src/pages/Home.tsx`               | Update the homepage banner text to mention multiple deals (optional, keep as-is if you prefer highlighting Buddy Deal only) |

### Technical Details

**1. New promotion entries in `Promotions.tsx` (added to the `promotions` array):**

```typescript
import { GraduationCap, Cake, Clock, RotateCcw } from "lucide-react";

const promotions = [
  // existing Buddy Deal...
  {
    id: "student-discount",
    icon: GraduationCap,
    titleKey: "promo.student.title",
    descKey: "promo.student.desc",
    detailsKey: "promo.student.details",
    termsKey: "promo.student.terms",
    highlight: "$100",
    highlightLabelKey: "promo.off",
    active: true,
  },
  {
    id: "birthday-special",
    icon: Cake,
    titleKey: "promo.birthday.title",
    descKey: "promo.birthday.desc",
    detailsKey: "promo.birthday.details",
    termsKey: "promo.birthday.terms",
    highlight: "$100",
    highlightLabelKey: "promo.off",
    active: true,
  },
  {
    id: "early-bird",
    icon: Clock,
    titleKey: "promo.earlybird.title",
    descKey: "promo.earlybird.desc",
    detailsKey: "promo.earlybird.details",
    termsKey: "promo.earlybird.terms",
    highlight: "10%",
    highlightLabelKey: "promo.off",
    active: true,
  },
  {
    id: "repeat-jumper",
    icon: RotateCcw,
    titleKey: "promo.repeat.title",
    descKey: "promo.repeat.desc",
    detailsKey: "promo.repeat.details",
    termsKey: "promo.repeat.terms",
    highlight: "$150",
    highlightLabelKey: "promo.off",
    active: true,
  },
];
```

**2. Translation keys (all 3 languages):**

English:

- `promo.off`: "Discount"
- `promo.student.title`: "Student Discount"
- `promo.student.desc`: "Show your valid student ID and save on your skydiving adventure!"
- `promo.student.details`: "Students get $100 off any tandem skydive package with a valid student ID."
- `promo.student.terms`: "Must present a valid student ID at check-in. Applies to tandem packages only. Cannot be combined with other promotions. One discount per person."
- `promo.birthday.title`: "Birthday Special"
- `promo.birthday.desc`: "Celebrate your birthday with an unforgettable skydive and save!"
- `promo.birthday.details`: "Jump during your birthday month and get $100 off any tandem package."
- `promo.birthday.terms`: "Must jump within your birthday month. Proof of date of birth required. Applies to tandem packages only. Cannot be combined with other promotions."
- `promo.earlybird.title`: "Early Bird Discount"
- `promo.earlybird.desc`: "Plan ahead and save! Book early to lock in a special rate."
- `promo.earlybird.details`: "Book 90+ days in advance and save 10% on any skydiving package."
- `promo.earlybird.terms`: "Booking must be made at least 90 days before the jump date. Discount applies at checkout. Cannot be combined with other promotions. Subject to availability."
- `promo.repeat.title`: "Repeat Jumper Reward"
- `promo.repeat.desc`: "Already jumped with us? Come back and save even more!"
- `promo.repeat.details`: "Returning customers get $150 off their next jump with us."
- `promo.repeat.terms`: "Must have a previous completed booking with Let's Skydive HK. Discount applied upon verification of prior booking. Cannot be combined with other promotions."

Traditional Chinese (zh-TW) and Simplified Chinese (zh-CN) equivalents will follow the same pattern with appropriate translations.

### Homepage Banner

The homepage banner will remain focused on the Buddy Deal as the headline offer. The promotions page itself will showcase all five deals, encouraging visitors to explore all options once they click through.
