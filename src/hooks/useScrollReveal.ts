import { useEffect } from "react";

/** Adds a soft rise-in to every homepage section as it enters view. */
export function useScrollReveal(selector = ".sky-reflection-home > section:not(#hero):not(#flight-journey):not(#locations):not(#safety)") {
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("is-revealed"); io.unobserve(e.target); }
    }), { rootMargin: "0px 0px -10% 0px", threshold: 0 });
    const observe = () => document.querySelectorAll(selector).forEach((el) => {
      if (!el.classList.contains("scroll-reveal")) { el.classList.add("scroll-reveal"); io.observe(el); }
    });
    observe();
    const mo = new MutationObserver(observe);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); };
  }, [selector]);
}
