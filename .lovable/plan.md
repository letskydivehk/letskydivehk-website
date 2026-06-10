
## Goal
Display the supplied 5月24日 day-trip schedule as the standard itinerary on the Zhuhai tandem skydive tour pages (Handicam & Ultimate Combo), fully translated across English / 繁體中文 / 简体中文.

## Where it shows up
`/tour/zhuhai/<service-id>` (rendered by `TourDetail.tsx` → `TourItinerary` component), which reads `location_services.itinerary` from Supabase. Currently both Zhuhai tandem rows have an empty itinerary; the 2D1N "Tour" service already has its own multi-day itinerary and will be left untouched.

## Itinerary content (authoritative 繁中, then EN/简中)

Day 1 — `香港 → 珠海 一日跳傘` / `HK → Zhuhai One-Day Skydive` / `香港 → 珠海 一日跳伞`

Morning (上午)
- 09:00 香港口岸集合（建議預留前往口岸時間） — Meet at HK Port (allow buffer time) — 香港口岸集合（建议预留前往口岸时间） — *location: 港珠澳大橋香港口岸 / HK-Zhuhai-Macao Bridge HK Port*
- 乘金巴往珠海（約40分鐘） — Gold Bus shuttle to Zhuhai (~40 min) — 乘金巴往珠海（约40分钟）
- 抵達珠海口岸、過關（約20分鐘） — Arrive Zhuhai Port & immigration (~20 min) — 抵达珠海口岸、过关（约20分钟）
- 10:10 包車前往跳傘基地（約1小時15分鐘） — 10:10 Private transfer to dropzone (~1h15m) — 10:10 包车前往跳伞基地（约1小时15分钟）
- 11:25 抵達基地、報到 — 11:25 Arrive dropzone & check-in — 11:25 抵达基地、报到 — *location: Weland Zhuhai Dropzone*

Afternoon (下午)
- 跳傘流程講解及培訓 — Skydive briefing & training — 跳伞流程讲解及培训
- 跳傘活動 — Tandem skydive jump — 跳伞活动
- 13:45 跳傘完成、領證書、短片 — 13:45 Jump complete, certificate & video handover — 13:45 跳伞完成、领证书、短片
- 14:30 午餐 — 14:30 Lunch — 14:30 午餐
- 16:30 乘車返回珠海口岸 — 16:30 Coach back to Zhuhai Port — 16:30 乘车返回珠海口岸

Evening (傍晚)
- 17:40 乘金巴返港 — 17:40 Gold Bus shuttle back to HK — 17:40 乘金巴返港
- 18:30 抵達香港口岸 — 18:30 Arrive HK Port — 18:30 抵达香港口岸 — *location: 港珠澳大橋香港口岸*

Times are embedded as prefixes inside `item.title` so no schema/component change is needed — `TourItinerary` already groups by morning/afternoon/evening with timeline styling.

## Implementation steps

1. **Supabase migration** updating both Zhuhai tandem `location_services` rows (`Tandem Skydive with Handicam` and `Tandem Skydive with Ultimate Combo (Handicam + Wide shot)`) — set `itinerary` JSONB to the single-day structure above using the English title strings as data keys (segments: morning / afternoon / evening, items with `title` + optional `location`).

2. **Translations** in `src/contexts/LanguageContext.tsx`:
   - Add `tour.dayTitle.HK → Zhuhai One-Day Skydive` for zh-TW and zh-CN.
   - Add `tour.item.<English title>` entries (zh-TW + zh-CN) for each new item title and the two location strings, mirroring the existing `tour.item.*` pattern used by Pattaya/Huizhou.

3. **Verification**: load `/tour/zhuhai/<handicam-id>` in the preview, language-switch through EN / 繁 / 简 to confirm the timeline renders correctly on desktop and mobile, then mirror-check the Ultimate Combo page.

## Files touched
- New Supabase migration (one `UPDATE` statement on `location_services`).
- `src/contexts/LanguageContext.tsx` — translation additions only.

No component, hook, or routing changes required.
