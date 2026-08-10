# 深圳 iFLY 固定出團日（每月第 2、4 個星期六）＋ 升級為主打套餐

## 目標

把「深圳室內跳傘豪華一日遊」變成網站現階段的主打產品：有固定出團日期、可即時網上落訂（$500 訂金）或 WhatsApp 報名，並在首頁最顯眼位置推廣。

## 出團規則（三語顯示）

- 日期：每月第 2 及第 4 個星期六，開放未來 12 個月
- 每團名額上限 8 人
- 3 人起成團（未達 3 人會與客人另議改期）
- 報名截止：出團前 5 天
- 名額滿即顯示「已滿 / Sold out / 已满」，並可選下一個日期

## 客人看到的體驗

1. **首頁最上方出團橫幅**：顯示「下一團：X 月 X 日（星期六）」＋剩餘名額（如「僅剩 3 位」）＋倒數，按下去到深圳 iFLY 頁面。
2. **首頁服務區**：深圳室內跳傘卡片排第一，加上「主打體驗」標籤；基地列表中「Shenzhen (iFLY)」排第一。
3. **深圳基地頁**新增「出團日期表」：列出未來出團日，每個日期顯示狀態
   - 可報名（剩 N 位）→ 兩個按鈕：`立即預訂（付 $500 訂金）` / `WhatsApp 詢問`
   - 已滿 → 灰色 + 「已滿」
   - 已過截止日 → 不顯示
4. **預訂流程**：選擇深圳 iFLY 時，日曆只允許選出團日（其他日期禁用），人數上限跟隨該團剩餘名額，之後照現有 $500 訂金 Airwallex 流程走。
5. **WhatsApp 路徑保留**：訊息會自動帶上所選出團日期、人數與套餐名稱。

## 技術實作

### 資料庫

- 新增 `service_departures` 表：`location_service_id`、`departure_date`、`capacity`（預設 8）、`min_participants`（預設 3）、`cutoff_days`（預設 5）、`status`（`open` / `closed` / `cancelled`）、`notes`
  - 唯一鍵 `(location_service_id, departure_date)`
  - 公開可讀（`anon` + `authenticated` 只讀）；只有管理員可新增／修改／刪除
- 新增函數 `public.get_departure_availability(_service_id uuid)`：回傳每個出團日的 `departure_date`、`capacity`、`seats_taken`（統計該日期、該服務、狀態非 `cancelled` 的 bookings 人數）、`seats_left`、`is_full`、`is_closed`
- 以資料寫入方式產生未來 12 個月的第 2、4 個星期六（一次性）
- 把深圳服務的 `deposit_amount` 由 0 改為 500，`is_popular` 保持 true、`display_order` 設為最前

### 前端

- `src/hooks/useServiceDepartures.ts`（新）：讀取出團日與名額狀態
- `src/components/DepartureSchedule.tsx`（新）：出團日期表卡片（三語、桌面／手機版式、已滿狀態）
- `src/components/home/NextDepartureBanner.tsx`（新）：首頁下一團橫幅（含倒數，沿用 `CountdownTimer`）
- `src/pages/LocationDetail.tsx`：深圳頁插入出團日期表；WhatsApp 訊息帶上日期
- `src/components/BookingSection.tsx`：不再把 `indoor` 排除於預訂流程之外；選中深圳 iFLY 時日曆只開放出團日、人數上限＝剩餘名額
- `src/components/Services.tsx`：`indoor` 排序提前至第 1，加「主打」標籤；卡片主按鈕改為「立即預訂」而非只有 WhatsApp
- `src/components/Locations.tsx` / 資料排序：深圳 iFLY 置頂
- `src/pages/Home.tsx`：Hero 下方加入出團橫幅
- `src/contexts/LanguageContext.tsx`：新增三語文案（出團日期、剩餘名額、已滿、截止、成團人數、橫幅字句）

### 後台

- `src/components/admin/AdminToursPanel.tsx` 或新增分頁：列出出團日，可改名額、關閉某團、加開特別團期，並看到每團已報名人數

## 不會改動

- 現有訂金金額（$500）、退款與改期政策
- 其他基地的預訂流程與排序邏輯（只是相對位置後移）
