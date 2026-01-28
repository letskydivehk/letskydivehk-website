import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Play, AlertCircle, Image } from "lucide-react";
import { GalleryItem } from "@/hooks/useGallery";
import { cn } from "@/lib/utils";

interface GalleryThumbnailsProps {
  items: GalleryItem[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export function GalleryThumbnails({ items, selectedIndex, onSelect }: GalleryThumbnailsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [errorImages, setErrorImages] = useState<Set<string>>(new Set());

  // Scroll selected item into view
  useEffect(() => {
    const selectedEl = itemRefs.current[selectedIndex];
    if (selectedEl && scrollRef.current) {
      const container = scrollRef.current;
      const elementLeft = selectedEl.offsetLeft;
      const elementWidth = selectedEl.offsetWidth;
      const containerWidth = container.clientWidth;
      const scrollLeft = elementLeft - containerWidth / 2 + elementWidth / 2;

      container.scrollTo({
        left: scrollLeft,
        behavior: "smooth",
      });
    }
  }, [selectedIndex]);

  // Reset loaded/error states when items change
  useEffect(() => {
    setLoadedImages(new Set());
    setErrorImages(new Set());
  }, [items]);

  const handleImageLoad = (id: string) => {
    setLoadedImages((prev) => new Set(prev).add(id));
    setErrorImages((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const handleImageError = (id: string, url: string) => {
    console.error(`Failed to load image: ${url}`);
    setErrorImages((prev) => new Set(prev).add(id));
    setLoadedImages((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  // Show placeholder if no items
  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Image className="h-16 w-16 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No gallery items found</p>
        <p className="text-sm text-muted-foreground mt-2">Upload photos or they will appear here automatically</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Show storage sync info */}
      {items.some((item) => item.is_storage_only) && (
        <div className="text-xs text-muted-foreground mb-2 text-center">
          {items.filter((item) => item.is_storage_only).length} item(s) imported from storage
        </div>
      )}

      {/* Gradient fade edges - only show if there are enough items to scroll */}
      {items.length > 3 && (
        <>
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        </>
      )}

      {/* Scrolling thumbnails */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto py-4 px-8 scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {items.map((item, index) => {
          const isLoaded = loadedImages.has(item.id);
          const hasError = errorImages.has(item.id);
          const isSelected = selectedIndex === index;

          return (
            <motion.button
              key={item.id}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              onClick={() => onSelect(index)}
              className={cn(
                "relative flex-shrink-0 w-32 h-24 md:w-40 md:h-28 rounded-lg overflow-hidden transition-all duration-300 group",
                isSelected
                  ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-105"
                  : "opacity-70 hover:opacity-100",
                hasError && "border border-destructive",
              )}
              whileHover={{ scale: isSelected ? 1.05 : 1.02 }}
              whileTap={{ scale: 0.98 }}
              title={item.title || `Item ${index + 1}`}
            >
              {/* Loading skeleton */}
              {!isLoaded && !hasError && <div className="absolute inset-0 bg-muted animate-pulse" />}

              {/* Error state */}
              {hasError ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-destructive/10">
                  <AlertCircle className="h-8 w-8 text-destructive mb-2" />
                  <span className="text-xs text-destructive px-2 text-center">Failed to load</span>
                </div>
              ) : item.media_type === "video" ? (
                <>
                  {item.thumbnail_url ? (
                    <img
                      src={item.thumbnail_url}
                      alt={item.title || "Video thumbnail"}
                      className="w-full h-full object-cover"
                      onLoad={() => handleImageLoad(item.id)}
                      onError={() => handleImageError(item.id, item.thumbnail_url!)}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                      <Play className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  {/* Video indicator */}
                  <div className="absolute bottom-1 right-1 bg-black/70 p-1 rounded">
                    <Play className="h-3 w-3 text-white" />
                  </div>
                </>
              ) : (
                <>
                  <img
                    src={item.file_url}
                    alt={item.title || "Gallery thumbnail"}
                    className={cn(
                      "w-full h-full object-cover transition-opacity duration-300",
                      isLoaded ? "opacity-100" : "opacity-0",
                    )}
                    onLoad={() => handleImageLoad(item.id)}
                    onError={() => handleImageError(item.id, item.file_url)}
                    loading="lazy"
                  />

                  {/* Storage indicator badge */}
                  {item.is_storage_only && (
                    <div className="absolute top-1 left-1 bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded">
                      Storage
                    </div>
                  )}
                </>
              )}

              {/* Selected indicator */}
              {isSelected && (
                <motion.div
                  layoutId="selected-indicator"
                  className="absolute inset-0 border-2 border-primary rounded-lg"
                />
              )}

              {/* Hover overlay with title */}
              {!isSelected && (
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-end p-2">
                  {item.title && (
                    <span className="text-white text-xs truncate opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {item.title}
                    </span>
                  )}
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Debug info (remove in production) */}
      {process.env.NODE_ENV === "development" && (
        <div className="text-xs text-muted-foreground mt-2 text-center">
          Showing {items.length} items • Loaded: {loadedImages.size} • Errors: {errorImages.size}
        </div>
      )}
    </div>
  );
}
