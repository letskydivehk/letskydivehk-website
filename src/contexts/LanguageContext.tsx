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

    // Privacy Policy - English (COMPREHENSIVE VERSION)
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

    // Terms of Service - English (Updated with your provided content)
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

    // Disclaimer - English (COMPLETE WITH ACTUAL CONTENT)
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

    // Privacy Policy - Traditional Chinese (COMPREHENSIVE VERSION)
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

    // Terms of Service - Traditional Chinese (簡化結構)
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

    // Disclaimer - Traditional Chinese (FIXED WITH ACTUAL CONTENT)
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

// Helper function to convert markdown-style bold (**text** or *text*) to HTML
const formatBoldText = (text: string): string => {
  return text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>");
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string): string => {
    const translation = translations[language][key] || key;
    return translation;
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
