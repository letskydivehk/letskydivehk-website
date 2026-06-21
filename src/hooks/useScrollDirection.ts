import { useEffect, useState } from "react";

/**
 * Tracks scrollY and scroll direction.
 * Returns { y, scrolled (y>threshold), direction ('up'|'down') }.
 */
export function useScrollDirection(threshold = 50) {
  const [state, setState] = useState({
    y: typeof window !== "undefined" ? window.scrollY : 0,
    scrolled: false,
    direction: "up" as "up" | "down",
  });

  useEffect(() => {
    let lastY = window.scrollY;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        const y = window.scrollY;
        const direction = y > lastY + 4 ? "down" : y < lastY - 4 ? "up" : state.direction;
        setState({ y, scrolled: y > threshold, direction });
        lastY = y;
        raf = 0;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threshold]);

  return state;
}
