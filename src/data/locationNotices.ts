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
  // Chiang Mai is shut down — handled via SHUT_DOWN_SLUGS / isEffectivelyComingSoon below.
};

// Frontend override: locations to treat as "Coming Soon" regardless of DB value.
// Used because the `locations` table has no public UPDATE policy.
export const SHUT_DOWN_SLUGS = new Set<string>(["chiang-mai"]);

export function isEffectivelyComingSoon(location: { slug?: string | null; coming_soon?: boolean | null } | null | undefined): boolean {
  if (!location) return false;
  if (location.coming_soon) return true;
  return !!location.slug && SHUT_DOWN_SLUGS.has(location.slug);
}

export function getLocationNotice(slug?: string | null): LocationNotice | null {
  if (!slug) return null;
  return LOCATION_NOTICES[slug] ?? null;
}

export function isDateAfterClosing(notice: LocationNotice | null, date: Date): boolean {
  if (!notice) return false;
  return date >= new Date(notice.closedFrom);
}
