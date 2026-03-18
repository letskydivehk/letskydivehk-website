import { createContext, useContext, useState, ReactNode } from "react";

export type Language = "en" | "zh-TW" | "zh-CN";

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
    "locations.viewDetails": "View Details",
    "locations.bookHereBtn": "Book Here",

    // Location Detail Page
    "locationDetail.notFound": "Location not found",
    "locationDetail.backToHome": "Back To Home",
    "locationDetail.highlights": "Highlights",
    "locationDetail.fromAirport": "From Airport",
    "locationDetail.fromCity": "From City",
    "locationDetail.transportation": "Transportation",
    "locationDetail.photos": "Photos",
    "locationDetail.servicesHere": "Services Here",
    "locationDetail.map": "Map",
    "locationDetail.readyToJump": "Ready To Jump?",
    "locationDetail.bookHere": "Book Here",

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
      "Before getting your first licence, the Accelerated Freefall (AFF) program is your pathway to becoming a licensed skydiver. Master the skills to jump independently.",
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
    "booking.step4": "Preview",
    "booking.step5": "Payment",
    "booking.paymentTitle": "Pay Deposit",
    "booking.paymentSubtitle": "A HKD $500 deposit is required to confirm your booking",
    "booking.depositAmount": "Deposit Amount",
    "booking.paymentProcessing": "Processing payment...",
    "booking.paymentSuccess": "Payment successful!",
    "booking.paymentFailed": "Payment failed. Please try again.",
    "booking.paymentError": "An error occurred during payment processing.",
    "booking.depositNote": "The remaining balance will be collected on the activity day.",
    "booking.mobileRedirectNotice": "You will be redirected to complete payment in your app.",
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
    "booking.depositReminder": "A HKD $500 deposit is required to confirm your booking.",
    "booking.depositReminderNote": "After clicking 'Next', you will proceed to the payment page to pay the deposit. The remaining balance will be collected on the activity day.",
    "booking.termsDisclaimer":
      "By clicking submit, you agree to our booking terms. We'll contact you within 24 hours to confirm availability and finalize your booking.",
    "booking.fixErrors": "Please fix the validation errors before submitting",
    "booking.submitError": "Failed to submit booking. Please try again.",
    "booking.submitSuccess": "Booking submitted successfully!",

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

    // Credits
    "credit.title": "My Credits",
    "credit.balance": "Credit Balance",
    "credit.history": "Transaction History",
    "credit.noTransactions": "No transactions yet",
    "credit.signup_bonus": "Signup Bonus",
    "credit.admin_adjustment": "Admin Adjustment",
    "credit.redemption": "Redemption",
    "credit.refund": "Refund",
    "credit.promotion": "Promotion",
    "credit.referral_bonus": "Referral Bonus",
    "credit.pending": "Pending",
    "credit.approved": "Approved",
    "credit.rejected": "Rejected",
    "credit.pendingBalance": "Pending Credits",

    // Referral
    "referral.title": "My Referral Code",
    "referral.description":
      "Share your code with friends. When they book, you'll earn $100 credit (pending admin approval).",
    "referral.copied": "Referral code copied!",
    "referral.label": "Referral Code (optional)",
    "referral.placeholder": "Enter referral code",

    // Admin
    "admin.title": "Admin - Credit Management",
    "admin.pendingReferrals": "Pending Referrals",
    "admin.approve": "Approve",
    "admin.reject": "Reject",
    "admin.noPending": "No pending referral credits",

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
    "auth.passwordMinLength": "Password must be at least 8 characters",
    "auth.passwordLowercase": "Password must contain a lowercase letter",
    "auth.passwordUppercase": "Password must contain an uppercase letter",
    "auth.passwordNumber": "Password must contain a number",
    "auth.criteria.length": "At least 8 characters",
    "auth.criteria.lowercase": "One lowercase letter",
    "auth.criteria.uppercase": "One uppercase letter",
    "auth.criteria.number": "One number",
    "auth.forgotPassword": "Forgot password?",
    "auth.resetPassword": "Reset Password",
    "auth.resetDescription": "Enter your email address and we'll send you a link to reset your password.",
    "auth.sendResetLink": "Send Reset Link",
    "auth.resetEmailSent": "Password reset email sent! Check your inbox.",
    "auth.resetFailed": "Failed to send reset email",
    "auth.enterEmail": "Please enter your email address",

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
    "gallery.photos": "Photos",
    "gallery.videos": "Videos",
    "gallery.dailyVideos": "Daily Videos",
    "gallery.affVideos": "AFF Course Videos",
    "gallery.noDailyVideos": "No daily videos yet",
    "gallery.noAffVideos": "No AFF course videos yet",
    "gallery.refresh": "Refresh",
    "gallery.refreshSuccess": "Gallery refreshed",
    "gallery.refreshError": "Failed to refresh gallery",
    "gallery.loadError": "Failed to load image",
    "nav.gallery": "Gallery",
    "nav.faq": "FAQ",
    "nav.promotions": "Promotions",

    // Promotions Page
    "promo.badge": "Limited Offers",
    "promo.title": "Current Promotions",
    "promo.subtitle": "Take advantage of our latest deals and save on your skydiving adventure.",
    "promo.backToHome": "Back to Home",
    "promo.active": "Active Now",
    "promo.termsTitle": "Terms & Conditions",
    "promo.bookNow": "Book Now",
    "promo.claimCoupon": "Claim Coupon",
    "promo.perPerson": "Per Person",
    "promo.group2.title": "Buddy Deal — Jump Together & Save",
    "promo.group2.desc": "Bring a friend and you both save! Book together for an instant discount.",
    "promo.group2.details": "Each person saves $100 when 2 people book together for the same session.",
    "promo.group2.terms":
      "Both participants must book the same session at the same location. Discount applies to tandem skydive packages only. Cannot be combined with other promotions. Subject to availability.",
    "promo.homeBanner": "🔥 Buddy Deal: 2 jump together, each saves $100!",
    "promo.homeBannerCta": "View Details",
    "promo.off": "Discount",
    "promo.student.title": "Student Discount",
    "promo.student.desc": "Show your valid student ID and save on your skydiving adventure!",
    "promo.student.details": "Students get $100 off any tandem skydive package with a valid student ID.",
    "promo.student.terms":
      "Must present a valid student ID at check-in. Applies to tandem packages only. Cannot be combined with other promotions. One discount per person.",
    "promo.birthday.title": "Birthday Special",
    "promo.birthday.desc": "Celebrate your birthday with an unforgettable skydive and save!",
    "promo.birthday.details": "Jump during your birthday month and get $100 off any tandem package.",
    "promo.birthday.terms":
      "Must jump within your birthday month. Proof of date of birth required. Applies to tandem packages only. Cannot be combined with other promotions.",
    "promo.earlybird.title": "Early Bird Discount",
    "promo.earlybird.desc": "Plan ahead and save! Book early to lock in a special rate.",
    "promo.earlybird.details": "Book 90+ days in advance and save 10% on any skydiving package.",
    "promo.earlybird.terms":
      "Booking must be made at least 90 days before the jump date. Discount applies at checkout. Cannot be combined with other promotions. Subject to availability.",
    "promo.repeat.title": "Repeat Jumper Reward",
    "promo.repeat.desc": "Already jumped with us? Come back and save even more!",
    "promo.repeat.details": "Returning customers get $150 off their next jump with us.",
    "promo.repeat.terms":
      "Must have a previous completed booking with Let's Skydive HK. Discount applied upon verification of prior booking. Cannot be combined with other promotions.",
    "promo.code": "Promo Code",
    "promo.codeCopied": "Promo code copied!",
    "promo.copyCode": "Copy",

    // Booking - DOB & Promo
    "booking.dob.label": "Date of Birth",
    "booking.dob.placeholder": "Select your date of birth",
    "booking.dob.hint": "Required for birthday promotions and age verification.",
    "booking.promo.label": "Apply a Promotion (Optional)",
    "booking.promo.hint": "Select any applicable promotions. Terms & conditions apply.",

    // Legal Pages
    "legal.backToHome": "Back to Home",

    // Privacy Policy - English
    "privacy.title": "Let's Skydive HK Limited Personal Data (Privacy) Policy Statement",
    "privacy.lastUpdated": "Last Updated",
    "privacy.introduction":
      'Let\'s Skydive HK Limited (hereinafter referred to as "the Company", "we", "us" or "our") is committed to safeguarding your personal data privacy. This Privacy Policy Statement outlines how we collect, use, store, transfer, and handle your personal data in accordance with the Personal Data (Privacy) Ordinance (Cap. 486) of the Laws of Hong Kong (hereinafter referred to as "the Ordinance"). Please read this policy carefully to understand our practices regarding your personal data.',
    "privacy.updateNotice":
      "Our policies and measures are designed to ensure compliance with the Ordinance in the handling of personal data (as defined below) during our business operations. We may amend this policy from time to time and will publish the updated version on this website. Your continued use of our services or maintenance of a relationship with us after any amendments constitutes your acceptance of the revised policy.",

    "privacy.section1.title": "1. Types of Personal Data Collected",
    "privacy.section1.content":
      'We may collect personal identification data ("Personal Data") necessary for providing our services through various channels such as our website, telephone, email, social media, mobile applications, or in-person at our offices. This includes, but is not limited to:',
    "privacy.section1.list":
      "• Contact details (e.g., name, phone number, email address, postal address);<br>• Identification document details (e.g., passport or ID card number, date of birth);<br>• Physical health and medical-related information (e.g., weight, medical history, injury records, for assessing suitability for skydiving activities);<br>• Payment details (e.g., credit/debit card number, cardholder name, expiry date, billing address);<br>• Activity-related details (e.g., booked skydiving date, location, package type, video and photo preferences, emergency contact information);<br>• Information provided when participating in promotional events, contests, or surveys organized by us; and<br>• Communication records (for quality assurance and training purposes, we may record customer service-related calls or electronic messages).",
    "privacy.section1.note":
      "If you choose not to provide necessary data, we may be unable to provide you with skydiving activities or related services. If you are under 18 years old, you must obtain consent from a parent or guardian before providing personal data.",

    "privacy.section2.title": "2. Purposes of Collection and Use of Personal Data",
    "privacy.section2.content":
      "We will use your Personal Data for the following purposes related to our business and services:",
    "privacy.section2.list":
      "• To process, confirm, and manage your skydiving activity bookings, registrations, and payments;<br>• To assess your physical suitability and safety risks for participating in skydiving activities;<br>• To contact and follow up with you regarding your booking, enquiries, feedback, or complaints;<br>• To provide pre-activity briefings, safety instructions, and related service arrangements;<br>• To process and produce photographs, video recordings, and related products from your skydiving activity;<br>• To manage member accounts (where applicable) and provide related benefits;<br>• To conduct customer service quality monitoring, staff training, and handle claims;<br>• To conduct market research, analysis, and service improvements to enhance customer experience;<br>• To send you direct marketing messages regarding our latest offers, promotions, and service information, subject to your consent;<br>• To comply with legal or regulatory obligations, or to respond to requests from law enforcement agencies or government departments as required or permitted by law;<br>• To protect the rights, property, or safety of the Company, our customers, or the public, including the prevention of fraud or criminal activity; and<br>• Other purposes directly related to any of the above.",
    "privacy.section2.note":
      "We will not use your Personal Data for purposes other than those specified above without your prior consent.",

    "privacy.section3.title": "3. Disclosure and Transfer of Personal Data",
    "privacy.section3.content":
      "To achieve the purposes stated in Section 2, we may disclose or transfer your Personal Data to the following categories of third parties where necessary:",
    "privacy.section3.list":
      "• Third-party service providers involved in delivering the skydiving activity (e.g., skydiving instructors, aircraft leasing companies, photography teams);<br>• Financial institutions and payment service providers for processing payments;<br>• Contractors providing business support services to us (e.g., IT system providers, customer service centers, mailing services);<br>• Our professional advisers (e.g., lawyers, insurers, auditors);<br>• Government departments, regulators, or law enforcement agencies entitled to request data under legal requirements or authorizations; and<br>• Business partners collaborating with us to offer you relevant benefits or services (only with your consent).",
    "privacy.section3.note":
      "Some of these third parties may be located outside Hong Kong. When transferring your Personal Data, we will take reasonable steps to ensure adequate protection and compliance with the Ordinance.",

    "privacy.section4.title": "4. Protection and Retention of Personal Data",
    "privacy.section4.content":
      "We adopt reasonable technical and organizational measures (including encryption, firewalls, and access controls) commensurate with industry standards to protect your Personal Data from unauthorized access, use, disclosure, alteration, or destruction.",
    "privacy.section4.retention":
      "We will retain your Personal Data only for as long as necessary to fulfill the purposes for which it was collected, or as required for legal compliance, dispute resolution, and enforcement of agreements. Thereafter, we will securely delete or destroy the data.",

    "privacy.section5.title": "5. Cookies and Similar Technologies",
    "privacy.section5.content":
      "Our website may use Cookies and similar technologies to enhance your browsing experience, analyze website traffic, and deliver personalized content. You can manage or disable Cookies through your browser settings, although this may affect some website functionalities.",

    "privacy.section6.title": "6. Links to Third-Party Websites",
    "privacy.section6.content":
      "Our website or communications may contain links to third-party websites. These sites have their own independent privacy policies. We assume no responsibility for their content or policies. We advise you to review their privacy policies before using these sites.",

    "privacy.section7.title": "7. Your Rights",
    "privacy.section7.content": "Under the Ordinance, you have the right to:",
    "privacy.section7.list":
      "• Inquire whether we hold your Personal Data and request access to such data;<br>• Request correction of inaccurate Personal Data;<br>• Ascertain our policies and practices regarding Personal Data and be informed of the kinds of Personal Data we hold;<br>• Object to the use of your Personal Data for direct marketing; and<br>• Request cessation of using your Personal Data, subject to the conditions stipulated in the Ordinance.",
    "privacy.section7.note":
      "For exercising the above rights or any enquiry regarding this policy, please contact our Privacy Officer (contact details in Section 9).",

    "privacy.section8.title": "8. Direct Marketing",
    "privacy.section8.content":
      "We will only use your Personal Data (e.g., name and contact details) to send you direct marketing information about our services and promotions with your explicit consent (opt-in). You can unsubscribe from receiving such messages at any time free of charge by using the unsubscribe method provided in our marketing messages or by contacting our Privacy Officer.",

    "privacy.section9.title": "9. Contact Us",
    "privacy.section9.content":
      "If you have any questions, requests, or complaints regarding this Privacy Policy, our handling of personal data, or wish to exercise your personal data rights, please contact our Privacy Officer via:",
    "privacy.section9.email": "Email: letskydivehk@gmail.com",
    "privacy.section9.phone": "Phone: (852) 69391570",

    "privacy.finalNote":
      "(Note: For the avoidance of doubt, the latest update date of this policy is **1 January 2026**.)<br><br>**(This Privacy Policy Statement shall be governed by the Tradional Chinese version.)**",

    // Terms of Service - English
    "terms.title": "TERMS AND CONDITIONS",
    "terms.lastUpdated": "Last Updated: January 30, 2026",

    "terms.preamble.title": "Preamble",
    "terms.preamble.content":
      '1.1 These Terms and Conditions (hereinafter referred to as the "Terms") constitute a legally binding agreement between you (hereinafter referred to as the "Participant" or "Customer") and Let\'s Skydive HK Limited (hereinafter referred to as "the Company", "we", or "us") regarding the provision of skydiving activity services (hereinafter referred to as "the Service"). These Terms shall be governed by and construed in accordance with the laws of the Hong Kong Special Administrative Region.<br><br>1.2 By confirming a booking, making any payment, or participating in the Service through any means, you acknowledge that you have read, understood, and unconditionally accept all contents of these Terms, which are legally binding upon you. If you are making a booking on behalf of others, you are deemed to have obtained full authorisation from those individuals to accept these Terms on their behalf.',

    "terms.article1.title": "1: Eligibility, Health, and Safety",
    "terms.article1.content":
      "1.1 The Participant must be at least 18 years old on the activity date and present a valid Hong Kong identity card or travel document with a photograph for verification.<br><br>1.2 The Participant's weight must be 100 kilograms or less, and their height-to-weight ratio must comply with the operational specifications of the safety equipment used by the Company. The Company reserves the right to conduct final measurements on the activity day. Should the Participant exceed these safety limits, the Company has the right to unilaterally refuse participation, and all fees paid will be non-refundable.<br><br>1.3 The Participant declares they are in good physical and mental health and are fit to participate in high-altitude and high-intensity sporting activities. <strong>The Participant must confirm and warrant that they do not have any of the following conditions (including but not limited to): heart disease, hypertension, spinal or neck injuries, epilepsy, pneumothorax, pregnancy or potential pregnancy, any condition that may be aggravated by changes in air pressure or severe impact, and any mental condition that may affect their ability to understand safety instructions or assess risks.</strong> The Company strongly advises the Participant to consult a qualified medical practitioner before booking to assess their personal suitability.<br><br>1.4 The Participant must not be under the influence of alcohol, illegal drugs, or any substance that may impair consciousness, judgment, coordination, or reaction time before and during participation. The Company's staff has absolute discretion to determine the Participant's suitability for participation. If deemed unsuitable, the Company has the right to immediately cancel their participation without refund.",

    "terms.article2.title": "2: Acknowledgement of Risk and Liability Waiver",
    "terms.article2.content":
      "2.1 <strong>Inherent Risks:</strong> The Participant expressly knows, understands, and acknowledges that skydiving is an extreme sport with inherent and significant risks, which can lead to serious bodily injury, permanent disability, or death. These risks include, but are not limited to: aircraft incidents during takeoff, flight, or landing; collisions during exit from the aircraft, freefall, parachute deployment, or landing; equipment malfunction, failure, or misuse; sudden changes in weather conditions; errors in judgment or negligence by the instructor, Participant, other persons, or third parties; and landing in unintended areas or colliding with obstacles.<br><br>2.2 <strong>Waiver, Release, and Indemnity:</strong> In consideration of the Company providing the Service, the Participant, on behalf of themselves, their heirs, executors, and administrators, hereby makes the following irrevocable commitments:<br><br>(a) <strong>Fully releases, waives, and forever discharges</strong> the Company, its directors, officers, employees, contracted instructors, agents, subcontractors, and aviation service providers (collectively, the \"Released Parties\") from any and all claims, demands, causes of action, losses, liabilities, damages, costs, and expenses (including reasonable legal fees) arising from or related to the Service, <strong>regardless of whether such liability arises from any negligence, fault, breach of statutory duty, or other cause attributable to any Released Party, and regardless of whether it arises from any latent defect in the equipment, premises, or aircraft provided by the Company, except for willful misconduct or gross negligence which cannot be excluded by law.</strong><br><br>(b) <strong>Agrees to indemnify and hold harmless the Released Parties</strong> from and against any and all claims, liabilities, damages, and expenses directly or indirectly resulting from the Participant's participation in the Service, breach of any warranty or provision herein, or any act or omission by the Participant.<br><br>2.3 <strong>Limitation of Liability:</strong> To the fullest extent permitted by law, the Company's total liability to the Participant arising under or in connection with these Terms or the Service, whether in contract, tort (including negligence), or any other legal theory, shall not exceed the total service fee paid by the Participant for the specific activity.",

    "terms.article3.title": "3: Booking, Payment, Cancellation, and Rescheduling",
    "terms.article3.content":
      "3.1 A booking is confirmed only upon payment of the deposit within the period specified by the Company. The full balance must be settled before the specified deadline prior to the activity date. Failure to pay may result in cancellation of the booking by the Company, and the deposit paid will be non-refundable.<br><br>3.2 <strong>Cancellation and Rescheduling Policy:</strong><br><br>(a) <strong>Cancellation Initiated by Participant:</strong><br>(i) Cancellation notification received <strong>14 days or more</strong> before the scheduled activity date: Free rescheduling to another available date.<br>(ii) Cancellation notification received <strong>within 7 to 14 days</strong> before the scheduled activity date: <strong>50%</strong> of the fees paid will be refunded.<br>(iii) Cancellation notification received <strong>within 7 days (inclusive)</strong> before the scheduled activity date, or failure to attend on the activity day (\"No-Show\"): <strong>All fees paid will be non-refundable.</strong><br><br>(b) <strong>Cancellation/Rescheduling Initiated by the Company:</strong><br>(i) If the activity cannot proceed due to safety reasons (including but not limited to adverse weather, excessive wind speed, insufficient visibility, low cloud base) or any circumstances beyond the Company's reasonable control (e.g., aircraft malfunction, maintenance, air traffic control, government directives, pandemic restrictions, etc.), the Company will endeavour to assist the Participant in rescheduling.<br>(ii) If rescheduling is not possible or the Participant does not accept the proposed alternative date, the Company will refund the full activity fee paid by the Participant.<br>(iii) <strong>Under such circumstances, the Company shall not be liable for any incidental, consequential, or indirect losses incurred by the Participant (including but not limited to travel, accommodation, loss of holiday, etc.), and the Participant shall have no claim against the Company for the same.</strong><br><br>3.3 All cancellation or rescheduling requests must be submitted via the Company's designated contact methods (e.g., phone, email) and receive written confirmation from the Company to be effective.",

    "terms.article4.title": "4: Rules of Conduct and Customer Responsibilities on Activity Day",
    "terms.article4.content":
      "4.1 The Participant must arrive at the designated meeting point at the specified time. Late arrival may result in cancellation of the activity without refund.<br><br>4.2 The Participant must attend the mandatory safety briefing and strictly follow all instructions given by the Company's instructors and staff throughout the activity. Any behaviour endangering the safety of themselves or others will result in immediate termination of participation without refund.<br><br>4.3 The Participant must bring appropriate sportswear and closed-toe athletic shoes. The Company will provide all necessary safety equipment (including jumpsuit, helmet, goggles, etc.). The Participant must not adjust or interfere with any equipment.<br><br>4.4 The Participant is responsible for their personal belongings. The Company is not responsible for any loss or damage to personal property left at the Company's premises, vehicles, or aircraft.",

    "terms.article5.title": "5: Insurance and Personal Data",
    "terms.article5.content":
      '5.1 The Company has obtained third-party liability insurance as required by law. <strong>This insurance does not cover personal accident or injury to the Participant.</strong> The Company strongly recommends that the Participant purchases adequate personal accident insurance, which must explicitly cover "skydiving" or "high-risk sporting activities".<br><br>5.2 To comply with the Personal Data (Privacy) Ordinance, personal data collected by the Company will be used solely for processing bookings, providing the Service, safety purposes, and internal administration. Please refer to the Company\'s Privacy Policy Statement for details.',

    "terms.article6.title": "6: Use of Images",
    "terms.article6.content":
      'The Company or its designated personnel may take photographs or videos ("Images") during the activity for safety records, staff training, quality control, and promotional purposes. Unless the Participant explicitly objects in writing before the activity, they are deemed to grant the Company a perpetual, royalty-free, irrevocable, worldwide license to use and edit such Images containing the Participant\'s likeness in any media.',

    "terms.article7.title": "7: General Provisions",
    "terms.article7.content":
      "7.1 <strong>Entire Agreement:</strong> These Terms constitute the entire agreement between the parties regarding the Service and supersede all prior discussions, communications, and agreements.<br><br>7.2 <strong>Severability:</strong> If any part of these Terms is held to be invalid or unenforceable by a court of competent jurisdiction, that part shall be severed to the minimum extent necessary, and the remaining parts shall remain in full force and effect.<br><br>7.3 <strong>Right to Amend:</strong> The Company reserves the right to amend these Terms at any time. The amended Terms will be published on the Company's official website. Continued use of the Service by the Participant after such amendments constitutes acceptance of the revised Terms.<br><br>7.4 <strong>Notices:</strong> All notices shall be issued via email or announcement on the Company's website.",

    "terms.additionalNotes.title": "Additional Important Notes",
    "terms.additionalNotes.content":
      "- To ensure comprehensive protection, the Company recommends that all Participants purchase travel insurance.<br>- The Company reserves the right to modify these Terms. In case of any dispute, the Company's decision shall be final.<br>- These Terms are prepared in the Chinese language version only, which shall be the governing version.<br>- The Company reserves the final right to accept any booking.",

    // Disclaimer - English
    "disclaimer.title": "COMPREHENSIVE DISCLAIMER FOR LET'S SKYDIVE HK LIMITED",
    "disclaimer.lastUpdated": "Last Updated: 1 January 2026",
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

    // Service Pages - Common
    "servicePage.backToHome": "Back to Home",
    "servicePage.viewDetails": "View Details",
    "servicePage.viewLocations": "View Locations",
    "servicePage.howItWorks": "Step by Step",
    "servicePage.howItWorksTitle": "How It Works",
    "servicePage.pricingBadge": "Pricing by Location",
    "servicePage.pricingTitle": "Choose Your Location",
    "servicePage.pricingSubtitle": "Prices vary by dropzone. Select your preferred location to book.",
    "servicePage.faqBadge": "Common Questions",
    "servicePage.faqTitle": "Frequently Asked Questions",
    "servicePage.ctaTitle": "Ready to Jump?",
    "servicePage.ctaSubtitle": "Don't just dream about it. Make it happen today.",

    // Tandem Service Page
    "servicePage.tandem.heroTitle": "Tandem Skydive",
    "servicePage.tandem.heroSubtitle":
      "Experience the ultimate thrill of freefall with a certified instructor. No experience needed — just bring your sense of adventure!",
    "servicePage.tandem.heroTagline": "No Experience Required",
    "servicePage.tandem.step1.title": "Arrival & Check-in",
    "servicePage.tandem.step1.desc": "Arrive at the dropzone, complete paperwork, and meet your tandem instructor.",
    "servicePage.tandem.step2.title": "Ground Training",
    "servicePage.tandem.step2.desc": "A 15-minute briefing on body position, safety procedures, and what to expect.",
    "servicePage.tandem.step3.title": "Board the Plane",
    "servicePage.tandem.step3.desc": "Gear up and climb to altitude (10,000-15,000 ft). Enjoy the stunning views!",
    "servicePage.tandem.step4.title": "Freefall!",
    "servicePage.tandem.step4.desc": "60 seconds of pure adrenaline at 200 km/h, securely attached to your instructor.",
    "servicePage.tandem.step5.title": "Canopy Ride",
    "servicePage.tandem.step5.desc": "5-7 minutes of peaceful gliding under the parachute with panoramic views.",
    "servicePage.tandem.step6.title": "Landing & Celebration",
    "servicePage.tandem.step6.desc": "Smooth landing, high fives, and receive your jump certificate!",
    "servicePage.tandem.include1": "Professional tandem instructor",
    "servicePage.tandem.include2": "All safety equipment provided",
    "servicePage.tandem.include3": "Ground training session",
    "servicePage.tandem.include4": "60 seconds of freefall",
    "servicePage.tandem.include5": "5-7 minute canopy ride",
    "servicePage.tandem.include6": "Jump certificate",
    "servicePage.tandem.testimonial":
      "An absolutely incredible experience! The team made me feel safe and comfortable throughout. Best decision I've ever made!",
    "servicePage.tandem.testimonialAuthor": "Iris, Hong Kong",
    "servicePage.tandem.faq.q1": "Do I need any prior experience?",
    "servicePage.tandem.faq.a1":
      "No! Tandem skydiving is designed for first-timers. You'll be securely attached to a certified instructor who handles everything. All you need is a sense of adventure.",
    "servicePage.tandem.faq.q2": "What are the age and weight limits?",
    "servicePage.tandem.faq.a2":
      "You must be at least 18 years old. The maximum weight is 100kg. Your height-to-weight ratio must also be within the safety limits of our equipment.",
    "servicePage.tandem.faq.q3": "Can I bring my own camera?",
    "servicePage.tandem.faq.a3":
      "For safety reasons, personal cameras are not allowed during the jump. We offer professional video and photo packages — handicam and wide shot options — so you can relive every moment.",
    "servicePage.tandem.faq.q4": "What if the weather is bad?",
    "servicePage.tandem.faq.a4":
      "Safety is our top priority. If weather conditions are unsuitable, we'll reschedule your jump at no extra cost. We'll keep you informed throughout.",

    // A-Licence Service Page
    "servicePage.aff.heroTitle": "A-Licence Course",
    "servicePage.aff.heroSubtitle":
      "Learn to skydive solo through our Accelerated Freefall (AFF) program. Master the skills, complete 25 jumps, and earn your international licence.",
    "servicePage.aff.heroTagline": "Become a Licensed Skydiver",
    "servicePage.aff.step1.title": "Enroll & Register",
    "servicePage.aff.step1.desc": "Sign up for the AFF program and complete medical & safety forms.",
    "servicePage.aff.step2.title": "Ground School",
    "servicePage.aff.step2.desc":
      "Intensive classroom training covering aerodynamics, emergency procedures, and equipment.",
    "servicePage.aff.step3.title": "AFF Levels 1-3",
    "servicePage.aff.step3.desc":
      "Jump with two instructors who guide you through basic freefall skills and stability.",
    "servicePage.aff.step4.title": "AFF Levels 4-7",
    "servicePage.aff.step4.desc": "Progress to one-instructor jumps. Master turns, tracking, and deployment.",
    "servicePage.aff.step5.title": "Solo Jumps (8-25)",
    "servicePage.aff.step5.desc": "Complete your remaining jumps independently, perfecting your skills.",
    "servicePage.aff.step6.title": "Get Licensed! 🎓",
    "servicePage.aff.step6.desc": "Pass your final assessment and receive your internationally recognized A-Licence.",
    "servicePage.aff.curriculumBadge": "TRAINING CURRICULUM",
    "servicePage.aff.curriculumTitle": "Complete A-Licence Training Path",
    "servicePage.aff.curriculumDesc":
      "From ground school to your final assessment — here's the full progression to earning your USPA A-Licence.",
    "servicePage.aff.curriculumAlt":
      "A-Licence skydiving training curriculum overview showing all 25 jumps progression",
    "servicePage.aff.include1": "25 jumps (as required for A-Licence)",
    "servicePage.aff.include2": "Ground school training",
    "servicePage.aff.include3": "All equipment provided",
    "servicePage.aff.include4": "Personal instructor guidance",
    "servicePage.aff.include5": "Free iFly indoor skydiving session",
    "servicePage.aff.testimonial":
      "The AFF program was life-changing. The instructors were incredibly patient and professional. Now I'm a licensed skydiver jumping every weekend!",
    "servicePage.aff.testimonialAuthor": "Mark R., Australia",
    "servicePage.aff.faq.q1": "How long does the A-Licence course take?",
    "servicePage.aff.faq.a1":
      "Typically 7-14 days depending on weather and your progression. Some students complete it in as little as a week during ideal conditions.",
    "servicePage.aff.faq.q2": "What are the prerequisites?",
    "servicePage.aff.faq.a2":
      "You must be at least 18, weigh under 100kg, and be in good physical health. No prior skydiving experience is needed — the AFF course starts from scratch.",
    "servicePage.aff.faq.q3": "Is the A-Licence internationally recognized?",
    "servicePage.aff.faq.a3":
      "Yes! The USPA A-Licence is recognized worldwide. You can jump at dropzones across the globe after earning your licence.",
    "servicePage.aff.faq.q4": "What happens after I get my A-Licence?",
    "servicePage.aff.faq.a4":
      "You can jump solo at any dropzone worldwide! Many graduates continue to B, C, and D licences, learn formation skydiving, wingsuit flying, or become instructors.",
  },
  "zh-TW": {
    // Navigation & Common
    "nav.services": "服務項目",
    "nav.locations": "跳傘基地",
    "nav.about": "關於我們",
    "nav.booking": "立即體驗",
    "nav.contact": "聯絡我們",
    "common.learnMore": "了解更多",
    "common.bookNow": "立即體驗",
    "common.comingSoon": "即將推出",
    "common.loading": "載入中...",

    // Hero Section
    "hero.badge": "香港首選跳傘體驗",
    "hero.title": "一起跳傘吧",
    "hero.experienceThe": "體驗",
    "hero.ultimateThrill": "極致飛翔",
    "hero.subtitle":
      "我們提供專業雙人跳傘體驗、AFF（Accelerated Freefall）加速自由落體認證課程，並可為企業團體、親友聚會等量身規劃跳傘活動專案。\n\n服務範圍遍及亞洲各地景觀絕佳的跳傘基地，讓您在專業安全保障下，俯瞰壯麗山河，成就非凡時刻。",
    "hero.cta.book": "立即體驗",
    "hero.cta.explore": "探索服務",

    // Locations Section
    "locations.badge": "我們的跳傘場",
    "locations.title": "跳傘基地",
    "locations.subtitle": "從我們位於泰國和中國的頂級跳傘場中選擇，每個場地都提供獨特的風景和世界級設施。",
    "locations.thailand": "🇹🇭 泰國",
    "locations.china": "🇨🇳 中國",
    "locations.noLocations": "{country}暫時沒有可用的跳傘地點。",
    "locations.bookHere": "立即體驗",
    "locations.tandem": "雙人跳傘",
    "locations.aff": "AFF課程",
    "locations.groups": "團體活動",
    "locations.map.title": "探索我們的跳傘基地",
    "locations.map.subtitle": "選擇一個地點在地圖上查看",
    "locations.map.openGoogleMaps": "在 Google 地圖中開啟",
    "locations.viewDetails": "查看詳情",
    "locations.bookHereBtn": "立即體驗",

    // Location Detail Page
    "locationDetail.notFound": "找不到該地點",
    "locationDetail.backToHome": "返回首頁",
    "locationDetail.highlights": "特色亮點",
    "locationDetail.fromAirport": "距離機場",
    "locationDetail.fromCity": "距離市區",
    "locationDetail.transportation": "交通方式",
    "locationDetail.photos": "相片集",
    "locationDetail.servicesHere": "此地點服務",
    "locationDetail.map": "地圖",
    "locationDetail.readyToJump": "準備好起飛了嗎？",
    "locationDetail.bookHere": "立即體驗",

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
    "booking.subtitle": "選擇您有興趣的地點和服務，開始您的跳傘之旅。",
    "booking.step1": "選擇地點",
    "booking.step2": "選擇服務",
    "booking.step3": "您的資料",
    "booking.step4": "預覽",
    "booking.step5": "付款",
    "booking.paymentTitle": "支付訂金",
    "booking.paymentSubtitle": "需支付 HKD $500 訂金以確認您的預約",
    "booking.depositAmount": "訂金金額",
    "booking.paymentProcessing": "正在處理付款...",
    "booking.paymentSuccess": "付款成功！",
    "booking.paymentFailed": "付款失敗，請重試。",
    "booking.paymentError": "付款處理過程中發生錯誤。",
    "booking.depositNote": "餘額將於活動當天收取。",
    "booking.mobileRedirectNotice": "您將被重新導向至應用程式完成付款。",
    "booking.selectLocation": "選擇地點",
    "booking.selectService": "選擇服務",
    "booking.form.name": "全名",
    "booking.form.email": "電子郵件",
    "booking.form.phone": "電話號碼",
    "booking.form.date": "日期",
    "booking.form.notes": "備註",
    "booking.form.submit": "提交預約申請",
    "booking.filter.showing": "顯示提供A級執照培訓的地點",
    "booking.whereJump": "您想在哪裡跳傘？",
    "booking.selectDropzone": "選擇您有興趣的跳傘基地",
    "booking.showAll": "顯示全部",
    "booking.chooseService": "選擇您的體驗",
    "booking.selectPackage": "選擇您想選的套餐",
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
    "booking.selectDateDetails": "選擇您的日期並填寫您的資料",
    "booking.preferredDate": "日期",
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
    "booking.depositReminder": "確認預約需支付 HKD $500 訂金。",
    "booking.depositReminderNote": "點擊「下一步」後，將進入付款頁面支付訂金。餘額將於活動當天收取。",
    "booking.termsDisclaimer": "點擊提交即表示您同意我們的預約條款。我們將在24小時內與您聯繫確認可用性並完成預約。",
    "booking.fixErrors": "請先修正驗證錯誤再提交",
    "booking.submitError": "預約提交失敗，請重試。",
    "booking.submitSuccess": "預約提交成功！",

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

    // Credits
    "credit.title": "我的積分",
    "credit.balance": "積分餘額",
    "credit.history": "交易記錄",
    "credit.noTransactions": "尚無交易記錄",
    "credit.signup_bonus": "註冊獎勵",
    "credit.admin_adjustment": "管理員調整",
    "credit.redemption": "兌換使用",
    "credit.refund": "退款",
    "credit.promotion": "推廣優惠",
    "credit.referral_bonus": "推薦獎勵",
    "credit.pending": "待審核",
    "credit.approved": "已批准",
    "credit.rejected": "已拒絕",
    "credit.pendingBalance": "待審核積分",

    // Referral
    "referral.title": "我的推薦碼",
    "referral.description": "與朋友分享您的推薦碼。當他們預約時，您將獲得 $100 積分（待管理員批准）。",
    "referral.copied": "推薦碼已複製！",
    "referral.label": "推薦碼（選填）",
    "referral.placeholder": "輸入推薦碼",

    // Admin
    "admin.title": "管理員 - 積分管理",
    "admin.pendingReferrals": "待審核推薦",
    "admin.approve": "批准",
    "admin.reject": "拒絕",
    "admin.noPending": "沒有待審核的推薦積分",

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
    "auth.passwordMinLength": "密碼必須至少8個字元",
    "auth.passwordLowercase": "密碼必須包含小寫字母",
    "auth.passwordUppercase": "密碼必須包含大寫字母",
    "auth.passwordNumber": "密碼必須包含數字",
    "auth.criteria.length": "至少8個字元",
    "auth.criteria.lowercase": "一個小寫字母",
    "auth.criteria.uppercase": "一個大寫字母",
    "auth.criteria.number": "一個數字",
    "auth.forgotPassword": "忘記密碼？",
    "auth.resetPassword": "重設密碼",
    "auth.resetDescription": "輸入您的電子郵件地址，我們將向您發送重設密碼的連結。",
    "auth.sendResetLink": "發送重設連結",
    "auth.resetEmailSent": "重設密碼郵件已發送！請查看您的收件箱。",
    "auth.resetFailed": "發送重設郵件失敗",
    "auth.enterEmail": "請輸入您的電子郵件地址",

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
    "gallery.photos": "照片",
    "gallery.videos": "影片",
    "gallery.dailyVideos": "每日影片",
    "gallery.affVideos": "AFF課程影片",
    "gallery.noDailyVideos": "暫時沒有每日影片",
    "gallery.noAffVideos": "暫時沒有AFF課程影片",
    "gallery.refresh": "重新整理",
    "gallery.refreshSuccess": "相片集已重新整理",
    "gallery.refreshError": "重新整理失敗",
    "gallery.loadError": "無法載入圖片",
    "nav.gallery": "相片集",
    "nav.faq": "常見問題",
    "nav.promotions": "最新優惠",

    // Promotions Page
    "promo.badge": "限時優惠",
    "promo.title": "最新優惠",
    "promo.subtitle": "把握我們的最新限時優惠，節省您的跳傘冒險費用。",
    "promo.backToHome": "返回首頁",
    "promo.active": "進行中",
    "promo.termsTitle": "條款及細則",
    "promo.bookNow": "立即體驗",
    "promo.claimCoupon": "領取優惠券",
    "promo.perPerson": "每人",
    "promo.group2.title": "孖住跳 — 兩個一齊跳更抵！",
    "promo.group2.desc": "約埋朋友一齊跳，二人同行即享折扣！",
    "promo.group2.details": "2人同行預約同一場次，每人即減 $100。",
    "promo.group2.terms":
      "兩位參加者必須預約同一地點的同一場次。優惠僅適用於雙人跳傘套餐，不能與其他優惠同時使用，名額有限，先到先得。",
    "promo.homeBanner": "🔥 孖住跳：2人同行，每人減 $100！",
    "promo.homeBannerCta": "查看詳情",
    "promo.off": "優惠",
    "promo.student.title": "學生優惠",
    "promo.student.desc": "出示有效學生證，即享跳傘冒險折扣！",
    "promo.student.details": "憑有效學生證預約任何雙人跳傘套餐，即減 $100。",
    "promo.student.terms": "須於報到時出示有效學生證。僅適用於雙人跳傘套餐，不可與其他優惠同時使用，每人限用一次。",
    "promo.birthday.title": "生日特惠",
    "promo.birthday.desc": "在生日月份來一次難忘的跳傘，享受專屬優惠！",
    "promo.birthday.details": "於生日當月跳傘，任何雙人跳傘套餐即減 $100。",
    "promo.birthday.terms":
      "須於生日當月內完成跳傘，需提供出生日期證明。僅適用於雙人跳傘套餐，不可與其他優惠同時使用。",
    "promo.earlybird.title": "早鳥優惠",
    "promo.earlybird.desc": "提早計劃，鎖定特惠價格！",
    "promo.earlybird.details": "提前 90 天以上預約，任何跳傘套餐享 9 折優惠。",
    "promo.earlybird.terms":
      "須於跳傘日期前至少 90 天完成預約。折扣於結帳時適用，不可與其他優惠同時使用，視供應情況而定。",
    "promo.repeat.title": "回頭客獎賞",
    "promo.repeat.desc": "曾經與我們一起跳過？回來再跳更優惠！",
    "promo.repeat.details": "舊客戶下次跳傘即減 $150。",
    "promo.repeat.terms": "須曾於 Let's Skydive HK 完成預約。折扣經核實後適用，不可與其他優惠同時使用。",
    "promo.code": "優惠碼",
    "promo.codeCopied": "優惠碼已複製！",
    "promo.copyCode": "複製",
    "booking.dob.label": "出生日期",
    "booking.dob.placeholder": "選擇出生日期",
    "booking.dob.hint": "用於生日優惠及年齡驗證。",
    "booking.promo.label": "套用優惠（可選）",
    "booking.promo.hint": "選擇適用的優惠，須符合條款及細則。",

    // Legal Pages
    "legal.backToHome": "返回首頁",

    // Privacy Policy - Traditional Chinese
    "privacy.title": "Let's Skydive HK Limited 個人資料（私隱）政策聲明",
    "privacy.lastUpdated": "最後更新",
    "privacy.introduction":
      "Let's Skydive HK Limited（下稱「本公司」、「我們」）致力保障您的個人資料私隱。本私隱政策聲明闡述我們如何根據香港法例第486章《個人資料（私隱）條例》（下稱「條例」）收集、使用、儲存、傳輸及處理您的個人資料。請細閱本政策，以了解我們處理您個人資料的常規做法。",
    "privacy.updateNotice":
      "我們的政策及措施旨在確保在業務營運過程中處理個人資料（定義見下文）時，符合條例的規定。我們可能不時修訂本政策，並於本網站公布更新版本。若您於修訂後繼續使用我們的服務或與我們維持關係，即表示您接受經修訂的政策。",

    "privacy.section1.title": "1. 收集的個人資料種類",
    "privacy.section1.content":
      "我們可能透過網站、電話、電郵、社交媒體、流動應用程式或親臨辦事處等渠道，向您收集為提供服務所必需的個人身份識別資料（「個人資料」），包括但不限於：",
    "privacy.section1.list":
      "• 聯絡資料（如姓名、電話號碼、電郵地址、通訊地址）；<br>• 身份證明文件資料（如護照或身份證號碼、出生日期）；<br>• 體格健康及醫療相關資料（如體重、過往病史、傷患記錄，以評估是否適合參與跳傘活動）；<br>• 付款資料（如信用卡/扣賬卡號碼、持卡人姓名、有效期及賬單地址）；<br>• 活動相關資料（如預訂的跳傘日期、地點、套餐類型、錄影及照片偏好、緊急聯絡人資料）；<br>• 參與本公司舉辦的推廣活動、比賽或問卷調查時所提供的資料；及<br>• 通訊記錄（為確保服務質素及培訓，我們可能會記錄與客戶服務相關的通話或電子訊息）。",
    "privacy.section1.note":
      "若您選擇不提供必要資料，我們可能無法為您提供跳傘活動或相關服務。如您未滿18歲，必須事先徵得家長或監護人同意方可提供個人資料。",

    "privacy.section2.title": "2. 收集及使用個人資料的目的",
    "privacy.section2.content": "我們會將您的個人資料用於以下與我們業務及服務相關之目的：",
    "privacy.section2.list":
      "• 處理、確認及管理您的跳傘活動預訂、報名及付款；<br>• 評估您參與跳傘活動的體格適合性及安全風險；<br>• 就您的預訂、查詢、意見或投訴與您聯絡及跟進；<br>• 提供活動前簡報、安全指引及相關服務安排；<br>• 處理及製作跳傘活動的相片、影片紀錄及相關產品；<br>• 管理會員帳戶（如適用）及提供相關禮遇；<br>• 進行客戶服務質素監控、員工培訓及處理索償事宜；<br>• 進行市場研究、分析及服務改善，以提升客戶體驗；<br>• 在獲得您同意的情况下，向您發送關於本公司最新優惠、推廣活動及服務資訊的直接營銷訊息；<br>• 履行法律或規管義務，或回應執法機構、政府部門依法提出的要求；<br>• 保障本公司、客戶或公眾的權利、財產或安全，包括預防欺詐或犯罪活動；及<br>• 與上述任何目的直接相關的其他用途。",
    "privacy.section2.note": "未經您的事先同意，我們不會將您的個人資料用於上述列明範圍之外的其他目的。",

    "privacy.section3.title": "3. 個人資料的披露及轉移",
    "privacy.section3.content": "為達成第2條所述之目的，我們可能在必要情況下將您的個人資料轉交予以下類別之第三方：",
    "privacy.section3.list":
      "• 提供跳傘活動協作服務的第三方供應商（如跳傘教練、飛機租賃公司、攝影團隊）；<br>• 協助處理付款的金融機構及支付服務供應商；<br>• 為我們提供業務支援服務的承辦商（如資訊科技系統供應商、客戶服務中心、郵遞服務公司）；<br>• 我們的專業顧問（如律師、保險公司、審計師）；<br>• 在法律要求或授權下，有權索取資料的政府部門、監管機構或執法機關；及<br>• 與我們有合作關係並為您提供相關優惠或服務的商業夥伴（僅在獲得您同意的情況下）。",
    "privacy.section3.note":
      "部分第三方可能位於香港以外的地方。在轉移您的個人資料時，我們會採取合理措施確保資料獲得足夠的保護，並遵守條例的規定。",

    "privacy.section4.title": "4. 個人資料的保護及保存",
    "privacy.section4.content":
      "我們採取符合行業標準的合理技術性及組織性措施（包括加密技術、防火牆及存取權限控制），以保護您提供的個人資料免遭未經授權的查閱、使用、披露、更改或破壞。",
    "privacy.section4.retention":
      "我們只會將您的個人資料保存至達致收集目的所需之期限，或為遵守法律義務、解決爭議及執行協議所需之合理期限。其後，我們會以安全的方式刪除或銷毀該等資料。",

    "privacy.section5.title": "5. Cookies及類似技術",
    "privacy.section5.content":
      "我們的網站可能使用Cookies及類似技術以增強您的瀏覽體驗、分析網站流量及提供個人化內容。您可透過瀏覽器設定管理或禁用Cookies，但此舉可能會影響網站的部分功能。",

    "privacy.section6.title": "6. 第三方網站連結",
    "privacy.section6.content":
      "我們的網站或通訊可能包含第三方網站的連結。該等第三方網站有其獨立的私隱政策，我們對其內容及政策概不負責。建議您在使用該等網站前查閱其私隱政策。",

    "privacy.section7.title": "7. 您的權利",
    "privacy.section7.content": "根據條例，您有權：",
    "privacy.section7.list":
      "• 查詢我們是否持有您的個人資料及要求查閱該等資料；<br>• 要求更正不準確的個人資料；<br>• 查明我們關於個人資料的政策和做法，並獲知我們持有的個人資料種類；<br>• 就我們使用您的個人資料作直接營銷提出反對；及<br>• 要求停止使用您的個人資料，惟須符合條例規定的條件。",
    "privacy.section7.note": "有關行使上述權利或對本政策有任何查詢，請聯絡我們的私隱主任（聯絡方式見第9條）。",

    "privacy.section8.title": "8. 直接營銷",
    "privacy.section8.content":
      "我們只有在獲得您明確同意（表示不反對）的情况下，才會使用您的個人資料（如姓名及聯絡方式）向您發送關於本公司服務及推廣活動的直接營銷資訊。您可隨時透過我們在營銷訊息中提供的取消訂閱方式，或聯絡我們的私隱主任，免費選擇停止接收此類訊息。",

    "privacy.section9.title": "9. 聯絡我們",
    "privacy.section9.content":
      "如您對本私隱政策、我們處理個人資料的方式，或欲行使您的個人資料權利有任何疑問、要求或投訴，請透過以下方式聯絡我們的私隱主任：",
    "privacy.section9.email": "電郵：letskydivehk@gmail.com",
    "privacy.section9.phone": "電話：(852) 69391570",

    "privacy.finalNote":
      "（註：為免生疑問，本政策之最新更新日期為 **2026年1月1日**。）<br><br>**（本私隱政策聲明以中文版本為準。）**",

    // Terms of Service - Traditional Chinese
    "terms.title": "條款及細則",
    "terms.lastUpdated": "最後修改時間：2026年1月30日",

    "terms.preamble.title": "前言",
    "terms.preamble.content":
      "1.1 本《條款及細則》（下稱「本條款」）構成閣下（下稱「參加者」或「客戶」）與Let's Skydive HK Limited（下稱「本公司」或「我們」）就提供跳傘活動服務（下稱「本服務」）所訂立之法律協議。本條款受香港特別行政區法律管轄及解釋。<br><br>1.2 閣下透過任何途徑確認預訂、支付款項或參與本服務，即表示閣下已閱讀、理解並無條件接受本條款之全部內容，對閣下具有法律約束力。若閣下為他人代為預訂，即被視為已獲該等人士之充分授權代表其同意受本條款約束。",

    "terms.article1.title": "第一條：資格、健康與安全",
    "terms.article1.content":
      "1.1 參加者必須於活動當日年滿18歲，並出示附有相片之有效香港身份證或旅遊證件以供核實。<br><br>1.2 參加者之體重必須為100公斤或以下，且身高體重比例須符合本公司所使用安全裝備之操作規格。本公司保留於活動當日進行最終測量之權利。若參加者超出此安全限制，本公司有權單方面拒絕其參與，已繳付之所有費用將不予退還。<br><br>1.3 參加者聲明其身心健康狀況良好，適宜參與高空及高強度之體育活動。<strong>參加者必須確認並保證其並無以下任何狀況（包括但不限於）：心臟病、高血壓、脊椎或頸部損傷、癲癇、氣胸、懷孕或可能懷孕、任何可能因氣壓變化或劇烈衝擊而惡化之病症，以及任何精神狀況以致影響其理解安全指示或判斷風險之能力。</strong> 本公司強烈建議參加者在預訂前諮詢合資格醫生以評估自身狀況。<br><br>1.4 參加者在參與活動前及期間，不得受酒精、非法藥物或任何可能損害神智、判斷力、協調能力或反應能力之藥物影響。本公司職員有絕對酌情權判斷參加者是否適合參與，若判斷為不適合，有權即時取消其參與資格而不作退款。",

    "terms.article2.title": "第二條：風險確認與責任豁免",
    "terms.article2.content":
      "2.1 <strong>固有風險之確認：</strong> 參加者明確知悉、理解並承認，跳傘乃一項具有固有及顯著風險之極限運動，此等風險可導致嚴重身體受傷、永久傷殘、甚或死亡。此等風險包括但不限於：起飛、飛行或降落時之航空器事故；跳出航空器、自由墜落、開傘或著陸過程中發生之碰撞；裝備故障、失靈或不當使用；天氣狀況突然變化；教練、參加者、其他人士或第三方之錯誤判斷或疏忽；以及著陸於非預定區域或與障礙物碰撞。<br><br>2.2 <strong>豁免、放棄索償及彌償：</strong> 為換取本公司提供本服務，參加者在此代表其本人、其繼承人、遺囑執行人及遺產管理人，作出以下不可撤銷之承諾：<br><br>(a) <strong>完全免除、放棄及永久解除</strong> 本公司、其董事、高級職員、僱員、合約教練、代理人、分包商及航空服務供應商（統稱「被豁免方」）因本服務引致或與之相關之任何及所有索償、要求、訴訟因由、損失、法律責任、損害賠償、費用及開支（包括合理律師費），<strong>無論該等責任因被豁免方之任何疏忽、過失、違反法定責任或其他原因而產生，亦不論是否因本公司所提供之設備、場所或航空器之任何潛在缺陷而引致，惟法律明令禁止豁免之故意失當行為或重大過失除外。</strong><br><br>(b) <strong>同意彌償並使被豁免方免受損害</strong>，保障其免受因參加者參與本服務、違反本條款任何保證或規定、或其任何作為或不作為而直接或間接導致之任何及所有索償、法律責任、損害及開支。<br><br>2.3 <strong>責任上限：</strong> 在法律允許之最大範圍內，本公司因本條款或本服務而對參加者所負之全部責任，不論於合約法、侵權法（包括疏忽）或其他法律原則下產生，其總額均不得超過參加者就該次活動向本公司支付之服務費用。",

    "terms.article3.title": "第三條：預訂、付款、取消及改期",
    "terms.article3.content":
      "3.1 預訂必須於本公司指定之期限內支付訂金方告確認。餘款須於活動日前指定期限內全數繳清。逾期未付，本公司有權取消預訂，已付訂金將不予退還。<br><br>3.2 <strong>取消及改期政策：</strong><br><br>(a) <strong>由參加者提出取消：</strong><br>• 於預定活動日 <strong>14天或之前</strong> 通知取消，可免費改期至另一可供預訂之日期。<br>• 於預定活動日 <strong>前7至14天內</strong> 通知取消，可獲退還已支付費用之 <strong>50%</strong>。<br>• 於預定活動日 <strong>前7天內（含第7天）</strong> 通知取消，或於活動當日未能出席（「No-Show」），<strong>所有已支付費用將概不退還</strong>。<br><br>(b) <strong>由本公司提出取消/改期：</strong><br>• 若因安全理由（包括但不限於惡劣天氣、風速過高、能見度不足、雲層過低）或任何超出本公司合理控制範圍之情況（如航空器故障、維修、空中交通管制、政府指令、疫症限制等）導致活動無法進行，本公司將盡力協助參加者改期。<br>• 若無法改期或參加者不接受建議之改期日期，本公司將全數退還參加者已支付之活動費用。<br>• <strong>在此等情況下，本公司對參加者因此產生之任何附帶、衍生或間接損失（包括但不限於交通、住宿、假期損失等）概不負責，參加者亦不得就此提出任何索償。</strong><br><br>3.3 所有取消或改期要求必須經由本公司指定之聯絡方式（如電話、電郵）提出並獲得書面確認，方為有效。",

    "terms.article4.title": "第四條：活動當日守則與客戶責任",
    "terms.article4.content":
      "4.1 參加者必須於指定時間到達指定集合地點。遲到者可能導致活動被取消，且不獲退款。<br><br>4.2 參加者必須參與強制性的安全簡報，並於活動全程嚴格遵守本公司教練及工作人員之一切指示。任何危害自身或他人安全之行為，將導致即時終止參與資格而不作退款。<br><br>4.3 參加者需自備合適之運動服裝及包覆腳踝之運動鞋。本公司將提供所有必要之安全裝備（包括跳傘服、頭盔、護目鏡等）。參加者不得擅自調校或干預任何裝備。<br><br>4.4 參加者須自行保管其個人物品。本公司對任何置於本公司場所、車輛或航空器內之財物之損失或損壞概不負責。",

    "terms.article5.title": "第五條：保險與個人資料",
    "terms.article5.content":
      "5.1 本公司已購買法律要求之第三者責任保險。<strong>此保險並不涵蓋參加者之人身意外傷害。</strong> 本公司強烈建議參加者自行購買足額之個人意外保險，且該保險須明確承保「跳傘」或「高危體育活動」。<br><br>5.2 為遵守《個人資料（私隱）條例》，本公司收集之個人資料將僅用於處理預訂、提供服務、安全及內部行政之用。詳情請參閱本公司之私隱政策聲明。",

    "terms.article6.title": "第六條：影像使用",
    "terms.article6.content":
      "本公司或其指定人員可能於活動期間拍攝照片或影片（「影像」）作安全記錄、員工培訓、品質控制及宣傳推廣之用。除非參加者於活動前以書面明確反對，否則即被視為授予本公司一項永久、免版稅、不可撤銷的全球性許可，允許本公司於任何媒體使用及編輯該等包含參加者肖像之影像。",

    "terms.article7.title": "第七條：一般條款",
    "terms.article7.content":
      "7.1 <strong>完整性：</strong> 本條款構成雙方就本服務之完整協議，取代所有先前之討論、通訊及協議。<br><br>7.2 <strong>可分割性：</strong> 若本條款任何部分被有管轄權之法院裁定為無效或不可執行，該部分應在最小必要範圍內被分割，其餘部分仍保持完全效力。<br><br>7.3 <strong>修改權：</strong> 本公司保留隨時修訂本條款之權利。修訂後之條款將公佈於本公司官方網站。參加者於修訂後繼續使用服務，即表示接受經修訂之條款。<br><br>7.4 <strong>通知：</strong> 所有通知應以電郵或本公司網站公告方式發出。",

    "terms.additionalNotes.title": "額外注意事項",
    "terms.additionalNotes.content":
      "• 為使各參加者獲得完善的保障，本公司建議參加者必須購買旅遊保險。<br>• 本公司保留權利修改本細則責任條款。如有任何爭議，本公司保留最終決定權。<br>• 本細則責任條款只備有中文版本，一概以中文版本為準。<br>• 本公司保留接受報名與否之最終權利。",

    // Disclaimer - Traditional Chinese
    "disclaimer.title": "Let's Skydive HK Limited 免責聲明（繁體中文版）",
    "disclaimer.lastUpdated": "最後更新日期：2026年1月1日",
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

    // Service Pages - Common
    "servicePage.backToHome": "返回首頁",
    "servicePage.viewDetails": "查看詳情",
    "servicePage.viewLocations": "查看地點",
    "servicePage.howItWorks": "流程說明",
    "servicePage.howItWorksTitle": "體驗流程",
    "servicePage.pricingBadge": "各地點價格",
    "servicePage.pricingTitle": "選擇您的地點",
    "servicePage.pricingSubtitle": "價格因跳傘場而異。選擇您的首選地點進行預約。",
    "servicePage.faqBadge": "常見問題",
    "servicePage.faqTitle": "常見問題",
    "servicePage.ctaTitle": "準備好起跳了嗎？",
    "servicePage.ctaSubtitle": "別只是想想而已，今天就行動吧。",

    // Tandem Service Page
    "servicePage.tandem.heroTitle": "雙人跳傘",
    "servicePage.tandem.heroSubtitle": "與認證教練一同體驗自由落體的極致快感。無需任何經驗——帶上你的冒險精神就好！",
    "servicePage.tandem.heroTagline": "零經驗即可體驗",
    "servicePage.tandem.step1.title": "抵達 & 報到",
    "servicePage.tandem.step1.desc": "抵達跳傘場，完成文件手續，認識您的雙人跳傘教練。",
    "servicePage.tandem.step2.title": "地面訓練",
    "servicePage.tandem.step2.desc": "15分鐘的身體姿勢、安全程序及注意事項簡報。",
    "servicePage.tandem.step3.title": "登機升空",
    "servicePage.tandem.step3.desc": "穿戴裝備，爬升至10,000-15,000呎高空。盡享壯麗景色！",
    "servicePage.tandem.step4.title": "自由落體！",
    "servicePage.tandem.step4.desc": "60秒純粹腎上腺素飆升，以時速200公里與教練安全綁定下墜。",
    "servicePage.tandem.step5.title": "傘下滑翔",
    "servicePage.tandem.step5.desc": "5-7分鐘在降落傘下寧靜滑翔，享受360度全景視野。",
    "servicePage.tandem.step6.title": "著陸 & 慶祝",
    "servicePage.tandem.step6.desc": "平穩降落，擊掌慶祝，領取您的跳傘證書！",
    "servicePage.tandem.include1": "專業雙人跳傘教練",
    "servicePage.tandem.include2": "提供全套安全裝備",
    "servicePage.tandem.include3": "地面訓練課程",
    "servicePage.tandem.include4": "60秒自由落體",
    "servicePage.tandem.include5": "5-7分鐘傘下滑翔",
    "servicePage.tandem.include6": "跳傘證書",
    "servicePage.tandem.testimonial": "絕對難以置信的體驗！團隊讓我全程感到安全和舒適。這是我做過最棒的決定！",
    "servicePage.tandem.testimonialAuthor": "Iris，香港",
    "servicePage.tandem.faq.q1": "需要任何經驗嗎？",
    "servicePage.tandem.faq.a1":
      "完全不需要！雙人跳傘專為初次體驗者設計。您將與認證教練安全綁定，教練會處理一切。您只需帶上冒險精神就好。",
    "servicePage.tandem.faq.q2": "年齡和體重有限制嗎？",
    "servicePage.tandem.faq.a2": "您必須年滿18歲。最大體重限制為100公斤。您的身高體重比也必須符合我們設備的安全範圍。",
    "servicePage.tandem.faq.q3": "可以自己帶相機嗎？",
    "servicePage.tandem.faq.a3":
      "基於安全考量，跳傘過程中不允許攜帶個人相機。我們提供專業攝影攝錄套餐——包括近鏡和全景拍攝——讓您重溫每個精彩瞬間。",
    "servicePage.tandem.faq.q4": "天氣不好怎麼辦？",
    "servicePage.tandem.faq.a4": "安全是我們的首要考量。若天氣條件不適合，我們將免費為您改期。我們會全程與您保持聯繫。",

    // A-Licence Service Page
    "servicePage.aff.heroTitle": "A級執照課程",
    "servicePage.aff.heroSubtitle":
      "透過我們的加速自由落體（AFF）課程學習獨立跳傘。掌握技能，完成25次跳傘，獲得國際執照。",
    "servicePage.aff.heroTagline": "成為持照跳傘員",
    "servicePage.aff.step1.title": "報名 & 註冊",
    "servicePage.aff.step1.desc": "報名AFF課程，完成醫療及安全表格。",
    "servicePage.aff.step2.title": "地面學校",
    "servicePage.aff.step2.desc": "密集課堂培訓，涵蓋空氣動力學、緊急程序及裝備知識。",
    "servicePage.aff.step3.title": "AFF 第1-3級",
    "servicePage.aff.step3.desc": "與兩名教練一起跳傘，學習基本自由落體技能和穩定性。",
    "servicePage.aff.step4.title": "AFF 第4-7級",
    "servicePage.aff.step4.desc": "進階到單教練跳傘。掌握轉彎、追蹤和開傘技術。",
    "servicePage.aff.step5.title": "獨立跳傘 (8-25)",
    "servicePage.aff.step5.desc": "獨立完成剩餘跳傘次數，精進您的技術。",
    "servicePage.aff.step6.title": "取得執照！🎓",
    "servicePage.aff.step6.desc": "通過最終評估，獲得國際認可的A級執照。",
    "servicePage.aff.curriculumBadge": "訓練課程",
    "servicePage.aff.curriculumTitle": "跳傘訓練課程全攻略",
    "servicePage.aff.curriculumDesc": "從地面訓練到最終考核 — 完整的USPA A級執照訓練流程一覽。",
    "servicePage.aff.curriculumAlt": "A級執照跳傘訓練課程全攻略，展示25跳完整進階流程",
    "servicePage.aff.include1": "25次跳傘（A級執照要求）",
    "servicePage.aff.include2": "地面學校培訓",
    "servicePage.aff.include3": "提供全部裝備",
    "servicePage.aff.include4": "個人教練指導",
    "servicePage.aff.include5": "免費iFly室內跳傘體驗",
    "servicePage.aff.testimonial": "AFF課程改變了我的人生。教練非常耐心且專業。現在我是持照跳傘員，每個週末都在跳傘！",
    "servicePage.aff.testimonialAuthor": "Mark R.，澳洲",
    "servicePage.aff.faq.q1": "A級執照課程需要多長時間？",
    "servicePage.aff.faq.a1": "通常需要7-14天，取決於天氣和您的進度。在理想條件下，有些學員只需一周即可完成。",
    "servicePage.aff.faq.q2": "有什麼先決條件？",
    "servicePage.aff.faq.a2": "您必須年滿18歲，體重100公斤以下，身體健康。無需任何跳傘經驗——AFF課程從零開始教學。",
    "servicePage.aff.faq.q3": "A級執照是國際認可的嗎？",
    "servicePage.aff.faq.a3": "是的！USPA A級執照獲全球認可。取得執照後，您可以在世界各地的跳傘場自由跳傘。",
    "servicePage.aff.faq.q4": "取得A級執照後可以做什麼？",
    "servicePage.aff.faq.a4":
      "您可以在全球任何跳傘場獨立跳傘！許多畢業學員會繼續考取B、C、D級執照，學習編隊跳傘、翼裝飛行，或成為教練。",
  },
  "zh-CN": {
    // Navigation & Common
    "nav.services": "服务项目",
    "nav.locations": "跳伞基地",
    "nav.about": "关于我们",
    "nav.booking": "立即体验",
    "nav.contact": "联系我们",
    "common.learnMore": "了解更多",
    "common.bookNow": "立即体验",
    "common.comingSoon": "即将推出",
    "common.loading": "加载中...",

    // Hero Section
    "hero.badge": "香港首选跳伞体验",
    "hero.title": "一起跳伞吧",
    "hero.experienceThe": "体验",
    "hero.ultimateThrill": "极致飞翔",
    "hero.subtitle":
      "我们提供专业双人跳伞体验、AFF（Accelerated Freefall）加速自由落体认证课程，并可为企业团体、亲友聚会等量身规划跳伞活动方案。\n\n服务范围遍及亚洲各地景观绝佳的跳伞基地，让您在专业安全保障下，俯瞰壮丽山河，成就非凡时刻。",
    "hero.cta.book": "立即体验",
    "hero.cta.explore": "探索服务",

    // Locations Section
    "locations.badge": "我们的跳伞场",
    "locations.title": "跳伞基地",
    "locations.subtitle": "从我们位于泰国和中国的顶级跳伞场中选择，每个场地都提供独特的风景和世界级设施。",
    "locations.thailand": "🇹🇭 泰国",
    "locations.china": "🇨🇳 中国",
    "locations.noLocations": "{country}暂时没有可用的跳伞地点。",
    "locations.bookHere": "立即体验",
    "locations.tandem": "双人跳伞",
    "locations.aff": "AFF课程",
    "locations.groups": "团体活动",
    "locations.map.title": "探索我们的跳伞基地",
    "locations.map.subtitle": "选择一个地点在地图上查看",
    "locations.map.openGoogleMaps": "在 Google 地图中打开",
    "locations.viewDetails": "查看详情",
    "locations.bookHereBtn": "立即体验",

    // Location Detail Page
    "locationDetail.notFound": "找不到该地点",
    "locationDetail.backToHome": "返回首页",
    "locationDetail.highlights": "特色亮点",
    "locationDetail.fromAirport": "距离机场",
    "locationDetail.fromCity": "距离市区",
    "locationDetail.transportation": "交通方式",
    "locationDetail.photos": "照片集",
    "locationDetail.servicesHere": "此地点服务",
    "locationDetail.map": "地图",
    "locationDetail.readyToJump": "准备好起飞了吗？",
    "locationDetail.bookHere": "立即体验",

    // Services Section
    "services.badge": "我们提供的服务",
    "services.title": "服务项目",
    "services.subtitle": "从首次跳伞者到有志成为持照跳伞员的学员，我们都有适合您的完美体验。",
    "services.tandem.title": "双人跳伞",
    "services.tandem.subtitle": "欢迎首次跳伞者",
    "services.tandem.description": "与经验丰富的教练一同体验极限自由落体的刺激。无需任何经验——只需带上您的冒险精神！",
    "services.alicence.title": "A级执照",
    "services.alicence.subtitle": "学习独立跳伞",
    "services.alicence.description": "加速自由落体（AFF）课程是您成为持照跳伞员的途径。掌握独立跳伞所需的技能。",
    "services.group.title": "团体活动",
    "services.group.subtitle": "团队建设与庆祝活动",
    "services.group.description": "非常适合企业团队建设、单身派对、生日或任何特殊场合。一起创造难忘的回忆！",
    "services.popular": "最受欢迎",
    "services.contactUs": "联系我们",
    "services.priceVaries": "价格因地而异",
    "services.whatsIncluded": "包含内容：",
    "services.safetyNote": "安全第一：",
    "services.safetyDesc": "所有跳伞均由认证教练使用现代化设备进行",
    "services.priceFrom": "${price}起",
    "services.customQuote": "专属跳伞报价",

    // Booking Section
    "booking.badge": "准备好了吗？",
    "booking.title": "预约您的冒险",
    "booking.subtitle": "选择您感兴趣的地点和服务，开始您的跳伞之旅。",
    "booking.step1": "选择地点",
    "booking.step2": "选择服务",
    "booking.step3": "您的资料",
    "booking.step4": "预览",
    "booking.step5": "付款",
    "booking.paymentTitle": "支付订金",
    "booking.paymentSubtitle": "需支付 HKD $500 订金以确认您的预约",
    "booking.depositAmount": "订金金额",
    "booking.paymentProcessing": "正在处理付款...",
    "booking.paymentSuccess": "付款成功！",
    "booking.paymentFailed": "付款失败，请重试。",
    "booking.paymentError": "付款处理过程中发生错误。",
    "booking.depositNote": "余额将于活动当天收取。",
    "booking.mobileRedirectNotice": "您将被重新导向至应用程序完成付款。",
    "booking.selectLocation": "选择地点",
    "booking.selectService": "选择服务",
    "booking.form.name": "全名",
    "booking.form.email": "电子邮件",
    "booking.form.phone": "电话号码",
    "booking.form.date": "日期",
    "booking.form.notes": "备注",
    "booking.form.submit": "提交预约申请",
    "booking.filter.showing": "显示提供A级执照培训的地点",
    "booking.whereJump": "您想在哪里跳伞？",
    "booking.selectDropzone": "选择您感兴趣的跳伞基地",
    "booking.showAll": "显示全部",
    "booking.chooseService": "选择您的体验",
    "booking.selectPackage": "选择您想选的套餐",
    "booking.changeLocation": "更换地点",
    "booking.yourDetails": "您的资料",
    "booking.fillInfo": "填写您的资料以完成预约",
    "booking.firstName": "名字",
    "booking.lastName": "姓氏",
    "booking.email": "电子邮件",
    "booking.phone": "电话",
    "booking.date": "偏好日期",
    "booking.participants": "参加人数",
    "booking.notes": "备注（选填）",
    "booking.notesPlaceholder": "任何特殊要求或需求...",
    "booking.reviewBooking": "确认您的预约",
    "booking.confirmDetails": "请确认您的预约详情",
    "booking.location": "地点",
    "booking.service": "服务",
    "booking.price": "价格",
    "booking.contact": "联系方式",
    "booking.back": "返回",
    "booking.next": "下一步",
    "booking.confirmBooking": "确认预约",
    "booking.submitting": "提交中...",
    "booking.success": "预约申请已提交！",
    "booking.successMessage": "我们已收到您的预约申请。我们会在24小时内联系您确认预约。",
    "booking.summary": "预约摘要",
    "booking.bookAnother": "再次预约",
    "booking.whenJump": "您想什么时候跳伞？",
    "booking.selectDateDetails": "选择您的日期并填写您的资料",
    "booking.preferredDate": "日期",
    "booking.numberOfJumpers": "跳伞人数",
    "booking.jumper": "位",
    "booking.jumpers": "位",
    "booking.contactDetails": "您的联系资料",
    "booking.firstName.label": "名字",
    "booking.lastName.label": "姓氏",
    "booking.email.label": "电子邮件",
    "booking.phone.label": "电话号码",
    "booking.specialRequests": "特殊需求（选填）",
    "booking.specialRequestsPlaceholder": "任何特殊要求或问题...",
    "booking.selected": "已选择",
    "booking.noServices": "此地点暂无可用服务。",
    "booking.noLocations": "此服务类型暂无可用地点。",
    "booking.more": "更多",
    "booking.depositReminder": "确认预约需支付 HKD $500 订金。",
    "booking.depositReminderNote": "点击「下一步」后，将进入付款页面支付订金。余额将于活动当天收取。",
    "booking.termsDisclaimer": "点击提交即表示您同意我们的预约条款。我们将在24小时内与您联系确认可用性并完成预约。",
    "booking.fixErrors": "请先修正验证错误再提交",
    "booking.submitError": "预约提交失败，请重试。",
    "booking.submitSuccess": "预约提交成功！",

    // Profile
    "profile.title": "个人资料",
    "profile.basicInfo": "基本资料",
    "profile.fullName": "全名",
    "profile.phone": "电话",
    "profile.emergencyContact": "紧急联系人",
    "profile.optional": "选填",
    "profile.name": "姓名",
    "profile.relationship": "关系",
    "profile.relationshipPlaceholder": "例如：配偶、父母、朋友",
    "profile.save": "保存更改",
    "profile.saving": "保存中...",
    "profile.namePlaceholder": "输入您的全名",
    "profile.phonePlaceholder": "输入您的电话号码",
    "profile.emergencyNamePlaceholder": "紧急联系人姓名",
    "profile.emergencyPhonePlaceholder": "紧急联系人电话",
    "profile.updateSuccess": "个人资料更新成功",
    "profile.updateError": "保存个人资料失败",
    "profile.loadError": "加载个人资料失败",
    "profile.validationError": "输入无效",
    "profile.myBookings": "我的预约",
    "profile.noBookings": "尚无预约记录",

    // Credits
    "credit.title": "我的积分",
    "credit.balance": "积分余额",
    "credit.history": "交易记录",
    "credit.noTransactions": "尚无交易记录",
    "credit.signup_bonus": "注册奖励",
    "credit.admin_adjustment": "管理员调整",
    "credit.redemption": "兑换使用",
    "credit.refund": "退款",
    "credit.promotion": "推广优惠",
    "credit.referral_bonus": "推荐奖励",
    "credit.pending": "待审核",
    "credit.approved": "已批准",
    "credit.rejected": "已拒绝",
    "credit.pendingBalance": "待审核积分",

    // Referral
    "referral.title": "我的推荐码",
    "referral.description": "与朋友分享您的推荐码。当他们预约时，您将获得 $100 积分（待管理员批准）。",
    "referral.copied": "推荐码已复制！",
    "referral.label": "推荐码（选填）",
    "referral.placeholder": "输入推荐码",

    // Admin
    "admin.title": "管理员 - 积分管理",
    "admin.pendingReferrals": "待审核推荐",
    "admin.approve": "批准",
    "admin.reject": "拒绝",
    "admin.noPending": "没有待审核的推荐积分",

    // Auth Messages
    "auth.signInSuccess": "登录成功！",
    "auth.signUpSuccess": "注册成功！请查看您的电子邮件以验证账户。",
    "auth.invalidCredentials": "电子邮件或密码无效",
    "auth.emailAlreadyRegistered": "此电子邮件已注册",
    "auth.emailNotConfirmed": "请先验证您的电子邮件",
    "auth.signInFailed": "登录失败",
    "auth.signUpFailed": "注册失败",
    "auth.googleSignInFailed": "Google 登录失败，请重试。",
    "auth.enterEmailPassword": "请输入电子邮件和密码",
    "auth.passwordsMismatch": "密码不一致",
    "auth.passwordTooShort": "密码必须至少6个字符",
    "auth.passwordMinLength": "密码必须至少8个字符",
    "auth.passwordLowercase": "密码必须包含小写字母",
    "auth.passwordUppercase": "密码必须包含大写字母",
    "auth.passwordNumber": "密码必须包含数字",
    "auth.criteria.length": "至少8个字符",
    "auth.criteria.lowercase": "一个小写字母",
    "auth.criteria.uppercase": "一个大写字母",
    "auth.criteria.number": "一个数字",
    "auth.forgotPassword": "忘记密码？",
    "auth.resetPassword": "重置密码",
    "auth.resetDescription": "输入您的电子邮件地址，我们将向您发送重置密码的链接。",
    "auth.sendResetLink": "发送重置链接",
    "auth.resetEmailSent": "重置密码邮件已发送！请查看您的收件箱。",
    "auth.resetFailed": "发送重置邮件失败",
    "auth.enterEmail": "请输入您的电子邮件地址",

    // About Section
    "about.badge": "关于我们",
    "about.title": "为什么选择 Let's Skydive HK？",
    "about.subtitle": "我们热衷于与亚洲各地的冒险家分享跳伞的刺激体验。",
    "about.stats.safeJumps": "安全跳伞次数",
    "about.stats.yearsExperience": "年经验",
    "about.stats.locations": "个跳伞地点",
    "about.stats.safetyRecord": "安全记录",
    "about.values.safetyFirst.title": "安全第一",
    "about.values.safetyFirst.desc": "每次跳伞均遵循最高安全标准。我们的设备每日检查，教练均持有完整认证。",
    "about.values.expertInstructors.title": "专业教练",
    "about.values.expertInstructors.desc":
      "我们的双人跳伞教练拥有数千次跳伞经验。从培训到降落，您都在经验丰富的专业人员手中。",
    "about.values.personalizedExperience.title": "个性化体验",
    "about.values.personalizedExperience.desc": "无论是您的第一次跳伞还是第一百次，我们都会为您量身打造难忘的体验。",
    "about.values.passionDriven.title": "热情驱动",
    "about.values.passionDriven.desc": "我们热爱我们的工作。这份热情转化为每位与我们一起跳伞的客人的绝佳体验。",
    "about.story.title": "我们的故事",
    "about.story.paragraph1":
      "Let's Skydive HK 由一位梦想穿上翼装飞行的年轻人创立。他的愿景是让更多香港人完成人生清单上的重要项目：体验纯粹的飞行快感。我们在亚洲各地提供更近、更优质的选择，将最初的热情转化为遍布泰国和中国的世界级设施网络。",
    "about.story.paragraph2":
      "作为香港首家提供全面、有系统跳伞支援服务的机构，我们的整体运营围绕着一个核心优先事项：您的安全。我们制定并维持业界最高的安全标准，确保每一次飞行不仅刺激，更是经过精心管理，让您绝对安心无忧。",

    // Contact Section
    "contact.badge": "联系我们",
    "contact.title": "联系我们",
    "contact.subtitle": "有问题吗？我们随时为您规划跳伞冒险提供帮助。",
    "contact.email.label": "电子邮件",
    "contact.email.desc": "预约及查询",
    "contact.instagram.label": "私信我们的Instagram",
    "contact.instagram.desc": "24小时内回复",
    "contact.location.label": "总部",
    "contact.whatsapp.label": "WhatsApp",
    "contact.whatsapp.desc": "快速回复",
    "contact.responseTime": "回复时间",
    "contact.responseTimeDesc": "我们通常会在24小时内回复所有查询。如有紧急事项，请直接致电或WhatsApp联系我们。",
    "contact.followUs": "关注我们",
    "contact.form.name": "姓名 *",
    "contact.form.namePlaceholder": "您的姓名",
    "contact.form.email": "电子邮件 *",
    "contact.form.emailPlaceholder": "your@email.com",
    "contact.form.phone": "电话（选填）",
    "contact.form.phonePlaceholder": "+852 6939 1570",
    "contact.form.subject": "主题 *",
    "contact.form.message": "消息 *",
    "contact.form.messagePlaceholder": "请告诉我们您的查询内容...",
    "contact.form.required": "* 必填字段",
    "contact.form.submit": "发送消息",
    "contact.form.sending": "发送中...",
    "contact.form.success": "消息已发送！",
    "contact.form.successDesc": "感谢您的来信。我们会在24小时内回复您。",
    "contact.form.sendAnother": "发送另一条消息",
    "contact.subject.aff": "A级执照查询",
    "contact.subject.group": "团体活动",
    "contact.subject.general": "一般问题",

    // Footer
    "footer.description": "与亚洲首屈一指的跳伞网络一同体验跳伞的刺激。专业双人跳伞、AFF课程及团体活动遍布泰国和中国。",
    "footer.quickLinks": "快速链接",
    "footer.services": "服务项目",
    "footer.locations": "我们的地点",
    "footer.privacy": "隐私政策",
    "footer.terms": "服务条款",
    "footer.disclaimer": "免责声明",
    "footer.copyright": "© 2025 Let's Skydive HK. 版权所有。",

    // Auth
    "auth.signIn": "登录",
    "auth.signUp": "注册",
    "auth.signOut": "退出",
    "auth.profile": "个人资料",
    "auth.welcomeBack": "欢迎回来",
    "auth.createAccount": "创建账户",
    "auth.signInWithGoogle": "使用 Google 登录",
    "auth.or": "或",
    "auth.emailAddress": "电子邮件地址",
    "auth.password": "密码",
    "auth.confirmPassword": "确认密码",
    "auth.processing": "处理中...",
    "auth.noAccount": "还没有账户？",
    "auth.haveAccount": "已经有账户？",
    "auth.member": "会员",

    // Gallery Section
    "gallery.badge": "我们的冒险",
    "gallery.title": "照片集",
    "gallery.subtitle": "通过我们跳伞者的照片和视频重温刺激时刻。",
    "gallery.backToHome": "返回首页",
    "gallery.upload": "上传",
    "gallery.empty": "暂时没有照片或视频。",
    "gallery.uploadFirst": "上传第一个媒体",
    "gallery.selectItem": "选择项目查看",
    "gallery.video": "视频",
    "gallery.deleteSuccess": "项目已成功删除",
    "gallery.deleteError": "删除项目失败",
    "gallery.deleteConfirmTitle": "删除此项目？",
    "gallery.deleteConfirmDesc": "此操作无法撤销。文件将被永久删除。",
    "gallery.cancel": "取消",
    "gallery.delete": "删除",
    "gallery.uploadTitle": "上传媒体",
    "gallery.invalidFileType": "无效的文件类型。请上传图片或视频。",
    "gallery.fileTooLarge": "文件太大。最大大小为50MB。",
    "gallery.dragDrop": "拖放文件至此，或",
    "gallery.browseFiles": "浏览文件",
    "gallery.removeFile": "移除",
    "gallery.titleLabel": "标题（选填）",
    "gallery.titlePlaceholder": "为您的媒体添加标题...",
    "gallery.descriptionLabel": "描述（选填）",
    "gallery.descriptionPlaceholder": "添加描述...",
    "gallery.uploading": "上传中...",
    "gallery.uploadBtn": "上传",
    "gallery.uploadSuccess": "媒体上传成功！",
    "gallery.uploadError": "上传媒体失败",
    "gallery.photos": "照片",
    "gallery.videos": "视频",
    "gallery.dailyVideos": "每日视频",
    "gallery.affVideos": "AFF课程视频",
    "gallery.noDailyVideos": "暂时没有每日视频",
    "gallery.noAffVideos": "暂时没有AFF课程视频",
    "gallery.refresh": "刷新",
    "gallery.refreshSuccess": "照片集已刷新",
    "gallery.refreshError": "刷新失败",
    "gallery.loadError": "无法加载图片",
    "nav.gallery": "照片集",
    "nav.faq": "常见问题",
    "nav.promotions": "最新优惠",

    // Promotions Page
    "promo.badge": "限时优惠",
    "promo.title": "最新优惠",
    "promo.subtitle": "把握我们的最新限时优惠，节省您的跳伞冒险费用。",
    "promo.backToHome": "返回首页",
    "promo.active": "进行中",
    "promo.termsTitle": "条款及细则",
    "promo.bookNow": "立即体验",
    "promo.claimCoupon": "领取优惠券",
    "promo.perPerson": "每人",
    "promo.group2.title": "好友同行 — 两人一起跳更划算！",
    "promo.group2.desc": "约上朋友一起跳，二人同行即享折扣！",
    "promo.group2.details": "2人同行预约同一场次，每人立减 $100。",
    "promo.group2.terms":
      "两位参加者必须预约同一地点的同一场次。优惠仅适用于双人跳伞套餐，不能与其他优惠同时使用，名额有限，先到先得。",
    "promo.homeBanner": "🔥 好友同行：2人同行，每人减 $100！",
    "promo.homeBannerCta": "查看详情",
    "promo.off": "优惠",
    "promo.student.title": "学生优惠",
    "promo.student.desc": "出示有效学生证，即享跳伞冒险折扣！",
    "promo.student.details": "凭有效学生证预约任何双人跳伞套餐，立减 $100。",
    "promo.student.terms": "须于报到时出示有效学生证。仅适用于双人跳伞套餐，不可与其他优惠同时使用，每人限用一次。",
    "promo.birthday.title": "生日特惠",
    "promo.birthday.desc": "在生日月份来一次难忘的跳伞，享受专属优惠！",
    "promo.birthday.details": "于生日当月跳伞，任何双人跳伞套餐立减 $100。",
    "promo.birthday.terms":
      "须于生日当月内完成跳伞，需提供出生日期证明。仅适用于双人跳伞套餐，不可与其他优惠同时使用。",
    "promo.earlybird.title": "早鸟优惠",
    "promo.earlybird.desc": "提早计划，锁定特惠价格！",
    "promo.earlybird.details": "提前 90 天以上预约，任何跳伞套餐享 9 折优惠。",
    "promo.earlybird.terms":
      "须于跳伞日期前至少 90 天完成预约。折扣于结账时适用，不可与其他优惠同时使用，视供应情况而定。",
    "promo.repeat.title": "回头客奖励",
    "promo.repeat.desc": "曾经与我们一起跳过？回来再跳更优惠！",
    "promo.repeat.details": "老客户下次跳伞立减 $150。",
    "promo.repeat.terms": "须曾于 Let's Skydive HK 完成预约。折扣经核实后适用，不可与其他优惠同时使用。",
    "promo.code": "优惠码",
    "promo.codeCopied": "优惠码已复制！",
    "promo.copyCode": "复制",
    "booking.dob.label": "出生日期",
    "booking.dob.placeholder": "选择出生日期",
    "booking.dob.hint": "用于生日优惠及年龄验证。",
    "booking.promo.label": "使用优惠（可选）",
    "booking.promo.hint": "选择适用的优惠，须符合条款及细则。",

    // Legal Pages
    "legal.backToHome": "返回首页",

    // Privacy Policy - Simplified Chinese
    "privacy.title": "Let's Skydive HK Limited 个人资料（隐私）政策声明",
    "privacy.lastUpdated": "最后更新",
    "privacy.introduction":
      "Let's Skydive HK Limited（下称「本公司」、「我们」）致力保障您的个人资料隐私。本隐私政策声明阐述我们如何根据香港法例第486章《个人资料（隐私）条例》（下称「条例」）收集、使用、储存、传输及处理您的个人资料。请仔细阅读本政策，以了解我们处理您个人资料的常规做法。",
    "privacy.updateNotice":
      "我们的政策及措施旨在确保在业务运营过程中处理个人资料（定义见下文）时，符合条例的规定。我们可能不时修订本政策，并于本网站公布更新版本。若您于修订后继续使用我们的服务或与我们维持关系，即表示您接受经修订的政策。",

    "privacy.section1.title": "1. 收集的个人资料种类",
    "privacy.section1.content":
      "我们可能通过网站、电话、电邮、社交媒体、移动应用程序或亲临办事处等渠道，向您收集为提供服务所必需的个人身份识别资料（「个人资料」），包括但不限于：",
    "privacy.section1.list":
      "• 联系资料（如姓名、电话号码、电邮地址、通讯地址）；<br>• 身份证明文件资料（如护照或身份证号码、出生日期）；<br>• 体格健康及医疗相关资料（如体重、过往病史、伤患记录，以评估是否适合参与跳伞活动）；<br>• 付款资料（如信用卡/借记卡号码、持卡人姓名、有效期及账单地址）；<br>• 活动相关资料（如预订的跳伞日期、地点、套餐类型、录影及照片偏好、紧急联系人资料）；<br>• 参与本公司举办的推广活动、比赛或问卷调查时所提供的资料；及<br>• 通讯记录（为确保服务质量及培训，我们可能会记录与客户服务相关的通话或电子消息）。",
    "privacy.section1.note":
      "若您选择不提供必要资料，我们可能无法为您提供跳伞活动或相关服务。如您未满18岁，必须事先征得家长或监护人同意方可提供个人资料。",

    "privacy.section2.title": "2. 收集及使用个人资料的目的",
    "privacy.section2.content": "我们会将您的个人资料用于以下与我们业务及服务相关之目的：",
    "privacy.section2.list":
      "• 处理、确认及管理您的跳伞活动预订、报名及付款；<br>• 评估您参与跳伞活动的体格适合性及安全风险；<br>• 就您的预订、查询、意见或投诉与您联络及跟进；<br>• 提供活动前简报、安全指引及相关服务安排；<br>• 处理及制作跳伞活动的照片、视频记录及相关产品；<br>• 管理会员账户（如适用）及提供相关礼遇；<br>• 进行客户服务质量监控、员工培训及处理索赔事宜；<br>• 进行市场研究、分析及服务改善，以提升客户体验；<br>• 在获得您同意的情况下，向您发送关于本公司最新优惠、推广活动及服务信息的直接营销消息；<br>• 履行法律或监管义务，或回应执法机构、政府部门依法提出的要求；<br>• 保障本公司、客户或公众的权利、财产或安全，包括预防欺诈或犯罪活动；及<br>• 与上述任何目的直接相关的其他用途。",
    "privacy.section2.note": "未经您的事先同意，我们不会将您的个人资料用于上述列明范围之外的其他目的。",

    "privacy.section3.title": "3. 个人资料的披露及转移",
    "privacy.section3.content": "为达成第2条所述之目的，我们可能在必要情况下将您的个人资料转交予以下类别之第三方：",
    "privacy.section3.list":
      "• 提供跳伞活动协作服务的第三方供应商（如跳伞教练、飞机租赁公司、摄影团队）；<br>• 协助处理付款的金融机构及支付服务供应商；<br>• 为我们提供业务支援服务的承办商（如信息科技系统供应商、客户服务中心、邮递服务公司）；<br>• 我们的专业顾问（如律师、保险公司、审计师）；<br>• 在法律要求或授权下，有权索取资料的政府部门、监管机构或执法机关；及<br>• 与我们有合作关系并为您提供相关优惠或服务的商业伙伴（仅在获得您同意的情况下）。",
    "privacy.section3.note":
      "部分第三方可能位于香港以外的地方。在转移您的个人资料时，我们会采取合理措施确保资料获得足够的保护，并遵守条例的规定。",

    "privacy.section4.title": "4. 个人资料的保护及保存",
    "privacy.section4.content":
      "我们采取符合行业标准的合理技术性及组织性措施（包括加密技术、防火墙及访问权限控制），以保护您提供的个人资料免遭未经授权的查阅、使用、披露、更改或破坏。",
    "privacy.section4.retention":
      "我们只会将您的个人资料保存至达致收集目的所需之期限，或为遵守法律义务、解决争议及执行协议所需之合理期限。其后，我们会以安全的方式删除或销毁该等资料。",

    "privacy.section5.title": "5. Cookies及类似技术",
    "privacy.section5.content":
      "我们的网站可能使用Cookies及类似技术以增强您的浏览体验、分析网站流量及提供个性化内容。您可通过浏览器设置管理或禁用Cookies，但此举可能会影响网站的部分功能。",

    "privacy.section6.title": "6. 第三方网站链接",
    "privacy.section6.content":
      "我们的网站或通讯可能包含第三方网站的链接。该等第三方网站有其独立的隐私政策，我们对其内容及政策概不负责。建议您在使用该等网站前查阅其隐私政策。",

    "privacy.section7.title": "7. 您的权利",
    "privacy.section7.content": "根据条例，您有权：",
    "privacy.section7.list":
      "• 查询我们是否持有您的个人资料及要求查阅该等资料；<br>• 要求更正不准确的个人资料；<br>• 查明我们关于个人资料的政策和做法，并获知我们持有的个人资料种类；<br>• 就我们使用您的个人资料作直接营销提出反对；及<br>• 要求停止使用您的个人资料，但须符合条例规定的条件。",
    "privacy.section7.note": "有关行使上述权利或对本政策有任何查询，请联络我们的隐私主任（联系方式见第9条）。",

    "privacy.section8.title": "8. 直接营销",
    "privacy.section8.content":
      "我们只有在获得您明确同意（表示不反对）的情况下，才会使用您的个人资料（如姓名及联系方式）向您发送关于本公司服务及推广活动的直接营销信息。您可随时通过我们在营销消息中提供的取消订阅方式，或联络我们的隐私主任，免费选择停止接收此类消息。",

    "privacy.section9.title": "9. 联系我们",
    "privacy.section9.content":
      "如您对本隐私政策、我们处理个人资料的方式，或欲行使您的个人资料权利有任何疑问、要求或投诉，请通过以下方式联络我们的隐私主任：",
    "privacy.section9.email": "电邮：letskydivehk@gmail.com",
    "privacy.section9.phone": "电话：(852) 69391570",

    "privacy.finalNote":
      "（注：为免生疑问，本政策之最新更新日期为 **2026年1月1日**。）<br><br>**（本隐私政策声明以中文版本为准。）**",

    // Terms of Service - Simplified Chinese
    "terms.title": "条款及细则",
    "terms.lastUpdated": "最后修改时间：2026年1月30日",

    "terms.preamble.title": "前言",
    "terms.preamble.content":
      "1.1 本《条款及细则》（下称「本条款」）构成阁下（下称「参加者」或「客户」）与Let's Skydive HK Limited（下称「本公司」或「我们」）就提供跳伞活动服务（下称「本服务」）所订立之法律协议。本条款受香港特别行政区法律管辖及解释。<br><br>1.2 阁下通过任何途径确认预订、支付款项或参与本服务，即表示阁下已阅读、理解并无条件接受本条款之全部内容，对阁下具有法律约束力。若阁下为他人代为预订，即被视为已获该等人士之充分授权代表其同意受本条款约束。",

    "terms.article1.title": "第一条：资格、健康与安全",
    "terms.article1.content":
      "1.1 参加者必须于活动当日年满18岁，并出示附有照片之有效香港身份证或旅游证件以供核实。<br><br>1.2 参加者之体重必须为100公斤或以下，且身高体重比例须符合本公司所使用安全装备之操作规格。本公司保留于活动当日进行最终测量之权利。若参加者超出此安全限制，本公司有权单方面拒绝其参与，已缴付之所有费用将不予退还。<br><br>1.3 参加者声明其身心健康状况良好，适宜参与高空及高强度之体育活动。<strong>参加者必须确认并保证其并无以下任何状况（包括但不限于）：心脏病、高血压、脊椎或颈部损伤、癫痫、气胸、怀孕或可能怀孕、任何可能因气压变化或剧烈冲击而恶化之病症，以及任何精神状况以致影响其理解安全指示或判断风险之能力。</strong> 本公司强烈建议参加者在预订前咨询合资格医生以评估自身状况。<br><br>1.4 参加者在参与活动前及期间，不得受酒精、非法药物或任何可能损害神志、判断力、协调能力或反应能力之药物影响。本公司职员有绝对酌情权判断参加者是否适合参与，若判断为不适合，有权即时取消其参与资格而不作退款。",

    "terms.article2.title": "第二条：风险确认与责任豁免",
    "terms.article2.content":
      "2.1 <strong>固有风险之确认：</strong> 参加者明确知悉、理解并承认，跳伞乃一项具有固有及显著风险之极限运动，此等风险可导致严重身体受伤、永久伤残、甚或死亡。此等风险包括但不限于：起飞、飞行或降落时之航空器事故；跳出航空器、自由坠落、开伞或着陆过程中发生之碰撞；装备故障、失灵或不当使用；天气状况突然变化；教练、参加者、其他人士或第三方之错误判断或疏忽；以及着陆于非预定区域或与障碍物碰撞。<br><br>2.2 <strong>豁免、放弃索赔及赔偿：</strong> 为换取本公司提供本服务，参加者在此代表其本人、其继承人、遗嘱执行人及遗产管理人，作出以下不可撤销之承诺：<br><br>(a) <strong>完全免除、放弃及永久解除</strong> 本公司、其董事、高级职员、雇员、合约教练、代理人、分包商及航空服务供应商（统称「被豁免方」）因本服务引致或与之相关之任何及所有索赔、要求、诉讼因由、损失、法律责任、损害赔偿、费用及开支（包括合理律师费），<strong>无论该等责任因被豁免方之任何疏忽、过失、违反法定责任或其他原因而产生，亦不论是否因本公司所提供之设备、场所或航空器之任何潜在缺陷而引致，但法律明令禁止豁免之故意失当行为或重大过失除外。</strong><br><br>(b) <strong>同意赔偿并使被豁免方免受损害</strong>，保障其免受因参加者参与本服务、违反本条款任何保证或规定、或其任何作为或不作为而直接或间接导致之任何及所有索赔、法律责任、损害及开支。<br><br>2.3 <strong>责任上限：</strong> 在法律允许之最大范围内，本公司因本条款或本服务而对参加者所负之全部责任，不论于合约法、侵权法（包括疏忽）或其他法律原则下产生，其总额均不得超过参加者就该次活动向本公司支付之服务费用。",

    "terms.article3.title": "第三条：预订、付款、取消及改期",
    "terms.article3.content":
      "3.1 预订必须于本公司指定之期限内支付订金方告确认。余款须于活动日前指定期限内全数缴清。逾期未付，本公司有权取消预订，已付订金将不予退还。<br><br>3.2 <strong>取消及改期政策：</strong><br><br>(a) <strong>由参加者提出取消：</strong><br>• 于预定活动日 <strong>14天或之前</strong> 通知取消，可免费改期至另一可供预订之日期。<br>• 于预定活动日 <strong>前7至14天内</strong> 通知取消，可获退还已支付费用之 <strong>50%</strong>。<br>• 于预定活动日 <strong>前7天内（含第7天）</strong> 通知取消，或于活动当日未能出席（「No-Show」），<strong>所有已支付费用将概不退还</strong>。<br><br>(b) <strong>由本公司提出取消/改期：</strong><br>• 若因安全理由（包括但不限于恶劣天气、风速过高、能见度不足、云层过低）或任何超出本公司合理控制范围之情况（如航空器故障、维修、空中交通管制、政府指令、疫情限制等）导致活动无法进行，本公司将尽力协助参加者改期。<br>• 若无法改期或参加者不接受建议之改期日期，本公司将全数退还参加者已支付之活动费用。<br>• <strong>在此等情况下，本公司对参加者因此产生之任何附带、衍生或间接损失（包括但不限于交通、住宿、假期损失等）概不负责，参加者亦不得就此提出任何索赔。</strong><br><br>3.3 所有取消或改期要求必须经由本公司指定之联络方式（如电话、电邮）提出并获得书面确认，方为有效。",

    "terms.article4.title": "第四条：活动当日守则与客户责任",
    "terms.article4.content":
      "4.1 参加者必须于指定时间到达指定集合地点。迟到者可能导致活动被取消，且不获退款。<br><br>4.2 参加者必须参与强制性的安全简报，并于活动全程严格遵守本公司教练及工作人员之一切指示。任何危害自身或他人安全之行为，将导致即时终止参与资格而不作退款。<br><br>4.3 参加者需自备合适之运动服装及包覆脚踝之运动鞋。本公司将提供所有必要之安全装备（包括跳伞服、头盔、护目镜等）。参加者不得擅自调校或干预任何装备。<br><br>4.4 参加者须自行保管其个人物品。本公司对任何置于本公司场所、车辆或航空器内之财物之损失或损坏概不负责。",

    "terms.article5.title": "第五条：保险与个人资料",
    "terms.article5.content":
      "5.1 本公司已购买法律要求之第三者责任保险。<strong>此保险并不涵盖参加者之人身意外伤害。</strong> 本公司强烈建议参加者自行购买足额之个人意外保险，且该保险须明确承保「跳伞」或「高危体育活动」。<br><br>5.2 为遵守《个人资料（隐私）条例》，本公司收集之个人资料将仅用于处理预订、提供服务、安全及内部行政之用。详情请参阅本公司之隐私政策声明。",

    "terms.article6.title": "第六条：影像使用",
    "terms.article6.content":
      "本公司或其指定人员可能于活动期间拍摄照片或视频（「影像」）作安全记录、员工培训、品质控制及宣传推广之用。除非参加者于活动前以书面明确反对，否则即被视为授予本公司一项永久、免版税、不可撤销的全球性许可，允许本公司于任何媒体使用及编辑该等包含参加者肖像之影像。",

    "terms.article7.title": "第七条：一般条款",
    "terms.article7.content":
      "7.1 <strong>完整性：</strong> 本条款构成双方就本服务之完整协议，取代所有先前之讨论、通讯及协议。<br><br>7.2 <strong>可分割性：</strong> 若本条款任何部分被有管辖权之法院裁定为无效或不可执行，该部分应在最小必要范围内被分割，其余部分仍保持完全效力。<br><br>7.3 <strong>修改权：</strong> 本公司保留随时修订本条款之权利。修订后之条款将公布于本公司官方网站。参加者于修订后继续使用服务，即表示接受经修订之条款。<br><br>7.4 <strong>通知：</strong> 所有通知应以电邮或本公司网站公告方式发出。",

    "terms.additionalNotes.title": "额外注意事项",
    "terms.additionalNotes.content":
      "• 为使各参加者获得完善的保障，本公司建议参加者必须购买旅游保险。<br>• 本公司保留权利修改本细则责任条款。如有任何争议，本公司保留最终决定权。<br>• 本细则责任条款只备有中文版本，一概以中文版本为准。<br>• 本公司保留接受报名与否之最终权利。",

    // Disclaimer - Simplified Chinese
    "disclaimer.title": "Let's Skydive HK Limited 免责声明（简体中文版）",
    "disclaimer.lastUpdated": "最后更新日期：2026年1月1日",
    "disclaimer.website": "网站：https://letskydivehk.com/",

    "disclaimer.section1.title": "1. 接受条款",
    "disclaimer.section1.content":
      "Let's Skydive HK Limited（以下称「本公司」、「我们」或「我们的」）运营此网站，并在全球范围内组织跳伞体验、培训课程及相关旅行服务。通过访问、浏览或使用本网站，或预订及参与我们组织的任何服务，即表示您确认已阅读、理解并不可撤销地接受本免责声明的所有条款。如您不同意任何部分，必须立即停止使用我们的服务。",

    "disclaimer.section2.title": "2. 极限运动风险认知与责任承担",
    "disclaimer.section2.subtitle1": "2.1 固有风险：",
    "disclaimer.section2.content1":
      "跳伞是一项具有固有、不可避免且重大风险的极限运动，无论采取何种防护措施，这些风险都无法被消除。这些风险包括但不限于：",
    "disclaimer.section2.risks":
      "• 人身伤害或死亡：可能因自由落体、开伞、着陆或空中碰撞而导致瘫痪、创伤性脑损伤或死亡。<br>• 设备故障：降落伞、背带、高度计、自动激活装置或飞机的故障或失灵。<br>• 环境危害：恶劣或突变的天气、风况、气流、能见度差、着陆区或降落区的障碍物。<br>• 操作及人为错误：飞行员、教练或地勤人员的判断错误；沟通失误；偏离计划的飞行或跳伞航线。<br>• 健康反应：高空相关疾病、眩晕、意识丧失，或既有身体或心理状况的恶化。",
    "disclaimer.section2.subtitle2": "2.2 您的责任与风险承担：",
    "disclaimer.section2.content2": "参与即表示您自愿且明确地承担所有此类风险。您确认：",
    "disclaimer.section2.responsibilities":
      "• 您已达法定年龄（18岁或以上），或已获得合法监护人/父母同意。<br>• 您并未怀孕，且身体及精神健康状况良好，无任何可能因跳伞而恶化的心血管、呼吸系统、骨骼/关节、神经系统疾病或其他任何疾病。<br>• 您已如实填写所有要求的健康及责任豁免表格。<br>• 您将毫无例外地遵守本公司代表及第三方教练的所有指示。<br>• 您需自行负责评估自身是否适合参与。",

    "disclaimer.section3.title": "3. 服务模式与第三方责任",
    "disclaimer.section3.subtitle1": "3.1 代理角色：",
    "disclaimer.section3.content1":
      "本公司仅作为预订代理、协调者及促成者。实际的跳伞服务（包括飞机操作、跳伞执行及教学）由独立的、持有牌照的第三方合作跳伞中心、运营商、飞行员及教练（「服务伙伴」）提供。",
    "disclaimer.section3.subtitle2": "3.2 无连带责任：",
    "disclaimer.section3.content2":
      "我们谨慎选择服务伙伴，但并不拥有、控制或直接监督其日常运营。在法律允许的最大范围内，我们明确免除对这些服务伙伴的任何行为、疏忽、过失或故意不当行为（包括违反安全协议）所产生的一切责任。任何与实际跳伞活动相关的索赔必须直接向相关的服务伙伴及其保险公司提出。",

    "disclaimer.section4.title": "4. 预订、取消及不可抗力",
    "disclaimer.section4.subtitle1": "4.1 天气及安全取消：",
    "disclaimer.section4.content1":
      "跳伞活动完全取决于天气及安全条件。本公司或服务伙伴可随时因安全考虑（天气、风速、能见度等）取消或重新安排活动。对于您因此产生的任何相关费用（如交通、住宿），我们概不负责。我们的标准改期政策将适用；并不保证退款。",
    "disclaimer.section4.subtitle2": "4.2 健康及适用性：",
    "disclaimer.section4.content2":
      "服务伙伴有权拒绝任何未通过现场安全简报或健康评估的人士参与。已支付费用将按预订条款处理。",
    "disclaimer.section4.subtitle3": "4.3 未出席及迟到：",
    "disclaimer.section4.content3": "未能准时出席已预订的活动时段，将被视为自动取消，不予退款。",
    "disclaimer.section4.subtitle4": "4.4 不可抗力：",
    "disclaimer.section4.content4":
      "对于因超出我们合理控制范围的事件（包括战争、自然灾害、疫情、政府命令、罢工或交通中断）导致我们未能履行服务，我们不承担责任。",

    "disclaimer.section5.title": "5. 保险与责任限制",
    "disclaimer.section5.subtitle1": "5.1 强制个人保险：",
    "disclaimer.section5.content1":
      "您必须购买全面的个人旅行及医疗保险，且该保险必须明确承保跳伞及极限运动。本公司的保险不涵盖您的个人伤害或医疗费用。",
    "disclaimer.section5.subtitle2": "5.2 公司责任保险：",
    "disclaimer.section5.content2": "我们依法持有第三方责任保险，其详细内容及限额可根据要求提供。",
    "disclaimer.section5.subtitle3": "5.3 我们的责任限制：",
    "disclaimer.section5.content3":
      "在法律允许的最大范围内，本公司及其董事、雇员和代理人均不对因您使用本网站或参与我们组织的活动而产生的任何直接、间接、附带、特殊、后果性或惩罚性损害承担责任。这包括但不限于人身伤害、死亡、精神困扰、利润损失、数据或乐趣丧失的损害赔偿，即使已被告知可能发生此类损害。",
    "disclaimer.section5.subtitle4": "5.4 豁免协议：",
    "disclaimer.section5.content4": "参与活动的前提条件是于活动当天签署服务伙伴提供的正式《风险承担及责任豁免协议》。",

    "disclaimer.section6.title": "6. 网站使用、内容及知识产权",
    "disclaimer.section6.subtitle1": "6.1 「现状」提供：",
    "disclaimer.section6.content1":
      "本网站及其所有内容（信息、价格、描述、媒体）均按「现状」及「可用」状态提供，不附带任何形式的保证。我们力求准确，但不保证内容的完整性、及时性或无错误。所有内容均可能随时更改，恕不另行通知。",
    "disclaimer.section6.subtitle2": "6.2 非专业建议：",
    "disclaimer.section6.content2": "教学内容（视频、指南）仅供参考，不能替代持证教练的强制性现场培训。",
    "disclaimer.section6.subtitle3": "6.3 外部链接：",
    "disclaimer.section6.content3": "我们不对任何我们链接到的第三方网站的内容、安全性或隐私惯例负责。",
    "disclaimer.section6.subtitle4": "6.4 知识产权：",
    "disclaimer.section6.content4":
      "本网站的所有内容（文字、图形、标志、图像、视频）均为本公司财产或经授权使用，受版权和商标法保护。未经我们事先书面许可，您不得复制、修改或用于任何商业用途。",

    "disclaimer.section7.title": "7. 管辖法律与争议解决",
    "disclaimer.section7.content":
      "本免责声明受中华人民共和国香港特别行政区法律管辖并据其解释。任何由此产生的争议均应提交香港法院专属管辖。",

    "disclaimer.section8.title": "8. 修改与联系方式",
    "disclaimer.section8.subtitle1": "8.1 更新：",
    "disclaimer.section8.content1":
      "我们保留随时修改本免责声明的权利。更新后的版本将在此发布，并附上新生效日期。您继续使用即表示接受。",
    "disclaimer.section8.subtitle2": "8.2 联系：",
    "disclaimer.section8.content2": "如有关于本免责声明的任何疑问，请使用我们网站上的联系表格。",

    "disclaimer.final.title": "最终确认声明",
    "disclaimer.final.content":
      "跳伞活动具有导致严重受伤或死亡的风险。您的参与纯属自愿。您需自行负责了解这些风险、确保自身适合参与并购买合适的保险。进行预订即表示您确认完全且无条件接受本免责声明。",

    // Service Pages - Common
    "servicePage.backToHome": "返回首页",
    "servicePage.viewDetails": "查看详情",
    "servicePage.viewLocations": "查看地点",
    "servicePage.howItWorks": "流程说明",
    "servicePage.howItWorksTitle": "体验流程",
    "servicePage.pricingBadge": "各地点价格",
    "servicePage.pricingTitle": "选择您的地点",
    "servicePage.pricingSubtitle": "价格因跳伞场而异。选择您的首选地点进行预约。",
    "servicePage.faqBadge": "常见问题",
    "servicePage.faqTitle": "常见问题",
    "servicePage.ctaTitle": "准备好起跳了吗？",
    "servicePage.ctaSubtitle": "别只是想想而已，今天就行动吧。",

    // Tandem Service Page
    "servicePage.tandem.heroTitle": "双人跳伞",
    "servicePage.tandem.heroSubtitle": "与认证教练一同体验自由落体的极致快感。无需任何经验——带上你的冒险精神就好！",
    "servicePage.tandem.heroTagline": "零经验即可体验",
    "servicePage.tandem.step1.title": "抵达 & 报到",
    "servicePage.tandem.step1.desc": "抵达跳伞场，完成文件手续，认识您的双人跳伞教练。",
    "servicePage.tandem.step2.title": "地面训练",
    "servicePage.tandem.step2.desc": "15分钟的身体姿势、安全程序及注意事项简报。",
    "servicePage.tandem.step3.title": "登机升空",
    "servicePage.tandem.step3.desc": "穿戴装备，爬升至10,000-15,000呎高空。尽享壮丽景色！",
    "servicePage.tandem.step4.title": "自由落体！",
    "servicePage.tandem.step4.desc": "60秒纯粹肾上腺素飙升，以时速200公里与教练安全绑定下坠。",
    "servicePage.tandem.step5.title": "伞下滑翔",
    "servicePage.tandem.step5.desc": "5-7分钟在降落伞下宁静滑翔，享受360度全景视野。",
    "servicePage.tandem.step6.title": "着陆 & 庆祝",
    "servicePage.tandem.step6.desc": "平稳降落，击掌庆祝，领取您的跳伞证书！",
    "servicePage.tandem.include1": "专业双人跳伞教练",
    "servicePage.tandem.include2": "提供全套安全装备",
    "servicePage.tandem.include3": "地面训练课程",
    "servicePage.tandem.include4": "60秒自由落体",
    "servicePage.tandem.include5": "5-7分钟伞下滑翔",
    "servicePage.tandem.include6": "跳伞证书",
    "servicePage.tandem.testimonial": "绝对难以置信的体验！团队让我全程感到安全和舒适。这是我做过最棒的决定！",
    "servicePage.tandem.testimonialAuthor": "Iris，香港",
    "servicePage.tandem.faq.q1": "需要任何经验吗？",
    "servicePage.tandem.faq.a1":
      "完全不需要！双人跳伞专为初次体验者设计。您将与认证教练安全绑定，教练会处理一切。您只需带上冒险精神就好。",
    "servicePage.tandem.faq.q2": "年龄和体重有限制吗？",
    "servicePage.tandem.faq.a2": "您必须年满18岁。最大体重限制为100公斤。您的身高体重比也必须符合我们设备的安全范围。",
    "servicePage.tandem.faq.q3": "可以自己带相机吗？",
    "servicePage.tandem.faq.a3":
      "基于安全考量，跳伞过程中不允许携带个人相机。我们提供专业摄影摄录套餐——包括近镜和全景拍摄——让您重温每个精彩瞬间。",
    "servicePage.tandem.faq.q4": "天气不好怎么办？",
    "servicePage.tandem.faq.a4": "安全是我们的首要考量。若天气条件不适合，我们将免费为您改期。我们会全程与您保持联系。",

    // A-Licence Service Page
    "servicePage.aff.heroTitle": "A级执照课程",
    "servicePage.aff.heroSubtitle":
      "通过我们的加速自由落体（AFF）课程学习独立跳伞。掌握技能，完成25次跳伞，获得国际执照。",
    "servicePage.aff.heroTagline": "成为持照跳伞员",
    "servicePage.aff.step1.title": "报名 & 注册",
    "servicePage.aff.step1.desc": "报名AFF课程，完成医疗及安全表格。",
    "servicePage.aff.step2.title": "地面学校",
    "servicePage.aff.step2.desc": "密集课堂培训，涵盖空气动力学、紧急程序及装备知识。",
    "servicePage.aff.step3.title": "AFF 第1-3级",
    "servicePage.aff.step3.desc": "与两名教练一起跳伞，学习基本自由落体技能和稳定性。",
    "servicePage.aff.step4.title": "AFF 第4-7级",
    "servicePage.aff.step4.desc": "进阶到单教练跳伞。掌握转弯、追踪和开伞技术。",
    "servicePage.aff.step5.title": "独立跳伞 (8-25)",
    "servicePage.aff.step5.desc": "独立完成剩余跳伞次数，精进您的技术。",
    "servicePage.aff.step6.title": "取得执照！🎓",
    "servicePage.aff.step6.desc": "通过最终评估，获得国际认可的A级执照。",
    "servicePage.aff.curriculumBadge": "训练课程",
    "servicePage.aff.curriculumTitle": "跳伞训练课程全攻略",
    "servicePage.aff.curriculumDesc": "从地面训练到最终考核 — 完整的USPA A级执照训练流程一览。",
    "servicePage.aff.curriculumAlt": "A级执照跳伞训练课程全攻略，展示25跳完整进阶流程",
    "servicePage.aff.include1": "25次跳伞（A级执照要求）",
    "servicePage.aff.include2": "地面学校培训",
    "servicePage.aff.include3": "提供全部装备",
    "servicePage.aff.include4": "个人教练指导",
    "servicePage.aff.include5": "免费iFly室内跳伞体验",
    "servicePage.aff.testimonial": "AFF课程改变了我的人生。教练非常耐心且专业。现在我是持照跳伞员，每个周末都在跳伞！",
    "servicePage.aff.testimonialAuthor": "Mark R.，澳洲",
    "servicePage.aff.faq.q1": "A级执照课程需要多长时间？",
    "servicePage.aff.faq.a1": "通常需要7-14天，取决于天气和您的进度。在理想条件下，有些学员只需一周即可完成。",
    "servicePage.aff.faq.q2": "有什么先决条件？",
    "servicePage.aff.faq.a2": "您必须年满18岁，体重100公斤以下，身体健康。无需任何跳伞经验——AFF课程从零开始教学。",
    "servicePage.aff.faq.q3": "A级执照是国际认可的吗？",
    "servicePage.aff.faq.a3": "是的！USPA A级执照获全球认可。取得执照后，您可以在世界各地的跳伞场自由跳伞。",
    "servicePage.aff.faq.q4": "取得A级执照后可以做什么？",
    "servicePage.aff.faq.a4":
      "您可以在全球任何跳伞场独立跳伞！许多毕业学员会继续考取B、C、D级执照，学习编队跳伞、翼装飞行，或成为教练。",
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
    "location.zhuhai.desc": "Stunning coastal views near Macau with year-round skydiving conditions.",

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
    "service.Tandem Skydive with Ultimate Combo (Handicam + Wide shot)":
      "Tandem Skydive with Ultimate Combo (Handicam + Wide shot)",
    "service.Tandem Skydive with Ultimate Combo (Video + Photos)":
      "Tandem Skydive with Ultimate Combo (Video + Photos)",
    "service.A-License Package": "A-License Package",
    "service.Group Events": "Group Events",

    // Service types
    "serviceType.tandem": "Tandem Skydive",
    "serviceType.aff": "A-Licence",
    "serviceType.group": "Group Events",

    // Service includes
    "include.Handicam video recording": "Handicam video recording",
    "include.Wide shot video": "Wide shot video",
    "include.Certificate of completion": "Certificate of completion",
    "include.60 seconds of freefall": "45-60 seconds of freefall",
    "include.5-7 minute canopy ride": "5-7 minute canopy ride",
    "include.Video recording": "Video recording",
    "include.Photos": "Photos",
    "include.Dedicated group coordinator": "Dedicated group coordinator",
    "include.Private briefing session": "Private briefing session",
    "include.Group photos & videos": "Group photos & videos",
    "include.Celebration area access": "Celebration area access",
    "include.A free session of Shenzhen i-Fly experience": "A free session of Shenzhen i-Fly experience",

    // Price display
    "price.Custom Quote": "Custom Quote",
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
    "location.zhuhai.desc": "澳門附近的壯麗海岸景色，全年適合跳傘。",

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
    "service.Tandem Skydive with Ultimate Combo": "雙人傘終極組合",
    "service.Tandem Skydive with Ultimate Combo (Handicam + Wide shot)": "雙人傘終極組合（包含近鏡 + 全景拍攝）",
    "service.Tandem Skydive with Ultimate Combo (Video + Photos)": "雙人傘終極組合（包含影片 + 照片）",
    "service.A-License Package": "A級執照套餐",
    "service.Group Events": "團體活動",

    // Service types
    "serviceType.tandem": "雙人跳傘",
    "serviceType.aff": "A級執照",
    "serviceType.group": "團體活動",

    // Service includes
    "include.Handicam video recording": "手持攝影錄影",
    "include.Wide shot video": "全景拍攝影片",
    "include.Certificate of completion": "完成證書",
    "include.60 seconds of freefall": "45-60秒自由落體",
    "include.5-7 minute canopy ride": "5-7分鐘傘下飛行",
    "include.Video recording": "錄影",
    "include.Photos": "照片",
    "include.Dedicated group coordinator": "專屬團體協調員",
    "include.Private briefing session": "私人簡報環節",
    "include.Group photos & videos": "團體照片及影片",
    "include.Celebration area access": "慶祝區域使用",
    "include.A free session of Shenzhen i-Fly experience": "免費一次深圳i-Fly體驗",
    "include.25 Jumps": "25次跳傘",
    "include.Ground school training": "地面訓練",
    "include.All equipment provided": "所有跳傘裝備",
    "include.Personal instructor guidance": "教練全程手把手教學",

    // Price display
    "price.Custom Quote": "專屬報價",
  },
  "zh-CN": {
    // Location names
    "location.chiang-mai": "清迈 (Wefly)",
    "location.pattaya": "芭提雅",
    "location.hainan": "海南 (蔚蓝)",
    "location.huizhou": "惠州 (鹰飞)",
    "location.luoding": "罗定 (鹰飞)",
    "location.zhuhai": "珠海 (蔚蓝)",

    // Location descriptions
    "location.chiang-mai.desc": "在泰国北部壮丽的山脉和寺庙上空跳伞。",
    "location.pattaya.desc": "在芭提雅体验泰国湾的壮丽景色。",
    "location.hainan.desc": "在热带天堂跳伞，享受清澈的海景。",
    "location.huizhou.desc": "全年优美的海岸景色和完美的天气条件。",
    "location.luoding.desc": "广东省的新探险目的地。",
    "location.zhuhai.desc": "澳门附近的壮丽海岸景色，全年适合跳伞。",

    // Countries
    "country.Thailand": "泰国",
    "country.China": "中国",

    // Cities
    "city.Chiang Mai": "清迈",
    "city.Pattaya": "芭提雅",
    "city.Hainan": "海南",
    "city.Huizhou": "惠州",
    "city.Luoding": "罗定",
    "city.Zhuhai": "珠海",

    // Service names
    "service.Tandem Skydive with Handicam": "双人跳伞含手持摄影",
    "service.Tandem Skydive with Video": "双人跳伞含视频",
    "service.Tandem Skydive with Ultimate Combo": "双人伞终极组合",
    "service.Tandem Skydive with Ultimate Combo (Handicam + Wide shot)": "双人伞终极组合（包含近镜 + 全景拍摄）",
    "service.Tandem Skydive with Ultimate Combo (Video + Photos)": "双人伞终极组合（包含视频 + 照片）",
    "service.A-License Package": "A级执照套餐",
    "service.Group Events": "团体活动",

    // Service types
    "serviceType.tandem": "双人跳伞",
    "serviceType.aff": "A级执照",
    "serviceType.group": "团体活动",

    // Service includes
    "include.Handicam video recording": "手持摄影录影",
    "include.Wide shot video": "全景拍摄视频",
    "include.Certificate of completion": "完成证书",
    "include.60 seconds of freefall": "45-60秒自由落体",
    "include.5-7 minute canopy ride": "5-7分钟伞下飞行",
    "include.Dedicated group coordinator": "专属团体协调员",
    "include.Private briefing session": "私人简报环节",
    "include.Group photos & videos": "团体照片及视频",
    "include.Celebration area access": "庆祝区域使用",
    "include.A free session of Shenzhen i-Fly experience": "免费一次深圳i-Fly体验",
    "include.25 Jumps": "25次跳伞",
    "include.Ground school training": "地面训练",
    "include.All equipment provided": "所有跳伞装备",
    "include.Personal instructor guidance": "教练全程手把手教学",

    // Price display
    "price.Custom Quote": "专属报价",
  },
};

