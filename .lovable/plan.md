## Goal

Move the quiz out of hard-coded files (`src/lib/quiz.ts` + `LanguageContext.tsx`) and into Supabase, so that:

1. You can edit questions, answers, wording, and recommendation logic from an admin page — no code changes.
2. When you save an English answer, it is **auto-translated** into Traditional Chinese and Simplified Chinese via the Lovable AI Gateway (`LOVABLE_API_KEY` is already set).
3. Each answer carries weights that drive **which service** (Tandem / A-Licence / Group) and **which dropzone** is recommended at the end.

---

## 1. Database schema (new tables)

### `quiz_questions`
| column | type | notes |
|---|---|---|
| id | uuid PK | |
| slug | text unique | e.g. `experience`, `group_size` — stable identifier |
| display_order | int | controls question order |
| is_active | bool | hide/show without deleting |
| text_en / text_zh_tw / text_zh_cn | text | the question in 3 languages |

### `quiz_options`
| column | type | notes |
|---|---|---|
| id | uuid PK | |
| question_id | uuid → quiz_questions.id | |
| display_order | int | |
| label_en / label_zh_tw / label_zh_cn | text | the answer text in 3 languages |
| service_weights | jsonb | `{ "tandem": 3, "alicence": 0, "group": 0 }` |
| location_weights | jsonb | `{ "proximity": 2, "scenery": 0, "budget": 1, "country": "China", "needsAff": false, "needsGroup": false, "monthPref": [11,12,1,2] }` |
| pin_location_slug | text nullable | hard pin: if chosen, that dropzone is heavily favoured (e.g. `hainan`) |

### RLS
- Public `SELECT` on both tables (the quiz must load for anonymous visitors).
- `INSERT / UPDATE / DELETE` restricted to admins via `has_role(auth.uid(),'admin')`.

### Seed
Migration seeds the current 7 questions and their options with the same weights they have today in `src/lib/quiz.ts`, so behaviour is unchanged on day one.

---

## 2. Auto-translation (English → zh-TW + zh-CN)

A new edge function **`translate-quiz`** uses the Lovable AI Gateway (`LOVABLE_API_KEY`, already configured — no new secret, no cost setup).

- Input: `{ text: "How far are you willing to travel?" }`
- Output: `{ zh_tw: "...", zh_cn: "..." }`
- Model: `google/gemini-2.5-flash` (fast + free during promo period).
- Prompt instructs: terminology rules from project memory ("A-Licence" never "AFF Course"; Traditional Chinese is authoritative; concise marketing tone).

In the admin UI, when you edit `text_en` or `label_en` and click **Auto-translate**, the function fills both Chinese fields. You can still hand-edit them afterwards.

---

## 3. Admin UI — `/admin/quiz`

Added to the existing admin hub (`/admin/credits` sidebar). Layout:

```text
Quiz Builder
├── [+ Add question]
├── Question card (drag to reorder)
│    ├── EN / 繁中 / 简中  text fields  [🪄 Auto-translate]
│    ├── Active toggle
│    └── Options
│         ├── Option row (drag to reorder)
│         │    ├── EN / 繁中 / 简中 labels  [🪄 Auto-translate]
│         │    ├── Service weights:  Tandem [_]  A-Licence [_]  Group [_]
│         │    ├── Location signals: Proximity [_] Scenery [_] Budget [_]
│         │    │                     Country [Thailand/China/—]
│         │    │                     Needs A-Licence ☐   Needs Group ☐
│         │    │                     Best months [multi-select 1–12]
│         │    └── Pin to dropzone [dropdown of locations or "None"]
│         └── [+ Add option]
└── [Save changes]
```

A small **"How scoring works"** help panel explains:
- Highest total `service_weights` wins → that's the recommended service.
- Location score = `proximity*locProfile.proximity + scenery*locProfile.scenery + budget*locProfile.budget + countryBoost + monthOverlap*1.5`.
- `pin_location_slug` adds a strong bonus (+10) so that answer almost always wins for that dropzone — the easy way to say *"if user picks this, recommend Hainan"*.

---

## 4. Frontend changes

- New hook `src/hooks/useQuiz.ts` — fetches questions+options once, cached via React Query.
- Replace static `QUIZ_QUESTIONS` import in `src/pages/Quiz.tsx` and `src/pages/QuizResult.tsx` with hook data.
- Refactor `computeRecommendation` in `src/lib/quiz.ts` to accept the DB shape and honour `pin_location_slug`.
- Translation lookup: instead of `t(option.key)`, render `option[`label_${lang}`]` directly (falling back to `label_en`).
- Loading state: skeleton on `/quiz` while questions load (≈100ms).

The current 3-language `quiz.*` keys in `LanguageContext.tsx` can be removed once the DB is the source of truth (UI chrome keys like `quiz.next`, `quiz.back`, `quiz.badge` stay in the language file).

---

## 5. Files

| Action | File |
|---|---|
| Create | migration: `quiz_questions`, `quiz_options`, RLS, seed from current data |
| Create | `supabase/functions/translate-quiz/index.ts` |
| Create | `src/hooks/useQuiz.ts` |
| Create | `src/pages/AdminQuiz.tsx` |
| Create | `src/components/admin/AdminQuizPanel.tsx` |
| Modify | `src/lib/quiz.ts` — accept DB shape, support `pin_location_slug` |
| Modify | `src/pages/Quiz.tsx`, `src/pages/QuizResult.tsx` — use hook + DB labels |
| Modify | `src/App.tsx` — add `/admin/quiz` route |
| Modify | admin hub sidebar — link to Quiz Builder |
| Modify | `src/contexts/LanguageContext.tsx` — drop now-unused `quiz.q*` keys |

---

## What you'll be able to do after this

- Open `/admin/quiz`, edit any question or answer in English, click 🪄 → both Chinese versions are filled automatically.
- Add or remove questions/options without touching code.
- For each answer, set weights or just **pin a dropzone** (e.g. "Q4 option C → always recommend Hainan").
- Changes go live instantly for all users (no deploy).

Approve and I'll build it.
