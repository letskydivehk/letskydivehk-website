# 天氣與氣候 UI/UX 互動化優化計劃

## 現況評估
目前天氣功能已整合：
- 首頁 `WeatherForecast`：基地切換、風/雨疊加切換、Windy iframe、Open-Meteo 當前天氣。
- 基地頁 `LocationWeather`：當前天氣、最佳月份標籤、氣候摘要。
- 數據層 `useWeather.ts`：Open-Meteo API + `localStorage` 緩存。

互動性仍較靜態：僅有按鈕切換，缺少數據可視化、即時反饋與跳傘情境化建議。

## 優化方向（可選組合實施）

### 1. 跳傘適宜度評分（Jump Readiness Score）
- 根據風速、降雨、天氣代碼計算 0–100 分。
- 分數區間配色：
  - 80–100 翠綠色（理想）
  - 50–79 橙色（可跳但需注意）
  - 0–49 紅色（不建議）
- 顯示一句跳傘建議，例如「今日風速低，非常適合跳傘」。
- 檔案：`src/components/WeatherForecast.tsx`、`src/components/location/LocationWeather.tsx`、翻譯檔。

### 2. 24 小時互動預報時間軸
- 橫向可捲動的溫度 / 風速 / 降雨預報。
- 懸停（桌面）或點擊（手機）顯示該小時詳情。
- 使用 Open-Meteo 免費 `hourly` endpoint，不增加成本。
- 檔案：`src/hooks/useWeather.ts`（擴充 hourly 資料）、新增 `WeatherTimeline.tsx`。

### 3. 動態天氣圖標與微動畫
- 根據 `weatherCode` 與 `isDay` 顯示對應 SVG/Lottie 動畫：
  - 晴天、局部多雲、陰天、小雨、大雨、雷暴、有霧。
- 圖標帶輕微漂浮動畫，強化「天空」主題。
- 檔案：新增 `WeatherIcon.tsx`，使用現有 `framer-motion`。

### 4. 基地切換卡片化（首頁）
- 將基地切換按鈕改為小卡片：顯示國旗、基地名、當前溫度與簡短狀態。
- 點擊後卡片有 active 狀態，內容平滑過渡（`AnimatePresence`）。
- 手機支援左右滑動切換基地。
- 檔案：`src/components/WeatherForecast.tsx`。

### 5. 最佳月份視覺化熱力圖（基地頁）
- 將 `bestMonths` 的 12 個方格改為橫向條形圖或熱力圖。
- 顯示「旺季 / 淡季 / 不建議」三級顏色，並附簡短說明。
- 檔案：`src/components/location/LocationWeather.tsx`。

### 6. 天氣小貼士與最後更新動態提示
- 根據當前天氣自動生成跳傘穿衣/裝備建議（例如「風大請帶外套」）。
- 最後更新時間改為「X 分鐘前」動態倒數，並提供手動刷新按鈕。
- 檔案：翻譯檔 + `WeatherForecast.tsx` / `LocationWeather.tsx`。

## 建議優先順序
建議分兩階段：

**第一階段（高影響、低風險）：**
1. 跳傘適宜度評分
2. 動態天氣圖標
3. 基地切換卡片化 + 手勢

**第二階段（數據可視化）：**
4. 24 小時預報時間軸
5. 最佳月份熱力圖
6. 天氣小貼士

## 技術細節
- 不新增外部付費 API，繼續使用 Open-Meteo。
- 使用現有 `framer-motion` 與 Tailwind 設計系統，保持風格一致。
- 所有文案同步更新繁中 / 簡中 / 英文翻譯。
- 保持現有 Windy iframe 與「查看即時天氣」按鈕不變。

## 想請你確認
1. 是否同意以上兩階段優先順序？還是想先只做某幾項？
2. 動態天氣圖標偏好純 CSS/SVG 動畫，還是可接受輕量 Lottie 檔案？
3. 首頁基地切換是否保留現有按鈕風格，還是想改成更突出的卡片式？