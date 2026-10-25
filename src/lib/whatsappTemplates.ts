// Page-aware WhatsApp pre-filled messages (trilingual).
import type { Language } from "@/contexts/LanguageContext";

export const WHATSAPP_NUMBER = "85256153271";
type Tri = { en: string; "zh-TW": string; "zh-CN": string };
const T = (zhTW: string, zhCN: string, en: string): Tri => ({ "zh-TW": zhTW, "zh-CN": zhCN, en });
export const tr = (t: Tri, lang: Language) => t[lang] ?? t.en;

export const waUrl = (text: string) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

export type QuickOption = { icon: string; label: Tri; message: Tri };
const general: QuickOption = { icon: "💬", label: T("一般客服查詢", "一般客服咨询", "General enquiry"),
  message: T("你好！想諮詢 Let's Skydive HK 跳傘預約及行程安排 🪂", "你好！想咨询 Let's Skydive HK 跳伞预约及行程安排 🪂", "Hi! I'd like to enquire about skydiving bookings with Let's Skydive HK 🪂") };

const slugName = (slug: string) => slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export function quickOptionsFor(pathname: string, locationName?: string): QuickOption[] | null {
  if (pathname.startsWith("/souvenirs")) return null; // keep souvenir-specific options
  if (pathname.startsWith("/location/shenzhen-ifly")) return [
    { icon: "🌀", label: T("雙週六專車一日遊", "双周六专车一日游", "Bi-weekly Saturday shuttle"), message: T("你好！想查詢【深圳 iFLY 室內跳傘】雙週六專車一日遊的名額及接送安排 🌀", "你好！想咨询【深圳 iFLY 室内跳伞】双周六专车一日游的名额及接送安排 🌀", "Hi! I'd like to enquire about the Shenzhen iFLY bi-weekly Saturday shuttle day tour 🌀") },
    { icon: "👨‍👩‍👧", label: T("新手/親子飛行方案", "新手/亲子飞行方案", "Beginner & family flights"), message: T("你好！想了解【深圳 iFLY】新手及親子飛行方案 🌀", "你好！想了解【深圳 iFLY】新手及亲子飞行方案 🌀", "Hi! I'd like to know about Shenzhen iFLY beginner and family flights 🌀") },
    { icon: "📍", label: T("交通集合地點", "交通集合地点", "Meeting point"), message: T("你好！想查詢【深圳 iFLY】一日遊的集合地點及時間 📍", "你好！想咨询【深圳 iFLY】一日游的集合地点及时间 📍", "Hi! Where and when do we meet for the Shenzhen iFLY day tour? 📍") },
    { icon: "👥", label: T("團體包場優惠", "团体包场优惠", "Group bookings"), message: T("你好！想查詢【深圳 iFLY】團體包場優惠，人數約為：", "你好！想咨询【深圳 iFLY】团体包场优惠，人数约为：", "Hi! I'd like a group quote for Shenzhen iFLY. Group size:") },
  ];
  const loc = pathname.match(/^\/location\/([^/]+)/);
  if (loc) {
    const n = locationName || slugName(loc[1]);
    return [
      { icon: "🪂", label: T("預約跳傘名額", "预约跳伞名额", "Book a jump"), message: T(`你好！我想預約【${n}】雙人跳傘，想查詢出發日期同名額安排 🪂`, `你好！我想预约【${n}】双人跳伞，想咨询出发日期和名额安排 🪂`, `Hi! I'd like to book a tandem skydive at ${n}. Could you advise on available dates? 🪂`) },
      { icon: "🚐", label: T("交通接送諮詢", "交通接送咨询", "Transport"), message: T(`你好！想查詢由香港去【${n}】的交通接送安排 🚐`, `你好！想咨询由香港去【${n}】的交通接送安排 🚐`, `Hi! How do I get from Hong Kong to ${n}? 🚐`) },
      { icon: "🌤️", label: T("天氣及改期政策", "天气及改期政策", "Weather & rescheduling"), message: T(`你好！想了解【${n}】遇上天氣不佳時的改期安排 🌤️`, `你好！想了解【${n}】遇上天气不佳时的改期安排 🌤️`, `Hi! What happens at ${n} if the weather is bad? 🌤️`) },
      general,
    ];
  }
  if (pathname.startsWith("/services/a-licence")) return [
    { icon: "🎓", label: T("考牌課程及收費", "考牌课程及收费", "Course & fees"), message: T("你好！我想諮詢 USPA A-Licence 考牌學員課程，想了解培訓時長、費用同近期開班日程 🎓", "你好！我想咨询 USPA A-Licence 考牌学员课程，想了解培训时长、费用和近期开班日程 🎓", "Hi! I'm interested in the USPA A-Licence course. Could you share the training schedule and fee breakdown? 🎓") },
    { icon: "📅", label: T("下期開班時間表", "下期开班时间表", "Next intake"), message: T("你好！想查詢 A-Licence 下一期開班日期 📅", "你好！想咨询 A-Licence 下一期开班日期 📅", "Hi! When is the next A-Licence intake? 📅") },
    { icon: "✅", label: T("報名資格及體重要求", "报名资格及体重要求", "Eligibility"), message: T("你好！想了解 A-Licence 報名資格及體重要求 ✅", "你好！想了解 A-Licence 报名资格及体重要求 ✅", "Hi! What are the A-Licence eligibility and weight requirements? ✅") },
    { icon: "🧑‍✈️", label: T("聯絡主教練", "联络主教练", "Talk to an instructor"), message: T("你好！想同主教練傾吓 A-Licence 考牌安排 🧑‍✈️", "你好！想和主教练聊聊 A-Licence 考牌安排 🧑‍✈️", "Hi! I'd like to talk to an instructor about the A-Licence 🧑‍✈️") },
  ];
  if (pathname.startsWith("/membership")) return [
    { icon: "✈️", label: T("會員權益及跳數要求", "会员权益及跳数要求", "Perks & tiers"), message: T("你好！想了解【萬呎俱樂部 Skywalkers Club】會員資格及季季一飛「萬呎集結日」詳情 ✈️", "你好！想了解【万尺俱乐部 Skywalkers Club】会员资格及季季一飞“万尺集结日”详情 ✈️", "Hi! I'd like to know more about the Skywalkers Club perks and the upcoming Skywalker Gathering ✈️") },
    { icon: "📅", label: T("萬呎集結日報名", "万尺集结日报名", "Join a Gathering"), message: T("你好！我想報名下一次「萬呎集結日」✈️", "你好！我想报名下一次“万尺集结日”✈️", "Hi! I'd like to sign up for the next Skywalker Gathering ✈️") },
    { icon: "🏷️", label: T("會員專享折扣", "会员专享折扣", "Member discounts"), message: T("你好！想查詢萬呎俱樂部會員專享折扣 🏷️", "你好！想咨询万尺俱乐部会员专享折扣 🏷️", "Hi! What discounts do Skywalkers Club members get? 🏷️") },
    { icon: "🧲", label: T("磁石貼進度查詢", "磁石贴进度查询", "Magnet progress"), message: T("你好！想查詢我嘅會籍等級及磁石貼進度 🧲", "你好！想查询我的会籍等级及磁石贴进度 🧲", "Hi! Could you check my tier and magnet progress? 🧲") },
  ];
  if (pathname.startsWith("/services/skydiving-tour") || pathname.startsWith("/tour")) return [
    { icon: "🗺️", label: T("旅遊團行程報價", "旅游团行程报价", "Tour quote"), message: T("你好！我想了解跳傘旅遊團行程，預計成行人數同想出發嘅月份是：", "你好！我想了解跳伞旅游团行程，预计成行人数和想出发的月份是：", "Hi! I'm interested in your skydiving tour packages. Our group size and target travel month is:") },
    { icon: "👥", label: T("成團人數及日期", "成团人数及日期", "Group size & dates"), message: T("你好！想查詢旅遊團成團人數及出發日期 👥", "你好！想咨询旅游团成团人数及出发日期 👥", "Hi! What are the minimum group size and departure dates? 👥") },
    { icon: "🏨", label: T("酒店及交通安排", "酒店及交通安排", "Hotel & transport"), message: T("你好！想了解旅遊團的酒店及交通安排 🏨", "你好！想了解旅游团的酒店及交通安排 🏨", "Hi! What hotel and transport is included in the tour? 🏨") },
    { icon: "✨", label: T("自訂私人團", "自订私人团", "Private tour"), message: T("你好！想自訂一個私人跳傘團，人數約為：", "你好！想自订一个私人跳伞团，人数约为：", "Hi! I'd like a private custom tour. Group size:") },
  ];
  return [
    { icon: "🪂", label: T("雙人跳傘預約", "双人跳伞预约", "Book a tandem"), message: T("你好！我想了解香港出發的跳傘體驗，想請教有哪幾個基地最推薦？💬", "你好！我想了解香港出发的跳伞体验，想请教有哪几个基地最推荐？💬", "Hi! I'd like to explore skydiving options from Hong Kong. Which dropzone would you recommend? 💬") },
    { icon: "📍", label: T("基地推介與比較", "基地推介与比较", "Compare dropzones"), message: T("你好！想比較一下各個跳傘基地，邊個最適合第一次跳？📍", "你好！想比较一下各个跳伞基地，哪个最适合第一次跳？📍", "Hi! Which dropzone is best for a first jump? 📍") },
    { icon: "👥", label: T("團體/公司包團", "团体/公司包团", "Group / corporate"), message: T("你好！想查詢團體／公司跳傘包團，人數約為：", "你好！想咨询团体／公司跳伞包团，人数约为：", "Hi! I'd like a group / corporate skydive quote. Group size:") },
    general,
  ];
}

