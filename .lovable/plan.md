## 目標

新增基地「深圳 (iFLY)」及新服務類型 `indoor`（室內跳傘豪華一日遊，$2,280 起），三種語言（English / 繁體 / 简体）齊備。CTA 為 WhatsApp 洽詢，不入線上預約流程。

## 一、資料庫（migration + 資料匯入）

1. `locations` 新增一筆：
   - slug `shenzhen-ifly`，Name `Shenzhen (iFLY)`，City `Shenzhen`，country `China`
   - `is_active = true`、`coming_soon = false`、`has_aff = false`、`has_group_events = true`
   - description：都市中心室內飛翔、位於壹方天地、全年無休風雨無阻
   - `highlights`、`airport_distance`、`city_distance`、`transportation`（羅湖口岸專車）、`getting_there_from_hk`、`climate_summary`（強調不受天氣影響）、`weather_lat/lon`、`google_maps_embed_url`、`travel_tips`
   - 連帶插入 `location_photos`、`location_food`（壹方天地）、`location_attractions`、`location_accommodations` 各數筆，讓基地頁「完整版」不留空白區塊。
2. `location_services` 新增一筆：
   - `service_type = 'indoor'`、`service_name = 'Shenzhen Indoor Skydiving Deluxe Day Tour (All-Inclusive)'`
   - `price_display = '$2,280'`、`is_popular = true`、`deposit_amount` 設 0（洽詢制）
   - `includes`：專車來回羅湖口岸（4人一車）／教學簡報 15 分鐘／一對一私人教練／2 分鐘風洞飛行／裝備租用／GoPro 特寫／地面專業相機照片（原價 $400）／官方證書／紀念 Tee（原價 $150）／紀念磁石貼（原價 $40）／壹方天地特色午餐／一日旅遊平安保險
   - `add_ons`：延長至 5 分鐘飛行 +$520
   - `itinerary`：一日行程（早：羅湖集合→上午：簡報＋飛行→午餐→下午：購物／自由活動→回程）

若 `location_services.service_type` 有 CHECK 限制，migration 會一併放寬以容納 `indoor`。

## 二、前端

- `src/hooks/useLocationServices.ts`：type 加入 `'indoor'`。
- `src/components/Services.tsx`：`iconMap` 加 `indoor: Wind`（lucide），排序 order 加入 `indoor: 3`；CTA 走 WhatsApp（與 group / Tour 相同分支）。
- `src/components/ServicePricing.tsx`：`indoor` 支援 add-ons 顯示（沿用 Tour 分支邏輯）。
- `src/pages/LocationDetail.tsx`：`indoor` 服務卡的 CTA 改為 WhatsApp 洽詢，不進入預約流程。
- `src/components/BookingSection.tsx`：過濾條件由 `!== 'Tour'` 改為排除 `Tour` 與 `indoor`。
- `src/data/locationDataTranslations.ts`：新增深圳基地所有英文自由文本（description、climate、transport、food、attractions…）的繁／簡對照。

## 三、文案與翻譯（三語）

`src/contexts/LanguageContext.tsx` 新增 key：
- `services.indoor.title` — Indoor Skydiving Day Tour ／ 室內跳傘豪華一日遊 ／ 室内跳伞豪华一日游
- `services.indoor.subtitle` — 歡迎首次體驗者
- `services.indoor.description` — 深圳頂級風洞、一對一教練、羅湖專車接送、一價全包
- `whatsapp.quick.indoor` — 預填 WhatsApp 洽詢訊息
- `include.*` 對應新包含項目的三語翻譯（配合現有 `translateData('include.…')` 機制）

## 四、SEO

- `public/llms.txt` 加入 `/location/shenzhen-ifly`
- `public/sitemap.xml`（由 `scripts/generate-sitemap.ts` 產生）自動包含新 slug

## 技術備註

- 不新增獨立服務頁（不做 `/services/indoor-skydiving`），資訊集中在首頁服務卡 + 基地頁，減少維護面。
- 現有 `has_aff` / A-Licence 過濾邏輯不受影響；`indoor` 不會出現在預約流程的服務清單。