// FAQ Translations - English
translations.en["faq.badge"] = "Frequently Asked Questions";
translations.en["faq.title"] = "FAQ";
translations.en["faq.subtitle"] =
  "Got questions about skydiving? Here are the answers to the most common questions from our guests.";
translations.en["faq.moreQuestions"] = "Still have questions? We're here to help!";
translations.en["faq.contactUs"] = "Contact Us";

translations.en["faq.q1"] = "What are the age and weight requirements for skydiving?";
translations.en["faq.a1"] =
  "Participants must be at least 18 years old (valid ID required). Weight limits vary by location but typically range from 40kg to 100kg. If you're close to the weight limit, please contact us in advance as some locations may accommodate higher weights with specific arrangements.";

translations.en["faq.q2"] = "Do I need any prior experience to do a tandem skydive?";
translations.en["faq.a2"] =
  "No prior experience is needed for tandem skydiving! You'll be securely attached to a certified instructor who handles all technical aspects of the jump. We provide comprehensive training before each jump covering body position, emergency procedures, and landing techniques.";

translations.en["faq.q3"] = "Can I skydive if I have a fear of heights?";
translations.en["faq.a3"] =
  "Yes! Many of our guests have a fear of heights and still complete their jump successfully. At high altitude (13,000+ feet), the height perception is completely different from standing on a tall building. You're so high that there's no visual reference to trigger the typical fear response. Many people with acrophobia find skydiving surprisingly comfortable.";