export const pageBrowseMessage = (lang: Language, page: string) => tr(T(
  `你好！我正在瀏覽 Let's Skydive HK 網站【${page}】，想請教相關詳情：`,
  `你好！我正在浏览 Let's Skydive HK 网站【${page}】，想请教相关详情：`,
  `Hi! I'm browsing ${page} on Let's Skydive HK and have an enquiry:`), lang);

export const contactMessage = (lang: Language) => tr(general.message, lang);

export const bookingHelpMessage = (lang: Language, location: string, date: string) => tr(T(
  `你好！我在預約【${location}】${date}的跳傘名額，想了解確認名額的安排與付款手續 ✈️`,
  `你好！我在预约【${location}】${date}的跳伞名额，想了解确认名额的安排与付款手续 ✈️`,
  `Hi! I'm reserving spots for ${location} on ${date} and have a quick question about confirmation ✈️`), lang);

export function pageLabel(pathname: string, lang: Language): string {
  const zh = lang !== "en";
  const loc = pathname.match(/^\/location\/([^/]+)/);
  if (loc) return slugName(loc[1]);
  const map: [string, string, string][] = [
    ["/services/a-licence", "A-Licence 考牌", "A-Licence"], ["/services/tandem", "雙人跳傘", "Tandem Skydive"],
    ["/services/skydiving-tour", "跳傘旅遊團", "Skydiving Tours"], ["/membership", lang === "zh-CN" ? "万尺俱乐部" : "萬呎俱樂部", "Skywalkers Club"],
    ["/promotions", "優惠", "Promotions"], ["/souvenirs", "紀念品", "Souvenirs"], ["/blog", "跳傘知識", "Blog"],
  ];
  const hit = map.find(([p]) => pathname.startsWith(p));
  return hit ? (zh ? hit[1] : hit[2]) : (zh ? "首頁" : "Home");
}
