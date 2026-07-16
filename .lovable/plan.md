## 目標

在既有 `/membership/tiers` 頁補上完整的**會員積分計劃**與**跳傘榮譽階梯（磁石貼）**客戶版說明，並實作兩套後端：
1. **積分 12 個月有效期** —— 每筆 `credit_transactions` 記錄到期日、到期前 30 天寄提醒信、逾期自動歸零、取消訂單收回積分。
2. **磁石貼收集追蹤** —— 依 `total_jumps` 里程碑（1 / 3 / 5 / 10）自動發放磁石貼紀錄與對應優惠券。

會員帳戶頁新增：積分摘要（含即將到期）、下一階段磁石貼進度、歷史紀錄、磁石貼展示牆。全部提供**繁中／簡中／英文**三語文案。

---

## 第一部分：內容與 UI（前端）

### A. `/membership/tiers` 頁面重構

現有頁只顯示 4 個等級卡；改為 tabs / 分段：

```text
┌─────────────────────────────────────────┐
│ [ Hero: 每跳一次，回饋更多 ]           │
├─────────────────────────────────────────┤
│ 分頁： 積分計劃 | 磁石貼階梯 | 會員等級  │
├─────────────────────────────────────────┤
│ Tab 1: 積分計劃                         │
│  - 如何賺取（每 $20 = 1 分）           │
│  - 使用方式（1 分 = $1，不可付訂金）   │
│  - 兌換須知表格（最低 10 分、12 月有效）│
│  - 範例情境卡                           │
│  - 條款細則                             │
├─────────────────────────────────────────┤
│ Tab 2: 磁石貼階梯                       │
│  - 4 個階段卡（銀/金/白金/鑽石）        │
│  - 每張含：跳數、顏色、獎勵、圖示       │
│  - 如何領取 / 關於磁石貼 / 進度查詢     │
├─────────────────────────────────────────┤
│ Tab 3: 會員等級（現有內容）             │
└─────────────────────────────────────────┘
```

新增元件：
- `src/components/rewards/PointsProgram.tsx`
- `src/components/rewards/MagnetLadder.tsx`（4 張階段卡 + 進度條）
- `src/components/rewards/RewardsTabs.tsx`

### B. 首頁精華摘要

在 `src/pages/Home.tsx` 的 `AlumniPathway` 附近插入 `<RewardsTeaser />`：兩張並排卡（積分 / 磁石貼），各 3–4 行摘要 + 「查看完整計劃」按鈕連到 `/membership/tiers?tab=points|magnets`。

### C. 會員帳戶頁強化 (`src/pages/MemberProfile.tsx`)

新增四個區塊（登入後可見）：

1. **積分摘要卡** —— 目前積分、即將到期積分與倒數天數：「你目前有 200 分，其中 30 分將於 45 天後到期」。
2. **磁石貼進度** —— 進度條 + 下一階段訊息：「距離白金色只差 1 跳！」
3. **磁石貼展示牆** —— 4 枚圖示，已解鎖彩色、未解鎖灰階。
4. **歷史紀錄**（現有已列出 credit transactions，加入「積分到期日」欄）。

### D. FAQ 新增條目

在 `src/components/FAQ.tsx` `faqItems` 末端追加 4 條，並在 `LanguageContext.tsx` 加 keys：
- `faq.qPoints1` 積分會過期嗎？
- `faq.qPoints2` 積分可以用來付訂金嗎？
- `faq.qMagnet1` 磁石貼可以補領嗎？
- `faq.qMagnet2` 錯過了某階段還能拿到嗎？

### E. i18n

`src/contexts/LanguageContext.tsx` 統一新增 key 前綴：
- `rewards.points.*`（約 25 個 key：標題、規則、範例、條款）
- `rewards.magnets.*`（約 20 個 key：階段名、獎勵、說明）
- `rewards.account.*`（會員頁區塊標題與模板句）

每個 key 提供 `en / zh-TW / zh-CN` 三語值。

---

## 第二部分：積分到期功能（後端）

### 1. Schema 變更（migration）

`credit_transactions` 新增：
- `expires_at TIMESTAMPTZ`（`created_at + interval '12 months'`，signup_bonus/referral_bonus/promotion 有到期，redemption/refund 不到期）
- `expiry_notified_at TIMESTAMPTZ`（記錄已發過 30 天提醒信）
- `expired_at TIMESTAMPTZ`（實際歸零時間戳）

新增 status 值：`expired`。

`bookings` 需要一個欄位或關聯以綁定「這筆訂單賺到多少積分」（現在沒有）—— 新增 `credit_transactions.related_booking_id UUID`，取消訂單時把該筆積分 status 改成 `rejected` 並描述「訂單取消回收」。

