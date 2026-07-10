
## 目標
兩個登記流程都寄出含「$200 現金券」按鈕的電郵，點擊後帶客人回到會員專頁；會員專頁再放一顆明顯「立即預約跳傘」按鈕。

## 需要改動

### 1. 信用額由 $100 升到 $200
- DB migration：更新 `grant_signup_credit()` 函數，把 `amount` 由 `100` 改為 `200`，描述改成「歡迎獎金 - $200 現金券」。
- 前端文案：`LanguageContext` 內所有出現「$100」的歡迎/信用額字串（quiz lead、AuthModal、會員頁提示）統一改為 `$200`。

### 2. 測驗登記電郵（`register-quiz-lead`）
- 主旨 & 內文改為「$200 現金券」。
- CTA 按鈕文字改為 `$200 現金券 — 立即使用`（中英繁簡三語）。
- 按鈕 `href` 由 magic link 的 `redirectTo` 由 `/auth/callback` 改為 `/auth/callback?next=/membership`，令登入後直接帶入會員專頁。

### 3. 一般註冊歡迎電郵（新）
目前 AuthModal signup 沒有自訂歡迎信。新增：
- 新 edge function `send-welcome-email`（`verify_jwt = false`，內部驗證 service role），輸入：`email`, `full_name`, `language`。內容同上：$200 現金券按鈕，連結指向 `https://letskydivehk.com/membership`（已登入者直接可用；未登入會走一般 auth flow）。
- 在 `AuthContext.signUp` 成功後（或 `handle_new_user` 觸發後）由前端 `supabase.functions.invoke("send-welcome-email", ...)` 呼叫一次；用 localStorage flag 防重寄。
- 用現有 `RESEND_API_KEY`（`onboarding@resend.dev` 寄件人）。

### 4. AuthCallback 支援 `next` 參數
`src/pages/AuthCallback.tsx` 讀取 query `next`，登入成功後 `navigate(next || "/")`，方便電郵按鈕直達 `/membership`。

### 5. 會員專頁預約按鈕
`src/pages/MemberProfile.tsx` 頂部（信用額卡片附近）新增一顆大按鈕「立即預約跳傘 →」，`onClick` 導去 `/#booking`（或現有 booking funnel 首頁），三語支援。

## 技術細節
- Edge function 路徑：`supabase/functions/send-welcome-email/index.ts` + 在 `supabase/config.toml` 加 `[functions.send-welcome-email] verify_jwt = false`。
- Email HTML 沿用 `register-quiz-lead` 內既有 inline style 模板，只換文字與按鈕連結。
- 不改動任何現有 booking / payment 邏輯。

## 不做的事
- 不啟用 Lovable 託管 auth email templates（本專案用外部 Supabase，且用戶只要一顆按鈕，不需完整 branding 系統）。
- 不動信用額計算/兌換邏輯，只改初始 grant 金額。
