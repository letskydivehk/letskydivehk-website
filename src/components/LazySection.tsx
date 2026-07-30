import { useEffect, useRef, useState, type ReactNode } from "react";

interface LazySectionProps {
  children: ReactNode;
  /** Pixel offset before viewport to start mounting. Default 300. */
  rootMargin?: string;
  /** Estimated height before mount so layout doesn't jump. */
  minHeight?: number | string;
  className?: string;
  /** Anchor id kept on the always-rendered wrapper so hash links work before mount. */
  id?: string;
  "aria-label"?: string;
}

/**
 * Defers rendering its children until the placeholder scrolls near the viewport.
 * Lightens initial JS execution for below-the-fold sections.
 */
export function LazySection({
  children,
  rootMargin = "300px",
  minHeight = 200,
  className,
  id,
  "aria-label": ariaLabel,
}: LazySectionProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, visible]);

  // When mounted via a hash link, the anchor target must exist immediately.
  useEffect(() => {
    if (!id || visible) return;
    if (window.location.hash === `#${id}`) setVisible(true);
  }, [id, visible]);

  return (
    <div
      ref={ref}
      id={id}
      aria-label={ariaLabel}
      className={className}
      style={!visible ? { minHeight: typeof minHeight === "number" ? `${minHeight}px` : minHeight } : undefined}
    >
      {visible ? children : null}
    </div>
  );
}
