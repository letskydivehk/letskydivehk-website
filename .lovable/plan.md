

## Add Simplified Chinese (zh-CN) Language Support

### Overview

Add Simplified Chinese as a third language option across the entire website, alongside English and Traditional Chinese.

### Scope of Changes

The translation file (`src/contexts/LanguageContext.tsx`) contains approximately 700+ translation keys across two sections:
- **Static UI translations** (`translations` object): navigation, hero, locations, services, booking, auth, FAQ, legal pages, service pages, testimonials, WhatsApp widget
- **Dynamic data translations** (`dataTranslations` object): location names, service names, includes, cities, countries

All keys need Simplified Chinese equivalents (converted from Traditional Chinese with appropriate terminology adjustments).

### Files to Modify

| File | Change |
|---|---|
| `src/contexts/LanguageContext.tsx` | Add `"zh-CN"` to `Language` type, add all zh-CN translations to both `translations` and `dataTranslations`, update `LanguageProvider` to accept zh-CN from localStorage |
| `src/components/LanguageSwitcher.tsx` | Add Simplified Chinese option with label "简体中文", update `currentLabel` logic |

### Technical Details

**1. Update Language type (line 3):**
```typescript
export type Language = "en" | "zh-TW" | "zh-CN";
```

**2. Add zh-CN translations block:**
- Add a complete `"zh-CN": { ... }` entry to the `translations` object with all ~500+ inline keys
- Add appended translations (FAQ, testimonials, WhatsApp) using `translations["zh-CN"][key] = value` pattern
- Add `"zh-CN": { ... }` entry to `dataTranslations` for location names, service names, etc.

**3. Simplified Chinese content approach:**
- Convert all Traditional Chinese text to Simplified Chinese equivalents
- Key differences: 繁體 characters mapped to 简体 (e.g., 預約 -> 预约, 體驗 -> 体验, 執照 -> 执照, 歡迎 -> 欢迎)
- Hong Kong-specific terms remain contextually appropriate
- Legal documents converted with proper Simplified Chinese legal terminology

**4. Update LanguageSwitcher (lines 10-15):**
```typescript
const languages: { code: Language; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'zh-TW', label: '繁體中文' },
  { code: 'zh-CN', label: '简体中文' },
];

const currentLabel = language === 'en' ? 'EN' : language === 'zh-TW' ? '繁' : '简';
```

**5. Update LanguageProvider localStorage validation (line 1631):**
```typescript
return saved === "en" || saved === "zh-TW" || saved === "zh-CN" ? saved : "zh-TW";
```

### Implementation Notes

- The zh-CN translations will be a complete copy converted from zh-TW, covering all sections: navigation, hero, locations, services, booking flow, authentication, profile, credits, referrals, admin, gallery, promotions, legal pages (privacy, terms, disclaimer), service pages (tandem, A-licence), FAQ, testimonials, and WhatsApp widget
- The file will grow significantly (~800+ new lines) but maintains the existing flat key-value pattern
- No changes needed to any component files other than `LanguageSwitcher.tsx` since they all use the `t()` and `translateData()` functions which will automatically resolve zh-CN keys

