# 每日訊息自動發送（取代只存草稿）

## 先講一個限制

WhatsApp 官方 API（Meta）**不支援自動發訊息到群組**，只可以發給個別電話號碼。所以「直接發到指定群組」在 WhatsApp 上做不到，任何聲稱可以的方法都是非官方、有封號風險。

可行做法是：每日草稿生成後，**自動發送到你指定的一份號碼名單**（例如你自己、教練、常客），同時保留現有「一鍵貼上群組」按鈕。若你要真正自動貼到群組，唯一穩定方案是改用 Telegram 群組 Bot，內容邏輯可完全沿用。

以下計劃做 WhatsApp 逐個號碼自動發送。

## 你會見到的介面

管理後台 → 每日群發 分頁新增：

- **自動發送開關**：開啟後每日 08:30 生成完後自動寄出。
- **收訊人名單**：可自行增刪電話號碼（國際格式），附備註名稱。
- **訊息範本設定**：填入已批核的 WhatsApp 範本名稱與語言。
- **立即發送** 按鈕：手動即時發今日草稿給名單。
- **發送紀錄**：每個號碼的成功／失敗狀態與錯誤原因。
- 原有的複製、開啟 WhatsApp、重新生成、標記已發送全部保留。

## 需要你配合的事

1. 連接 WhatsApp Business 帳號（我會開連接卡，你在畫面完成）。需要一個電話號碼並通過 Meta 審核。
2. Meta 規定：主動發出的訊息（非用戶 24 小時內回覆）必須用**已批核範本**。範本審核可能需時最多 48 小時。因為每日內容都不同，範本會設計成「標題固定 + 一個內容變數」的形式，把當日訊息全文放進變數。
3. 首次測試建議先發給你自己的號碼。

## 技術細節

**資料庫（migration）**
- `daily_broadcast_settings` 加欄位：`auto_send boolean default false`、`recipients jsonb default '[]'`（`[{phone, label}]`）、`template_name text`、`template_language text default 'zh_HK'`。
- 新表 `daily_broadcast_sends`：`id`、`broadcast_id`（FK → `daily_broadcasts`）、`phone`、`status`（sent／failed）、`error text`、`sent_at`。Admin-only RLS 用 `has_role(auth.uid(),'admin')`，並 `GRANT SELECT` 給 `authenticated`、`GRANT ALL` 給 `service_role`。

**新 Edge Function `daily-broadcast-send`**
- 驗證 admin JWT，或以 `cron: true` 由排程呼叫。
- 讀今日 `daily_broadcasts` 與設定名單，逐個號碼經 Lovable connector gateway 呼叫 `POST https://connector-gateway.lovable.dev/whatsapp/messages`，`type: 'template'`，body 參數放入當日訊息全文（英文名單用 `body_en`，否則 `body_zh_tw`）。
- 逐條寫入 `daily_broadcast_sends`；把 provider 的 status 與錯誤內容原文回傳，不吞錯。
- 全部成功後把 `daily_broadcasts.status` 更新為 `posted`、寫 `posted_at`。

**排程**
- 現有 `daily-broadcast-generate` cron 之後，加一條 pg_cron（08:35 HKT）呼叫 `daily-broadcast-send`，並在 function 內檢查 `auto_send` 是否開啟。

**前端**
- `src/components/admin/AdminDailyBroadcastPanel.tsx`：加自動發送開關、名單編輯、範本欄位、立即發送、發送紀錄列表。
- 新翻譯鍵加入 `src/contexts/translationsBroadcast.ts`，三語齊備。
