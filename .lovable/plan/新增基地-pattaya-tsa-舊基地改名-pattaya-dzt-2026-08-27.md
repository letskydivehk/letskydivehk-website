# 新增基地：Pattaya (TSA)｜舊基地改名 Pattaya (DZT)

## 目標
- 現有 Pattaya 基地改名為 **Pattaya (DZT)**（中文：芭堤雅 (DZT)）。
- 新增第二個芭堤雅基地 **Pattaya (TSA)**（中文：芭堤雅 (TSA)），地址 142/162 Sukhumvit – Pattaya 21, Na Kluea, Bang Lamung District, Chonburi, Thailand 2015。
- 全站 Pattaya 中文統一為「芭堤雅」（取代現時繁體「芭達雅」、簡體「芭提雅」）。

## 新基地內容
交通：專車接送 — 曼谷為指定上車地點，芭堤雅可任選酒店接送。

服務項目（三語）：
| 服務 | 價格 | 包含 |
| --- | --- | --- |
| 雙人傘終極組合（影片＋照片） | $3,999 | 影片、照片、完成證書、60 秒自由落體、5–7 分鐘傘降 |
| A 級執照課程 | $39,999 | 25 跳、地面課程、全套裝備、教練一對一指導（不含 iFLY 體驗） |
| 團體活動 | 客製報價 | 專屬統籌、私人簡報、團體影相、慶祝區 |
| 芭堤雅 3 日 2 夜 / 4 日 3 夜旅遊團 | $6,799 起 | 沿用現有 Pattaya 旅遊團內容與行程 |

其他資料沿用芭堤雅：氣候摘要、最佳月份（11–3 月）、香港出發交通說明、旅遊小提示、天氣座標（12.9236, 100.8825）。基地照片使用 thaiskyadventures.com 提供的連結。

## 實作步驟

1. **資料庫（run_sql，資料更新非結構改動）**
   - `locations`：更新現有 `pattaya` 的 `Name` 為 `Pattaya (DZT)`；新增一列 slug `pattaya-tsa`、Name `Pattaya (TSA)`、City `Pattaya`、country Thailand、`has_aff = true`、`has_group_events = true`、`is_active = true`、`coming_soon = false`、`display_order` 緊接舊 Pattaya、圖片用指定連結、`transportation` 寫接送安排、天氣座標與氣候欄位沿用。
   - `location_services`：為新基地插入 4 類服務（tandem 終極組合、aff、group、兩個 Tour），Tour 的 `itinerary`／`photos`／`add_ons` 由舊 Pattaya 對應紀錄複製。

2. **翻譯（`src/contexts/LanguageContext.tsx`）**
   - `location.pattaya` 改為 `Pattaya (DZT)` / `芭堤雅 (DZT)`；新增 `location.pattaya-tsa`、`location.pattaya-tsa.desc`。
   - `city.Pattaya` 繁體改「芭堤雅」（簡體同）；其餘含「芭達雅／芭提雅」的字串一併校正為「芭堤雅」。
   - `src/data/locationDataTranslations.ts` 中的芭達雅／芭提雅字串同步更新，並補上新服務名稱與 includes 的三語對應（例如「A-License Package」既有翻譯可重用）。

3. **程式碼調整**
   - `src/pages/LocationDetail.tsx`、`src/pages/ServiceSkydivingTour.tsx`、`src/pages/TourDetail.tsx` 的 `TOUR_DETAIL_SLUGS` / `ALLOWED_SLUGS` 加入 `pattaya-tsa`，令新基地旅遊團有行程頁。
   - `src/data/previousItineraries.ts`：新基地旅遊團沿用現有芭堤雅行程資料（以 slug 對應）。
   - `src/components/location/LocationMap.tsx`：`cityCoordinates` 以 City 為 key，芭堤雅已存在，無需改動；如需精確 TSA 座標，改為以 slug 覆寫（`pattaya-tsa` 用該地址座標）。
   - `src/lib/quiz.ts`：加入 `pattaya-tsa` 權重（沿用 pattaya 數值），確保問卷推薦不會漏基地。

4. **驗收**
   - 首頁 Locations → 泰國分頁應見兩張卡（DZT、TSA），高度一致。
   - `/location/pattaya-tsa` 顯示服務卡、價格、WhatsApp 預約按鈕、地圖、天氣。
   - 三語切換檢查名稱與服務文案無英文殘留、無 missing key 警告。

## 待你之後補充（先用預設值）
- TSA 場地的實際天氣／地圖精確座標（現用芭堤雅市中心座標）。
- 新基地專屬簡介文案與更多場地照片。