`grant_signup_credit` 觸發器改為同時設定 `expires_at = now() + interval '12 months'`。

### 2. RPC：`get_credit_balance` 更新

只計 `status='approved' AND (expires_at IS NULL OR expires_at > now())`。新增 `get_expiring_credits(_user_id, _days)` 回傳即將到期分數。

### 3. Edge Function：`expire-credits`（每日 pg_cron 排程）

- 掃出 `expires_at <= now() AND status='approved'` 且尚未歸零的紀錄 → 插入一筆負值 `expired` 交易（金額 = -amount）並更新原紀錄。
- 掃出 `expires_at BETWEEN now() AND now()+30 days AND expiry_notified_at IS NULL` → 呼叫 Resend 寄「積分即將到期」通知信，寫入 `expiry_notified_at`。
- 使用 `pg_cron` 每天 UTC 01:00 觸發（需啟用 `pg_cron` + `pg_net`）。

### 4. 前端

`useCreditBalance` 加回傳 `expiringSoon: { amount, days }`。`MemberProfile` 顯示到期提示卡片。

---

## 第三部分：磁石貼追蹤（後端）

### 1. 新表 `public.user_magnets`

```sql
CREATE TABLE public.user_magnets (
  id UUID PK,
  user_id UUID NOT NULL,
  tier TEXT NOT NULL,          -- 'silver' | 'gold' | 'platinum' | 'diamond'
  jumps_at_award INT NOT NULL,
  coupon_code TEXT,             -- 對應 95折/9折/85折/終身8折
  coupon_discount NUMERIC,
  coupon_expires_at TIMESTAMPTZ,
  awarded_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, tier)
);
```

+ 標準 GRANT + RLS：`authenticated` 只可讀自己的；admin 可全讀寫。

### 2. Trigger：`profiles.total_jumps` 更新後自動發放

`AFTER UPDATE OF total_jumps ON public.profiles` → 呼叫 `award_magnets(user_id, new_total_jumps)`：
- 檢查 1/3/5/10 里程碑，插入尚未擁有的階段紀錄。
- 產生一次性優惠券碼（例：`MAGNET-{tier}-{userShort}`），寫入 `coupon_discount`（0.05/0.10/0.15/0.20），`coupon_expires_at = now() + interval '12 months'`（鑽石為終身 = NULL）。
- 呼叫 Resend 寄「恭喜獲得 X 磁石貼」通知信。

### 3. 現有 admin_update_profile 已可改 total_jumps → 自動觸發。

### 4. 前端

新增 hook `useUserMagnets()` → 拉 `user_magnets`；`MagnetLadder` 內部顯示已解鎖與否；會員頁展示牆使用同 hook。

---

## 檔案異動總覽

**新增**
- `supabase/migrations/…_rewards_system.sql`
- `supabase/functions/expire-credits/index.ts`
- `supabase/functions/award-magnet-email/index.ts`（或併入現有 send-notification）
- `src/components/rewards/RewardsTabs.tsx`
- `src/components/rewards/PointsProgram.tsx`
- `src/components/rewards/MagnetLadder.tsx`
- `src/components/rewards/MagnetShowcase.tsx`
- `src/components/rewards/RewardsTeaser.tsx`
- `src/hooks/useUserMagnets.ts`

**修改**
- `src/pages/MembershipTiers.tsx`（tabs）
- `src/pages/MemberProfile.tsx`（4 個新區塊）
- `src/pages/Home.tsx`（插入 teaser）
- `src/components/FAQ.tsx`
- `src/contexts/LanguageContext.tsx`（新增 3 語 keys）
- `src/hooks/useCreditBalance.ts`（增加 expiring 欄位）

---

## 交付順序

1. 建立 migration（schema + trigger + `expire-credits` cron 排程 SQL）
2. 部署 edge functions（`expire-credits`、磁石貼通知）
3. 更新 i18n keys（三語）
4. 建立 rewards 元件與頁面 tabs
5. 更新會員帳戶頁四個區塊
6. 首頁 teaser + FAQ 新增
7. 驗證：手動改 `total_jumps` 觸發磁石貼發放；手動把某筆 credit `expires_at` 設成明天，執行 edge function 驗證通知信與歸零流程。

---

## 需要用戶確認的細節

- 磁石貼優惠券使用機制：目前系統沒有 coupon 表，是否要用 `credit_transactions` 加特殊 type 呈現（例如發 200 credit 相當 95折於 $4000 訂單），或另建 `coupons` 表？**建議先用 credit_transactions 折抵**以最快落地。
- 鑽石「終身 8 折」如何實作？**建議**：在 `profiles` 增加 `lifetime_discount NUMERIC`（0.20），booking 結算時自動套用。