translations.en["faq.q4"] = "Can I wear glasses or contact lenses while skydiving?";
translations.en["faq.a4"] =
  "Yes, you can wear both glasses and contact lenses. We provide protective goggles that fit comfortably over regular glasses. For contact lens wearers, the goggles also prevent them from drying out or being displaced during freefall.";

translations.en["faq.q5"] = "What is the difference between tandem skydiving and the A-Licence course?";
translations.en["faq.a5"] =
  "Tandem skydiving is a one-time experience where you're attached to an instructor. The A-Licence (AFF) course is a comprehensive training program (typically 25 jumps) that teaches you to skydive solo. After completing the course and passing the exam, you'll receive an internationally recognized license allowing you to jump independently at dropzones worldwide.";

translations.en["faq.q6"] = "How long does the entire skydiving experience take?";
translations.en["faq.a6"] =
  "Plan for approximately 3-4 hours for the entire experience. This includes registration, training (about 30 minutes), gearing up, the flight to altitude (15-20 minutes), the jump itself (1 minute of freefall + 5-7 minutes under canopy), and landing celebrations. Actual times may vary based on weather and the number of jumpers.";

translations.en["faq.q7"] = "Is skydiving safe?";
translations.en["faq.a7"] =
  "Skydiving is statistically one of the safest extreme sports when conducted with proper training and equipment. All our instructors are certified by international organizations (USPA/APF) with thousands of jumps of experience. Equipment includes multiple backup systems, including automatic deployment devices. Our safety record speaks for itself with zero accidents across all our locations.";

