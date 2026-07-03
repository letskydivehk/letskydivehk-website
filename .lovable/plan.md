## 現時紀念品部份的觀察

紀念品頁面 `/souvenirs` 現時像一個獨立的商品目錄，與「吸引人跳傘」的核心目標脫節：

1. **入口幾乎不存在**：主頁 `Home.tsx` 從未 link 到 `/souvenirs`，只有 WhatsApp widget 在 `/souvenirs` 路徑下才會切換到紀念品快速訊息。潛在客人根本看不到。
2. **敘事只講產品，不講體驗**：頁面標題只有 badge + title + subtitle，沒有「這是你人生第一跳的證明」這種情感連結。冰箱磁石的價值在於「回憶」，但頁面沒有展示真實跳傘照被做成磁石的 before→after。
3. **與 booking flow 斷裂**：紀念品完全靠 WhatsApp 落單，跟 `BookingContext`／$500 訂金流程無關。跳傘後客人拿到照片，沒有「一鍵把這張照片變成磁石」的路徑。
4. **會員折扣宣傳弱**：`memberDiscountGuest` 只用一句小 banner 帶過，沒有量化「跳完傘 = 自動解鎖折扣」的價值。
5. **社會證明缺席**：沒有其他學員收到磁石／T-shirt 的照片、開箱、留言。這是吸引「未跳過」訪客最有效的信任訊號。
6. **CTA 只有一個方向**：所有按鈕都是「WhatsApp 落單買紀念品」。缺少反向 CTA — 「想擁有屬於自己的跳傘磁石？先預約跳傘」。
7. **SEO／可發現性**：`llms.txt` 沒列出 `/souvenirs`，sitemap 也需要確認。

## 建議改動（只涉及前端呈現，不改商業邏輯）

### A. 把紀念品變成主頁的「跳傘動機」板塊
- 在 `Home.tsx` 現有 `AlumniPathway` 附近，新增一個輕量的 **SouvenirTeaser** section（LazySection 懶載入）：
  - 標題：「你的第一跳，值得一塊冰箱磁石」
  - 3 張真實學員磁石／T-shirt 照片（用現有 `magnet-fridge-mosaic.jpg` + 2 張變體）
  - 一句情感文案 + 兩個 CTA：主 CTA「立即預約跳傘」→ `#booking`，次 CTA「查看紀念品」→ `/souvenirs`
- 在 `Footer.tsx` Quick Links 加入「紀念品」入口。

### B. 重寫 `/souvenirs` 頁首 hero
在 `Souvenirs.tsx` 的 `motion.div`（第 822-834 行）加入：
- Before/After 視覺：「你的跳傘照片 → 你家冰箱上的磁石」
- 3 個 trust chip：「跳傘學員限定」「1 張起訂」「7 日內寄出」
- 頂部 CTA banner：「未跳過？先預約，回來訂磁石享會員 8 折」→ link 到 `/#booking`

### C. 每張 ProductCard 加入「跳傘連結」尾欄
在 `ProductCard` 落單按鈕下方（第 759 行後）加一個輕量區塊：
- 「還未跳過？把你的第一跳變成這塊磁石」
- Secondary button → `/#booking`
- 只對 `customisation_required` 為 true 的商品顯示（因為那些需要客人自己的跳傘照）

### D. 加入社會證明區
在 `Souvenirs.tsx` 商品列表之後，新增一個 `<SouvenirTestimonials>` 區塊：
- 3-4 張學員收貨後開箱／貼在冰箱／穿 T-shirt 的照片（靜態 array，先放 placeholder）
- 每張配一句短 quote（多語）

### E. 強化會員折扣的說服力
把現有 `memberDiscountGuest` banner 升級：
- 顯示具體節省金額，例如「會員價 HK$XXX（省 HK$YY）」
- 加一行小字：「跳完第一跳自動成為會員」→ link 到 `/#booking`

### F. 把 `/souvenirs` 加入 `public/llms.txt` 的 Pages 區塊，並在 `SEO` title/description 中強調「跳傘紀念品／學員限定」。

## 技術範圍

- 新增：`src/components/SouvenirTeaser.tsx`（首頁用）、`src/components/souvenirs/SouvenirTestimonials.tsx`
- 修改：`src/pages/Home.tsx`（插入 teaser）、`src/pages/Souvenirs.tsx`（hero、每卡尾欄、testimonial、折扣 banner 文案）、`src/components/Footer.tsx`（Quick Link）、`public/llms.txt`
- 新增 i18n key（英／繁／簡）於 `LanguageContext`
- **不改**：資料庫 schema、`useSouvenirs` hook、WhatsApp 落單流程、Airwallex／booking 邏輯、任何 admin panel

## 開放問題

1. 是否要我全部 6 項一次做齊，還是先做 A + B + C（最直接影響「吸引跳傘」的三項）？
2. 社會證明（D）需要真實客人照片，暫時用佔位圖 + 假 quote，還是先跳過等你提供素材？
