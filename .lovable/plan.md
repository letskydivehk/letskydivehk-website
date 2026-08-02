## 目標
1. 修正 `20km (50 mins) from Luohu border` 的繁中/簡中翻譯為「距離羅湖口岸20公里（50分鐘）」。
2. 把「羅湖口岸 → 壹方天地」的車程時間統一改成 50 分鐘（目前英文描述仍寫 20 分鐘）。

## 現況確認
- DB `locations.city_distance` 已為 `20km (50 mins) from Luohu border`。
- DB `locations.getting_there_from_hk` 仍寫 `... our private car takes you to Uniwalk in around 20 minutes ...`。
- `src/contexts/LanguageContext.tsx` 裡只有舊 key：`"8km (20 mins) from Luohu border"` 及對應的 20 分鐘描述翻譯，缺少新 key。

## 執行步驟
1. **更新 DB 英文原文**
   - 把 `locations.getting_there_from_hk`（shenzhen-ifly）裡的 `around 20 minutes` 改為 `around 50 minutes`，讓英文與距離欄位一致。

2. **更新 `src/contexts/LanguageContext.tsx` 翻譯對照**
   - **繁中（zh-TW）**
     - 將 `"8km (20 mins) from Luohu border"` 改為 `"20km (50 mins) from Luohu border"`，值改為 `"距離羅湖口岸20公里（50分鐘）"`。
     - 將 `"From Hong Kong: take the East Rail Line to Lo Wu (about 45 minutes), clear immigration, then our private car takes you to Uniwalk in around 20 minutes. Door-to-door about 1.5 hours."` 裡的 `around 20 minutes` 改為 `around 50 minutes`，繁中翻譯同步改為「約50分鐘直達壹方天地」。
   - **簡中（zh-CN）**
     - 對應 key 與值同步修改為「距离罗湖口岸20公里（50分钟）」及「约50分钟直达壹方天地」。

3. **驗證**
   - 在預覽以繁中/簡中開啟 `/location/shenzhen-ifly`。
   - 確認「距離」卡片顯示「距離羅湖口岸20公里（50分鐘）」。
   - 確認「前往方法」卡片顯示 50 分鐘車程，且無英文 fallback。

## 不會改動的範圍
- 不改變其他地點的距離/時間翻譯。
- 不改變 `8km (20 mins)` 這個通用 key（它用於 Luohu station hotel 到場地，非羅湖口岸到壹方天地）。
- 不改變行程細節或價格。