translations.en["faq.q8"] = "What should I wear for skydiving?";
translations.en["faq.a8"] =
  "Wear comfortable, weather-appropriate clothing that allows freedom of movement. Athletic wear, t-shirts, and long pants work well. Closed-toe athletic shoes are required (no sandals, heels, or loose footwear). Avoid loose jewelry, scarves, or anything that could get tangled. We provide jumpsuits, harnesses, goggles, and all necessary equipment.";

translations.en["faq.q9"] = "What happens if the weather is bad on my scheduled jump day?";
translations.en["faq.a9"] =
  "Safety is our top priority. If weather conditions are unsuitable (strong winds, rain, low visibility, thunderstorms), we will reschedule your jump at no additional cost. We recommend booking with some flexibility in your travel schedule to accommodate weather delays.";

translations.en["faq.q10"] = "Should I train in a wind tunnel before taking the A-Licence course?";
translations.en["faq.a10"] =
  "Wind tunnel training is optional but beneficial. One hour in a wind tunnel equals approximately 60-80 skydives worth of freefall practice. Some students prefer to train beforehand for efficiency, while others go directly to the dropzone and use the tunnel later if they encounter difficulties. We can provide recommendations based on your learning style.";

// FAQ Translations - Traditional Chinese
translations["zh-TW"]["faq.badge"] = "常見問題";
translations["zh-TW"]["faq.title"] = "常見問題";
translations["zh-TW"]["faq.subtitle"] = "對跳傘有疑問？以下是我們最常收到的問題解答。";
translations["zh-TW"]["faq.moreQuestions"] = "還有其他問題？我們隨時為您解答！";
translations["zh-TW"]["faq.contactUs"] = "聯絡我們";

