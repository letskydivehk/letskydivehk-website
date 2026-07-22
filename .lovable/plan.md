## 目標
當會員的積分有任何更新（新增、扣減、退款、調整等）時，該會員所有未到期的積分自動延展到「最新一次活動日 + 365 天」，並在頁面清楚說明此規則。

## 一、資料庫（migration）

新增觸發器：`credit_transactions` INSERT 後執行。

```sql
CREATE OR REPLACE FUNCTION public.trg_renew_credit_expiry()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  -- 每次有新的 approved 交易，就把該用戶所有未到期、有 expires_at 的 approved 積分續期至 365 天後
  IF NEW.status = 'approved' AND NEW.user_id IS NOT NULL THEN
    UPDATE public.credit_transactions
    SET expires_at = now() + INTERVAL '365 days',
        expiry_notified_at = NULL   -- 續期後重置到期提醒，讓下次接近到期時可再通知
    WHERE user_id = NEW.user_id
      AND status = 'approved'
      AND expired_at IS NULL
      AND expires_at IS NOT NULL
      AND id <> NEW.id;
  END IF;
  RETURN NEW;
END $$;

CREATE TRIGGER credit_tx_renew_expiry
AFTER INSERT ON public.credit_transactions
FOR EACH ROW EXECUTE FUNCTION public.trg_renew_credit_expiry();
```

備註：新插入的 row 本身在 INSERT 時已由既有邏輯設定 12 個月 expires_at，此觸發器只延展「其他既存」積分。若需要，也可讓觸發器把 NEW 自己也標準化到 365 天。

## 二、頁面文案更新（`src/lib/rewardsCopy.ts`）

- `ruleExpiryValue`（三語）改為：
  - zh-TW：「積分有效期 365 天；每次有積分變動（獲得、使用或調整），全部未到期積分自動延長至活動日後 365 天。」
  - zh-CN：對應簡體
  - en：「Points valid for 365 days. Any credit activity (earn, redeem, or adjust) automatically renews all unexpired points to 365 days from the latest activity.」
- `pointsShort`（第 180 行）尾句「Points valid for 12 months」改為 365 天自動續期版本。

## 三、UI 明示

在會員頁面積分卡下方加入一行 badge 樣式的提示：

- 檔案：`src/components/rewards/ExpiringCreditsNote.tsx` 加入永久顯示的 secondary note（即使沒有即將到期積分也顯示一次規則），或在 `src/pages/MembershipTiers.tsx` PointsProgram 區塊顯著位置加 callout。

顯示文字（zh-TW）：「積分有效期 365 天，只要有任何積分活動即自動續期。」

## 四、驗證

1. Migration 執行後在 SQL editor 手動 INSERT 一筆 `admin_adjustment` 交易，確認同用戶其他 approved rows 的 `expires_at` 被更新為 now()+365d。
2. 檢視 `/membership` 三語頁面文案顯示正確。
