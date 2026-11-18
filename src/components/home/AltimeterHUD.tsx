import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const copy = {
  "zh-TW": ["離機", "自由落體", "開傘", "安全着陸 🎉", "確認名額"],
  "zh-CN": ["离机", "自由落体", "开伞", "安全着陆 🎉", "确认名额"],
  en: ["Exit", "Freefall", "Canopy", "Touchdown 🎉", "Confirm spot"],
} as const;

/** Floating altimeter: page scroll maps 14,000 FT → 0 FT, landing at the booking section. */
export function AltimeterHUD() {
  const { language } = useLanguage();
  const reduced = useReducedMotion();
  const [p, setP] = useState(0);
  const [visible, setVisible] = useState(false);
  const raf = useRef(0);

  useEffect(() => {
    const update = () => {
      raf.current = 0;
      const hero = document.getElementById("hero");
      const booking = document.getElementById("booking");
      const start = hero ? hero.offsetHeight * 0.5 : 0;
      const end = booking ? booking.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.4 : document.body.scrollHeight - window.innerHeight;
      const value = Math.max(0, Math.min(1, (window.scrollY - start) / Math.max(1, end - start)));
      setP(value);
      // Step aside while the dropzone cards slide past so they are never covered.
      const loc = document.getElementById("locations")?.getBoundingClientRect();
      const overCards = !!loc && loc.top < window.innerHeight * 0.6 && loc.bottom > window.innerHeight * 0.4;
      setVisible(window.scrollY > start && !overCards);
    };
    const onScroll = () => { if (!raf.current) raf.current = requestAnimationFrame(update); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(raf.current); };
  }, []);

  const labels = copy[language as keyof typeof copy] ?? copy.en;
  const altitude = Math.round((14000 * (1 - p)) / 100) * 100;
  const speed = p < 0.08 ? Math.round(p / 0.08 * 200) : p < 0.7 ? 200 : Math.max(0, Math.round(200 - (p - 0.7) / 0.3 * 185));
  const stage = p >= 0.99 ? 3 : p >= 0.7 ? 2 : p >= 0.08 ? 1 : 0;
  const landed = stage === 3;

  return (
    <aside aria-hidden="true" className={`altimeter-hud ${visible ? "is-visible" : ""} ${landed ? "is-landed" : ""}`}>
      <div className="altimeter-track">
        <div className="altimeter-fill" style={{ transform: `scaleY(${p})` }} />
        <span className="altimeter-chute" style={{ top: `${p * 100}%`, transition: reduced ? "none" : undefined }}>🪂</span>
      </div>
      <div className="altimeter-readout">
        <span className="altimeter-stage">{labels[stage]}</span>
        <span className="altimeter-alt">{altitude.toLocaleString("en-US")}<small> FT</small></span>
        <span className="altimeter-speed">{speed} km/h</span>
        {landed && (
          <a href="#booking" className="altimeter-cta" aria-hidden="false">{labels[4]} →</a>
        )}
      </div>
    </aside>
  );
}