translations["zh-TW"]["faq.q1"] = "跳傘的年齡和體重限制是什麼？";
translations["zh-TW"]["faq.a1"] =
  "參加者必須年滿18歲（需出示有效身份證明）。體重限制因地點而異，通常為40公斤至100公斤。如果您的體重接近上限，請提前與我們聯繫，部分場地可能可以作特別安排以容納較高體重的參加者。";

translations["zh-TW"]["faq.q2"] = "雙人跳傘需要任何經驗嗎？";
translations["zh-TW"]["faq.a2"] =
  "雙人跳傘完全不需要任何經驗！您將安全地連接在持證教練身上，由教練負責所有技術操作。我們會在每次跳傘前提供全面培訓，包括身體姿勢、緊急程序和著陸技巧。";

translations["zh-TW"]["faq.q3"] = "有懼高症可以跳傘嗎？";
translations["zh-TW"]["faq.a3"] =
  "可以！我們很多客人都有懼高症，但仍然成功完成跳傘。在高空（13,000英尺以上），高度感知與站在高樓上完全不同。當您身處如此高的位置時，沒有視覺參照物來觸發典型的恐懼反應。許多有恐高症的人會發現跳傘出乎意料地舒適。";

translations["zh-TW"]["faq.q4"] = "跳傘時可以戴眼鏡或隱形眼鏡嗎？";
translations["zh-TW"]["faq.a4"] =
  "可以，您可以佩戴眼鏡或隱形眼鏡。我們提供的護目鏡可以舒適地戴在普通眼鏡外面。對於佩戴隱形眼鏡的人，護目鏡也能防止鏡片在自由落體期間乾燥或移位。";

