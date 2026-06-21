// Baseline ("before") itineraries captured prior to the agency-style rewrite.
// Used by the admin compare screen to diff against the current DB values.
import type { ItineraryDay } from "@/hooks/useLocationServices";

export const PREVIOUS_ITINERARIES: Record<string, { name: string; itinerary: ItineraryDay[] }> = {
  "b7b4784f-a5d2-46ac-afc2-9dc9ce2170de": {
    name: "Hainan 3D2N Tour",
    itinerary: [
      { day: 1, title: "Arrival in Sanya", segments: [
        { period: "morning", items: [{ title: "Flight + transfer", location: "HK → Sanya" }] },
        { period: "afternoon", items: [{ title: "Beach walk" }] },
        { period: "evening", items: [{ title: "Welcome dinner" }, { title: "Beachfront resort" }] },
      ]},
      { day: 2, title: "Tandem Skydive Day", segments: [
        { period: "morning", items: [{ title: "Hotel ⇄ dropzone", location: "Weland Hainan dropzone" }] },
        { period: "afternoon", items: [{ title: "Tandem skydive" }, { title: "Video & photos" }] },
        { period: "evening", items: [{ title: "Breakfast + dinner" }, { title: "Beachfront resort" }] },
      ]},
      { day: 3, title: "Departure", segments: [
        { period: "morning", items: [{ title: "Transfer + flight", location: "Sanya → HK" }] },
        { period: "afternoon", items: [{ title: "Free morning" }] },
        { period: "evening", items: [{ title: "Breakfast" }] },
      ]},
    ],
  },
  "3ad0903a-b4a5-43f4-b072-84f3e9df52b3": {
    name: "Hainan 4D3N Tour",
    itinerary: [
      { day: 1, title: "Arrival", segments: [
        { period: "morning", items: [{ title: "Flight + transfer", location: "HK → Sanya" }] },
        { period: "afternoon", items: [{ title: "Beach sunset" }] },
        { period: "evening", items: [{ title: "Welcome dinner" }, { title: "Beachfront resort" }] },
      ]},
      { day: 2, title: "Tandem Skydive Day", segments: [
        { period: "morning", items: [{ title: "Hotel ⇄ dropzone", location: "Weland Hainan" }] },
        { period: "afternoon", items: [{ title: "Tandem skydive" }, { title: "Video & photos" }] },
        { period: "evening", items: [{ title: "Breakfast + lunch" }, { title: "Beachfront resort" }] },
      ]},
      { day: 3, title: "Yalong Bay & Wuzhizhou", segments: [
        { period: "morning", items: [{ title: "Private van", location: "Sanya coast" }] },
        { period: "afternoon", items: [{ title: "Island day trip" }, { title: "Snorkeling" }] },
        { period: "evening", items: [{ title: "Seafood lunch" }, { title: "Beachfront resort" }] },
      ]},
      { day: 4, title: "Departure", segments: [
        { period: "morning", items: [{ title: "Transfer + flight", location: "Sanya → HK" }] },
        { period: "afternoon", items: [{ title: "Shopping" }] },
        { period: "evening", items: [{ title: "Brunch" }] },
      ]},
    ],
  },
  "14f0dbbb-f186-46d7-b742-94f92e8da94f": {
    name: "Pattaya 3D2N Tour",
    itinerary: [
      { day: 1, title: "Arrival & Pattaya Beach", segments: [
        { period: "morning", items: [{ title: "Flight HKG–BKK + private transfer", location: "HK → Bangkok → Pattaya" }] },
        { period: "afternoon", items: [{ title: "Beach sunset" }, { title: "Walking Street stroll" }] },
        { period: "evening", items: [{ title: "Welcome seafood dinner" }, { title: "4★ Beachfront hotel (Central Pattaya)" }] },
      ]},
      { day: 2, title: "Tandem Skydive Day", segments: [
        { period: "morning", items: [{ title: "Hotel ⇄ dropzone shuttle", location: "Thai Sky Adventures dropzone" }] },
        { period: "afternoon", items: [{ title: "Briefing & gear-up" }, { title: "Tandem skydive from 13,000 ft" }, { title: "HD video & photos" }] },
        { period: "evening", items: [{ title: "Breakfast + celebratory dinner" }, { title: "4★ Beachfront hotel" }] },
      ]},
      { day: 3, title: "Brunch & Departure", segments: [
        { period: "morning", items: [{ title: "Private transfer + flight BKK–HKG", location: "Pattaya → Bangkok → Hong Kong" }] },
        { period: "afternoon", items: [{ title: "Free morning" }, { title: "Souvenir shopping" }] },
        { period: "evening", items: [{ title: "Beachside brunch" }] },
      ]},
    ],
  },
  "d77f6091-45d4-46d2-9c9c-aaeb2894c10e": {
    name: "Pattaya 4D3N Tour",
    itinerary: [
      { day: 1, title: "Arrival", segments: [
        { period: "morning", items: [{ title: "Flight + transfer", location: "HK → Bangkok → Pattaya" }] },
        { period: "afternoon", items: [{ title: "Beach sunset" }] },
        { period: "evening", items: [{ title: "Welcome dinner" }, { title: "4★ Beachfront hotel" }] },
      ]},
      { day: 2, title: "Island Hopping", segments: [
        { period: "morning", items: [{ title: "Speedboat", location: "Koh Larn" }] },
        { period: "afternoon", items: [{ title: "Snorkeling" }, { title: "Beach time" }] },
        { period: "evening", items: [{ title: "Breakfast + seafood lunch" }, { title: "4★ Beachfront hotel" }] },
      ]},
      { day: 3, title: "Tandem Skydive Day", segments: [
        { period: "morning", items: [{ title: "Hotel ⇄ dropzone", location: "Thai Sky Adventures" }] },
        { period: "afternoon", items: [{ title: "Tandem skydive" }, { title: "HD video & photos" }] },
        { period: "evening", items: [{ title: "Breakfast + dinner" }, { title: "4★ Beachfront hotel" }] },
      ]},
      { day: 4, title: "Departure", segments: [
        { period: "morning", items: [{ title: "Transfer + flight", location: "Pattaya → HK" }] },
        { period: "afternoon", items: [{ title: "Shopping" }] },
        { period: "evening", items: [{ title: "Brunch" }] },
      ]},
    ],
  },
};
