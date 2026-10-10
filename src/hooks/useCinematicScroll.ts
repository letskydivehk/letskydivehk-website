import { useEffect, useState } from "react";

// Native scrolling remains the source of truth; short screens get the linear layout.
export function useCinematicScroll(desktopOnly = false) {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const query = window.matchMedia(desktopOnly
      ? "(min-width: 1024px) and (min-height: 740px) and (prefers-reduced-motion: no-preference)"
      : "(min-height: 600px) and (prefers-reduced-motion: no-preference)");
    const update = () => setEnabled(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, [desktopOnly]);
  return enabled;
}