將首頁 `src/pages/Home.tsx` 中的四個現有區塊：
1. QuizCTA（唔知點揀好？60 秒測試）
2. SocialProofTicker（本週六僅剩 3 個名額）
3. ReferralBanner（邀請朋友一起跳）
4. RewardsTeaser（會員獎勵計劃）

從目前位於 Testimonials 下方的位置，整體搬移到 `#locations` 區塊上方，順序緊接在「促銷橫幅（Promotion Ribbon）」之後。

新的首頁主內容順序將為：
- Hero
- Trust signals
- Promotion Ribbon
- QuizCTA
- SocialProofTicker
- ReferralBanner
- RewardsTeaser
- Locations
- WeatherForecast
- Services
- Booking
- SafetySection
- JumpDayTimeline
- Testimonials
- AlumniPathway
- SouvenirTeaser
- About
- FAQ
- Contact

技術細節：
- 只調整 `src/pages/Home.tsx` 內 `<section id="locations">` 與上述四個 `LazySection` 區塊的相對順序。
- 保留現有的 `LazySection` 包裝與 `minHeight` 設定不變。
- 不更動任何文案、樣式或業務邏輯。