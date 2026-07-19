## 目標
更新 `expire-credits` edge function 內的積分到期提醒電郵範本，改用新的主旨與繁中口語內文，並加入公司 Logo 及 Hero 圖片以提升可信度。

## 變更檔案
只改一個檔案：`supabase/functions/expire-credits/index.ts`

### 1. 上傳圖片為 Lovable Asset
- 將用戶剛上傳的 `Logo_magnet_base.png` 透過 `lovable-assets` CLI 上傳到 CDN，得到穩定 URL（電郵必須用絕對 https URL，不能用本地 import）。
- Hero 圖片：沿用專案現有的 skydiver 素材。因為現有 hero 是 `.mp4`（電郵不支援影片），會用 `imagegen` 產生一張跳傘 hero 靜態圖（1200×600 JPEG）並上傳為 asset，取得 CDN URL。

### 2. 改寫 `sendMail()` HTML 模板
兩個發送點都會用到同一個新模板（真實排程寄送 + `preview_to` 測試寄送）：

- 主旨：`你的跳傘積分就到期啦，快啲預約跳傘用咗佢啦！`
- 內文結構（table-based email HTML，寬 600px 置中，白底）：
  1. 頂部：Logo 圖（高約 80px、置中）
  2. Hero 圖（寬 100%、圓角、alt="Let's Skydive HK"）
  3. 稱謂：`親愛的 {full_name || "跳傘朋友"}，`
  4. 主體文案（照用戶提供）：
     > 你的會員積分中有 **{amount}** 分將於 **{expires_at 格式化為 YYYY年M月D日}** 到期。每 1 分 = $1，可用於下次跳傘尾款或加購服務。立即登入預訂你的下一次冒險！
  5. CTA 按鈕：`按此登入帳戶` → `https://letskydivehk.com/membership`（藍色底、白字、圓角、置中、內邊距 14×28）
  6. 頁尾小字：`Let's Skydive HK · letskydivehk.com`

### 3. 保持不變
- 每日 cron 排程、30 天提醒判斷、`expiry_notified_at` 去重、積分歸零邏輯完全不動
- 寄件人 `no-reply@letskydivehk.com`、Reply-To `letskydivehk@gmail.com` 維持
- `preview_to` 測試路徑改用新模板（方便用戶再發一次到 ianwcc@gmail.com 檢查）

## 驗收
- 呼叫 `preview_to=ianwcc@gmail.com` 收到新版電郵，包含 Logo、Hero 圖、新文案與可點擊的登入按鈕
- 日常 cron 執行結果 `ok: true` 不變
