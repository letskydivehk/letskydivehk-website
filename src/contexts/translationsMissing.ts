/**
 * Consolidated fill for translation keys that were missing in one or more languages.
 * Applied non-destructively in LanguageContext (existing keys always win).
 * Keep all three languages in sync when adding new entries here.
 */
export const missingTranslations: Record<"en" | "zh-TW" | "zh-CN", Record<string, string>> = {
  en: {
    // Location compare
    "compare.col.best": "Best months",
    "compare.col.location": "Location",
    "compare.col.scenery": "Scenery",
    "compare.col.travel": "From Hong Kong",
    "compare.col.action": "",
    "compare.metaTitle": "Compare Skydiving Locations | Let's Skydive HK",
    "compare.subtitle":
      "Side by side: travel time from Hong Kong, best months, scenery and what makes each dropzone special.",
    "compare.title": "Compare Skydiving Locations",
    "compare.viewDetails": "View details",

    // Countdown
    "countdown.d": "d",
    "countdown.daysLeft": "{days} days left",
    "countdown.endsIn": "Offer ends in",
    "countdown.h": "h",
    "countdown.m": "m",
    "countdown.s": "s",

    // Eligibility
    "eligibility.title": "Quick eligibility check",
    "eligibility.age": "18 years or above",
    "eligibility.weight": "100kg or below",
    "eligibility.health": "In good general health",

    // Exit intent
    "exit.body":
      "Take the 30-second quiz and we'll match you with the right jump type and location — plus a $200 HKD credit for your first booking.",
    "exit.primary": "Take the quiz",
    "exit.secondary": "Maybe later",
    "exit.title": "Wait — not ready to book yet?",

    // FAQ
    "faq.badge": "FAQ",
    "faq.contactUs": "Contact us",
    "faq.moreQuestions": "Still have questions? We're always happy to help!",
    "faq.subtitle": "Curious about skydiving? Here are the questions we get asked the most.",
    "faq.title": "Frequently Asked Questions",

    // Hero
    "hero.cta.quiz": "30-sec quiz: find your jump",
    "hero.cta.watchVideo": "Watch video",
    "hero.scrollToExplore": "Scroll to explore",

    // Member
    "member.bookNowCta": "Book your jump now →",

    // Alumni pathway
    "pathway.badge": "After your first jump",
    "pathway.cta": "Explore the A-Licence path",
    "pathway.subtitle":
      "Many of our tandem guests come back for the A-Licence. It's how a once-in-a-lifetime tick turns into a lifelong sport.",
    "pathway.title": "From excited first-timer to licensed skydiver",

    // Quiz
    "quiz.back": "Back",
    "quiz.badge": "Find your jump",
    "quiz.bookThis": "Book this experience",
    "quiz.cta.badge": "Not sure which to pick?",
    "quiz.cta.button": "Start the quiz",
    "quiz.cta.subtitle": "Answer 7 questions and we'll match you with the right location and service.",
    "quiz.cta.title": "Find your perfect jump in 60 seconds",
    "quiz.lead.creditToast": "Account created! Check your email for your $200 credit and login link.",
    "quiz.lead.email": "Email",
    "quiz.lead.invalid": "Please check your details.",
    "quiz.lead.name": "Name",
    "quiz.lead.phone": "Mobile number",
    "quiz.lead.subtitle":
      "We'll create your account and email you a login link, plus a $200 HKD credit for your first booking.",
    "quiz.lead.title": "One step to go!",
    "quiz.next": "Next",
    "quiz.page.subtitle":
      "Answer 7 quick questions and we'll recommend the location and service that fit you best.",
    "quiz.page.title": "Find the jump that fits you",
    "quiz.progress": "Question",
    "quiz.reason.default": "A well-rounded match for your preferences.",
    "quiz.result.bestLocation": "Best location for you",
    "quiz.result.bookNow": "Book this combination",
    "quiz.result.empty.cta": "Start the quiz",
    "quiz.result.empty.desc": "Take the 60-second quiz to get your personalised recommendation.",
    "quiz.result.empty.title": "No quiz answers found",
    "quiz.result.nextSteps": "Next steps",
    "quiz.result.otherOptions": "Other dropzones you may like",
    "quiz.result.recommendedFor": "Recommended for you",
    "quiz.result.share": "Share result",
    "quiz.result.share.copied": "Link copied!",
    "quiz.result.share.title": "My skydiving quiz result",
    "quiz.result.step1.desc": "Browse available dates and pick a slot that suits your schedule.",
    "quiz.result.step1.title": "Pick your date",
    "quiz.result.step3.desc": "Arrive at the dropzone, finish your briefing, and get ready for the jump of your life.",
    "quiz.result.step3.title": "Jump day",
    "quiz.result.viewLocation": "Explore this dropzone",
    "quiz.result.whyMatch": "Why we recommend this",
    "quiz.result.whyMatchTitle": "Matched to your answers",
    "quiz.seeResult": "See my result",
    "quiz.subtitle": "Answer 3 quick questions and we'll recommend the skydive that suits you best.",
    "quiz.title": "Which skydive suits you?",
    "quiz.tryAgain": "Retake the quiz",

    // Referral
    "referral.banner.body":
      "Share your personal referral code at checkout. Credits stack with promotions and roll over to your next jump.",
    "referral.banner.cta": "See how it works",
    "referral.banner.title": "Invite a friend — you both get $100 HKD credit",

    // Safety
    "safety.badge": "Is it safe?",
    "safety.cta": "See what jump day actually looks like",
    "safety.subtitle":
      "Skydiving sounds extreme, but the way it works is anything but. Here's what stands between you and a perfect landing.",
    "safety.title": "Every jump is engineered to be safe",

    // Social proof ticker
    "social.booked": "{name} just booked a tandem skydive! 🪂",
    "social.recentCount": "{count} people booked in the last 24 hours 🔥",
    "social.slotsLeft": "Only {count} slots left this Saturday! ⏰",

    // Sticky bar
    "sticky.message": "Ready to fly? Limited slots this weekend!",
    "sticky.messageMobile": "Book now!",

    // Testimonials
    "testimonials.badge": "Jumper stories",
    "testimonials.subtitle": "Hear from the adventurers who took the leap with us.",
    "testimonials.title": "Happy Skydivers",

    // Jump day timeline
    "timeline.badge": "Your jump day",
    "timeline.subtitle": "No surprises. Here's exactly how your day unfolds.",
    "timeline.title": "From arrival to landing in 6 steps",

    // WhatsApp widget
    "whatsapp.greeting": "Hi there! 👋 How can we help? Pick a topic below or type your message.",
    "whatsapp.placeholder": "Type a message...",
    "whatsapp.quickOptions": "Popular questions:",
    "whatsapp.subtitle": "Usually replies within an hour",
    "whatsapp.title": "Let's Skydive HK",

    // Legal
    "disclaimer.section1.content":
      "Let's Skydive HK Limited (\"the Company\", \"we\", \"us\" or \"our\") operates this website and organises skydiving experiences, training courses and related travel services worldwide. By accessing, browsing or using this website, or by booking and participating in any service we organise, you confirm that you have read, understood and irrevocably accept all terms of this disclaimer. If you disagree with any part of it, you must stop using our services immediately.",
    "disclaimer.section3.content1":
      "The Company acts solely as a booking agent, coordinator and facilitator. The actual skydiving services (including aircraft operation, jump execution and instruction) are delivered by independent, licensed third-party partner dropzones, operators, pilots and instructors (the \"Service Partners\").",
    "privacy.introduction":
      "Let's Skydive HK Limited (\"the Company\", \"we\", \"us\") is committed to protecting the privacy of your personal data. This Privacy Policy Statement explains how we collect, use, store, transfer and process your personal data in accordance with the Personal Data (Privacy) Ordinance (Cap. 486) of Hong Kong. Please read it carefully to understand our practices regarding your personal data.",
    "privacy.section1.content":
      "We may collect personally identifiable information (\"Personal Data\") necessary to provide our services through channels such as our website, telephone, email, social media, mobile applications or in person at our office, including but not limited to:",
    "terms.preamble.content":
      "1.1 These Terms and Conditions (the \"Terms\") form a legal agreement between you (the \"Participant\" or \"Customer\") and Let's Skydive HK Limited (the \"Company\" or \"we\") in respect of the provision of skydiving activity services (the \"Services\"). These Terms are governed by and construed in accordance with the laws of the Hong Kong Special Administrative Region.<br><br>1.2 By confirming a booking, making payment or participating in the Services through any channel, you confirm that you have read, understood and unconditionally accept these Terms in full, and that they are legally binding on you. If you book on behalf of others, you are deemed to be fully authorised by those persons to agree to these Terms on their behalf.",
    "terms.article5.content":
      "5.1 The Company maintains third-party liability insurance as required by law. <strong>This insurance does not cover personal accidental injury to participants.</strong> The Company strongly recommends that participants arrange their own adequate personal accident insurance which expressly covers \"skydiving\" or \"high-risk sports\".<br><br>5.2 In compliance with the Personal Data (Privacy) Ordinance, personal data collected by the Company will be used solely for processing bookings, providing services, safety and internal administration. Please refer to our Privacy Policy Statement for details.",
    "terms.article6.content":
      "The Company or its designated personnel may take photographs or video (the \"Images\") during the activity for safety records, staff training, quality control and promotional purposes. Unless a participant objects expressly in writing before the activity, the participant is deemed to grant the Company a perpetual, royalty-free, irrevocable worldwide licence to use and edit such Images featuring the participant's likeness in any media.",

    // Admin panels
    "admin.addCredit": "Add credit",
    "admin.adjustCredit": "Adjust credit",
    "admin.amount": "Amount",
    "admin.creditHistory": "Credit history",
    "admin.currentBalance": "Current balance",
    "admin.dateOfBirth": "Date of birth",
    "admin.deductCredit": "Deduct credit",
    "admin.description": "Description",
    "admin.editProfile": "Edit profile",
    "admin.memberTier": "Member tier",
    "admin.noMembers": "No members found",
    "admin.profileUpdated": "Profile updated",
    "admin.saveChanges": "Save changes",
    "admin.searchMembers": "Search members",
    "admin.totalJumps": "Total jumps",

    // Auth / contact
    "auth.accessDenied": "Access denied",
    "auth.allowCookies": "Please allow cookies to sign in.",
    "contact.form.error": "Sorry, your message could not be sent. Please try again.",

    // Instructors
    "instructors.badge": "Our team",
    "instructors.cert": "Certified instructor",
    "instructors.langs": "Cantonese / English / Mandarin",
    "instructors.subtitle":
      "You'll be jumping with experienced, certified instructors who do this every single day.",
    "instructors.title": "Meet your instructors",

    // Pricing / credits
    "pricing.off": "OFF",
    "credits.label": "Credit",

    // Souvenirs
    "souvenirs.customPhotoLine": "Custom photo magnet",
    "souvenirs.photoSendInChat": "I'll send my photos in this chat",

    // Tour
    "tour.addOns": "Add-ons",
    "tour.addOnsHint": "Optional extras you can add when booking.",
    "tour.afternoon": "Afternoon",
    "tour.badge.oneDay": "One-day tour",
    "tour.badge.popular": "Most popular",
    "tour.chooseLocation": "Choose your destination",
    "tour.chooseLocationDesc": "Pick a base and we'll show you the full day-by-day itinerary.",
    "tour.day": "Day",
    "tour.deposit": "Deposit",
    "tour.duration": "Duration",
    "tour.evening": "Evening",
    "tour.included": "What's included",
    "tour.itinerary": "Itinerary",
    "tour.itineraryComingSoon": "Detailed itinerary coming soon.",
    "tour.morning": "Morning",
    "tour.noTours": "No tours available right now.",
    "tour.price": "Price",
    "tour.promoBanner.cta": "View tours",
    "tour.promoBanner.oneDay": "One-day tours now available — jump and return the same day!",
    "tour.quickHighlights": "Quick highlights",
    "tour.viewDetails": "View details",

    // Tour service page steps
    "servicePage.tour.step1.title": "Pick your tour",
    "servicePage.tour.step1.desc": "Choose a destination and date that works for you.",
    "servicePage.tour.step2.title": "Pay the deposit",
    "servicePage.tour.step2.desc": "Secure your slot with a $500 HKD deposit.",
    "servicePage.tour.step3.title": "Get your itinerary",
    "servicePage.tour.step3.desc": "We send you the full schedule, packing list and meeting point.",
    "servicePage.tour.step4.title": "Travel with us",
    "servicePage.tour.step4.desc": "Transport, accommodation and meals are arranged for you.",
    "servicePage.tour.step5.title": "Jump day",
    "servicePage.tour.step5.desc": "Briefing, gear-up, and your skydive with a certified instructor.",
    "servicePage.tour.step6.title": "Take the memories home",
    "servicePage.tour.step6.desc": "Photos, video and your certificate — plus your souvenir magnet.",

    // Location service cards — WhatsApp booking
    "locationDetail.whatsappBook": "Book via WhatsApp",
    "locationDetail.whatsappBookMsg":
      "Hi! I'd like to book \"{service}\" at {location}. Price: {price}. Which dates are available?",
    "locationDetail.viewItinerary": "View itinerary",
  },

  "zh-TW": {
    // Admin panels
    "admin.addCredit": "增加積分",
    "admin.adjustCredit": "調整積分",
    "admin.amount": "金額",
    "admin.creditHistory": "積分紀錄",
    "admin.currentBalance": "目前餘額",
    "admin.dateOfBirth": "出生日期",
    "admin.deductCredit": "扣減積分",
    "admin.description": "說明",
    "admin.editProfile": "編輯會員資料",
    "admin.memberTier": "會員等級",
    "admin.noMembers": "找不到會員",
    "admin.profileUpdated": "會員資料已更新",
    "admin.saveChanges": "儲存變更",
    "admin.searchMembers": "搜尋會員",
    "admin.totalJumps": "總跳躍次數",

    // Auth / contact
    "auth.accessDenied": "拒絕存取",
    "auth.allowCookies": "請允許 Cookie 以便登入。",
    "contact.form.error": "抱歉，訊息未能發送，請再試一次。",

    // Instructors
    "instructors.badge": "我們的團隊",
    "instructors.cert": "持證教練",
    "instructors.langs": "廣東話 / 英文 / 普通話",
    "instructors.subtitle": "帶你跳的都是每日實戰、經驗豐富的持證教練。",
    "instructors.title": "認識你的教練團隊",

    // Pricing / credits
    "pricing.off": "折扣",
    "credits.label": "積分",

    // Souvenirs
    "souvenirs.customPhotoLine": "訂製照片磁石貼",
    "souvenirs.photoSendInChat": "我會在此對話傳送照片",

    // Tour
    "tour.addOns": "加購服務",
    "tour.addOnsHint": "預訂時可選擇加購的項目。",
    "tour.afternoon": "下午",
    "tour.badge.oneDay": "一日遊",
    "tour.badge.popular": "最受歡迎",
    "tour.chooseLocation": "選擇你的目的地",
    "tour.chooseLocationDesc": "選一個基地，即可查看完整每日行程。",
    "tour.day": "第",
    "tour.deposit": "訂金",
    "tour.duration": "行程長度",
    "tour.evening": "晚上",
    "tour.included": "費用包含",
    "tour.itinerary": "行程安排",
    "tour.itineraryComingSoon": "詳細行程即將公佈。",
    "tour.morning": "上午",
    "tour.noTours": "暫時沒有可預訂的行程。",
    "tour.price": "價格",
    "tour.promoBanner.cta": "查看行程",
    "tour.promoBanner.oneDay": "一日遊已開放預訂 — 當日往返，即跳即回！",
    "tour.quickHighlights": "行程亮點",
    "tour.viewDetails": "查看詳情",

    // Tour service page steps
    "servicePage.tour.step1.title": "選擇行程",
    "servicePage.tour.step1.desc": "揀選適合你的目的地及日期。",
    "servicePage.tour.step2.title": "支付訂金",
    "servicePage.tour.step2.desc": "以 $500 HKD 訂金鎖定名額。",
    "servicePage.tour.step3.title": "收取行程表",
    "servicePage.tour.step3.desc": "我們會寄出完整行程、行李清單及集合地點。",
    "servicePage.tour.step4.title": "跟我們出發",
    "servicePage.tour.step4.desc": "交通、住宿及膳食全部為你安排好。",
    "servicePage.tour.step5.title": "跳傘當日",
    "servicePage.tour.step5.desc": "簡介、穿戴裝備，然後與持證教練一同起跳。",
    "servicePage.tour.step6.title": "帶走回憶",
    "servicePage.tour.step6.desc": "照片、影片及證書，再加上你的紀念磁石貼。",
  },

  "zh-CN": {
    // Admin panels
    "admin.addCredit": "增加积分",
    "admin.adjustCredit": "调整积分",
    "admin.amount": "金额",
    "admin.creditHistory": "积分记录",
    "admin.currentBalance": "当前余额",
    "admin.dateOfBirth": "出生日期",
    "admin.deductCredit": "扣减积分",
    "admin.description": "说明",
    "admin.editProfile": "编辑会员资料",
    "admin.memberTier": "会员等级",
    "admin.noMembers": "找不到会员",
    "admin.profileUpdated": "会员资料已更新",
    "admin.saveChanges": "保存更改",
    "admin.searchMembers": "搜索会员",
    "admin.totalJumps": "总跳跃次数",

    // Auth / contact
    "auth.accessDenied": "拒绝访问",
    "auth.allowCookies": "请允许 Cookie 以便登录。",
    "contact.form.error": "抱歉，消息未能发送，请再试一次。",

    // Instructors
    "instructors.badge": "我们的团队",
    "instructors.cert": "持证教练",
    "instructors.langs": "粤语 / 英文 / 普通话",
    "instructors.subtitle": "带你跳的都是每日实战、经验丰富的持证教练。",
    "instructors.title": "认识你的教练团队",

    // Pricing / credits
    "pricing.off": "折扣",
    "credits.label": "积分",

    // Souvenirs
    "souvenirs.customPhotoLine": "定制照片磁石贴",
    "souvenirs.photoSendInChat": "我会在此对话发送照片",

    // Tour
    "tour.addOns": "加购服务",
    "tour.addOnsHint": "预订时可选择加购的项目。",
    "tour.afternoon": "下午",
    "tour.badge.oneDay": "一日游",
    "tour.badge.popular": "最受欢迎",
    "tour.chooseLocation": "选择你的目的地",
    "tour.chooseLocationDesc": "选一个基地，即可查看完整每日行程。",
    "tour.day": "第",
    "tour.deposit": "订金",
    "tour.duration": "行程长度",
    "tour.evening": "晚上",
    "tour.included": "费用包含",
    "tour.itinerary": "行程安排",
    "tour.itineraryComingSoon": "详细行程即将公布。",
    "tour.morning": "上午",
    "tour.noTours": "暂时没有可预订的行程。",
    "tour.price": "价格",
    "tour.promoBanner.cta": "查看行程",
    "tour.promoBanner.oneDay": "一日游已开放预订 — 当日往返，即跳即回！",
    "tour.quickHighlights": "行程亮点",
    "tour.viewDetails": "查看详情",

    // Tour service page steps
    "servicePage.tour.step1.title": "选择行程",
    "servicePage.tour.step1.desc": "挑选适合你的目的地及日期。",
    "servicePage.tour.step2.title": "支付订金",
    "servicePage.tour.step2.desc": "以 $500 HKD 订金锁定名额。",
    "servicePage.tour.step3.title": "收取行程表",
    "servicePage.tour.step3.desc": "我们会发出完整行程、行李清单及集合地点。",
    "servicePage.tour.step4.title": "跟我们出发",
    "servicePage.tour.step4.desc": "交通、住宿及餐饮全部为你安排好。",
    "servicePage.tour.step5.title": "跳伞当日",
    "servicePage.tour.step5.desc": "简介、穿戴装备，然后与持证教练一同起跳。",
    "servicePage.tour.step6.title": "带走回忆",
    "servicePage.tour.step6.desc": "照片、视频及证书，再加上你的纪念磁石贴。",
  },
};
