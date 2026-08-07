# 三語翻譯檢查與同步修正

## 現況（已用工具核實）

`src/contexts/LanguageContext.tsx` 內 `translations` 有三個語言字典（en / zh-TW / zh-CN），另有多段以 `translations["zh-TW"]["key"] = ...` 形式後補的補丁。

實際掃描全部 `src/**/*.tsx|ts` 中的 `t("...")` 用法後：

- **英文版缺 156 個鍵**：這些鍵只在 zh-TW / zh-CN 補丁段補過，英文完全沒有。切到 English 時畫面會直接顯示原始鍵名（例如 `faq.title`、`quiz.page.title`、`safety.badge`、`timeline.title`、`instructors.title`）。
- **三語全缺 60 個鍵**：無論任何語言都顯示鍵名，主要集中在：
  - 一日遊／行程：`tour.*`（morning/afternoon/evening/day/itinerary/deposit/price/duration/included/addOns/badge.*/promoBanner.*/noTours/viewDetails/chooseLocation*/quickHighlights/itineraryComingSoon）
  - 一日遊服務頁步驟：`servicePage.tour.step1–6.title/desc`
  - 教練團隊：`instructors.title/subtitle/badge/cert/langs`
  - 紀念品：`souvenirs.customPhotoLine`、`souvenirs.photoSendInChat`
  - 定價／CTA：`pricing.off`、`credits.label`
  - 管理後台：`admin.*`（15 個）、`auth.accessDenied`、`auth.allowCookies`、`contact.form.error`
- zh-TW 與 zh-CN 之間鍵覆蓋一致（各 968–969 個），沒有互相缺漏。

## 修正方案

1. **補齊英文 156 個鍵**：為所有只有中文的鍵新增對應英文文案，語氣與現有英文段落一致（簡潔行銷語）。
2. **補齊三語全缺的 60 個鍵**：為每個鍵撰寫 en / zh-TW / zh-CN 三個版本，中文以繁體為權威版本，再轉出簡體（依既有用詞規則，例如「跳傘／跳伞」、「一日遊／一日游」）。
3. **統一整理結構**：把散落在檔案末端的補丁式賦值（`translations["zh-TW"][...] = ...`）合併回三個主字典，讓三語並排、日後易於比對；不改動 `dataTranslations`、`tourDataTranslations` 等動態資料字典的行為。
4. **加入開發期檢查**：在 `LanguageContext` 內（僅 `import.meta.env.DEV`）新增一次性比對，若三語鍵集合不一致就在 console 列出缺漏鍵，避免日後再度失同步。
5. **驗證**：以 Playwright 逐一開啟主要頁面（首頁、/service/skydiving-tour、/souvenirs、/membership/tiers、/quiz、/location/shenzhen-ifly、/promotions）在三種語言下截圖，並掃描頁面文字是否仍出現 `xxx.yyy` 形態的原始鍵名。

## 技術細節

- 只修改 `src/contexts/LanguageContext.tsx`（新增／整理翻譯鍵）＋必要時修正個別元件誤用的鍵名。
- 不改任何業務邏輯、資料庫或 UI 版面。
- 完成後執行 typecheck 確認無錯。
