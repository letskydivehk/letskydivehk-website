// Trilingual copy for the rewards program (points + magnet ladder).
// Kept here to avoid ballooning LanguageContext with 60+ keys.
import type { Language } from "@/contexts/LanguageContext";

type Tri = { en: string; "zh-TW": string; "zh-CN": string };

export const pick = (t: Tri, lang: Language) => t[lang] ?? t.en;

export const rewardsCopy = {
  // Section badges & titles
  heroBadge: { en: "Rewards Program", "zh-TW": "會員獎勵計劃", "zh-CN": "会员奖励计划" },
  heroTitle: {
    en: "Every jump gives back more",
    "zh-TW": "每跳一次，回饋更多",
    "zh-CN": "每跳一次，回馈更多",
  },
  heroSub: {
    en: "Earn points on every purchase, and collect exclusive magnets as you climb the skydiving ladder.",
    "zh-TW": "每筆消費都可累積積分，同時解鎖屬於你的限量磁石貼，見證每一次躍下的成長。",
    "zh-CN": "每笔消费都可累积积分，同时解锁属于你的限量磁石贴，见证每一次跃下的成长。",
  },

  // Tabs
  tabPoints: { en: "Points", "zh-TW": "積分計劃", "zh-CN": "积分计划" },
  tabMagnets: { en: "Magnets", "zh-TW": "磁石貼階梯", "zh-CN": "磁石贴阶梯" },
  tabTiers: { en: "Tiers", "zh-TW": "會員等級", "zh-CN": "会员等级" },

  // ─── Points ─────────────────────────────────────
  pointsHeadline: {
    en: "Points Program — every HKD 20 = 1 point",
    "zh-TW": "積分計劃 — 每 HKD 20 = 1 分",
    "zh-CN": "积分计划 — 每 HKD 20 = 1 分",
  },
  pointsEarnTitle: { en: "How to earn", "zh-TW": "如何賺取積分？", "zh-CN": "如何赚取积分？" },
  pointsEarnBody: {
    en: "Any purchase in our store — tandem experience, A-Licence course, photo add-ons, souvenirs, gathering tickets — earns 1 point per HKD 20 spent.",
    "zh-TW": "於本店消費任何服務或商品（包括跳傘體驗、考牌課程、攝影加購、紀念品、聚會門票），每 HKD 20 即可獲得 1 分。",
    "zh-CN": "于本店消费任何服务或商品（包括跳伞体验、考牌课程、摄影加购、纪念品、聚会门票），每 HKD 20 即可获得 1 分。",
  },

  pointsUseTitle: { en: "How to use", "zh-TW": "積分如何使用？", "zh-CN": "积分如何使用？" },
  pointsUse1: {
    en: "1 point = HKD 1 — redeem directly on your next purchase.",
    "zh-TW": "1 分 = HKD 1，可於下次消費時直接折抵。",
    "zh-CN": "1 分 = HKD 1，可于下次消费时直接折抵。",
  },
  pointsUse2: {
    en: "Redeem against your final balance or add-ons (photos, souvenirs, gathering tickets).",
    "zh-TW": "積分可折抵「尾款」或「加購服務」（攝影、周邊商品、聚會門票）。",
    "zh-CN": "积分可折抵「尾款」或「加购服务」（摄影、周边商品、聚会门票）。",
  },
  pointsUse3: {
    en: "Note: Points cannot be used for the booking deposit, to keep your reservation smooth.",
    "zh-TW": "⚠️ 注意：積分不可用於支付訂金，以確保您的行程預訂順利。",
    "zh-CN": "⚠️ 注意：积分不可用于支付订金，以确保您的行程预订顺利。",
  },

  redeemRulesTitle: { en: "Redemption rules", "zh-TW": "兌換須知", "zh-CN": "兑换须知" },
  ruleMinLabel: { en: "Minimum redemption", "zh-TW": "最低兌換", "zh-CN": "最低兑换" },
  ruleMinValue: {
    en: "10 points per transaction (HKD 10)",
    "zh-TW": "每次最少使用 10 分（即 HKD 10）",
    "zh-CN": "每次最少使用 10 分（即 HKD 10）",
  },
  ruleExpiryLabel: { en: "Validity", "zh-TW": "有效期", "zh-CN": "有效期" },
  ruleExpiryValue: {
    en: "Points expire 12 months after being earned",
    "zh-TW": "積分有效期為 12 個月，逾期自動歸零",
    "zh-CN": "积分有效期为 12 个月，逾期自动归零",
  },
  ruleRemindLabel: { en: "Expiry reminder", "zh-TW": "到期提醒", "zh-CN": "到期提醒" },
  ruleRemindValue: {
    en: "We email you 30 days before points expire.",
    "zh-TW": "系統將於到期前 30 天發送電郵通知，請把握使用。",
    "zh-CN": "系统将于到期前 30 天发送电邮通知，请把握使用。",
  },
  ruleCheckLabel: { en: "Check balance", "zh-TW": "查詢餘額", "zh-CN": "查询余额" },
  ruleCheckValue: {
    en: "Sign in to your member account to see points, expiry date, and history.",
    "zh-TW": "登入會員帳戶即可查看目前積分、到期日及歷史紀錄。",
    "zh-CN": "登入会员帐户即可查看目前积分、到期日及历史纪录。",
  },

  exampleTitle: { en: "Example", "zh-TW": "情境範例", "zh-CN": "情境范例" },
  exampleBody: {
    en: "You book a tandem jump for HKD 4,000 → earn 200 points. Three months later you bring a friend and spend another HKD 4,000 — redeem your 200 points to save HKD 200, paying only HKD 3,800. That same purchase also earns you fresh points!",
    "zh-TW": "您參加了一次跳傘體驗（HKD 4,000），獲得 200 分。三個月後帶朋友再參加，該次消費 HKD 4,000，您可使用 200 分折抵 HKD 200，只需支付 HKD 3,800。同時，這次新消費又為您賺取新的積分！",
    "zh-CN": "您参加了一次跳伞体验（HKD 4,000），获得 200 分。三个月后带朋友再参加，该次消费 HKD 4,000，您可使用 200 分折抵 HKD 200，只需支付 HKD 3,800。同时，这次新消费又为您赚取新的积分！",
  },

  termsTitle: { en: "Terms (short)", "zh-TW": "條款細則（簡版）", "zh-CN": "条款细则（简版）" },
  term1: {
    en: "Points are non-transferable and cannot be exchanged for cash.",
    "zh-TW": "積分不可轉讓予他人，亦不可兌換現金。",
    "zh-CN": "积分不可转让予他人，亦不可兑换现金。",
  },
  term2: {
    en: "If a booking is cancelled, points earned on that purchase are reclaimed.",
    "zh-TW": "如取消訂單，該次消費所賺取之積分將被收回。",
    "zh-CN": "如取消订单，该次消费所赚取之积分将被收回。",
  },
  term3: {
    en: "We reserve the right to update the points program; changes will be posted on this page.",
    "zh-TW": "本公司保留修改積分計劃條款之權利，任何變更將於網站公佈。",
    "zh-CN": "本公司保留修改积分计划条款之权利，任何变更将于网站公布。",
  },

  // ─── Magnets ─────────────────────────────────────
  magnetsHeadline: {
    en: "Skydiving Honour Ladder — collect your exclusive magnets",
    "zh-TW": "跳傘榮譽階梯 — 收集你的專屬磁石貼",
    "zh-CN": "跳伞荣誉阶梯 — 收集你的专属磁石贴",
  },
  magnetsIntro: {
    en: "Every completed jump is a milestone worth remembering. We designed a magnet collection just for you — one for every stage as you progress from first-timer to sky king.",
    "zh-TW": "每完成一次跳傘，都是值得紀念的里程碑。我們為你設計了一套專屬的磁石貼收集系統，每跳一次，你將獲得一枚代表該階段的限量磁石貼，見證你由新手逐步進化為空中王者。",
    "zh-CN": "每完成一次跳伞，都是值得纪念的里程碑。我们为你设计了一套专属的磁石贴收集系统，每跳一次，你将获得一枚代表该阶段的限量磁石贴，见证你由新手逐步进化为空中王者。",
  },

  // Tier names & rewards
  silver: { en: "Silver", "zh-TW": "銀色", "zh-CN": "银色" },
  gold: { en: "Gold", "zh-TW": "金色", "zh-CN": "金色" },
  platinum: { en: "Platinum", "zh-TW": "白金色", "zh-CN": "白金色" },
  diamond: { en: "Diamond", "zh-TW": "鑽石", "zh-CN": "钻石" },

  jump1st: { en: "1st jump", "zh-TW": "第 1 跳", "zh-CN": "第 1 跳" },
  jump3rd: { en: "3rd jump", "zh-TW": "第 3 跳", "zh-CN": "第 3 跳" },
  jump5th: { en: "5th jump", "zh-TW": "第 5 跳", "zh-CN": "第 5 跳" },
  jump10th: { en: "10th jump", "zh-TW": "第 10 跳", "zh-CN": "第 10 跳" },

  perkSilver: {
    en: "Magnet + 5% off next jump coupon",
    "zh-TW": "贈送磁石貼 ＋ 下次跳傘 95 折優惠券",
    "zh-CN": "赠送磁石贴 ＋ 下次跳伞 95 折优惠券",
  },
  perkGold: {
    en: "Magnet + 10% off next jump coupon",
    "zh-TW": "贈送磁石貼 ＋ 下次跳傘 9 折優惠券",
    "zh-CN": "赠送磁石贴 ＋ 下次跳伞 9 折优惠券",
  },
  perkPlatinum: {
    en: "Magnet + 15% off next jump coupon",
    "zh-TW": "贈送磁石貼 ＋ 下次跳傘 85 折優惠券",
    "zh-CN": "赠送磁石贴 ＋ 下次跳伞 85 折优惠券",
  },
  perkDiamond: {
    en: "Magnet + Diamond Jumpers hall of fame + lifetime 20% off",
    "zh-TW": "贈送磁石貼 ＋ 榮登「鑽石跳傘者」榮譽榜 ＋ 終身 8 折會員資格",
    "zh-CN": "赠送磁石贴 ＋ 荣登「钻石跳伞者」荣誉榜 ＋ 终身 8 折会员资格",
  },

  howReceiveTitle: { en: "How to receive", "zh-TW": "如何領取？", "zh-CN": "如何领取？" },
  howReceiveBody: {
    en: "Our team hands you the magnet in person right after your jump. Snap a photo and tag us — we love sharing your milestone!",
    "zh-TW": "每次跳傘完成後，我們的工作人員會親手將該階段的磁石貼交給你。請記得拍照留念並標記我們，我們很樂意分享你的榮耀時刻！",
    "zh-CN": "每次跳伞完成后，我们的工作人员会亲手将该阶段的磁石贴交给你。请记得拍照留念并标记我们，我们很乐意分享你的荣耀时刻！",
  },
  aboutMagnetTitle: { en: "About the magnets", "zh-TW": "關於磁石貼", "zh-CN": "关于磁石贴" },
  aboutMagnet1: {
    en: "Each magnet is a limited design, only issued at its milestone — never for sale.",
    "zh-TW": "每款磁石貼均為限量設計，僅在對應跳傘次數時發放，無法購買。",
    "zh-CN": "每款磁石贴均为限量设计，仅在对应跳伞次数时发放，无法购买。",
  },
  aboutMagnet2: {
    en: "They stick to fridges, metal desks, or any magnetic surface — the best memento of your journey.",
    "zh-TW": "磁石貼可吸附於雪櫃、金屬桌面或任何磁性表面，是你冒險旅程的最佳紀念品。",
    "zh-CN": "磁石贴可吸附于雪柜、金属桌面或任何磁性表面，是你冒险旅程的最佳纪念品。",
  },

  progressTitle: { en: "Track your progress", "zh-TW": "進度查詢", "zh-CN": "进度查询" },
  progressBody: {
    en: "Sign in to your member account to see your jump count and next milestone. Keep going — Diamond awaits!",
    "zh-TW": "登入會員帳戶，即可查看你目前的跳傘次數以及下一階段的目標。繼續挑戰，向鑽石邁進！",
    "zh-CN": "登入会员帐户，即可查看你目前的跳伞次数以及下一阶段的目标。继续挑战，向钻石迈进！",
  },

  // ─── Home teaser & member account ───────────────
  teaserPointsTitle: { en: "Earn points on every jump", "zh-TW": "每次跳傘都賺積分", "zh-CN": "每次跳伞都赚积分" },
  teaserPointsBody: {
    en: "HKD 20 = 1 point. 1 point = HKD 1 off your next purchase. Points valid for 12 months.",
    "zh-TW": "每 HKD 20 = 1 分。1 分 = HKD 1 折抵，下次消費即用。積分 12 個月有效。",
    "zh-CN": "每 HKD 20 = 1 分。1 分 = HKD 1 折抵，下次消费即用。积分 12 个月有效。",
  },
  teaserMagnetsTitle: { en: "Magnets — your tier rewards", "zh-TW": "磁石貼 — 會員等級獎賞", "zh-CN": "磁石贴 — 会员等级奖赏" },
  teaserMagnetsBody: {
    en: "Silver → Gold → Platinum → Diamond. Reach each member tier and unlock its exclusive magnet plus a next-jump coupon.",
    "zh-TW": "銀 → 金 → 白金 → 鑽石。每達到一個會員等級，即解鎖該等級的限量磁石貼與下次跳傘優惠券。",
    "zh-CN": "银 → 金 → 白金 → 钻石。每达到一个会员等级，即解锁该等级的限量磁石贴与下次跳伞优惠券。",
  },
  seeFullPlan: { en: "See full program", "zh-TW": "查看完整計劃", "zh-CN": "查看完整计划" },

  accountMagnetTitle: { en: "Your magnet collection", "zh-TW": "你的磁石貼收藏", "zh-CN": "你的磁石贴收藏" },
  locked: { en: "Locked", "zh-TW": "未解鎖", "zh-CN": "未解锁" },
  unlockedAt: {
    en: "Unlocked at jump #",
    "zh-TW": "已解鎖（第 ",
    "zh-CN": "已解锁（第 ",
  },
  unlockedAtSuffix: { en: "", "zh-TW": " 跳）", "zh-CN": " 跳）" },
  nextMagnetProgress: {
    en: "Next magnet in {n} more jump(s)",
    "zh-TW": "距離下一枚磁石貼還差 {n} 跳",
    "zh-CN": "距离下一枚磁石贴还差 {n} 跳",
  },

  expiringSoonPrefix: {
    en: "You have {total} points; {amount} will expire in {days} days.",
    "zh-TW": "你目前有 {total} 分，其中 {amount} 分將於 {days} 天後到期。",
    "zh-CN": "你目前有 {total} 分，其中 {amount} 分将于 {days} 天后到期。",
  },
} as const;

export const magnetTiers = [
  { key: "silver", color: "#C0C0C0", jumps: 1, perk: rewardsCopy.perkSilver, jump: rewardsCopy.jump1st, name: rewardsCopy.silver },
  { key: "gold", color: "#FFD700", jumps: 3, perk: rewardsCopy.perkGold, jump: rewardsCopy.jump3rd, name: rewardsCopy.gold },
  { key: "platinum", color: "#E5E4E2", jumps: 5, perk: rewardsCopy.perkPlatinum, jump: rewardsCopy.jump5th, name: rewardsCopy.platinum },
  { key: "diamond", color: "#B9F2FF", jumps: 10, perk: rewardsCopy.perkDiamond, jump: rewardsCopy.jump10th, name: rewardsCopy.diamond },
] as const;
