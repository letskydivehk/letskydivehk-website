import { createContext, useContext, useState, ReactNode } from "react";

export type Language = "en" | "zh-TW";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  translateData: (key: string, fallback: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations for static UI content
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation & Common
    "nav.services": "Services",
    "nav.locations": "Locations",
    "nav.about": "About Us",
    "nav.booking": "Book Now",
    "nav.contact": "Contact",
    "common.learnMore": "Learn More",
    "common.bookNow": "Book Now",
    "common.comingSoon": "Coming Soon",
    "common.loading": "Loading...",

    // Hero Section
    "hero.badge": "Hong Kong's Premier Skydiving Experience",
    "hero.title": "LET'S SKYDIVE",
    "hero.experienceThe": "EXPERIENCE THE",
    "hero.ultimateThrill": "ULTIMATE THRILL",
    "hero.subtitle":
      "Professional tandem skydiving, AFF courses, and group events across Asia's most stunning dropzones.",
    "hero.cta.book": "Book Your Jump",
    "hero.cta.explore": "Explore Services",

    // Locations Section
    "locations.badge": "Our Dropzones",
    "locations.title": "Jump Locations",
    "locations.subtitle":
      "Choose from our premium dropzones across Thailand and China, each offering unique scenery and world-class facilities.",
    "locations.thailand": "🇹🇭 Thailand",
    "locations.china": "🇨🇳 China",
    "locations.noLocations": "No locations available in {country} yet.",
    "locations.bookHere": "Book at this location",
    "locations.tandem": "Tandem",
    "locations.aff": "AFF",
    "locations.groups": "Groups",
    "locations.map.title": "Explore Our Dropzones",
    "locations.map.subtitle": "Select a location to view on the map",
    "locations.map.openGoogleMaps": "Open in Google Maps",

    // Services Section
    "services.badge": "What We Offer",
    "services.title": "Our Services",
    "services.subtitle":
      "From first-time jumpers to aspiring licensed skydivers, we have the perfect experience for you.",
    "services.tandem.title": "Tandem Skydive",
    "services.tandem.subtitle": "First-time jumpers welcome",
    "services.tandem.description":
      "Experience the ultimate thrill of freefall attached to an experienced instructor. No prior experience needed - just bring your sense of adventure!",
    "services.alicence.title": "A-Licence",
    "services.alicence.subtitle": "Learn to skydive solo",
    "services.alicence.description":
      "The Accelerated Freefall (AFF) program is your pathway to becoming a licensed skydiver. Master the skills to jump independently.",
    "services.group.title": "Group Events",
    "services.group.subtitle": "Team building & celebrations",
    "services.group.description":
      "Perfect for corporate team building, bachelor/bachelorette parties, birthdays, or any special occasion. Create unforgettable memories together!",
    "services.popular": "Most Popular",
    "services.contactUs": "Contact Us",
    "services.priceVaries": "Prices vary by location",
    "services.whatsIncluded": "What's included:",
    "services.safetyNote": "Safety First:",
    "services.safetyDesc": "All jumps are conducted with certified instructors and modern equipment",
    "services.priceFrom": "From ${price}",
    "services.customQuote": "Custom Quote",

    // Booking Section
    "booking.badge": "Ready to Jump?",
    "booking.title": "Book Your Adventure",
    "booking.subtitle": "Select your preferred location and service to begin your skydiving journey.",
    "booking.step1": "Choose Location",
    "booking.step2": "Select Service",
    "booking.step3": "Your Details",
    "booking.step4": "Confirm",
    "booking.selectLocation": "Select a location",
    "booking.selectService": "Select a service",
    "booking.form.name": "Full Name",
    "booking.form.email": "Email Address",
    "booking.form.phone": "Phone Number",
    "booking.form.date": "Preferred Date",
    "booking.form.notes": "Additional Notes",
    "booking.form.submit": "Submit Booking Request",
    "booking.filter.showing": "Showing locations with A-Licence training available",
    "booking.whereJump": "Where do you want to jump?",
    "booking.selectDropzone": "Select your preferred dropzone location",
    "booking.showAll": "Show all",
    "booking.chooseService": "Choose your experience",
    "booking.selectPackage": "Select your preferred package",
    "booking.changeLocation": "Change location",
    "booking.yourDetails": "Your details",
    "booking.fillInfo": "Fill in your information to complete the booking",
    "booking.firstName": "First Name",
    "booking.lastName": "Last Name",
    "booking.email": "Email",
    "booking.phone": "Phone",
    "booking.date": "Preferred Date",
    "booking.participants": "Number of Participants",
    "booking.notes": "Additional Notes (Optional)",
    "booking.notesPlaceholder": "Any special requests or requirements...",
    "booking.reviewBooking": "Review your booking",
    "booking.confirmDetails": "Please confirm your booking details",
    "booking.location": "Location",
    "booking.service": "Service",
    "booking.price": "Price",
    "booking.contact": "Contact",
    "booking.back": "Back",
    "booking.next": "Next",
    "booking.confirmBooking": "Confirm Booking",
    "booking.submitting": "Submitting...",
    "booking.success": "Booking Request Submitted!",
    "booking.successMessage":
      "We've received your booking request. We'll contact you within 24 hours to confirm your booking.",
    "booking.summary": "Booking Summary",
    "booking.bookAnother": "Book Another Jump",
    "booking.whenJump": "When would you like to jump?",
    "booking.selectDateDetails": "Select your preferred date and provide your details",
    "booking.preferredDate": "Preferred Date",
    "booking.numberOfJumpers": "Number of Jumpers",
    "booking.jumper": "jumper",
    "booking.jumpers": "jumpers",
    "booking.contactDetails": "Your Contact Details",
    "booking.firstName.label": "First Name",
    "booking.lastName.label": "Last Name",
    "booking.email.label": "Email Address",
    "booking.phone.label": "Phone Number",
    "booking.specialRequests": "Special Requests (Optional)",
    "booking.specialRequestsPlaceholder": "Any special requirements or questions...",
    "booking.selected": "Selected",
    "booking.noServices": "No services available at this location.",
    "booking.noLocations": "No locations available for this service type.",
    "booking.more": "more",
    "booking.termsDisclaimer":
      "By clicking submit, you agree to our booking terms. We'll contact you within 24 hours to confirm availability and finalize your booking.",

    // Profile
    "profile.title": "Profile",
    "profile.basicInfo": "Basic Information",
    "profile.fullName": "Full Name",
    "profile.phone": "Phone",
    "profile.emergencyContact": "Emergency Contact",
    "profile.optional": "Optional",
    "profile.name": "Name",
    "profile.relationship": "Relationship",
    "profile.relationshipPlaceholder": "e.g., Spouse, Parent, Friend",
    "profile.save": "Save Changes",
    "profile.saving": "Saving...",
    "profile.namePlaceholder": "Enter your full name",
    "profile.phonePlaceholder": "Enter your phone number",
    "profile.emergencyNamePlaceholder": "Emergency contact name",
    "profile.emergencyPhonePlaceholder": "Emergency contact phone",
    "profile.updateSuccess": "Profile updated successfully",
    "profile.updateError": "Failed to save profile",
    "profile.loadError": "Failed to load profile",
    "profile.validationError": "Invalid input",
    "profile.myBookings": "My Bookings",
    "profile.noBookings": "No bookings yet",

    // Auth Messages
    "auth.signInSuccess": "Signed in successfully!",
    "auth.signUpSuccess": "Registration successful! Please check your email to verify your account.",
    "auth.invalidCredentials": "Invalid email or password",
    "auth.emailAlreadyRegistered": "This email is already registered",
    "auth.emailNotConfirmed": "Please verify your email first",
    "auth.signInFailed": "Sign in failed",
    "auth.signUpFailed": "Registration failed",
    "auth.googleSignInFailed": "Google sign in failed. Please try again.",
    "auth.enterEmailPassword": "Please enter email and password",
    "auth.passwordsMismatch": "Passwords do not match",
    "auth.passwordTooShort": "Password must be at least 6 characters",

    // About Section
    "about.badge": "About Us",
    "about.title": "Why Choose Let's Skydive HK?",
    "about.subtitle": "We are passionate about sharing the thrill of skydiving with adventurers across Asia.",
    "about.stats.safeJumps": "Safe Jumps",
    "about.stats.yearsExperience": "Years Experience",
    "about.stats.locations": "Locations",
    "about.stats.safetyRecord": "Safety Record",
    "about.values.safetyFirst.title": "Safety First",
    "about.values.safetyFirst.desc":
      "Every jump is conducted with the highest safety standards. Our equipment is inspected daily and our instructors are fully certified.",
    "about.values.expertInstructors.title": "Expert Instructors",
    "about.values.expertInstructors.desc":
      "Our tandem masters have thousands of jumps under their belts. You're in experienced hands from training to landing.",
    "about.values.personalizedExperience.title": "Personalized Experience",
    "about.values.personalizedExperience.desc":
      "Whether it's your first jump or your hundredth, we tailor the experience to make it unforgettable for you.",
    "about.values.passionDriven.title": "Passion Driven",
    "about.values.passionDriven.desc":
      "We love what we do. That passion translates into an incredible experience for every guest who jumps with us.",
    "about.story.title": "Our Story",
    "about.story.paragraph1":
      "Let's Skydive HK was founded by a young man who dreamed of wearing a wingsuit. His vision was to let more people in Hong Kong accomplish a major bucket-list item: to experience the pure thrill of flight. We provide closer and better options across Asia, transforming that initial passion into a network of world-class facilities in Thailand and China.",
    "about.story.paragraph2":
      "As the first in Hong Kong to provide comprehensive, well-organized support for skydiving, our entire operation is built around a singular priority: your safety. We set and maintain the highest safety standards in the industry, ensuring every flight is not only thrilling but also meticulously managed for your absolute security and peace of mind.",

    // Contact Section
    "contact.badge": "Get in Touch",
    "contact.title": "Contact Us",
    "contact.subtitle": "Have questions? We're here to help you plan your skydiving adventure.",
    "contact.email.label": "Email Us",
    "contact.email.desc": "For bookings and inquiries",
    "contact.instagram.label": "Message our Instagram",
    "contact.instagram.desc": "Response time in 24 hours",
    "contact.location.label": "Headquarters",
    "contact.whatsapp.label": "WhatsApp",
    "contact.whatsapp.desc": "Quick responses",
    "contact.responseTime": "Response Time",
    "contact.responseTimeDesc":
      "We typically respond to all inquiries within 24 hours. For urgent matters, please call or WhatsApp us directly.",
    "contact.followUs": "Follow Us",
    "contact.form.name": "Name *",
    "contact.form.namePlaceholder": "Your name",
    "contact.form.email": "Email *",
    "contact.form.emailPlaceholder": "your@email.com",
    "contact.form.phone": "Phone (Optional)",
    "contact.form.phonePlaceholder": "+852 6939 1570",
    "contact.form.subject": "Subject *",
    "contact.form.message": "Message *",
    "contact.form.messagePlaceholder": "Tell us about your inquiry...",
    "contact.form.required": "* Required fields",
    "contact.form.submit": "Send Message",
    "contact.form.sending": "Sending...",
    "contact.form.success": "Message Sent!",
    "contact.form.successDesc": "Thank you for reaching out. We'll get back to you within 24 hours.",
    "contact.form.sendAnother": "Send another message",
    "contact.subject.aff": "A-Licence Inquiry",
    "contact.subject.group": "Group Events",
    "contact.subject.general": "General Question",

    // Footer
    "footer.description":
      "Experience the thrill of skydiving with Asia's premier dropzone network. Professional tandem jumps, AFF courses, and group events across Thailand and China.",
    "footer.quickLinks": "Quick Links",
    "footer.services": "Services",
    "footer.locations": "Our Locations",
    "footer.privacy": "Privacy Policy",
    "footer.terms": "Terms of Service",
    "footer.disclaimer": "Disclaimer",
    "footer.copyright": "© 2025 Let's Skydive HK. All rights reserved.",

    // Auth
    "auth.signIn": "Sign In",
    "auth.signUp": "Sign Up",
    "auth.signOut": "Sign Out",
    "auth.profile": "Profile",
    "auth.welcomeBack": "Welcome Back",
    "auth.createAccount": "Create Account",
    "auth.signInWithGoogle": "Sign in with Google",
    "auth.or": "or",
    "auth.emailAddress": "Email Address",
    "auth.password": "Password",
    "auth.confirmPassword": "Confirm Password",
    "auth.processing": "Processing...",
    "auth.noAccount": "Don't have an account?",
    "auth.haveAccount": "Already have an account?",
    "auth.member": "Member",

    // Gallery Section
    "gallery.badge": "Our Adventures",
    "gallery.title": "Gallery",
    "gallery.subtitle": "Relive the thrill through photos and videos from our jumpers.",
    "gallery.backToHome": "Back to Home",
    "gallery.upload": "Upload",
    "gallery.empty": "No photos or videos yet.",
    "gallery.uploadFirst": "Upload First Media",
    "gallery.selectItem": "Select an item to view",
    "gallery.video": "Video",
    "gallery.deleteSuccess": "Item deleted successfully",
    "gallery.deleteError": "Failed to delete item",
    "gallery.deleteConfirmTitle": "Delete this item?",
    "gallery.deleteConfirmDesc": "This action cannot be undone. The file will be permanently deleted.",
    "gallery.cancel": "Cancel",
    "gallery.delete": "Delete",
    "gallery.uploadTitle": "Upload Media",
    "gallery.invalidFileType": "Invalid file type. Please upload an image or video.",
    "gallery.fileTooLarge": "File too large. Maximum size is 50MB.",
    "gallery.dragDrop": "Drag & drop your file here, or",
    "gallery.browseFiles": "Browse Files",
    "gallery.removeFile": "Remove",
    "gallery.titleLabel": "Title (Optional)",
    "gallery.titlePlaceholder": "Give your media a title...",
    "gallery.descriptionLabel": "Description (Optional)",
    "gallery.descriptionPlaceholder": "Add a description...",
    "gallery.uploading": "Uploading...",
    "gallery.uploadBtn": "Upload",
    "gallery.uploadSuccess": "Media uploaded successfully!",
    "gallery.uploadError": "Failed to upload media",
    "nav.gallery": "Gallery",

    // Legal Pages
    "legal.backToHome": "Back to Home",

    // Privacy Policy
    "privacy.title": "Privacy Policy",
    "privacy.lastUpdated": "Last Updated",
    "privacy.section1.title": "1. Information We Collect",
    "privacy.section1.content":
      "We collect personal information you provide when booking a skydiving experience, creating an account, or contacting us. This includes your name, email address, phone number, emergency contact details, and any health information relevant to skydiving safety.",
    "privacy.section2.title": "2. How We Use Your Information",
    "privacy.section2.content":
      "Your information is used to process bookings, communicate about your skydiving experience, ensure safety compliance, and improve our services. We may also send promotional materials if you opt-in to receive them.",
    "privacy.section3.title": "3. Information Sharing",
    "privacy.section3.content":
      "We share your information with our partner dropzones to facilitate your booking. We do not sell your personal information to third parties. We may disclose information when required by law or to protect safety.",
    "privacy.section4.title": "4. Data Security",
    "privacy.section4.content":
      "We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.",
    "privacy.section5.title": "5. Your Rights",
    "privacy.section5.content":
      "You have the right to access, correct, or delete your personal information. You may also opt-out of marketing communications at any time. Contact us at letskydivehk@gmail.com to exercise these rights.",
    "privacy.section6.title": "6. Contact Us",
    "privacy.section6.content":
      "If you have questions about this Privacy Policy, please contact us at letskydivehk@gmail.com or call (852) 69391570.",

    // Terms of Service
    "terms.title": "Terms of Service",
    "terms.lastUpdated": "Last Updated",
    "terms.section1.title": "1. Acceptance of Terms",
    "terms.section1.content":
      "By accessing or using Let's Skydive HK services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.",
    "terms.section2.title": "2. Eligibility Requirements",
    "terms.section2.content":
      "Participants must meet minimum age requirements (typically 18 years or 16 with parental consent), weight restrictions, and health requirements as specified by each dropzone. You must honestly disclose any medical conditions that may affect your ability to skydive safely.",
    "terms.section3.title": "3. Booking and Cancellation",
    "terms.section3.content":
      "All bookings are subject to availability and weather conditions. Cancellation policies vary by location and service type. Refunds for weather-related cancellations will be handled according to each dropzone's policy. We recommend travel insurance for all bookings.",
    "terms.section4.title": "4. Assumption of Risk",
    "terms.section4.content":
      "Skydiving is an inherently dangerous activity. By participating, you acknowledge and accept the risks involved. You will be required to sign a liability waiver before jumping at any of our partner dropzones.",
    "terms.section5.title": "5. Photography and Media",
    "terms.section5.content":
      "Photos and videos taken during your jump are subject to additional fees as specified in your booking. Let's Skydive HK may use anonymized photos and videos for promotional purposes unless you opt out.",
    "terms.section6.title": "6. Limitation of Liability",
    "terms.section6.content":
      "Let's Skydive HK acts as a booking facilitator and is not directly liable for incidents occurring at partner dropzones. Each dropzone maintains its own insurance and safety protocols. Our liability is limited to the booking fee paid.",
    "terms.section7.title": "7. Changes to Terms",
    "terms.section7.content":
      "We reserve the right to modify these terms at any time. Continued use of our services after changes constitutes acceptance of the new terms.",

    // Disclaimer
    "disclaimer.title": "COMPREHENSIVE DISCLAIMER FOR LET'S SKYDIVE HK LIMITED",
    "disclaimer.lastUpdated": "Last Updated:",
    "disclaimer.website": "Website: https://letskydivehk.com/",
    "disclaimer.section1.title": "1. Acceptance of Terms",
    "disclaimer.section1.content":
      'Let\'s Skydive HK Limited ("the Company", "we", "us", or "our") operates this website and organises skydiving experiences, training courses, and related travel services worldwide. By accessing, browsing, or using this website, or by booking and participating in any service we organise, you acknowledge that you have read, understood, and irrevocably accept all terms of this comprehensive Disclaimer. If you do not agree with any part, you must immediately discontinue use of our services.',
    "disclaimer.section2.title": "2. Extreme Sport Risk Acknowledgement & Assumption of Liability",
    "disclaimer.section2.subtitle1": "2.1 Inherent Risks:",
    "disclaimer.section2.content1":
      "Skydiving is an extreme sport with inherent, unavoidable, and significant risks that CANNOT BE ELIMINATED, regardless of the care taken. These risks include, but are not limited to:",
    "disclaimer.section2.risks":
      "• Personal Injury or Death: From freefall, parachute deployment, landing, or mid-air collision, potentially resulting in paralysis, traumatic brain injury, or fatality.<br>• Equipment Failure: Malfunction or failure of the parachute, harness, altimeter, automatic activation device, or aircraft.<br>• Environmental Hazards: Adverse or sudden changes in weather, wind conditions, turbulence, poor visibility, obstacles in the landing or drop zone.<br>• Operational & Human Error: Errors in judgment by pilots, instructors, or ground crew; communication failures; deviations from planned flight or jump run.<br>• Health Reactions: Altitude-related illnesses, vertigo, loss of consciousness, or exacerbation of pre-existing physical or psychological conditions.",
    "disclaimer.section2.subtitle2": "2.2 Your Responsibility & Assumption of Risk:",
    "disclaimer.section2.content2":
      "By participating, you VOLUNTARILY AND EXPRESSLY ASSUME ALL SUCH RISKS. You confirm that you:",
    "disclaimer.section2.responsibilities":
      "• Are of legal age (18 years or older) or have consent from a legal guardian/parent.<br>• Are NOT pregnant and are in good physical and mental health, without any cardiovascular, respiratory, bone/joint, neurological conditions, or any other ailment that may be aggravated by skydiving.<br>• Have truthfully completed all required health and liability waiver forms.<br>• Will follow ALL instructions given by Company representatives and third-party instructors without exception.<br>• Are solely responsible for self-assessing your fitness and suitability to participate.",
    "disclaimer.section3.title": "3. Service Model & Third-Party Liability",
    "disclaimer.section3.subtitle1": "3.1 Agent Role:",
    "disclaimer.section3.content1":
      'The Company acts as a booking agent, coordinator, and facilitator. The actual skydiving services (including aircraft operation, jump execution, and instruction) are performed by independent, licensed third-party partner drop zones, operators, pilots, and instructors ("Service Partners").',
    "disclaimer.section3.subtitle2": "3.2 No Joint Liability:",
    "disclaimer.section3.content2":
      "We meticulously select our Service Partners but do not own, control, or directly supervise their daily operations. To the fullest extent permitted by law, we explicitly disclaim all liability for any acts, omissions, negligence, or wilful misconduct of these Service Partners, including breaches of safety protocols. Any claim relating to the actual skydive must be directed to the relevant Service Partner and their insurers.",
    "disclaimer.section4.title": "4. Booking, Cancellation, and Force Majeure",
    "disclaimer.section4.subtitle1": "4.1 Weather & Safety Cancellations:",
    "disclaimer.section4.content1":
      "Skydiving is 100% weather and condition-dependent. The Company or the Service Partner may cancel or reschedule any activity due to safety concerns (weather, wind, visibility, etc.) at any time. We are not liable for any associated costs you incur (e.g., travel, accommodation). Our standard rescheduling policy will apply; refunds are not guaranteed.",
    "disclaimer.section4.subtitle2": "4.2 Health & Suitability:",
    "disclaimer.section4.content2":
      "Service Partners reserve the right to deny participation to any person failing the on-site safety briefing or health assessment. Paid fees will be handled per the booking terms.",
    "disclaimer.section4.subtitle3": "4.3 No-Shows & Late Arrival:",
    "disclaimer.section4.content3":
      "Failure to arrive on time for your booked slot constitutes a cancellation without refund.",
    "disclaimer.section4.subtitle4": "4.4 Force Majeure:",
    "disclaimer.section4.content4":
      "We are not liable for failure to perform due to events beyond our reasonable control, including war, natural disasters, pandemics, government orders, strikes, or transportation failures.",
    "disclaimer.section5.title": "5. Insurance and Limitation of Liability",
    "disclaimer.section5.subtitle1": "5.1 Mandatory Personal Insurance:",
    "disclaimer.section5.content1":
      "You MUST obtain comprehensive personal travel and medical insurance that EXPLICITLY COVERS SKYDIVING AND EXTREME SPORTS. The Company's insurance does not cover your personal injury or medical costs.",
    "disclaimer.section5.subtitle2": "5.2 Company Liability Insurance:",
    "disclaimer.section5.content2":
      "We maintain third-party liability insurance as required by law, the details and limits of which are available upon request.",
    "disclaimer.section5.subtitle3": "5.3 Limitation of Our Liability:",
    "disclaimer.section5.content3":
      "TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE COMPANY, ITS DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES arising from your use of this website or participation in our organised activities. This includes, but is not limited to, damages for personal injury, death, emotional distress, loss of profits, data, or enjoyment, even if advised of the possibility of such damages.",
    "disclaimer.section5.subtitle4": "5.4 Waiver Agreement:",
    "disclaimer.section5.content4":
      "Participation is CONDITIONAL upon signing the Service Partner's formal Risk Waiver and Release of Liability agreement on the activity day.",
    "disclaimer.section6.title": "6. Website Use, Content, and Intellectual Property",
    "disclaimer.section6.subtitle1": '6.1 "As-Is" Basis:',
    "disclaimer.section6.content1":
      'This website and all content (information, prices, descriptions, media) are provided "AS IS" and "AS AVAILABLE" without warranties of any kind. We strive for accuracy but do not guarantee completeness, timeliness, or freedom from errors. All content is subject to change without notice.',
    "disclaimer.section6.subtitle2": "6.2 No Professional Advice:",
    "disclaimer.section6.content2":
      "Instructional content (videos, guides) is for reference only and DOES NOT replace mandatory on-site training from a certified instructor.",
    "disclaimer.section6.subtitle3": "6.3 External Links:",
    "disclaimer.section6.content3":
      "We are not responsible for the content, security, or privacy practices of any third-party websites we link to.",
    "disclaimer.section6.subtitle4": "6.4 Intellectual Property:",
    "disclaimer.section6.content4":
      "All website content (text, graphics, logos, images, videos) is our property or licensed to us and is protected by copyright and trademark laws. You may not reproduce, modify, or commercially exploit any content without our prior written permission.",
    "disclaimer.section7.title": "7. Governing Law and Dispute Resolution",
    "disclaimer.section7.content":
      "This Disclaimer is governed by and construed in accordance with the laws of the Hong Kong Special Administrative Region. Any dispute arising from it shall be subject to the exclusive jurisdiction of the courts of Hong Kong.",
    "disclaimer.section8.title": "8. Amendments and Contact",
    "disclaimer.section8.subtitle1": "8.1 Updates:",
    "disclaimer.section8.content1":
      "We reserve the right to modify this Disclaimer at any time. The updated version will be posted here with a new effective date. Your continued use constitutes acceptance.",
    "disclaimer.section8.subtitle2": "8.2 Contact:",
    "disclaimer.section8.content2":
      "For any questions regarding this Disclaimer, please use the contact form on our website.",
    "disclaimer.final.title": "FINAL ACKNOWLEDGEMENT",
    "disclaimer.final.content":
      "SKYDIVING CARRIES A RISK OF SERIOUS INJURY OR DEATH. YOUR PARTICIPATION IS VOLUNTARY. YOU ARE SOLELY RESPONSIBLE FOR UNDERSTANDING THESE RISKS, ENSURING YOU ARE FIT TO PARTICIPATE, AND OBTAINING APPROPRIATE INSURANCE. BY PROCEEDING WITH A BOOKING, YOU CONFIRM YOUR FULL AND UNCONDITIONAL ACCEPTANCE OF THIS DISCLAIMER.",
  },
  "zh-TW": {
    // Navigation & Common
    "nav.services": "服務項目",
    "nav.locations": "跳傘地點",
    "nav.about": "關於我們",
    "nav.booking": "立即預約",
    "nav.contact": "聯絡我們",
    "common.learnMore": "了解更多",
    "common.bookNow": "立即預約",
    "common.comingSoon": "即將推出",
    "common.loading": "載入中...",

    // Hero Section
    "hero.badge": "香港首選跳傘體驗",
    "hero.title": "一起跳傘吧",
    "hero.experienceThe": "體驗",
    "hero.ultimateThrill": "極致飛翔",
    "hero.subtitle":
      "我們提供專業雙人跳傘體驗、AFF（ Accelerated Freefall）加速自由落體認證課程，並可為企業團體、親友聚會等量身規劃跳傘活動專案。\n\n服務範圍遍及亞洲各地景觀絕佳的跳傘基地，讓您在專業安全保障下，俯瞰壯麗山河，成就非凡時刻。",
    "hero.cta.book": "預約您的跳傘",
    "hero.cta.explore": "探索服務",

    // Locations Section
    "locations.badge": "我們的跳傘場",
    "locations.title": "跳傘地點",
    "locations.subtitle": "從我們位於泰國和中國的頂級跳傘場中選擇，每個場地都提供獨特的風景和世界級設施。",
    "locations.thailand": "🇹🇭 泰國",
    "locations.china": "🇨🇳 中國",
    "locations.noLocations": "{country}暫時沒有可用的跳傘地點。",
    "locations.bookHere": "在此地點預約",
    "locations.tandem": "雙人跳傘",
    "locations.aff": "AFF課程",
    "locations.groups": "團體活動",
    "locations.map.title": "探索我們的跳傘基地",
    "locations.map.subtitle": "選擇一個地點在地圖上查看",
    "locations.map.openGoogleMaps": "在 Google 地圖中開啟",

    // Services Section
    "services.badge": "我們提供的服務",
    "services.title": "服務項目",
    "services.subtitle": "從首次跳傘者到有志成為持牌跳傘員的學員，我們都有適合您的完美體驗。",
    "services.tandem.title": "雙人跳傘",
    "services.tandem.subtitle": "歡迎首次跳傘者",
    "services.tandem.description": "與經驗豐富的教練一同體驗極限自由落體的刺激。無需任何經驗——只需帶上您的冒險精神！",
    "services.alicence.title": "A級執照",
    "services.alicence.subtitle": "學習獨立跳傘",
    "services.alicence.description": "加速自由落體（AFF）課程是您成為持牌跳傘員的途徑。掌握獨立跳傘所需的技能。",
    "services.group.title": "團體活動",
    "services.group.subtitle": "團隊建設與慶祝活動",
    "services.group.description": "非常適合企業團隊建設、單身派對、生日或任何特殊場合。一起創造難忘的回憶！",
    "services.popular": "最受歡迎",
    "services.contactUs": "聯絡我們",
    "services.priceVaries": "價格因地點而異",
    "services.whatsIncluded": "包含內容：",
    "services.safetyNote": "安全第一：",
    "services.safetyDesc": "所有跳傘均由認證教練使用現代化設備進行",
    "services.priceFrom": "${price}起",
    "services.customQuote": "專屬跳傘報價",

    // Booking Section
    "booking.badge": "準備好了嗎？",
    "booking.title": "預約您的冒險",
    "booking.subtitle": "選擇您偏好的地點和服務，開始您的跳傘之旅。",
    "booking.step1": "選擇地點",
    "booking.step2": "選擇服務",
    "booking.step3": "您的資料",
    "booking.step4": "確認",
    "booking.selectLocation": "選擇地點",
    "booking.selectService": "選擇服務",
    "booking.form.name": "全名",
    "booking.form.email": "電子郵件",
    "booking.form.phone": "電話號碼",
    "booking.form.date": "偏好日期",
    "booking.form.notes": "備註",
    "booking.form.submit": "提交預約申請",
    "booking.filter.showing": "顯示提供A級執照培訓的地點",
    "booking.whereJump": "您想在哪裡跳傘？",
    "booking.selectDropzone": "選擇您偏好的跳傘場地",
    "booking.showAll": "顯示全部",
    "booking.chooseService": "選擇您的體驗",
    "booking.selectPackage": "選擇您偏好的套餐",
    "booking.changeLocation": "更換地點",
    "booking.yourDetails": "您的資料",
    "booking.fillInfo": "填寫您的資料以完成預約",
    "booking.firstName": "名字",
    "booking.lastName": "姓氏",
    "booking.email": "電子郵件",
    "booking.phone": "電話",
    "booking.date": "偏好日期",
    "booking.participants": "參加人數",
    "booking.notes": "備註（選填）",
    "booking.notesPlaceholder": "任何特殊要求或需求...",
    "booking.reviewBooking": "確認您的預約",
    "booking.confirmDetails": "請確認您的預約詳情",
    "booking.location": "地點",
    "booking.service": "服務",
    "booking.price": "價格",
    "booking.contact": "聯絡方式",
    "booking.back": "返回",
    "booking.next": "下一步",
    "booking.confirmBooking": "確認預約",
    "booking.submitting": "提交中...",
    "booking.success": "預約申請已提交！",
    "booking.successMessage": "我們已收到您的預約申請。我們會在24小時內聯繫您確認預約。",
    "booking.summary": "預約摘要",
    "booking.bookAnother": "再次預約",
    "booking.whenJump": "您想什麼時候跳傘？",
    "booking.selectDateDetails": "選擇您偏好的日期並填寫您的資料",
    "booking.preferredDate": "偏好日期",
    "booking.numberOfJumpers": "跳傘人數",
    "booking.jumper": "位",
    "booking.jumpers": "位",
    "booking.contactDetails": "您的聯絡資料",
    "booking.firstName.label": "名字",
    "booking.lastName.label": "姓氏",
    "booking.email.label": "電子郵件",
    "booking.phone.label": "電話號碼",
    "booking.specialRequests": "特殊需求（選填）",
    "booking.specialRequestsPlaceholder": "任何特殊要求或問題...",
    "booking.selected": "已選擇",
    "booking.noServices": "此地點暫無可用服務。",
    "booking.noLocations": "此服務類型暫無可用地點。",
    "booking.more": "更多",
    "booking.termsDisclaimer": "點擊提交即表示您同意我們的預約條款。我們將在24小時內與您聯繫確認可用性並完成預約。",

    // Profile
    "profile.title": "個人資料",
    "profile.basicInfo": "基本資料",
    "profile.fullName": "全名",
    "profile.phone": "電話",
    "profile.emergencyContact": "緊急聯絡人",
    "profile.optional": "選填",
    "profile.name": "姓名",
    "profile.relationship": "關係",
    "profile.relationshipPlaceholder": "例如：配偶、父母、朋友",
    "profile.save": "儲存變更",
    "profile.saving": "儲存中...",
    "profile.namePlaceholder": "輸入您的全名",
    "profile.phonePlaceholder": "輸入您的電話號碼",
    "profile.emergencyNamePlaceholder": "緊急聯絡人姓名",
    "profile.emergencyPhonePlaceholder": "緊急聯絡人電話",
    "profile.updateSuccess": "個人資料更新成功",
    "profile.updateError": "儲存個人資料失敗",
    "profile.loadError": "載入個人資料失敗",
    "profile.validationError": "輸入無效",
    "profile.myBookings": "我的預約",
    "profile.noBookings": "尚無預約記錄",

    // Auth Messages
    "auth.signInSuccess": "登入成功！",
    "auth.signUpSuccess": "註冊成功！請查看您的電子郵件以驗證帳戶。",
    "auth.invalidCredentials": "電子郵件或密碼無效",
    "auth.emailAlreadyRegistered": "此電子郵件已註冊",
    "auth.emailNotConfirmed": "請先驗證您的電子郵件",
    "auth.signInFailed": "登入失敗",
    "auth.signUpFailed": "註冊失敗",
    "auth.googleSignInFailed": "Google 登入失敗，請重試。",
    "auth.enterEmailPassword": "請輸入電子郵件和密碼",
    "auth.passwordsMismatch": "密碼不符",
    "auth.passwordTooShort": "密碼必須至少6個字元",

    // About Section
    "about.badge": "關於我們",
    "about.title": "為什麼選擇 Let's Skydive HK？",
    "about.subtitle": "我們熱衷於與亞洲各地的冒險家分享跳傘的刺激體驗。",
    "about.stats.safeJumps": "安全跳傘次數",
    "about.stats.yearsExperience": "年經驗",
    "about.stats.locations": "個跳傘地點",
    "about.stats.safetyRecord": "安全紀錄",
    "about.values.safetyFirst.title": "安全第一",
    "about.values.safetyFirst.desc": "每次跳傘均遵循最高安全標準。我們的設備每日檢查，教練均持有完整認證。",
    "about.values.expertInstructors.title": "專業教練",
    "about.values.expertInstructors.desc":
      "我們的雙人跳傘教練擁有數千次跳傘經驗。從培訓到降落，您都在經驗豐富的專業人員手中。",
    "about.values.personalizedExperience.title": "個人化體驗",
    "about.values.personalizedExperience.desc": "無論是您的第一次跳傘還是第一百次，我們都會為您量身打造難忘的體驗。",
    "about.values.passionDriven.title": "熱情驅動",
    "about.values.passionDriven.desc": "我們熱愛我們的工作。這份熱情轉化為每位與我們一起跳傘的客人的絕佳體驗。",
    "about.story.title": "我們的故事",
    "about.story.paragraph1":
      "Let's Skydive HK 由一位夢想穿上翼裝飛行的年輕人創立。他的願景是讓更多香港人完成人生清單上的重要項目：體驗純粹的飛行快感。我們在亞洲各地提供更近、更優質的選擇，將最初的熱情轉化為遍布泰國和中國的世界級設施網絡。",
    "about.story.paragraph2":
      "作為香港首家提供全面、有系統跳傘支援服務的機構，我們的整體運營圍繞著一個核心優先事項：您的安全。我們制定並維持業界最高的安全標準，確保每一次飛行不僅刺激，更是經過精心管理，讓您絕對安心無憂。",

    // Contact Section
    "contact.badge": "聯繫我們",
    "contact.title": "聯絡我們",
    "contact.subtitle": "有問題嗎？我們隨時為您規劃跳傘冒險提供幫助。",
    "contact.email.label": "電子郵件",
    "contact.email.desc": "預約及查詢",
    "contact.instagram.label": "私訊我們的Instagram",
    "contact.instagram.desc": "24小時內回覆",
    "contact.location.label": "總部",
    "contact.whatsapp.label": "WhatsApp",
    "contact.whatsapp.desc": "快速回覆",
    "contact.responseTime": "回覆時間",
    "contact.responseTimeDesc": "我們通常會在24小時內回覆所有查詢。如有緊急事項，請直接致電或WhatsApp聯繫我們。",
    "contact.followUs": "關注我們",
    "contact.form.name": "姓名 *",
    "contact.form.namePlaceholder": "您的姓名",
    "contact.form.email": "電子郵件 *",
    "contact.form.emailPlaceholder": "your@email.com",
    "contact.form.phone": "電話（選填）",
    "contact.form.phonePlaceholder": "+852 6939 1570",
    "contact.form.subject": "主題 *",
    "contact.form.message": "訊息 *",
    "contact.form.messagePlaceholder": "請告訴我們您的查詢內容...",
    "contact.form.required": "* 必填欄位",
    "contact.form.submit": "發送訊息",
    "contact.form.sending": "發送中...",
    "contact.form.success": "訊息已發送！",
    "contact.form.successDesc": "感謝您的來信。我們會在24小時內回覆您。",
    "contact.form.sendAnother": "發送另一則訊息",
    "contact.subject.aff": "A級執照查詢",
    "contact.subject.group": "團體活動",
    "contact.subject.general": "一般問題",

    // Footer
    "footer.description": "與亞洲首屈一指的跳傘網絡一同體驗跳傘的刺激。專業雙人跳傘、AFF課程及團體活動遍布泰國和中國。",
    "footer.quickLinks": "快速連結",
    "footer.services": "服務項目",
    "footer.locations": "我們的地點",
    "footer.privacy": "隱私政策",
    "footer.terms": "服務條款",
    "footer.disclaimer": "免責聲明",
    "footer.copyright": "© 2025 Let's Skydive HK. 版權所有。",

    // Auth
    "auth.signIn": "登入",
    "auth.signUp": "註冊",
    "auth.signOut": "登出",
    "auth.profile": "個人資料",
    "auth.welcomeBack": "歡迎回來",
    "auth.createAccount": "建立帳戶",
    "auth.signInWithGoogle": "使用 Google 登入",
    "auth.or": "或",
    "auth.emailAddress": "電子郵件地址",
    "auth.password": "密碼",
    "auth.confirmPassword": "確認密碼",
    "auth.processing": "處理中...",
    "auth.noAccount": "還沒有帳戶？",
    "auth.haveAccount": "已經有帳戶？",
    "auth.member": "會員",

    // Gallery Section
    "gallery.badge": "我們的冒險",
    "gallery.title": "相片集",
    "gallery.subtitle": "透過我們跳傘者的照片和影片重溫刺激時刻。",
    "gallery.backToHome": "返回首頁",
    "gallery.upload": "上傳",
    "gallery.empty": "暫時沒有照片或影片。",
    "gallery.uploadFirst": "上傳第一個媒體",
    "gallery.selectItem": "選擇項目查看",
    "gallery.video": "影片",
    "gallery.deleteSuccess": "項目已成功刪除",
    "gallery.deleteError": "刪除項目失敗",
    "gallery.deleteConfirmTitle": "刪除此項目？",
    "gallery.deleteConfirmDesc": "此操作無法撤銷。檔案將被永久刪除。",
    "gallery.cancel": "取消",
    "gallery.delete": "刪除",
    "gallery.uploadTitle": "上傳媒體",
    "gallery.invalidFileType": "無效的檔案類型。請上傳圖片或影片。",
    "gallery.fileTooLarge": "檔案太大。最大大小為50MB。",
    "gallery.dragDrop": "拖放檔案至此，或",
    "gallery.browseFiles": "瀏覽檔案",
    "gallery.removeFile": "移除",
    "gallery.titleLabel": "標題（選填）",
    "gallery.titlePlaceholder": "為您的媒體添加標題...",
    "gallery.descriptionLabel": "描述（選填）",
    "gallery.descriptionPlaceholder": "添加描述...",
    "gallery.uploading": "上傳中...",
    "gallery.uploadBtn": "上傳",
    "gallery.uploadSuccess": "媒體上傳成功！",
    "gallery.uploadError": "上傳媒體失敗",
    "nav.gallery": "相片集",

    // Legal Pages
    "legal.backToHome": "返回首頁",

    // Privacy Policy
    "privacy.title": "私隱政策",
    "privacy.lastUpdated": "最後更新",
    "privacy.section1.title": "1. 我們收集的資料",
    "privacy.section1.content":
      "當您預約跳傘體驗、建立帳戶或聯絡我們時，我們會收集您提供的個人資料。這包括您的姓名、電郵地址、電話號碼、緊急聯絡人資料，以及與跳傘安全相關的健康資訊。",
    "privacy.section2.title": "2. 我們如何使用您的資料",
    "privacy.section2.content":
      "您的資料用於處理預約、溝通跳傘體驗事宜、確保安全合規以及改進我們的服務。如您選擇接收推廣資訊，我們亦會向您發送相關內容。",
    "privacy.section3.title": "3. 資料分享",
    "privacy.section3.content":
      "我們會與合作跳傘場分享您的資料以便處理預約。我們不會將您的個人資料出售給第三方。在法律要求或為保護安全時，我們可能會披露相關資料。",
    "privacy.section4.title": "4. 資料安全",
    "privacy.section4.content":
      "我們採取適當的安全措施保護您的個人資料。然而，網絡傳輸並非百分百安全，我們無法保證絕對安全。",
    "privacy.section5.title": "5. 您的權利",
    "privacy.section5.content":
      "您有權存取、更正或刪除您的個人資料。您亦可隨時選擇退出營銷通訊。如需行使這些權利，請聯絡 letskydivehk@gmail.com。",
    "privacy.section6.title": "6. 聯絡我們",
    "privacy.section6.content": "如對本私隱政策有任何疑問，請聯絡 letskydivehk@gmail.com 或致電 (852) 69391570。",

    // Terms of Service
    "terms.title": "服務條款",
    "terms.lastUpdated": "最後更新",
    "terms.section1.title": "1. 條款接受",
    "terms.section1.content":
      "使用 Let's Skydive HK 的服務即表示您同意受這些服務條款約束。如您不同意這些條款，請勿使用我們的服務。",
    "terms.section2.title": "2. 資格要求",
    "terms.section2.content":
      "參加者必須符合最低年齡要求（通常為18歲或16歲並獲得家長同意）、體重限制及各跳傘場指定的健康要求。您必須如實披露任何可能影響跳傘安全的健康狀況。",
    "terms.section3.title": "3. 預約及取消",
    "terms.section3.content":
      "所有預約視乎供應情況及天氣條件而定。取消政策因地點和服務類型而異。因天氣原因取消的退款將按各跳傘場政策處理。我們建議所有預約購買旅遊保險。",
    "terms.section4.title": "4. 風險承擔",
    "terms.section4.content":
      "跳傘是一項本質上具有危險性的活動。參與即表示您確認並接受所涉及的風險。在任何合作跳傘場跳傘前，您需要簽署免責聲明。",
    "terms.section5.title": "5. 攝影及媒體",
    "terms.section5.content":
      "跳傘期間拍攝的照片和影片需支付預約時註明的額外費用。除非您選擇退出，Let's Skydive HK 可能會使用匿名照片和影片作推廣用途。",
    "terms.section6.title": "6. 責任限制",
    "terms.section6.content":
      "Let's Skydive HK 作為預約中介，不對合作跳傘場發生的事故承擔直接責任。各跳傘場維護其自身的保險和安全規程。我們的責任僅限於已支付的預約費用。",
    "terms.section7.title": "7. 條款變更",
    "terms.section7.content": "我們保留隨時修改這些條款的權利。在條款變更後繼續使用我們的服務即表示接受新條款。",

    // Disclaimer
    "disclaimer.title": "Let's Skydive HK Limited 免責聲明（繁體中文版）",
    "disclaimer.lastUpdated": "最後更新日期：",
    "disclaimer.website": "網站：https://letskydivehk.com/",
    "disclaimer.section1.title": "1. 接受條款",
    "disclaimer.section1.content":
      "Let's Skydive HK Limited（以下稱「本公司」、「我們」或「我們的」）運營此網站，並在全球範圍內組織跳傘體驗、培訓課程及相關旅行服務。透過存取、瀏覽或使用本網站，或預訂及參與我們組織的任何服務，即表示您確認已閱讀、理解並不可撤銷地接受本免責聲明的所有條款。如您不同意任何部分，必須立即停止使用我們的服務。",
    "disclaimer.section2.title": "2. 極限運動風險認知與責任承擔",
    "disclaimer.section2.subtitle1": "2.1 固有風險：",
    "disclaimer.section2.content1":
      "跳傘是一項具有固有、不可避免且重大風險的極限運動，無論採取何種防護措施，這些風險都無法被消除。這些風險包括但不限於：",
    "disclaimer.section2.risks":
      "• 人身傷害或死亡：可能因自由落體、開傘、著陸或空中碰撞而導致癱瘓、創傷性腦損傷或死亡。<br>• 設備故障：降落傘、背帶、高度計、自動激活裝置或飛機的故障或失靈。<br>• 環境危害：惡劣或突變的天氣、風況、氣流、能見度差、著陸區或降落區的障礙物。<br>• 操作及人為錯誤：飛行員、教練或地勤人員的判斷錯誤；溝通失誤；偏離計劃的飛行或跳傘航線。<br>• 健康反應：高空相關疾病、眩暈、意識喪失，或既有身體或心理狀況的惡化。",
    "disclaimer.section2.subtitle2": "2.2 您的責任與風險承擔：",
    "disclaimer.section2.content2": "參與即表示您自願且明確地承擔所有此類風險。您確認：",
    "disclaimer.section2.responsibilities":
      "• 您已達法定年齡（18歲或以上），或已獲得合法監護人/父母同意。<br>• 您並未懷孕，且身體及精神健康狀況良好，無任何可能因跳傘而惡化的心血管、呼吸系統、骨骼/關節、神經系統疾病或其他任何疾病。<br>• 您已如實填寫所有要求的健康及責任豁免表格。<br>• 您將毫無例外地遵守本公司代表及第三方教練的所有指示。<br>• 您需自行負責評估自身是否適合參與。",
    "disclaimer.section3.title": "3. 服務模式與第三方責任",
    "disclaimer.section3.subtitle1": "3.1 代理角色：",
    "disclaimer.section3.content1":
      "本公司僅作為預訂代理、協調者及促成者。實際的跳傘服務（包括飛機操作、跳傘執行及教學）由獨立的、持有牌照的第三方合作跳傘中心、運營商、飛行員及教練（「服務夥伴」）提供。",
    "disclaimer.section3.subtitle2": "3.2 無連帶責任：",
    "disclaimer.section3.content2":
      "我們謹慎選擇服務夥伴，但並不擁有、控制或直接監督其日常運營。在法律允許的最大範圍內，我們明確免除對這些服務夥伴的任何行為、疏忽、過失或故意不當行為（包括違反安全協議）所產生的一切責任。任何與實際跳傘活動相關的索賠必須直接向相關的服務夥伴及其保險公司提出。",
    "disclaimer.section4.title": "4. 預訂、取消及不可抗力",
    "disclaimer.section4.subtitle1": "4.1 天氣及安全取消：",
    "disclaimer.section4.content1":
      "跳傘活動完全取決於天氣及安全條件。本公司或服務夥伴可隨時因安全考慮（天氣、風速、能見度等）取消或重新安排活動。對於您因此產生的任何相關費用（如交通、住宿），我們概不負責。我們的標準改期政策將適用；並不保證退款。",
    "disclaimer.section4.subtitle2": "4.2 健康及適用性：",
    "disclaimer.section4.content2":
      "服務夥伴有權拒絕任何未通過現場安全簡報或健康評估的人士參與。已支付費用將按預訂條款處理。",
    "disclaimer.section4.subtitle3": "4.3 未出席及遲到：",
    "disclaimer.section4.content3": "未能準時出席已預訂的活動時段，將被視為自動取消，不予退款。",
    "disclaimer.section4.subtitle4": "4.4 不可抗力：",
    "disclaimer.section4.content4":
      "對於因超出我們合理控制範圍的事件（包括戰爭、自然災害、疫情、政府命令、罷工或交通中斷）導致我們未能履行服務，我們不承擔責任。",
    "disclaimer.section5.title": "5. 保險與責任限制",
    "disclaimer.section5.subtitle1": "5.1 強制個人保險：",
    "disclaimer.section5.content1":
      "您必須購買全面的個人旅行及醫療保險，且該保險必須明確承保跳傘及極限運動。本公司的保險不涵蓋您的個人傷害或醫療費用。",
    "disclaimer.section5.subtitle2": "5.2 公司責任保險：",
    "disclaimer.section5.content2": "我們依法持有第三方責任保險，其詳細內容及限額可根據要求提供。",
    "disclaimer.section5.subtitle3": "5.3 我們的責任限制：",
    "disclaimer.section5.content3":
      "在法律允許的最大範圍內，本公司及其董事、僱員和代理人均不對因您使用本網站或參與我們組織的活動而產生的任何直接、間接、附帶、特殊、後果性或懲罰性損害承擔責任。這包括但不限於人身傷害、死亡、精神困擾、利潤損失、數據或樂趣喪失的損害賠償，即使已被告知可能發生此類損害。",
    "disclaimer.section5.subtitle4": "5.4 豁免協議：",
    "disclaimer.section5.content4": "參與活動的前提條件是於活動當天簽署服務夥伴提供的正式《風險承擔及責任豁免協議》。",
    "disclaimer.section6.title": "6. 網站使用、內容及知識產權",
    "disclaimer.section6.subtitle1": "6.1 「現狀」提供：",
    "disclaimer.section6.content1":
      "本網站及其所有內容（資訊、價格、描述、媒體）均按「現狀」及「可用」狀態提供，不附帶任何形式的保證。我們力求準確，但不保證內容的完整性、及時性或無錯誤。所有內容均可能隨時更改，恕不另行通知。",
    "disclaimer.section6.subtitle2": "6.2 非專業建議：",
    "disclaimer.section6.content2": "教學內容（影片、指南）僅供參考，不能替代持證教練的強制性現場培訓。",
    "disclaimer.section6.subtitle3": "6.3 外部連結：",
    "disclaimer.section6.content3": "我們不對任何我們連結到的第三方網站的內容、安全性或隱私慣例負責。",
    "disclaimer.section6.subtitle4": "6.4 知識產權：",
    "disclaimer.section6.content4":
      "本網站的所有內容（文字、圖形、標誌、圖像、影片）均為本公司財產或經授權使用，受版權和商標法保護。未經我們事先書面許可，您不得複製、修改或用於任何商業用途。",
    "disclaimer.section7.title": "7. 管轄法律與爭議解決",
    "disclaimer.section7.content":
      "本免責聲明受中華人民共和國香港特別行政區法律管轄並據其解釋。任何由此產生的爭議均應提交香港法院專屬管轄。",
    "disclaimer.section8.title": "8. 修改與聯繫方式",
    "disclaimer.section8.subtitle1": "8.1 更新：",
    "disclaimer.section8.content1":
      "我們保留隨時修改本免責聲明的權利。更新後的版本將在此發布，並附上新生效日期。您繼續使用即表示接受。",
    "disclaimer.section8.subtitle2": "8.2 聯繫：",
    "disclaimer.section8.content2": "如有關於本免責聲明的任何疑問，請使用我們網站上的聯繫表格。",
    "disclaimer.final.title": "最終確認聲明",
    "disclaimer.final.content":
      "跳傘活動具有導致嚴重受傷或死亡的風險。您的參與純屬自願。您需自行負責了解這些風險、確保自身適合參與並購買合適的保險。進行預訂即表示您確認完全且無條件接受本免責聲明。",
  },
};

