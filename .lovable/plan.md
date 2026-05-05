## Issue

The screenshot shows raw keys (`quiz.lead.title`, `quiz.lead.subtitle`, `quiz.lead.name`, `quiz.lead.phone`, `quiz.lead.email`) on `letskydivehk.com` — the live custom domain.

## Root cause

The translations **already exist in source** for all three languages (`src/contexts/LanguageContext.tsx` lines 2894–2901 EN, 2939–2945 zh-TW, 2983–2989 zh-CN). The fallback in `t()` returns the raw key when a value is missing — which is what's showing.

Two possible reasons the live site shows raw keys:

1. **Stale published build** — `letskydivehk.com` is the published custom domain. The most recent translation additions haven't been re-published yet, so the production bundle still lacks these keys.
2. **Browser cache** — the user's mobile browser is serving a cached JS bundle from before the keys were added.

## Plan

1. **Re-publish the site** so the production bundle on `letskydivehk.com` includes the `quiz.lead.*` keys. (This is a one-click "Publish" action in Lovable — no code change needed.)
2. **Defensive hardening** — to make the form bulletproof against any future missing-key regression, keep the inline fallback strings already present in `src/pages/Quiz.tsx` (e.g. `t("quiz.lead.title") || "Almost there!"`). Confirm all 5 visible labels have these fallbacks. They currently do.
3. **Ask the user to hard-refresh** the mobile browser after re-publishing (clear cache or open in incognito) to bypass the cached bundle.

## No code changes required

The translation keys are correct and complete in the source. Once re-published and the cache cleared, the labels will render correctly in EN/zh-TW/zh-CN.

If after re-publish + hard refresh the issue persists, I will investigate a runtime issue (e.g. the assignment-after-literal pattern not surviving production minification — unlikely but verifiable).