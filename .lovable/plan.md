## 目標
把 `expire-credits` 積分到期提醒的寄件人從 `onboarding@resend.dev` 改為 `no-reply@letskydivehk.com`，並加上 `Reply-To: letskydivehk@gmail.com`，讓客戶回信時仍會寄到你的 Gmail。

## 前置條件（需你先在 Resend 完成一次）
Resend 只允許從你**擁有並已驗證的網域**寄件。步驟：
1. 登入 Resend → Domains → Add Domain → 輸入 `letskydivehk.com`
2. Resend 會顯示一組 DNS 記錄（SPF `TXT`、DKIM `TXT`、可選 DMARC）
3. 到 `letskydivehk.com` 的 DNS 供應商加入這些記錄
4. 回 Resend 按 Verify，狀態變綠即完成

驗證完成前，寄件仍會失敗，所以這步是關鍵。若你希望改用子網域（如 `mail.letskydivehk.com`）也可以，只是 DNS 記錄要加在該子網域下。

## 程式碼變更
只改一個檔案：`supabase/functions/expire-credits/index.ts`

在 `sendMail()` 內：
- `from`: `Let's Skydive HK <no-reply@letskydivehk.com>`
- 新增 `reply_to`: `letskydivehk@gmail.com`

其餘邏輯（每日 cron、30 天提醒、去重、積分歸零）不動。

## 驗收
- Resend 網域顯示 Verified
- 手動觸發一次 `expire-credits`，收到的信寄件人為 `no-reply@letskydivehk.com`，回覆會導向 Gmail
- Resend Logs 顯示 `delivered`（非 `403 domain not verified`）

## 備註
若你目前不想動 DNS，另一個選項是換用 Lovable Cloud 內建的 Email 基礎建設（自動發網域、自動 DNS 引導），但那要重做一次 email 設定流程 —— 若需要我可以另開計畫。
