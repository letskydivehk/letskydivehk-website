## Plan

### 1. Remove InstructorTeam section
- Remove `<InstructorTeam />` import and JSX usage from `src/pages/Home.tsx`.
- Remove all `instructors.*` translation keys from `src/contexts/LanguageContext.tsx` (3 languages).

### 2. Change discount badge text
- Replace `pricing.off` translations in `src/contexts/LanguageContext.tsx`:
  - en: `"Member -20%"`
  - zh-TW: `"會員 -20%"`
  - zh-CN: `"会员 -20%"`
- Update badge rendering in `src/components/ServicePricing.tsx` and `src/components/BookingSection.tsx` so the full localized badge text is shown (remove hardcoded `-20%` prefix from the badge, since the new translation includes it).