translations["zh-TW"]["faq.q5"] = "雙人跳傘與A級執照課程有什麼分別？";
translations["zh-TW"]["faq.a5"] =
  "雙人跳傘是一次性的體驗，您會與教練連接在一起。A級執照（AFF）課程是一個全面的培訓計劃（通常需要25次跳傘），教您如何獨立跳傘。完成課程並通過考試後，您將獲得國際認可的執照，可以在全球各地的跳傘場獨立跳傘。";

translations["zh-TW"]["faq.q6"] = "整個跳傘體驗需要多長時間？";
translations["zh-TW"]["faq.a6"] =
  "請預留大約3-4小時。這包括登記、培訓（約30分鐘）、穿戴裝備、飛到指定高度（15-20分鐘）、跳傘本身（約1分鐘自由落體 + 5-7分鐘傘下飛行），以及著陸後慶祝。實際時間可能因天氣和跳傘人數而異。";

translations["zh-TW"]["faq.q7"] = "跳傘安全嗎？";
translations["zh-TW"]["faq.a7"] =
  "在正確的培訓和設備下，跳傘在統計上是最安全的極限運動之一。我們所有教練都獲得國際組織（USPA/APF）認證，擁有數千次跳傘經驗。設備包括多重備份系統，包括自動開傘裝置。我們在所有場地保持零事故的安全紀錄。";

