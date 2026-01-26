import { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'zh-TW';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  translateData: (key: string, fallback: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations for static UI content
const translations: Record<Language, Record<string, string>> = {
  'en': {
    // Navigation & Common
    'nav.services': 'Services',
    'nav.locations': 'Locations',
    'nav.about': 'About Us',
    'nav.booking': 'Book Now',
    'nav.contact': 'Contact',
    'common.learnMore': 'Learn More',
    'common.bookNow': 'Book Now',
    'common.comingSoon': 'Coming Soon',
    'common.loading': 'Loading...',
    
    // Hero Section
    'hero.badge': 'Hong Kong\'s Premier Skydiving Experience',
    'hero.title': "LET'S SKYDIVE",
    'hero.experienceThe': 'EXPERIENCE THE',
    'hero.ultimateThrill': 'ULTIMATE THRILL',
    'hero.subtitle': 'Professional tandem skydiving, AFF courses, and group events across Asia\'s most stunning dropzones.',
    'hero.cta.book': 'Book Your Jump',
    'hero.cta.explore': 'Explore Locations',
    
    // Locations Section
    'locations.badge': 'Our Dropzones',
    'locations.title': 'Jump Locations',
    'locations.subtitle': 'Choose from our premium dropzones across Thailand and China, each offering unique scenery and world-class facilities.',
    'locations.thailand': '🇹🇭 Thailand',
    'locations.china': '🇨🇳 China',
    'locations.noLocations': 'No locations available in {country} yet.',
    'locations.bookHere': 'Book at this location',
    'locations.tandem': 'Tandem',
    'locations.aff': 'AFF',
    'locations.groups': 'Groups',
    'locations.map.title': 'Explore Our Dropzones',
    'locations.map.subtitle': 'Select a location to view on the map',
    'locations.map.openGoogleMaps': 'Open in Google Maps',
    
    // Services Section
    'services.badge': 'What We Offer',
    'services.title': 'Our Services',
    'services.subtitle': 'From first-time jumpers to aspiring licensed skydivers, we have the perfect experience for you.',
    'services.tandem.title': 'Tandem Skydive',
    'services.tandem.subtitle': 'First-time jumpers welcome',
    'services.tandem.description': 'Experience the ultimate thrill of freefall attached to an experienced instructor. No prior experience needed - just bring your sense of adventure!',
    'services.alicence.title': 'A-Licence',
    'services.alicence.subtitle': 'Learn to skydive solo',
    'services.alicence.description': 'The Accelerated Freefall (AFF) program is your pathway to becoming a licensed skydiver. Master the skills to jump independently.',
    'services.group.title': 'Group Events',
    'services.group.subtitle': 'Team building & celebrations',
    'services.group.description': 'Perfect for corporate team building, bachelor/bachelorette parties, birthdays, or any special occasion. Create unforgettable memories together!',
    'services.popular': 'Most Popular',
    'services.contactUs': 'Contact Us',
    'services.priceVaries': 'Prices vary by location',
    'services.whatsIncluded': "What's included:",
    'services.safetyNote': 'Safety First:',
    'services.safetyDesc': 'All jumps are conducted with certified instructors and modern equipment',
    'services.priceFrom': 'From ${price}',
    'services.customQuote': 'Custom Quote',
    
    // Booking Section
    'booking.badge': 'Ready to Jump?',
    'booking.title': 'Book Your Adventure',
    'booking.subtitle': 'Select your preferred location and service to begin your skydiving journey.',
    'booking.step1': 'Choose Location',
    'booking.step2': 'Select Service',
    'booking.step3': 'Your Details',
    'booking.step4': 'Confirm',
    'booking.selectLocation': 'Select a location',
    'booking.selectService': 'Select a service',
    'booking.form.name': 'Full Name',
    'booking.form.email': 'Email Address',
    'booking.form.phone': 'Phone Number',
    'booking.form.date': 'Preferred Date',
    'booking.form.notes': 'Additional Notes',
    'booking.form.submit': 'Submit Booking Request',
    'booking.filter.showing': 'Showing locations with A-Licence training available',
    'booking.whereJump': 'Where do you want to jump?',
    'booking.selectDropzone': 'Select your preferred dropzone location',
    'booking.showAll': 'Show all',
    'booking.chooseService': 'Choose your experience',
    'booking.selectPackage': 'Select your preferred package',
    'booking.changeLocation': 'Change location',
    'booking.yourDetails': 'Your details',
    'booking.fillInfo': 'Fill in your information to complete the booking',
    'booking.firstName': 'First Name',
    'booking.lastName': 'Last Name',
    'booking.email': 'Email',
    'booking.phone': 'Phone',
    'booking.date': 'Preferred Date',
    'booking.participants': 'Number of Participants',
    'booking.notes': 'Additional Notes (Optional)',
    'booking.notesPlaceholder': 'Any special requests or requirements...',
    'booking.reviewBooking': 'Review your booking',
    'booking.confirmDetails': 'Please confirm your booking details',
    'booking.location': 'Location',
    'booking.service': 'Service',
    'booking.price': 'Price',
    'booking.contact': 'Contact',
    'booking.back': 'Back',
    'booking.next': 'Next',
    'booking.confirmBooking': 'Confirm Booking',
    'booking.submitting': 'Submitting...',
    'booking.success': 'Booking Request Submitted!',
    'booking.successMessage': "We've received your booking request. We'll contact you within 24 hours to confirm your booking.",
    'booking.summary': 'Booking Summary',
    'booking.bookAnother': 'Book Another Jump',
    
    // About Section
    'about.badge': 'About Us',
    'about.title': "Why Choose Let's Skydive HK?",
    'about.subtitle': 'We are passionate about sharing the thrill of skydiving with adventurers across Asia.',
    'about.stats.safeJumps': 'Safe Jumps',
    'about.stats.yearsExperience': 'Years Experience',
    'about.stats.locations': 'Locations',
    'about.stats.safetyRecord': 'Safety Record',
    'about.values.safetyFirst.title': 'Safety First',
    'about.values.safetyFirst.desc': 'Every jump is conducted with the highest safety standards. Our equipment is inspected daily and our instructors are fully certified.',
    'about.values.expertInstructors.title': 'Expert Instructors',
    'about.values.expertInstructors.desc': 'Our tandem masters have thousands of jumps under their belts. You\'re in experienced hands from training to landing.',
    'about.values.personalizedExperience.title': 'Personalized Experience',
    'about.values.personalizedExperience.desc': 'Whether it\'s your first jump or your hundredth, we tailor the experience to make it unforgettable for you.',
    'about.values.passionDriven.title': 'Passion Driven',
    'about.values.passionDriven.desc': 'We love what we do. That passion translates into an incredible experience for every guest who jumps with us.',
    'about.story.title': 'Our Story',
    'about.story.paragraph1': 'Let\'s Skydive HK was founded by a group of passionate skydivers who wanted to share the incredible feeling of freefall with adventure seekers across Asia. What started as a single dropzone has grown into a network of world-class facilities across Thailand and China.',
    'about.story.paragraph2': 'Today, we\'re proud to be one of the most trusted names in Asian skydiving. Our team includes internationally certified instructors, riggers, and pilots who share one common goal: to give you the experience of a lifetime while maintaining the highest safety standards in the industry.',
    
    // Contact Section
    'contact.badge': 'Get in Touch',
    'contact.title': 'Contact Us',
    'contact.subtitle': 'Have questions? We\'re here to help you plan your skydiving adventure.',
    'contact.email.label': 'Email Us',
    'contact.instagram.label': 'Message our Instagram',
    'contact.location.label': 'Headquarters',
    'contact.whatsapp.label': 'WhatsApp',
    
    // Footer
    'footer.description': 'Experience the thrill of skydiving with Asia\'s premier dropzone network. Professional tandem jumps, AFF courses, and group events across Thailand and China.',
    'footer.quickLinks': 'Quick Links',
    'footer.services': 'Services',
    'footer.locations': 'Our Locations',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.safety': 'Safety Guidelines',
    'footer.copyright': '© 2025 Let\'s Skydive HK. All rights reserved.',
    
    // Auth
    'auth.signIn': 'Sign In',
    'auth.signUp': 'Sign Up',
    'auth.signOut': 'Sign Out',
    'auth.profile': 'Profile',
    'auth.welcomeBack': 'Welcome Back',
    'auth.createAccount': 'Create Account',
    'auth.signInWithGoogle': 'Sign in with Google',
    'auth.or': 'or',
    'auth.emailAddress': 'Email Address',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.processing': 'Processing...',
    'auth.noAccount': "Don't have an account?",
    'auth.haveAccount': 'Already have an account?',
    'auth.member': 'Member',

    // Profile
    'profile.title': 'Profile',
    'profile.basicInfo': 'Basic Information',
    'profile.fullName': 'Full Name',
    'profile.phone': 'Phone',
    'profile.emergencyContact': 'Emergency Contact',
    'profile.optional': 'Optional',
    'profile.name': 'Name',
    'profile.relationship': 'Relationship',
    'profile.relationshipPlaceholder': 'e.g., Spouse, Parent, Friend',
    'profile.save': 'Save',
    'profile.saving': 'Saving...',
  },
  'zh-TW': {
    // Navigation & Common
    'nav.services': '服務項目',
    'nav.locations': '跳傘地點',
    'nav.about': '關於我們',
    'nav.booking': '立即預約',
    'nav.contact': '聯絡我們',
    'common.learnMore': '了解更多',
    'common.bookNow': '立即預約',
    'common.comingSoon': '即將推出',
    'common.loading': '載入中...',
    
    // Hero Section
    'hero.badge': '香港首選跳傘體驗',
    'hero.title': "一起跳傘吧",
    'hero.experienceThe': '體驗',
    'hero.ultimateThrill': '極致飛翔',
    'hero.subtitle': '我們提供專業雙人跳傘體驗、AFF（ Accelerated Freefall）加速自由落體認證課程，並可為企業團體、親友聚會等量身規劃跳傘活動專案。\n\n服務範圍遍及亞洲各地景觀絕佳的跳傘基地，讓您在專業安全保障下，俯瞰壯麗山河，成就非凡時刻。',
    'hero.cta.book': '預約您的跳傘',
    'hero.cta.explore': '探索跳傘地點',
    
    // Locations Section
    'locations.badge': '我們的跳傘場',
    'locations.title': '跳傘地點',
    'locations.subtitle': '從我們位於泰國和中國的頂級跳傘場中選擇，每個場地都提供獨特的風景和世界級設施。',
    'locations.thailand': '🇹🇭 泰國',
    'locations.china': '🇨🇳 中國',
    'locations.noLocations': '{country}暫時沒有可用的跳傘地點。',
    'locations.bookHere': '在此地點預約',
    'locations.tandem': '雙人跳傘',
    'locations.aff': 'AFF課程',
    'locations.groups': '團體活動',
    'locations.map.title': '探索我們的跳傘基地',
    'locations.map.subtitle': '選擇一個地點在地圖上查看',
    'locations.map.openGoogleMaps': '在 Google 地圖中開啟',
    
    // Services Section
    'services.badge': '我們提供的服務',
    'services.title': '服務項目',
    'services.subtitle': '從首次跳傘者到有志成為持牌跳傘員的學員，我們都有適合您的完美體驗。',
    'services.tandem.title': '雙人跳傘',
    'services.tandem.subtitle': '歡迎首次跳傘者',
    'services.tandem.description': '與經驗豐富的教練一同體驗極限自由落體的刺激。無需任何經驗——只需帶上您的冒險精神！',
    'services.alicence.title': 'A級執照',
    'services.alicence.subtitle': '學習獨立跳傘',
    'services.alicence.description': '加速自由落體（AFF）課程是您成為持牌跳傘員的途徑。掌握獨立跳傘所需的技能。',
    'services.group.title': '團體活動',
    'services.group.subtitle': '團隊建設與慶祝活動',
    'services.group.description': '非常適合企業團隊建設、單身派對、生日或任何特殊場合。一起創造難忘的回憶！',
    'services.popular': '最受歡迎',
    'services.contactUs': '聯絡我們',
    'services.priceVaries': '價格因地點而異',
    'services.whatsIncluded': '包含內容：',
    'services.safetyNote': '安全第一：',
    'services.safetyDesc': '所有跳傘均由認證教練使用現代化設備進行',
    'services.priceFrom': '${price}起',
    'services.customQuote': '專屬跳傘報價',
    
    // Booking Section
    'booking.badge': '準備好了嗎？',
    'booking.title': '預約您的冒險',
    'booking.subtitle': '選擇您偏好的地點和服務，開始您的跳傘之旅。',
    'booking.step1': '選擇地點',
    'booking.step2': '選擇服務',
    'booking.step3': '您的資料',
    'booking.step4': '確認',
    'booking.selectLocation': '選擇地點',
    'booking.selectService': '選擇服務',
    'booking.form.name': '全名',
    'booking.form.email': '電子郵件',
    'booking.form.phone': '電話號碼',
    'booking.form.date': '偏好日期',
    'booking.form.notes': '備註',
    'booking.form.submit': '提交預約申請',
    'booking.filter.showing': '顯示提供A級執照培訓的地點',
    'booking.whereJump': '您想在哪裡跳傘？',
    'booking.selectDropzone': '選擇您偏好的跳傘場地',
    'booking.showAll': '顯示全部',
    'booking.chooseService': '選擇您的體驗',
    'booking.selectPackage': '選擇您偏好的套餐',
    'booking.changeLocation': '更換地點',
    'booking.yourDetails': '您的資料',
    'booking.fillInfo': '填寫您的資料以完成預約',
    'booking.firstName': '名字',
    'booking.lastName': '姓氏',
    'booking.email': '電子郵件',
    'booking.phone': '電話',
    'booking.date': '偏好日期',
    'booking.participants': '參加人數',
    'booking.notes': '備註（選填）',
    'booking.notesPlaceholder': '任何特殊要求或需求...',
    'booking.reviewBooking': '確認您的預約',
    'booking.confirmDetails': '請確認您的預約詳情',
    'booking.location': '地點',
    'booking.service': '服務',
    'booking.price': '價格',
    'booking.contact': '聯絡方式',
    'booking.back': '返回',
    'booking.next': '下一步',
    'booking.confirmBooking': '確認預約',
    'booking.submitting': '提交中...',
    'booking.success': '預約申請已提交！',
    'booking.successMessage': '我們已收到您的預約申請。我們會在24小時內聯繫您確認預約。',
    'booking.summary': '預約摘要',
    'booking.bookAnother': '再次預約',
    
    // About Section
    'about.badge': '關於我們',
    'about.title': '為什麼選擇 Let\'s Skydive HK？',
    'about.subtitle': '我們熱衷於與亞洲各地的冒險家分享跳傘的刺激體驗。',
    'about.stats.safeJumps': '安全跳傘次數',
    'about.stats.yearsExperience': '年經驗',
    'about.stats.locations': '個跳傘地點',
    'about.stats.safetyRecord': '安全紀錄',
    'about.values.safetyFirst.title': '安全第一',
    'about.values.safetyFirst.desc': '每次跳傘均遵循最高安全標準。我們的設備每日檢查，教練均持有完整認證。',
    'about.values.expertInstructors.title': '專業教練',
    'about.values.expertInstructors.desc': '我們的雙人跳傘教練擁有數千次跳傘經驗。從培訓到降落，您都在經驗豐富的專業人員手中。',
    'about.values.personalizedExperience.title': '個人化體驗',
    'about.values.personalizedExperience.desc': '無論是您的第一次跳傘還是第一百次，我們都會為您量身打造難忘的體驗。',
    'about.values.passionDriven.title': '熱情驅動',
    'about.values.passionDriven.desc': '我們熱愛我們的工作。這份熱情轉化為每位與我們一起跳傘的客人的絕佳體驗。',
    'about.story.title': '我們的故事',
    'about.story.paragraph1': 'Let\'s Skydive HK 由一群熱愛跳傘的人士創立，他們希望與亞洲各地的冒險家分享自由落體的美妙感覺。從一個跳傘場開始，如今已發展成為遍布泰國和中國的世界級設施網絡。',
    'about.story.paragraph2': '如今，我們自豪地成為亞洲跳傘界最受信賴的品牌之一。我們的團隊包括國際認證的教練、裝備維護師和飛行員，他們都有一個共同的目標：為您提供畢生難忘的體驗，同時保持業界最高的安全標準。',
    
    // Contact Section
    'contact.badge': '聯繫我們',
    'contact.title': '聯絡我們',
    'contact.subtitle': '有問題嗎？我們隨時為您規劃跳傘冒險提供幫助。',
    'contact.email.label': '電子郵件',
    'contact.instagram.label': '私訊我們的Instagram',
    'contact.location.label': '總部',
    'contact.whatsapp.label': 'WhatsApp',
    
    // Footer
    'footer.description': '與亞洲首屈一指的跳傘網絡一同體驗跳傘的刺激。專業雙人跳傘、AFF課程及團體活動遍布泰國和中國。',
    'footer.quickLinks': '快速連結',
    'footer.services': '服務項目',
    'footer.locations': '我們的地點',
    'footer.privacy': '隱私政策',
    'footer.terms': '服務條款',
    'footer.safety': '安全指南',
    'footer.copyright': '© 2025 Let\'s Skydive HK. 版權所有。',
    
    // Auth
    'auth.signIn': '登入',
    'auth.signUp': '註冊',
    'auth.signOut': '登出',
    'auth.profile': '個人資料',
    'auth.welcomeBack': '歡迎回來',
    'auth.createAccount': '建立帳戶',
    'auth.signInWithGoogle': '使用 Google 登入',
    'auth.or': '或',
    'auth.emailAddress': '電子郵件地址',
    'auth.password': '密碼',
    'auth.confirmPassword': '確認密碼',
    'auth.processing': '處理中...',
    'auth.noAccount': '還沒有帳戶？',
    'auth.haveAccount': '已經有帳戶？',
    'auth.member': '會員',

    // Profile
    'profile.title': '個人資料',
    'profile.basicInfo': '基本資料',
    'profile.fullName': '全名',
    'profile.phone': '電話',
    'profile.emergencyContact': '緊急聯絡人',
    'profile.optional': '選填',
    'profile.name': '姓名',
    'profile.relationship': '關係',
    'profile.relationshipPlaceholder': '例如：配偶、父母、朋友',
    'profile.save': '儲存',
    'profile.saving': '儲存中...',
  }
};

// Translations for dynamic Supabase data (locations, services, etc.)
const dataTranslations: Record<Language, Record<string, string>> = {
  'en': {
    // Location names (keep English as-is)
    'location.chiang-mai': 'Chiang Mai (Wefly)',
    'location.pattaya': 'Pattaya',
    'location.hainan': 'Hainan (Weland)',
    'location.huizhou': 'Huizhou (Yingfei)',
    'location.luoding': 'Luoding (Yingfei)',
    'location.zhuhai': 'Zhuhai (Weland)',
    
    // Location descriptions
    'location.chiang-mai.desc': 'Jump over the stunning mountains and temples of Northern Thailand.',
    'location.pattaya.desc': 'Experience breathtaking views of the Gulf of Thailand in Pattaya.',
    'location.hainan.desc': 'Tropical paradise skydiving with crystal clear ocean views.',
    'location.huizhou.desc': 'Scenic coastal views and perfect weather conditions year-round.',
    'location.luoding.desc': 'A new adventure destination in Guangdong province.',
    'location.zhuhai.desc': 'Coming soon - Stunning coastal views near Macau.',
    
    // Countries
    'country.Thailand': 'Thailand',
    'country.China': 'China',
    
    // Cities
    'city.Chiang Mai': 'Chiang Mai',
    'city.Pattaya': 'Pattaya',
    'city.Hainan': 'Hainan',
    'city.Huizhou': 'Huizhou',
    'city.Luoding': 'Luoding',
    'city.Zhuhai': 'Zhuhai',
    
    // Service names
    'service.Tandem Skydive with Handicam': 'Tandem Skydive with Handicam',
    'service.Tandem Skydive with Video': 'Tandem Skydive with Video',
    'service.Tandem Skydive with Ultimate Combo': 'Tandem Skydive with Ultimate Combo',
    'service.A-License Package': 'A-License Package',
    'service.Group Events': 'Group Events',
    
    // Service types
    'serviceType.tandem': 'Tandem Skydive',
    'serviceType.aff': 'A-Licence',
    'serviceType.group': 'Group Events',
  },
  'zh-TW': {
    // Location names
    'location.chiang-mai': '清邁 (Wefly)',
    'location.pattaya': '芭達雅',
    'location.hainan': '海南 (蔚藍)',
    'location.huizhou': '惠州 (鷹飛)',
    'location.luoding': '羅定 (鷹飛)',
    'location.zhuhai': '珠海 (蔚藍)',
    
    // Location descriptions
    'location.chiang-mai.desc': '在泰國北部壯麗的山脈和寺廟上空跳傘。',
    'location.pattaya.desc': '在芭達雅體驗泰國灣的壯麗景色。',
    'location.hainan.desc': '在熱帶天堂跳傘，享受清澈的海景。',
    'location.huizhou.desc': '全年優美的海岸景色和完美的天氣條件。',
    'location.luoding.desc': '廣東省的新探險目的地。',
    'location.zhuhai.desc': '即將推出 - 澳門附近的壯麗海岸景色。',
    
    // Countries
    'country.Thailand': '泰國',
    'country.China': '中國',
    
    // Cities
    'city.Chiang Mai': '清邁',
    'city.Pattaya': '芭達雅',
    'city.Hainan': '海南',
    'city.Huizhou': '惠州',
    'city.Luoding': '羅定',
    'city.Zhuhai': '珠海',
    
    // Service names
    'service.Tandem Skydive with Handicam': '雙人跳傘含手持攝影',
    'service.Tandem Skydive with Video': '雙人跳傘含影片',
    'service.Tandem Skydive with Ultimate Combo': '雙人跳傘終極組合',
    'service.A-License Package': 'A級執照套餐',
    'service.Group Events': '團體活動',
    
    // Service types
    'serviceType.tandem': '雙人跳傘',
    'serviceType.aff': 'A級執照',
    'serviceType.group': '團體活動',
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  // Translate dynamic data from Supabase
  const translateData = (key: string, fallback: string): string => {
    return dataTranslations[language][key] || fallback;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translateData }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
