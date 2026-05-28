import { Skeleton } from "@/components/ui/skeleton";

interface CardGridSkeletonProps {
  count?: number;
  /** Tailwind grid columns class — defaults to a 1/2/3 layout. */
  className?: string;
  imageAspect?: string;
}

/**
 * Skeleton grid for card-based lists (Locations, Services, Blog).
 * Matches the final card silhouette so the page doesn't jump on mount.
 */
export function CardGridSkeleton({
  count = 6,
  className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto",
  imageAspect = "aspect-[4/3]",
}: CardGridSkeletonProps) {
  return (
    <div className={className} role="status" aria-label="Loading">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-border bg-card/60 overflow-hidden shadow-sm"
        >
          <Skeleton className={`${imageAspect} w-full rounded-none`} />
          <div className="p-5 space-y-3">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-9 w-24 rounded-lg" />
              <Skeleton className="h-9 w-24 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
      <span className="sr-only">Loading content…</span>
    </div>
  );
}
