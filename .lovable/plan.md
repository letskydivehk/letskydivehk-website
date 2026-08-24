# 每日 WhatsApp 群組更新（自動草稿 + 一鍵貼上）

WhatsApp 官方 API 無法自動發訊息到群組，所以做法是：系統每日自動幫你寫好當日訊息，你在管理後台（或手機）按一下複製／開啟 WhatsApp 貼上即可。內容混合 AI 撰寫 + 自動抓網站即時資料。

## 每日流程

```text
每日 08:30 (HKT) 自動排程
        |
  抓即時資料：下次深圳 iFLY 出團日 / 剩餘位 / 該基地天氣 / 生效中優惠
        |
  AI 撰寫當日主文（跳傘知識、小貼士、鼓勵預約）
        |
  組合成一段 WhatsApp 格式文字（含 emoji、*粗體*、預約連結）
        |
  存為「今日草稿」→ 你在後台預覽／編輯
        |
  按「複製訊息」或「開啟 WhatsApp」→ 揀群組貼上
```

## 你會見到的介面

管理後台 `/admin/credits` 新增一個 **每日群發** 分頁：

- **今日訊息卡**：今日日期、AI 生成的完整文字，直接可編輯。
- **一鍵複製** 按鈕（複製到剪貼簿）與 **開啟 WhatsApp** 按鈕（手機／桌面開啟 WhatsApp，訊息已預填，你只需揀群組）。
- **重新生成** 按鈕（可加自訂主題提示，例如「今日講天氣」）。
- **已發送** 勾選：標記今日已貼出，避免重覆。
- **主題輪播設定**：星期一至日各自預設主題方向（例如週一安全知識、週三出團提醒、週五優惠、週日學員故事），可自行修改。
- **歷史紀錄**：過去 30 日訊息，可重看／重用。
- **語言**：預設繁體中文（可切換加英文版本一併輸出）。

## 訊息會自動包含

- 當日跳傘知識 / 小貼士（AI）
- 下次深圳 iFLY 出團日期與剩餘名額（來自 `service_departures`）
- 該基地未來幾日天氣與適跳指數（現有 weather 邏輯）
- 生效中優惠或推薦碼提醒
- 預約連結（letskydivehk.com）

## 技術細節

**資料庫（migration）**
- `daily_broadcasts`：`id`、`broadcast_date`（unique）、`topic`、`body_zh_tw`、`body_en`、`status`（draft / posted）、`posted_at`、`created_at`、`updated_at`。Admin-only RLS 用 `has_role(auth.uid(),'admin')`；`GRANT` 給 `authenticated` 與 `service_role`。
- `daily_broadcast_settings`：單行，`weekday_topics jsonb`（週一至日主題）、`enabled boolean`、`include_en boolean`、`send_hour int`。同樣 admin-only RLS + grants。

**Edge function**
- `daily-broadcast-generate`（`verify_jwt = false`，程式內驗證 admin JWT 或 cron 呼叫）：
  - 讀設定取得當日星期主題，查 `service_departures`（`get_departure_availability`）取下次出團與剩位，取天氣資料，查生效優惠。
  - 呼叫 Lovable AI Gateway（`google/gemini-2.5-flash`）產生主文，程式再把實時資料以固定模板拼入，輸出 WhatsApp 純文字格式（`*bold*`、emoji、無 markdown 標題）。
  - `upsert` 入 `daily_broadcasts`（以 `broadcast_date` 去重，同日重覆呼叫不會產生第二筆）。
  - 處理 AI gateway 402 / 429 並回傳訊息。

**排程**
- `pg_cron` 每日 00:30 UTC（08:30 HKT）用 `pg_net` 呼叫該 function。用 `run_sql` 建立（含 function URL 與 anon key，不入 migration）。

**前端**
- `src/components/admin/AdminDailyBroadcastPanel.tsx`：今日卡、編輯、複製（`navigator.clipboard`）、`https://wa.me/?text=<encoded>` 開啟 WhatsApp、重新生成、標記已發送、設定區、歷史列表。
- `src/pages/AdminCredits.tsx` 加一個 `broadcast` 分頁（沿用現有 `TabsTrigger` 樣式）。
- 新翻譯鍵加入 `src/contexts/translationsMissing.ts`，三語齊備。

## 備註

若日後想真正「零人手」自動發到群組，唯一穩定做法是改用 Telegram 群組 Bot（WhatsApp 官方不支援群組自動發送）。此計劃保留的內容產生邏輯，日後可直接接上 Telegram。
