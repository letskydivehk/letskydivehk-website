import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCinematicScroll } from "@/hooks/useCinematicScroll";

export function HorizontalLocationTrack({ children, heading, count, country }: { children: ReactNode; heading: ReactNode; count: number; country: string }) {
  const enabled = useCinematicScroll(true);
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const [height, setHeight] = useState(0);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  useMotionValueEvent(scrollYProgress, "change", (p) => { if (enabled) setActive(Math.round(p * Math.max(0, count - 1))); });
  useEffect(() => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!track || !viewport) return;
    const update = () => {
      const travel = Math.max(0, track.scrollWidth - viewport.clientWidth);
      setDistance(travel);
      setHeight(window.innerHeight + travel);
    };
    const observer = new ResizeObserver(update);
    observer.observe(track);
    observer.observe(viewport);
    window.addEventListener("resize", update);
    update();
    return () => { observer.disconnect(); window.removeEventListener("resize", update); };
  }, [country, count, enabled]);
  const goTo = (index: number) => {
    const next = Math.max(0, Math.min(count - 1, index));
    if (enabled && sectionRef.current) {
      const top = sectionRef.current.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: top + distance * next / Math.max(1, count - 1), behavior: "smooth" });
    } else {
      const card = trackRef.current?.children[next];
      if (card instanceof HTMLElement) viewportRef.current?.scrollTo({ left: card.offsetLeft - (trackRef.current?.offsetLeft ?? 0), behavior: "smooth" });
      setActive(next);
    }
  };
  return <div ref={sectionRef} className={`home-location-scroll ${enabled && distance > 0 ? "is-cinematic" : "is-linear"}`} style={enabled && distance > 0 ? { height } : undefined}>
    <div className="home-location-sticky">
      {heading}
      <div ref={viewportRef} className="home-location-viewport" tabIndex={0} aria-label={t("locations.title")} onKeyDown={(event) => {
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); goTo(active + (event.key === "ArrowRight" ? 1 : -1)); }
      }} onScroll={() => {
        if (!enabled && viewportRef.current && trackRef.current) {
          const width = trackRef.current.children[0]?.getBoundingClientRect().width ?? 1;
          setActive(Math.min(count - 1, Math.round(viewportRef.current.scrollLeft / (width + 24))));
        }
      }}>
        <motion.div ref={trackRef} className="home-location-track" style={enabled ? { x } : undefined} onFocusCapture={(event) => {
          if (!enabled) return;
          const cards = Array.from(trackRef.current?.children ?? []);
          const index = cards.findIndex((card) => card.contains(event.target));
          if (index >= 0 && index !== active) goTo(index);
          if (viewportRef.current) viewportRef.current.scrollLeft = 0;
        }}>{children}</motion.div>
      </div>
      {count > 1 && <div className="home-location-controls"><span className="text-sm text-muted-foreground tabular-nums">{String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}</span><div className="flex gap-2"><Button variant="outline" size="icon" aria-label={t("scroll.previous")} disabled={active === 0} onClick={() => goTo(active - 1)}><ArrowLeft /></Button><Button variant="outline" size="icon" aria-label={t("scroll.next")} disabled={active >= count - 1} onClick={() => goTo(active + 1)}><ArrowRight /></Button></div></div>}
    </div>
  </div>;
}