// Translations for dynamic Supabase data (locations, services, etc.)
const dataTranslations: Record<Language, Record<string, string>> = {
  en: {
    // Location names (keep English as-is)
    "location.chiang-mai": "Chiang Mai (Wefly)",
    "location.pattaya": "Pattaya",
    "location.hainan": "Hainan (Weland)",
    "location.huizhou": "Huizhou (Yingfei)",
    "location.luoding": "Luoding (Yingfei)",
    "location.zhuhai": "Zhuhai (Weland)",

    // Location descriptions
    "location.chiang-mai.desc": "Jump over the stunning mountains and temples of Northern Thailand.",
    "location.pattaya.desc": "Experience breathtaking views of the Gulf of Thailand in Pattaya.",
    "location.hainan.desc": "Tropical paradise skydiving with crystal clear ocean views.",
    "location.huizhou.desc": "Scenic coastal views and perfect weather conditions year-round.",
    "location.luoding.desc": "A new adventure destination in Guangdong province.",
    "location.zhuhai.desc": "Coming soon - Stunning coastal views near Macau.",

    // Countries
    "country.Thailand": "Thailand",
    "country.China": "China",

    // Cities
    "city.Chiang Mai": "Chiang Mai",
    "city.Pattaya": "Pattaya",
    "city.Hainan": "Hainan",
    "city.Huizhou": "Huizhou",
    "city.Luoding": "Luoding",
    "city.Zhuhai": "Zhuhai",

    // Service names
    "service.Tandem Skydive with Handicam": "Tandem Skydive with Handicam",
    "service.Tandem Skydive with Video": "Tandem Skydive with Video",
    "service.Tandem Skydive with Ultimate Combo": "Tandem Skydive with Ultimate Combo",
    "service.A-License Package": "A-License Package",
    "service.Group Events": "Group Events",

    // Service types
    "serviceType.tandem": "Tandem Skydive",
    "serviceType.aff": "A-Licence",
    "serviceType.group": "Group Events",
  },
  "zh-TW": {
    // Location names
    "location.chiang-mai": "清邁 (Wefly)",
    "location.pattaya": "芭達雅",
    "location.hainan": "海南 (蔚藍)",
    "location.huizhou": "惠州 (鷹飛)",
    "location.luoding": "羅定 (鷹飛)",
    "location.zhuhai": "珠海 (蔚藍)",

    // Location descriptions
    "location.chiang-mai.desc": "在泰國北部壯麗的山脈和寺廟上空跳傘。",
    "location.pattaya.desc": "在芭達雅體驗泰國灣的壯麗景色。",
    "location.hainan.desc": "在熱帶天堂跳傘，享受清澈的海景。",
    "location.huizhou.desc": "全年優美的海岸景色和完美的天氣條件。",
    "location.luoding.desc": "廣東省的新探險目的地。",
    "location.zhuhai.desc": "即將推出 - 澳門附近的壯麗海岸景色。",

    // Countries
    "country.Thailand": "泰國",
    "country.China": "中國",

    // Cities
    "city.Chiang Mai": "清邁",
    "city.Pattaya": "芭達雅",
    "city.Hainan": "海南",
    "city.Huizhou": "惠州",
    "city.Luoding": "羅定",
    "city.Zhuhai": "珠海",

    // Service names
    "service.Tandem Skydive with Handicam": "雙人跳傘含手持攝影",
    "service.Tandem Skydive with Video": "雙人跳傘含影片",
    "service.Tandem Skydive with Ultimate Combo": "雙人跳傘終極組合",
    "service.A-License Package": "A級執照套餐",
    "service.Group Events": "團體活動",

    // Service types
    "serviceType.tandem": "雙人跳傘",
    "serviceType.aff": "A級執照",
    "serviceType.group": "團體活動",
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  // Translate dynamic data from Supabase
  const translateData = (key: string, fallback: string): string => {
    return dataTranslations[language][key] || fallback;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translateData }}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
