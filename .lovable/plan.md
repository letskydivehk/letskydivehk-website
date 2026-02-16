
## 問題分析

資料庫中所有「Ultimate Combo」相關的服務名稱在 `(` 前面包含了一個隱藏的**換行符號**（`\n`），導致翻譯 key 無法匹配。

例如：
- 資料庫值：`Tandem Skydive with Ultimate Combo\n(Video + Photos)`（有換行）
- 翻譯 key：`service.Tandem Skydive with Ultimate Combo (Video + Photos)`（無換行）

由於 key 不同，`translateData` 找不到對應翻譯，就直接顯示英文原文。

## 修復方案

在 `translateData` 函數中加入清理邏輯，將換行符號替換為空格後再進行 key 查找。這樣不需要修改資料庫資料，也能正確匹配翻譯。

---

### 技術細節

**修改檔案**: `src/contexts/LanguageContext.tsx`

修改 `translateData` 函數，在查找翻譯前先將 key 中的換行符號（`\n`、`\r`）替換為空格：

```tsx
const translateData = (key: string, fallback: string): string => {
  const normalizedKey = key.replace(/[\r\n]+/g, ' ');
  return dataTranslations[language][normalizedKey] || dataTranslations[language][key] || fallback;
};
```

這個修改：
- 先嘗試用清理後的 key 查找翻譯
- 如果找不到，再用原始 key 查找（向下兼容）
- 最後才退回顯示 fallback 原文
- 不需要修改資料庫資料
- 影響範圍最小，所有動態翻譯都會受益
