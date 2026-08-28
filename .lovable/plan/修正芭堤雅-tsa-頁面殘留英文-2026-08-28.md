# 修正芭堤雅 (TSA) 頁面殘留英文

## 已核實的問題

`/location/pattaya-tsa` 共有 5 個服務（資料庫查證）：

| 服務名稱（DB） | 中文顯示情況 |
| --- | --- |
| Tandem Skydive with Ultimate Combo (Video + Photos) | 正常（有 `service.` 翻譯鍵） |
| A-License Package | 正常 |
| Group Events | 正常 |
| Pattaya 3D2N Tour | **顯示英文** |
| Pattaya 4D3N Tour | **顯示英文** |

原因：`LocationDetail.tsx` 用 `translateData("service." + service_name, ...)` 取翻譯，但 `dataTranslations` 只有 `tour.name.Pattaya 3D2N Tour`（旅遊團頁面用），沒有 `service.Pattaya 3D2N Tour`。同一問題也影響其他基地的旅遊團卡片（Chiang Mai / Hainan / Huizhou 的 Tour 名稱在基地頁面同樣顯示英文）。

另外核實到英文版的相關小問題：價格 `$6,799起` 沒有英文對應鍵（`price.$6,799起` 不存在），切到 English 時會顯示中文「起」字。

其餘欄位（描述、接送方式、機場距離、氣候、香港出發交通、包含項目）都已有三語翻譯，顯示正常。

## 修正內容

1. 在 `src/contexts/LanguageContext.tsx` 的 `dataTranslations` 三語字典補上基地頁面用的旅遊團服務名稱鍵：
   - `service.Pattaya 3D2N Tour`、`service.Pattaya 4D3N Tour`
   - 同時補齊 `service.Chiang Mai 3D2N/4D3N Tour`、`service.Hainan 3D2N/4D3N Tour`、`service.Huizhou 2D1N Tour`（沿用既有 `tour.name.*` 文案，避免同類問題）
   - en 版本用英文原名（例如 "Pattaya 3-Day 2-Night Tour"）。
2. 補上價格鍵 `price.$6,799起`、`price.$5,899起`：中文維持「$6,799起」，英文顯示 "From $6,799" / "From $5,899"。
3. 驗證：以 Playwright 在繁體、簡體、英文三語開啟 `/location/pattaya-tsa` 與 `/location/pattaya`，截圖確認服務卡名稱與價格無語言殘留。

## 技術細節

- 只改 `src/contexts/LanguageContext.tsx`（新增翻譯鍵），不動資料庫、不動版面邏輯。
- 不改 `service_name` 原始資料，避免影響 WhatsApp 訊息與旅遊團頁面對應。
