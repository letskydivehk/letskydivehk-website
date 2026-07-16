## 目標
在 Windy 天氣顯示中，除了風速外，新增雨量資訊供參考。

## 變動範圍

### 1. `src/hooks/useWeather.ts`
- 擴充 Open-Meteo API 請求，加入 `precipitation`（當前雨量, mm）欄位
- `WeatherData` interface 新增 `precipitation: number`
- 快取結構會自動包含此欄位（JSON 序列化）

### 2. `src/components/location/LocationWeather.tsx`
- 在「風速」下方新增一行顯示雨量：`{雨量}: {precipitation} mm`
- 使用 `Droplets` 或 `CloudRain` icon (lucide-react)

### 3. `src/components/WeatherForecast.tsx`
- 同樣在風速下方新增雨量顯示

### 4. Windy iframe overlay
- 目前 iframe URL 用 `overlay=wind`；新增第二個 iframe 或切換按鈕以顯示雨量？
- **建議**：在 `WeatherForecast.tsx` 加入 overlay 切換 tabs（風 / 雨），共用同一個 iframe，改變 `overlay=wind` / `overlay=rain`。這樣使用者可切換查看不同資訊。
- 基地頁的「即時天氣」外部連結維持 windy.com，使用者可自行切換 overlay。

### 5. `src/contexts/LanguageContext.tsx`
新增 i18n keys：
- `weather.precipitation` — 「雨量」/「雨量」/ "Precipitation"
- `weather.overlayWind` — 「風速」/「风速」/ "Wind"
- `weather.overlayRain` — 「雨量」/「雨量」/ "Rain"

## 技術細節
- Open-Meteo 當前欄位加入 `precipitation`（單位 mm，即最近一小時）
- Windy embed overlay 參數支援值包含 `wind`, `rain`, `temp`, `clouds` 等，切換免費且無需 API key
- 無資料庫或後端變動

## 檔案變動
- 修改：`src/hooks/useWeather.ts`
- 修改：`src/components/WeatherForecast.tsx`
- 修改：`src/components/location/LocationWeather.tsx`
- 修改：`src/contexts/LanguageContext.tsx`
