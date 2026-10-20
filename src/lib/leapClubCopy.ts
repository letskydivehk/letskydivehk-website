// Trilingual copy for 離地會籍 (Leap Club) — four tiers, quarterly Leap Days.
import type { Language } from "@/contexts/LanguageContext";

type Tri = { en: string; "zh-TW": string; "zh-CN": string };
export const lp = (t: Tri, lang: Language) => t[lang] ?? t.en;
const T = (zhTW: string, zhCN: string, en: string): Tri => ({ "zh-TW": zhTW, "zh-CN": zhCN, en });

export const leapCopy = {
  name: T("離地會籍", "离地会籍", "Leap Club"),
  slogan: T("唔係一次旅行，而係一個你每年都會返嚟嘅習慣。", "不是一次旅行，而是一个你每年都会回来的习惯。", "Not a one-off trip — a habit you come back to every year."),
  intro: T("入會費全免，無月費、無年費。完成第 1 跳自動成為銀級會員，權益終身保留。", "入会费全免，无月费、无年费。完成第 1 跳自动成为银级会员，权益终身保留。", "No joining fee, no monthly or annual fees. Your first jump makes you a Silver member automatically — for life."),
  letterTitle: T("創辦人 E人 嘅一封信", "创办人 E人 的一封信", "A letter from founder E"),
  letter: T("你驚，但你想。我明白嗰種心跳。跟住 E人，你淨係負責跳就得——其餘交俾我哋。跳完一次，你會想再跳；所以我哋建立咗離地會籍，等每一年都有一個返嚟嘅理由。", "你怕，但你想。我明白那种心跳。跟着 E人，你只负责跳就好——其余交给我们。跳完一次，你会想再跳；所以我们建立了离地会籍，让每一年都有一个回来的理由。", "You're scared, but you want it. I know that heartbeat. Jump with E — you only need to jump, we handle the rest. After one jump you'll want another, so we built Leap Club to give you a reason to return every year."),
  tiersTitle: T("四級會籍・四款磁石貼", "四级会籍・四款磁石贴", "Four tiers, four magnets"),
  leapTitle: T("季季一飛：離地日", "季季一飞：离地日", "Every season, a Leap Day"),
  leapSub: T("每季一次會員專屬團，會員優先報名。", "每季一次会员专属团，会员优先报名。", "One members' trip every quarter, with priority sign-up."),
  cta: T("立即預約名額", "立即预约名额", "Reserve your spot"),
  learn: T("了解離地會籍", "了解离地会籍", "Explore Leap Club"),
  myStatus: T("我的會籍", "我的会籍", "My membership"),
  teaserTitle: T("唔止跳一次，而係建立一個習慣", "不止跳一次，而是建立一个习惯", "Not just one jump — a new habit"),
  locationNote: T("完成此跳傘後，你將自動成為離地會籍銀級會員。", "完成此跳伞后，你将自动成为离地会籍银级会员。", "Complete this jump and you automatically become a Leap Club Silver member."),
  promoNote: T("此優惠可與離地會籍權益同時使用（金級會員額外享 95 折，白金享 85 折）。", "此优惠可与离地会籍权益同时使用（金级会员额外享 95 折，白金享 85 折）。", "Stacks with Leap Club perks (Gold members get an extra 5% off, Platinum 15% off)."),
  jumpsToNext: T("距離下一級尚欠 {n} 跳", "距离下一级尚欠 {n} 跳", "{n} more jumps to next tier"),
  notMember: T("完成第 1 跳即自動啟動銀級會籍", "完成第 1 跳即自动启动银级会籍", "Your first jump activates Silver"),
  maxTier: T("你已達最高等級", "你已达最高等级", "You've reached the top tier"),
};

export const leapTiers = [
  { key: "silver", min: 1, name: T("銀級", "银级", "Silver"), req: T("完成第 1 跳", "完成第 1 跳", "First jump"),
    perks: [T("專屬銀色磁石貼", "专属银色磁石贴", "Silver magnet"), T("每消費 $20 賺 1 積分（1 分 = HKD 1）", "每消费 $20 赚 1 积分（1 分 = HKD 1）", "Earn 1 point per $20 (1 pt = HKD 1)"), T("離地日優先報名", "离地日优先报名", "Priority Leap Day sign-up")] },
  { key: "gold", min: 3, name: T("金級", "金级", "Gold"), req: T("累積 3 跳", "累积 3 跳", "3 jumps"),
    perks: [T("專屬金色磁石貼", "专属金色磁石贴", "Gold magnet"), T("跳傘額外 95 折", "跳伞额外 95 折", "Extra 5% off jumps"), T("積分倍數提升", "积分倍数提升", "Higher points multiplier")] },
  { key: "platinum", min: 6, name: T("白金級", "白金级", "Platinum"), req: T("累積 6 跳", "累积 6 跳", "6 jumps"),
    perks: [T("專屬白金磁石貼", "专属白金磁石贴", "Platinum magnet"), T("跳傘額外 85 折", "跳伞额外 85 折", "Extra 15% off jumps"), T("離地日預留名額", "离地日预留名额", "Reserved Leap Day seats")] },
  { key: "diamond", min: 10, name: T("鑽石級", "钻石级", "Diamond"), req: T("累積 10 跳", "累积 10 跳", "10 jumps"),
    perks: [T("專屬鑽石磁石貼", "专属钻石磁石贴", "Diamond magnet"), T("年度會員派對 VIP 席", "年度会员派对 VIP 席", "VIP seat at the annual party"), T("與 E人 同機跳傘機會", "与 E人 同机跳伞机会", "Chance to jump with E")] },
];

export const leapDays = [
  { q: "Q1", place: T("中國・廣東珠海", "中国・广东珠海", "Zhuhai, China"), theme: T("開季首跳", "开季首跳", "Season opener"),
    desc: T("港珠澳大橋口岸出發最快 1 小時直達，春季開年第一跳。", "港珠澳大桥口岸出发最快 1 小时直达，春季开年第一跳。", "About an hour via the HZMB — the first jump of spring.") },
  { q: "Q2", place: T("泰國・芭堤雅", "泰国・芭堤雅", "Pattaya, Thailand"), theme: T("初夏海岸飛", "初夏海岸飞", "Early-summer coast jump"),
    desc: T("初夏出國跳傘，俯瞰芭堤雅蔚藍海岸線。", "初夏出国跳伞，俯瞰芭堤雅蔚蓝海岸线。", "Fly abroad and look down on Pattaya's blue coastline.") },
  { q: "Q3", place: T("中國・海南島", "中国・海南岛", "Hainan, China"), theme: T("碧海藍天度假跳", "碧海蓝天度假跳", "Island holiday jump"),
    desc: T("海島度假風情，高空俯瞰海岸景致。", "海岛度假风情，高空俯瞰海岸景致。", "Island vibes with sweeping coastal views.") },
  { q: "Q4", place: T("泰國・芭堤雅", "泰国・芭堤雅", "Pattaya, Thailand"), theme: T("避寒年終盛典", "避寒年终盛典", "Year-end celebration"),
    desc: T("乾爽宜跳旺季，年度會員大聚會。", "干爽宜跳旺季，年度会员大聚会。", "Dry, perfect jump season and our annual members' party.") },
];

export function tierForJumps(jumps: number) {
  let idx = -1;
  leapTiers.forEach((t, i) => { if (jumps >= t.min) idx = i; });
  return idx;
}