translations["zh-TW"]["faq.q8"] = "跳傘應該穿什麼？";
translations["zh-TW"]["faq.a8"] =
  "穿著舒適、適合天氣且方便活動的衣服。運動服、T恤和長褲都很合適。必須穿著包腳趾的運動鞋（不可穿涼鞋、高跟鞋或鬆脫的鞋子）。避免佩戴容易纏繞的鬆散珠寶、圍巾等物品。我們會提供跳傘服、安全帶、護目鏡及所有必要裝備。";

translations["zh-TW"]["faq.q9"] = "如果預定跳傘當天天氣不好怎麼辦？";
translations["zh-TW"]["faq.a9"] =
  "安全是我們的首要考慮。如果天氣條件不適合（強風、下雨、能見度低、雷暴），我們將免費為您重新安排跳傘日期。我們建議預訂時在行程中保留一些彈性，以應對可能的天氣延誤。";

translations["zh-TW"]["faq.q10"] = "學習A級執照課程前應該先去風洞訓練嗎？";
translations["zh-TW"]["faq.a10"] =
  "風洞訓練是可選的，但確實有幫助。在風洞中訓練一小時，相當於約60-80次跳傘的自由落體練習。有些學員喜歡事先訓練以提高效率，有些則直接去跳傘場，等遇到困難時再去風洞練習。我們可以根據您的學習風格提供建議。";

// FAQ Translations - Simplified Chinese
translations["zh-CN"]["faq.badge"] = "常见问题";
translations["zh-CN"]["faq.title"] = "常见问题";
translations["zh-CN"]["faq.subtitle"] = "对跳伞有疑问？以下是我们最常收到的问题解答。";
translations["zh-CN"]["faq.moreQuestions"] = "还有其他问题？我们随时为您解答！";
translations["zh-CN"]["faq.contactUs"] = "联系我们";

translations["zh-CN"]["faq.q1"] = "跳伞的年龄和体重限制是什么？";
translations["zh-CN"]["faq.a1"] =
  "参加者必须年满18岁（需出示有效身份证明）。体重限制因地而异，通常为40公斤至100公斤。如果您的体重接近上限，请提前与我们联系，部分场地可能可以作特别安排以容纳较高体重的参加者。";

translations["zh-CN"]["faq.q2"] = "双人跳伞需要任何经验吗？";
translations["zh-CN"]["faq.a2"] =
  "双人跳伞完全不需要任何经验！您将安全地连接在持证教练身上，由教练负责所有技术操作。我们会在每次跳伞前提供全面培训，包括身体姿势、紧急程序和着陆技巧。";

translations["zh-CN"]["faq.q3"] = "有恐高症可以跳伞吗？";
translations["zh-CN"]["faq.a3"] =
  "可以！我们很多客人都有恐高症，但仍然成功完成跳伞。在高空（13,000英尺以上），高度感知与站在高楼上完全不同。当您身处如此高的位置时，没有视觉参照物来触发典型的恐惧反应。许多有恐高症的人会发现跳伞出乎意料地舒适。";

translations["zh-CN"]["faq.q4"] = "跳伞时可以戴眼镜或隐形眼镜吗？";
translations["zh-CN"]["faq.a4"] =
  "可以，您可以佩戴眼镜或隐形眼镜。我们提供的护目镜可以舒适地戴在普通眼镜外面。对于佩戴隐形眼镜的人，护目镜也能防止镜片在自由落体期间干燥或移位。";

translations["zh-CN"]["faq.q5"] = "双人跳伞与A级执照课程有什么区别？";
translations["zh-CN"]["faq.a5"] =
  "双人跳伞是一次性的体验，您会与教练连接在一起。A级执照（AFF）课程是一个全面的培训计划（通常需要25次跳伞），教您如何独立跳伞。完成课程并通过考试后，您将获得国际认可的执照，可以在全球各地的跳伞场独立跳伞。";

translations["zh-CN"]["faq.q6"] = "整个跳伞体验需要多长时间？";
translations["zh-CN"]["faq.a6"] =
  "请预留大约3-4小时。这包括登记、培训（约30分钟）、穿戴装备、飞到指定高度（15-20分钟）、跳伞本身（约1分钟自由落体 + 5-7分钟伞下飞行），以及着陆后庆祝。实际时间可能因天气和跳伞人数而异。";

translations["zh-CN"]["faq.q7"] = "跳伞安全吗？";
translations["zh-CN"]["faq.a7"] =
  "在正确的培训和设备下，跳伞在统计上是最安全的极限运动之一。我们所有教练都获得国际组织（USPA/APF）认证，拥有数千次跳伞经验。设备包括多重备份系统，包括自动开伞装置。我们在所有场地保持零事故的安全记录。";

translations["zh-CN"]["faq.q8"] = "跳伞应该穿什么？";
translations["zh-CN"]["faq.a8"] =
  "穿着舒适、适合天气且方便活动的衣服。运动服、T恤和长裤都很合适。必须穿着包脚趾的运动鞋（不可穿凉鞋、高跟鞋或松脱的鞋子）。避免佩戴容易缠绕的松散珠宝、围巾等物品。我们会提供跳伞服、安全带、护目镜及所有必要装备。";

translations["zh-CN"]["faq.q9"] = "如果预定跳伞当天天气不好怎么办？";
translations["zh-CN"]["faq.a9"] =
  "安全是我们的首要考虑。如果天气条件不适合（强风、下雨、能见度低、雷暴），我们将免费为您重新安排跳伞日期。我们建议预订时在行程中保留一些弹性，以应对可能的天气延误。";

translations["zh-CN"]["faq.q10"] = "学习A级执照课程前应该先去风洞训练吗？";
translations["zh-CN"]["faq.a10"] =
  "风洞训练是可选的，但确实有帮助。在风洞中训练一小时，相当于约60-80次跳伞的自由落体练习。有些学员喜欢事先训练以提高效率，有些则直接去跳伞场，等遇到困难时再去风洞练习。我们可以根据您的学习风格提供建议。";

// Testimonials - English
translations.en["testimonials.badge"] = "What Jumpers Say";
translations.en["testimonials.title"] = "Happy Jumpers";
translations.en["testimonials.subtitle"] =
  "Hear from adventurers who took the leap with us and lived to tell the tale.";
translations.en["testimonials.review1.name"] = "Sarah L.";
translations.en["testimonials.review1.location"] = "Hong Kong";
translations.en["testimonials.review1.quote"] =
  "Absolutely incredible experience! The instructors were professional and made me feel safe the entire time. The views over Pattaya were breathtaking. Already planning my next jump!";
translations.en["testimonials.review1.service"] = "Tandem";
translations.en["testimonials.review2.name"] = "David C.";
translations.en["testimonials.review2.location"] = "Hong Kong";
translations.en["testimonials.review2.quote"] =
  "Completed my A-Licence with Let's Skydive and it was the best decision ever. The training was thorough and the instructors genuinely cared about my progress. Now I'm a licensed skydiver!";
translations.en["testimonials.review2.service"] = "A-Licence";
translations.en["testimonials.review3.name"] = "Jessica W.";
translations.en["testimonials.review3.location"] = "Singapore";
translations.en["testimonials.review3.quote"] =
  "We booked a group event for my husband's birthday — 8 of us jumped together! The coordination was flawless and the photos & videos were amazing. Truly unforgettable.";
