// Static services data - will be replaced with Firebase later
export interface Service {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  priceDisplay: string;
  priceNote?: string;
  duration: string;
  includes: string[];
  iconName: "parachute" | "graduation" | "users";
  isPopular: boolean;
  bookingType: "direct" | "contact"; // direct = can book online, contact = contact form only
  availableEverywhere: boolean;
  displayOrder: number;
}

export const services: Service[] = [
  {
    id: "tandem",
    slug: "tandem-skydive",
    title: "Tandem Skydive",
    subtitle: "First-time jumpers welcome",
    description:
      "Experience the ultimate thrill of freefall attached to an experienced instructor. No prior experience needed - just bring your sense of adventure!",
    priceDisplay: "From $299",
    priceNote: "Price varies by location",
    duration: "3-4 hours total (includes training)",
    includes: [
      "15-minute ground training",
      "60 seconds of freefall",
      "5-7 minute canopy ride",
      "Certificate of completion",
      "Photos & video available",
    ],
    iconName: "parachute",
    isPopular: true,
    bookingType: "direct",
    availableEverywhere: true,
    displayOrder: 1,
  },
  {
    id: "Alicences",
    slug: "A-Licences",
    title: "A-Licences",
    subtitle: "Learn to skydive solo",
    description:
      "Before getting your first licence, the Accelerated Freefall (AFF) program is your pathway to becoming a licensed skydiver. Master the skills to jump independently.",
    priceDisplay: "Contact for pricing",
    duration: "7-10 days intensive program",
    includes: [
      "25 Jumps",
      "Ground school training",
      "9 progressive jump levels",
      "Personal instructor guidance",
      "All equipment provided",
      "License preparation",
    ],
    iconName: "graduation",
    isPopular: false,
    bookingType: "contact",
    availableEverywhere: false, // Only at select locations
    displayOrder: 2,
  },
  {
    id: "group",
    slug: "group-events",
    title: "Group Events",
    subtitle: "Team building & celebrations",
    description:
      "Perfect for corporate team building, bachelor/bachelorette parties, birthdays, or any special occasion. Create unforgettable memories together!",
    priceDisplay: "Custom packages",
    priceNote: "Groups of 5+ receive special rates",
    duration: "Half day or full day options",
    includes: [
      "Dedicated group coordinator",
      "Private briefing session",
      "Group photos & videos",
      "Celebration area access",
      "Catering options available",
    ],
    iconName: "users",
    isPopular: false,
    bookingType: "contact",
    availableEverywhere: true,
    displayOrder: 3,
  },
];

export const getDirectBookingServices = () => {
  return services.filter((s) => s.bookingType === "direct");
};

export const getContactOnlyServices = () => {
  return services.filter((s) => s.bookingType === "contact");
};
