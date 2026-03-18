

## Fix Missing Translations for Location Service Includes

### Problem
The database `location_services` table contains 16 distinct `includes` items, but only 14 have translations. Two Pattaya-specific items are missing translations in all three languages:
- `Video recording`
- `Photos`

These will fall back to English when viewed in Traditional or Simplified Chinese.

### Changes

**`src/contexts/LanguageContext.tsx`** — Add missing include translations in all 3 language sections:

**English (`en`) section** (~line 2155, after existing includes):
```
"include.Video recording": "Video recording",
"include.Photos": "Photos",
```

**Traditional Chinese (`zh-TW`) section** (~line 2217, after existing includes):
```
"include.Video recording": "錄影",
"include.Photos": "照片",
```

**Simplified Chinese (`zh-CN`) section** (~line 2279, after existing includes):
```
"include.Video recording": "录影",
"include.Photos": "照片",
```

### Summary
This is a small but important fix — without these keys, Pattaya's tandem packages show untranslated English text when the site is in Chinese mode.