translations.en["testimonials.review3.service"] = "Group Event";
translations.en["testimonials.review4.name"] = "Tom H.";
translations.en["testimonials.review4.location"] = "UK";
translations.en["testimonials.review4.quote"] =
  "I was terrified of heights but the team was so encouraging. The 60 seconds of freefall changed my life — pure freedom! Highly recommend for anyone on the fence.";
translations.en["testimonials.review4.service"] = "Tandem";
translations.en["testimonials.review5.name"] = "Yuki T.";
translations.en["testimonials.review5.location"] = "Japan";
translations.en["testimonials.review5.quote"] =
  "Best organised skydiving experience in Asia. Everything from pickup to the jump itself was seamless. The canopy ride with ocean views was magical. Five stars!";
translations.en["testimonials.review5.service"] = "Tandem";
translations.en["testimonials.review6.name"] = "Mark R.";
translations.en["testimonials.review6.location"] = "Australia";
translations.en["testimonials.review6.quote"] =
  "As a licensed skydiver, I appreciate how seriously they take safety. Top-notch equipment, well-maintained aircraft, and the dropzones are stunning. Great fun jumps!";
translations.en["testimonials.review6.service"] = "A-Licence";

// Testimonials - Traditional Chinese
translations["zh-TW"]["testimonials.badge"] = "跳傘者的話";
translations["zh-TW"]["testimonials.title"] = "快樂的跳傘者";
translations["zh-TW"]["testimonials.subtitle"] = "聽聽與我們一起挑戰的冒險者們怎麼說。";
translations["zh-TW"]["testimonials.review1.name"] = "呀淇";
translations["zh-TW"]["testimonials.review1.location"] = "香港";
translations["zh-TW"]["testimonials.review1.quote"] =
  "🪂 原來好安全。伴隨飛機離地高度增加，自動驚🥶 原先較多雲，但跳落去時萬里無雲，能見度極高，竟然呆咗😱（風景太清晰，反而細胆，無咗好好享受在天空的感覺）好快，時間流走，又回到地面。原來，會唔捨得喺天空嘅時間。有啲遺憾，解決方法：之後要玩多次😆";
translations["zh-TW"]["testimonials.review1.service"] = "雙人跳傘";
translations["zh-TW"]["testimonials.review2.name"] = "David";
translations["zh-TW"]["testimonials.review2.location"] = "香港";
translations["zh-TW"]["testimonials.review2.quote"] =
  "在Let's Skydive完成了A級執照課程，這是我做過最好的決定。培訓非常全面，教練真心關心我的進步。現在我是持照跳傘員了！";
translations["zh-TW"]["testimonials.review2.service"] = "A級執照";
translations["zh-TW"]["testimonials.review3.name"] = "Adrian";
translations["zh-TW"]["testimonials.review3.location"] = "香港";
translations["zh-TW"]["testimonials.review3.quote"] =
  "臨時應變做得好好 好不容易🥹 即使好多突發情況都無特別影響到體驗~ 多謝你咁細心嘅安排😆 特別係間溫泉別墅 真係好正！";
translations["zh-TW"]["testimonials.review3.service"] = "團體活動";
translations["zh-TW"]["testimonials.review4.name"] = "Tom";
translations["zh-TW"]["testimonials.review4.location"] = "香港";
translations["zh-TW"]["testimonials.review4.quote"] =
  "整體很好，辛苦晒☺️ 懂應變，星期六有意外就 多一次模擬跳傘，住的地方👍🏻👍🏻 ";
translations["zh-TW"]["testimonials.review4.service"] = "雙人跳傘";
translations["zh-TW"]["testimonials.review5.name"] = "Kaylie";
translations["zh-TW"]["testimonials.review5.location"] = "香港";
translations["zh-TW"]["testimonials.review5.quote"] =
  "多謝你俾咗個咁好嘅體驗我，唔講唔知原來大陸都有得跳傘，你搵嗰間溫泉旅館，簡直係無敵🥳🥳🥳多謝大家「飲」酒嘅時候俾咗咁多歡樂「我」😌 啲氣足夠飽2日😂😂😂";
translations["zh-TW"]["testimonials.review5.service"] = "雙人跳傘";
translations["zh-TW"]["testimonials.review6.name"] = "Mark R.";
translations["zh-TW"]["testimonials.review6.location"] = "澳洲";
translations["zh-TW"]["testimonials.review6.quote"] =
  "作為持照跳傘員，我欣賞他們對安全的重視。一流的設備、維護良好的飛機，跳傘場景色優美。非常棒的跳傘體驗！";
translations["zh-TW"]["testimonials.review6.service"] = "A級執照";

// Testimonials - Simplified Chinese
translations["zh-CN"]["testimonials.badge"] = "跳伞者的话";
translations["zh-CN"]["testimonials.title"] = "快乐的跳伞者";
translations["zh-CN"]["testimonials.subtitle"] = "听听与我们一起挑战的冒险者们怎么说。";
translations["zh-CN"]["testimonials.review1.name"] = "呀淇";
translations["zh-CN"]["testimonials.review1.location"] = "香港";
translations["zh-CN"]["testimonials.review1.quote"] =
  "🪂 原来好安全。伴随飞机离地高度增加，自动紧张🥶 原先较多云，但跳下去时万里无云，能见度极高，竟然呆了😱（风景太清晰，反而胆小，没有好好享受在天空的感觉）好快，时间流走，又回到地面。原来，会舍不得在天空的时间。有些遗憾，解决方法：之后要玩多次😆";
translations["zh-CN"]["testimonials.review1.service"] = "双人跳伞";
translations["zh-CN"]["testimonials.review2.name"] = "David";
translations["zh-CN"]["testimonials.review2.location"] = "香港";
translations["zh-CN"]["testimonials.review2.quote"] =
  "在Let's Skydive完成了A级执照课程，这是我做过最好的决定。培训非常全面，教练真心关心我的进步。现在我是持照跳伞员了！";
translations["zh-CN"]["testimonials.review2.service"] = "A级执照";
translations["zh-CN"]["testimonials.review3.name"] = "Adrian";
translations["zh-CN"]["testimonials.review3.location"] = "香港";
translations["zh-CN"]["testimonials.review3.quote"] =
  "临时应变做得很好，好不容易🥹 即使好多突发情况都没特别影响到体验~ 谢谢你这么细心的安排😆 特别是那间温泉别墅，真的好棒！";
translations["zh-CN"]["testimonials.review3.service"] = "团体活动";
translations["zh-CN"]["testimonials.review4.name"] = "Tom";
translations["zh-CN"]["testimonials.review4.location"] = "香港";
translations["zh-CN"]["testimonials.review4.quote"] =
  "整体很好，辛苦了☺️ 懂应变，星期六有意外就多一次模拟跳伞，住的地方👍🏻👍🏻";
translations["zh-CN"]["testimonials.review4.service"] = "双人跳伞";
translations["zh-CN"]["testimonials.review5.name"] = "Kaylie";
translations["zh-CN"]["testimonials.review5.location"] = "香港";
translations["zh-CN"]["testimonials.review5.quote"] =
  "谢谢你给了这么好的体验，不说不知道原来大陆也有跳伞，你找的那间温泉旅馆简直无敌🥳🥳🥳谢谢大家「喝」酒的时候给了这么多欢乐😌 开心到够饱两天😂😂😂";
translations["zh-CN"]["testimonials.review5.service"] = "双人跳伞";
translations["zh-CN"]["testimonials.review6.name"] = "Mark R.";
translations["zh-CN"]["testimonials.review6.location"] = "澳洲";
translations["zh-CN"]["testimonials.review6.quote"] =
  "作为持照跳伞员，我欣赏他们对安全的重视。一流的设备、维护良好的飞机，跳伞场景色优美。非常棒的跳伞体验！";
translations["zh-CN"]["testimonials.review6.service"] = "A级执照";

// WhatsApp Widget - English
translations.en["whatsapp.title"] = "Let's Skydive HK";
translations.en["whatsapp.subtitle"] = "Typically replies within an hour";
translations.en["whatsapp.greeting"] =
  "Hey there! 👋 How can we help you today? Choose a topic below or type your own message.";
translations.en["whatsapp.quickOptions"] = "Quick questions:";
translations.en["whatsapp.quick.tandem"] = "I'd like to book a tandem skydive!";
translations.en["whatsapp.quick.aff"] = "Tell me about A-Licence courses";
translations.en["whatsapp.quick.group"] = "I'm interested in group events";
translations.en["whatsapp.quick.general"] = "I have a general question";
translations.en["whatsapp.placeholder"] = "Type a message...";

// WhatsApp Widget - Traditional Chinese
translations["zh-TW"]["whatsapp.title"] = "Let's Skydive HK";
translations["zh-TW"]["whatsapp.subtitle"] = "通常在一小時內回覆";
translations["zh-TW"]["whatsapp.greeting"] = "你好！👋 有什麼可以幫到你？選擇以下話題或輸入你的訊息。";
translations["zh-TW"]["whatsapp.quickOptions"] = "常見問題：";
translations["zh-TW"]["whatsapp.quick.tandem"] = "我想預約雙人跳傘！";
translations["zh-TW"]["whatsapp.quick.aff"] = "想了解A級執照課程";
translations["zh-TW"]["whatsapp.quick.group"] = "我對團體活動有興趣";
translations["zh-TW"]["whatsapp.quick.general"] = "我有一般問題想查詢";
translations["zh-TW"]["whatsapp.placeholder"] = "輸入訊息...";

// WhatsApp Widget - Simplified Chinese
translations["zh-CN"]["whatsapp.title"] = "Let's Skydive HK";
translations["zh-CN"]["whatsapp.subtitle"] = "通常在一小时内回复";
translations["zh-CN"]["whatsapp.greeting"] = "你好！👋 有什么可以帮到你？选择以下话题或输入你的消息。";
translations["zh-CN"]["whatsapp.quickOptions"] = "常见问题：";
translations["zh-CN"]["whatsapp.quick.tandem"] = "我想预约双人跳伞！";
translations["zh-CN"]["whatsapp.quick.aff"] = "想了解A级执照课程";
translations["zh-CN"]["whatsapp.quick.group"] = "我对团体活动有兴趣";
translations["zh-CN"]["whatsapp.quick.general"] = "我有一般问题想咨询";
translations["zh-CN"]["whatsapp.placeholder"] = "输入消息...";

// ===== Sticky Booking Bar =====
translations.en["sticky.message"] = "Ready to jump? Limited slots available this weekend!";
translations.en["sticky.messageMobile"] = "Book your jump now!";
translations["zh-TW"]["sticky.message"] = "準備好飛翔了嗎？本週末名額有限！";
translations["zh-TW"]["sticky.messageMobile"] = "立即預約！";
translations["zh-CN"]["sticky.message"] = "准备好飞翔了吗？本周末名额有限！";
translations["zh-CN"]["sticky.messageMobile"] = "立即预约！";

// ===== Social Proof Ticker =====
translations.en["social.booked"] = "{name} just booked a Tandem Skydive! 🪂";
translations.en["social.recentCount"] = "{count} people booked in the last 24 hours 🔥";
translations.en["social.slotsLeft"] = "Only {count} slots left this Saturday! ⏰";
translations["zh-TW"]["social.booked"] = "{name} 剛剛預約了雙人跳傘！🪂";
translations["zh-TW"]["social.recentCount"] = "過去24小時有 {count} 人預約 🔥";
translations["zh-TW"]["social.slotsLeft"] = "本週六僅剩 {count} 個名額！⏰";
translations["zh-CN"]["social.booked"] = "{name} 刚刚预约了双人跳伞！🪂";
translations["zh-CN"]["social.recentCount"] = "过去24小时有 {count} 人预约 🔥";
translations["zh-CN"]["social.slotsLeft"] = "本周六仅剩 {count} 个名额！⏰";

// ===== Countdown Timer =====
translations.en["countdown.endsIn"] = "Offer ends in";
translations.en["countdown.daysLeft"] = "{days}d left";
translations.en["countdown.d"] = "d";
translations.en["countdown.h"] = "h";
translations.en["countdown.m"] = "m";
translations.en["countdown.s"] = "s";
translations["zh-TW"]["countdown.endsIn"] = "優惠倒數";
translations["zh-TW"]["countdown.daysLeft"] = "剩餘 {days} 天";
translations["zh-TW"]["countdown.d"] = "天";
translations["zh-TW"]["countdown.h"] = "時";
translations["zh-TW"]["countdown.m"] = "分";
translations["zh-TW"]["countdown.s"] = "秒";
translations["zh-CN"]["countdown.endsIn"] = "优惠倒数";
translations["zh-CN"]["countdown.daysLeft"] = "剩余 {days} 天";
translations["zh-CN"]["countdown.d"] = "天";
translations["zh-CN"]["countdown.h"] = "时";
translations["zh-CN"]["countdown.m"] = "分";
translations["zh-CN"]["countdown.s"] = "秒";

// ===== Video Hero =====
translations.en["hero.cta.watchVideo"] = "Watch Video";
translations["zh-TW"]["hero.cta.watchVideo"] = "觀看影片";
translations["zh-CN"]["hero.cta.watchVideo"] = "观看视频";

// ===== Jump Quiz =====
translations.en["quiz.badge"] = "Find Your Jump";
translations.en["quiz.title"] = "What's Your Jump Style?";
translations.en["quiz.subtitle"] = "Answer 3 quick questions and we'll recommend the perfect skydiving experience for you.";
translations.en["quiz.q1"] = "Have you skydived before?";
translations.en["quiz.q1.a"] = "🆕 No, this is my first time!";
translations.en["quiz.q1.b"] = "✅ Yes, I've jumped before";
translations.en["quiz.q2"] = "Who are you jumping with?";
translations.en["quiz.q2.a"] = "🙋 Just me, solo adventure";
translations.en["quiz.q2.b"] = "👫 With friends or partner";
translations.en["quiz.q2.c"] = "🏢 Corporate / team building event";
translations.en["quiz.q3"] = "What's your thrill level?";
translations.en["quiz.q3.a"] = "😊 Casual — enjoy the view";
translations.en["quiz.q3.b"] = "🔥 Full-on adrenaline rush";
translations.en["quiz.q3.c"] = "🚀 Life-changing — I want my own licence!";
translations.en["quiz.result.tandem.title"] = "Tandem Skydive";
translations.en["quiz.result.tandem.desc"] = "Perfect for you! Jump securely with an expert instructor and enjoy the ultimate freefall experience.";
translations.en["quiz.result.alicence.title"] = "A-Licence Course";
translations.en["quiz.result.alicence.desc"] = "Ready to fly solo! Our AFF program will take you from student to licensed skydiver.";
translations.en["quiz.result.group.title"] = "Group Event";
translations.en["quiz.result.group.desc"] = "The perfect team experience! We'll organize an unforgettable group skydiving day.";
translations.en["quiz.bookThis"] = "Book This Experience";
translations.en["quiz.tryAgain"] = "Try Again";

translations["zh-TW"]["quiz.badge"] = "找到你的跳法";
translations["zh-TW"]["quiz.title"] = "你適合哪種跳傘？";
translations["zh-TW"]["quiz.subtitle"] = "回答3個簡單問題，我們為你推薦最適合的跳傘體驗。";
translations["zh-TW"]["quiz.q1"] = "你有跳傘經驗嗎？";
translations["zh-TW"]["quiz.q1.a"] = "🆕 沒有，這是第一次！";
translations["zh-TW"]["quiz.q1.b"] = "✅ 有，我之前跳過";
translations["zh-TW"]["quiz.q2"] = "你和誰一起跳？";
translations["zh-TW"]["quiz.q2.a"] = "🙋 獨自冒險";
translations["zh-TW"]["quiz.q2.b"] = "👫 和朋友或伴侶";
translations["zh-TW"]["quiz.q2.c"] = "🏢 企業/團隊建設活動";
translations["zh-TW"]["quiz.q3"] = "你的刺激程度？";
translations["zh-TW"]["quiz.q3.a"] = "😊 輕鬆——享受風景";
translations["zh-TW"]["quiz.q3.b"] = "🔥 全力腎上腺素飆升";
translations["zh-TW"]["quiz.q3.c"] = "🚀 改變人生——我要考執照！";
translations["zh-TW"]["quiz.result.tandem.title"] = "雙人跳傘";
translations["zh-TW"]["quiz.result.tandem.desc"] = "最適合你！與專業教練安全地體驗極致自由落體。";
translations["zh-TW"]["quiz.result.alicence.title"] = "A級執照課程";
translations["zh-TW"]["quiz.result.alicence.desc"] = "準備好獨自飛翔！AFF課程帶你從學員到持照跳傘員。";
translations["zh-TW"]["quiz.result.group.title"] = "團體活動";
translations["zh-TW"]["quiz.result.group.desc"] = "完美的團隊體驗！我們為你策劃一場難忘的團體跳傘日。";
translations["zh-TW"]["quiz.bookThis"] = "預約此體驗";
translations["zh-TW"]["quiz.tryAgain"] = "重新測試";

translations["zh-CN"]["quiz.badge"] = "找到你的跳法";
translations["zh-CN"]["quiz.title"] = "你适合哪种跳伞？";
translations["zh-CN"]["quiz.subtitle"] = "回答3个简单问题，我们为你推荐最适合的跳伞体验。";
translations["zh-CN"]["quiz.q1"] = "你有跳伞经验吗？";
translations["zh-CN"]["quiz.q1.a"] = "🆕 没有，这是第一次！";
translations["zh-CN"]["quiz.q1.b"] = "✅ 有，我之前跳过";
translations["zh-CN"]["quiz.q2"] = "你和谁一起跳？";
translations["zh-CN"]["quiz.q2.a"] = "🙋 独自冒险";
translations["zh-CN"]["quiz.q2.b"] = "👫 和朋友或伴侣";
translations["zh-CN"]["quiz.q2.c"] = "🏢 企业/团队建设活动";
translations["zh-CN"]["quiz.q3"] = "你的刺激程度？";
translations["zh-CN"]["quiz.q3.a"] = "😊 轻松——享受风景";
translations["zh-CN"]["quiz.q3.b"] = "🔥 全力肾上腺素飙升";
translations["zh-CN"]["quiz.q3.c"] = "🚀 改变人生——我要考执照！";
translations["zh-CN"]["quiz.result.tandem.title"] = "双人跳伞";
translations["zh-CN"]["quiz.result.tandem.desc"] = "最适合你！与专业教练安全地体验极致自由落体。";
translations["zh-CN"]["quiz.result.alicence.title"] = "A级执照课程";
translations["zh-CN"]["quiz.result.alicence.desc"] = "准备好独自飞翔！AFF课程带你从学员到持照跳伞员。";
translations["zh-CN"]["quiz.result.group.title"] = "团体活动";
translations["zh-CN"]["quiz.result.group.desc"] = "完美的团队体验！我们为你策划一场难忘的团体跳伞日。";
translations["zh-CN"]["quiz.bookThis"] = "预约此体验";
translations["zh-CN"]["quiz.tryAgain"] = "重新测试";

// Helper function to convert markdown-style bold (**text** or *text*) to HTML
const formatBoldText = (text: string): string => {
  return text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>");
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("preferred-language");
    return saved === "en" || saved === "zh-TW" || saved === "zh-CN" ? saved : "zh-TW";
  });

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("preferred-language", lang);
  };

  const t = (key: string): string => {
    const translation = translations[language][key] || key;
    return translation;
  };

  // Translate dynamic data from Supabase
  const translateData = (key: string, fallback: string): string => {
    const normalizedKey = key.replace(/[\r\n]+/g, " ").replace(/\s+/g, " ");
    return dataTranslations[language][normalizedKey] || dataTranslations[language][key] || fallback;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t, translateData }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
