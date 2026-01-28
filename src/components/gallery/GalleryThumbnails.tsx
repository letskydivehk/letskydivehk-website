import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { GalleryItem } from '@/hooks/useGallery';
import { cn } from '@/lib/utils';

interface GalleryThumbnailsProps {
  items: GalleryItem[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export function GalleryThumbnails({ items, selectedIndex, onSelect }: GalleryThumbnailsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Scroll selected item into view
  useEffect(() => {
    const selectedEl = itemRefs.current[selectedIndex];
    if (selectedEl && scrollRef.current) {
      const container = scrollRef.current;
      const elementLeft = selectedEl.offsetLeft;
      const elementWidth = selectedEl.offsetWidth;
      const containerWidth = container.clientWidth;
      const scrollLeft = elementLeft - (containerWidth / 2) + (elementWidth / 2);
      
      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth',
      });
    }
  }, [selectedIndex]);

  return (
    <div className="relative">
      {/* Gradient fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      {/* Scrolling thumbnails */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto py-4 px-8 scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {items.map((item, index) => (
          <motion.button
            key={item.id}
            ref={(el) => { itemRefs.current[index] = el; }}
            onClick={() => onSelect(index)}
            className={cn(
              "relative flex-shrink-0 w-32 h-24 md:w-40 md:h-28 rounded-lg overflow-hidden transition-all duration-300",
              selectedIndex === index
                ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-105"
                : "opacity-70 hover:opacity-100"
            )}
            whileHover={{ scale: selectedIndex === index ? 1.05 : 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {item.media_type === 'video' ? (
              <>
                {item.thumbnail_url ? (
                  <img
                    src={item.thumbnail_url}
                    alt={item.title || 'Video thumbnail'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <Play className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                {/* Video indicator */}
                <div className="absolute bottom-1 right-1 bg-black/70 p-1 rounded">
                  <Play className="h-3 w-3 text-white" />
                </div>
              </>
            ) : (
              <img
                src={item.file_url}
                alt={item.title || 'Gallery thumbnail'}
                className="w-full h-full object-cover"
              />
            )}

            {/* Selected indicator */}
            {selectedIndex === index && (
              <motion.div
                layoutId="selected-indicator"
                className="absolute inset-0 border-2 border-primary rounded-lg"
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
