import { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'zh-TW';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations
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
    'hero.subtitle': 'Experience the ultimate thrill of freefall across Asia\'s most stunning dropzones. Professional tandem jumps, AFF courses, and group adventures.',
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
    
    // About Section
    'about.badge': 'About Us',
    'about.title': "Why Choose Let's Skydive HK?",
    'about.subtitle': 'We are passionate about sharing the thrill of skydiving with adventurers across Asia.',
    'about.experience.title': 'Years of Experience',
    'about.experience.desc': 'Trusted expertise in skydiving operations',
    'about.safety.title': 'Safety First',
    'about.safety.desc': 'World-class safety standards and equipment',
    'about.locations.title': 'Multiple Locations',
    'about.locations.desc': 'Premium dropzones across Thailand and China',
    'about.instructors.title': 'Expert Instructors',
    'about.instructors.desc': 'Certified professionals with thousands of jumps',
    
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
    'hero.subtitle': '在亞洲最壯麗的跳傘場地體驗極限自由落體的刺激。專業雙人跳傘、AFF課程及團體探險活動。',
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
    
    // About Section
    'about.badge': '關於我們',
    'about.title': '為什麼選擇 Let\'s Skydive HK？',
    'about.subtitle': '我們熱衷於與亞洲各地的冒險家分享跳傘的刺激體驗。',
    'about.experience.title': '多年經驗',
    'about.experience.desc': '值得信賴的跳傘運營專業知識',
    'about.safety.title': '安全第一',
    'about.safety.desc': '世界級的安全標準和設備',
    'about.locations.title': '多個地點',
    'about.locations.desc': '遍布泰國和中國的頂級跳傘場',
    'about.instructors.title': '專業教練',
    'about.instructors.desc': '擁有數千次跳傘經驗的認證專業人士',
    
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
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
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
