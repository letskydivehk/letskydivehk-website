// Soft notices for locations (closing, special events, etc.)
// No DB change required — keyed by location slug.

export type LocationNotice = {
  type: "closing";
  // Last day the dropzone operates (inclusive). YYYY-MM-DD
  lastOperatingDate: string;
  // First day the dropzone is closed (exclusive end). YYYY-MM-DD
  closedFrom: string;
};

export const LOCATION_NOTICES: Record<string, LocationNotice> = {
  "chiang-mai": {
    type: "closing",
    lastOperatingDate: "2026-06-30",
    closedFrom: "2026-07-01",
  },
};

export function getLocationNotice(slug?: string | null): LocationNotice | null {
  if (!slug) return null;
  return LOCATION_NOTICES[slug] ?? null;
}

export function isDateAfterClosing(notice: LocationNotice | null, date: Date): boolean {
  if (!notice) return false;
  return date >= new Date(notice.closedFrom);
}
