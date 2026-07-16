# 天氣功能擴充計劃

## 1. 首頁天氣預測區塊（新元件）

新增 `src/components/WeatherForecast.tsx`：
- 顯示 5 個基地的天氣預測卡片：珠海、海南、羅定、惠州、芭堤雅
- 每個卡片包含：地點名稱、Windy iframe（顯示該地天氣預測地圖）、7 日概要（用現有 Open-Meteo API）
- 手風琴/Tab 切換不同地點，避免同時載入 5 個 iframe（效能考量）
- 預設顯示第一個基地，用戶點選 Tab 切換
- 每個基地座標寫死在元件內（與 `useLocations` 一致）：
  - 珠海 (Zhuhai): 22.2711, 113.5767
  - 海南 (Hainan): 19.9° 109.5°
  - 羅定 (Luoding): 22.7686, 111.5698
  - 惠州 (Huizhou): 23.1115, 114.4160
  - 芭堤雅 (Pattaya): 12.9236, 100.8825

Windy iframe URL 格式：
```
https://embed.windy.com/embed2.html?lat={LAT}&lon={LON}&zoom=8&level=surface&overlay=wind&menu=&message=&marker=true&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=default&metricTemp=default&radarRange=-1
```

「每天更新」：Windy embed 本身是即時的；另外用 `useWeather` hook（已存在，30 分鐘 staleTime）顯示當前溫度/風速摘要，符合每日更新要求。

放在 `src/pages/Home.tsx` 的 Locations 區塊之後、Services 之前，用 `LazySection` 包裝以延後載入 iframe。

## 2. 基地頁「即時天氣」按鈕

修改 `src/components/location/LocationWeather.tsx`：
- 在現有 "Current Weather" 區塊底下新增按鈕「點此查看（該地點）即時天氣」
- 按鈕 `onClick` 開新分頁到 Windy 該座標的完整網站：
  `https://www.windy.com/?{LAT},{LON},9`
- 三語按鈕文字：
  - zh-TW: 「點此查看{地點名}即時天氣」
  - zh-CN: 「点此查看{地点名}实时天气」
  - en: "View live weather for {location}"

按鈕帶 `<ExternalLink>` icon，樣式跟目前 accent-blue 一致。

## 3. i18n 新增鍵值

在 `src/contexts/LanguageContext.tsx` 新增：
- `weather.forecastTitle` — 「基地天氣預測」/ "Base Weather Forecast"
- `weather.forecastSubtitle` — 「查看各基地未來天氣，選擇最佳跳傘日子」
- `weather.viewLive` — 「點此查看即時天氣」/ "View live weather"
- `weather.updatedDaily` — 「每日更新」/ "Updated daily"

## 4. 技術細節

- Windy embed 免費、無需 API key
- iframe 使用 `loading="lazy"` 與 `title` 屬性（無障礙）
- 只影響前端展示，無資料庫或後端變動
- 座標若日後從 DB `locations.lat/lon` 讀取更佳，但目前先寫死 5 個基地以求穩定

## 檔案變動

- 新增：`src/components/WeatherForecast.tsx`
- 修改：`src/pages/Home.tsx`（插入新區塊）
- 修改：`src/components/location/LocationWeather.tsx`（新增按鈕）
- 修改：`src/contexts/LanguageContext.tsx`（新增翻譯鍵）
