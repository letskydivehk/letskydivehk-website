# 基地順序：中國先於泰國

## 目標
首頁「基地位置」區塊預設先顯示中國基地，泰國基地排在後面，兩國分頁次序對調。

## 更改內容
- 分頁按鈕次序由「泰國 → 中國」改為「中國 → 泰國」。
- 預設選中的國家由泰國改為中國（首次載入時顯示中國基地：珠海、海南、羅定、惠州、深圳 iFLY）。
- 保留現有 hash 行為：`#locations-china` / `#locations-thailand` 等連結仍可切換到對應國家。

## 技術細節
只改 `src/components/Locations.tsx`：
- `useState<Country>("Thailand")` → `useState<Country>("China")`
- 分頁陣列 `["Thailand", "China"]` → `["China", "Thailand"]`

不改資料庫 `display_order`、卡片內容、翻譯或其他頁面。
