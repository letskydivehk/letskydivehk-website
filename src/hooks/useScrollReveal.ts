import { useEffect } from "react";

/** Adds a soft rise-in to every homepage section as it enters view. */
export function useScrollReveal(selector = ".sky-reflection-home > section:not(#hero):not(#flight-journey):not(#locations):not(#safety)") {
  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      document.querySelectorAll(selector).forEach((el) => {
        if (!el.classList.contains("scroll-reveal")) el.classList.add("scroll-reveal");
        if (!el.classList.contains("is-revealed") && el.getBoundingClientRect().top < window.innerHeight * 0.92) el.classList.add("is-revealed");
      });
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(check); };
    check();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const mo = new MutationObserver(schedule);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); mo.disconnect(); cancelAnimationFrame(raf); };
  }, [selector]);
}
