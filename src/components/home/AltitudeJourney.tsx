import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, type MotionValue } from "framer-motion";
import { ArrowDownRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCinematicScroll } from "@/hooks/useCinematicScroll";
import exitImage from "@/assets/hero-tandem.jpg";
import freefallImage from "@/assets/hero-a-licence.jpg";
import canopyImage from "@/assets/scroll-canopy.jpg";
import landingImage from "@/assets/scroll-landing.jpg";

const images = [exitImage, freefallImage, canopyImage, landingImage];
const altitudes = [14000, 8000, 4000, 0];

function JourneyImage({ index, progress, title }: { index: number; progress: MotionValue<number>; title: string }) {
  const opacity = useTransform(progress, (p) => {
    const position = p * 3;
    return Math.max(0, Math.min(1, (0.6 - Math.abs(position - index)) / 0.2));
  });
  const scale = useTransform(progress, [0, 1], [1.04, 1]);
  return <motion.img src={images[index]} alt={title} loading="lazy" width={1536} height={1024}
    className="home-journey-image" style={{ opacity, scale }} />;
}

export function AltitudeJourney() {
  const { t } = useLanguage();
  const enabled = useCinematicScroll();
  const ref = useRef<HTMLElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const [stage, setStage] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const dashOffset = useTransform(scrollYProgress, [0, 1], [0, 540]);
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setStage(Math.min(3, Math.round(p * 3)));
    const segment = Math.min(2, Math.floor(p * 3));
    const fraction = p * 3 - segment;
    const altitude = Math.round((altitudes[segment] + (altitudes[segment + 1] - altitudes[segment]) * fraction) / 100) * 100;
    if (numberRef.current) numberRef.current.textContent = altitude.toLocaleString("en-US");
  });
  const goToStage = (index: number) => {
    const el = ref.current;
    if (!el) return;
    const start = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: start + (el.offsetHeight - window.innerHeight) * index / 3, behavior: "smooth" });
  };

  return (
    <section id="flight-journey" ref={ref} className={`home-altitude-journey ${enabled ? "is-cinematic" : "is-linear"}`}>
      <div className="home-journey-sticky">
        <header className="home-journey-heading">
          <p className="text-accent-blue text-xs font-semibold mb-3">{t("scroll.journey.badge")}</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">{t("scroll.journey.title")}</h2>
          <p className="text-muted-foreground mt-3">{t("scroll.journey.subtitle")}</p>
        </header>
        {enabled ? <div className="home-journey-scene">
          <div className="home-altimeter">
            <div className="home-altimeter-dial">
              <svg viewBox="0 0 200 200" aria-hidden="true" className="home-dial-svg">
                <circle cx="100" cy="100" r="86" className="home-dial-track" />
                <motion.circle cx="100" cy="100" r="86" className="home-dial-progress" strokeDasharray="540" style={{ strokeDashoffset: dashOffset }} />
                {Array.from({ length: 40 }, (_, i) => <line key={i} x1="100" y1="5" x2="100" y2={i % 5 === 0 ? "17" : "11"} transform={`rotate(${i * 9} 100 100)`} className="home-dial-tick" />)}
              </svg>
              <div className="home-dial-reading"><span className="text-xs text-muted-foreground">{t("scroll.journey.altitude")}</span><span ref={numberRef} className="home-altitude-number">14,000</span><span className="text-accent-blue text-xs font-semibold">FT <ArrowDownRight className="inline h-4 w-4" /></span></div>
            </div>
            <div className="home-stage-copy" aria-live="polite">
              <p className="text-accent-blue text-xs font-semibold mb-2">0{stage + 1} / 04</p>
              <h3 className="text-xl lg:text-2xl font-bold mb-3">{t(`scroll.journey.stage${stage + 1}`)}</h3>
              <p className="text-muted-foreground leading-relaxed">{t(`scroll.journey.body${stage + 1}`)}</p>
            </div>
          </div>
          <div className="home-journey-visual">
            {images.map((_, i) => <JourneyImage key={i} index={i} progress={scrollYProgress} title={t(`scroll.journey.stage${i + 1}`)} />)}
            <div className="home-journey-stage-controls">{images.map((_, i) => <Button key={i} variant="ghost" size="icon" aria-label={t(`scroll.journey.stage${i + 1}`)} aria-pressed={stage === i} onClick={() => goToStage(i)} className={`home-stage-button ${stage === i ? "is-active" : ""}`}>0{i + 1}</Button>)}</div>
          </div>
        </div> : <div className="home-journey-linear-grid">{images.map((image, i) => <article key={image} className="home-journey-linear-step"><img src={image} alt={t(`scroll.journey.stage${i + 1}`)} loading="lazy" width={1536} height={1024} /><div className="py-5"><p className="text-accent-blue text-xs mb-2">0{i + 1} / 04</p><h3 className="font-bold text-xl mb-2">{t(`scroll.journey.stage${i + 1}`)}</h3><p className="text-muted-foreground">{t(`scroll.journey.body${i + 1}`)}</p></div></article>)}</div>}
        <div className="home-journey-footer"><p className="text-xs text-muted-foreground max-w-lg">{t("scroll.journey.note")}</p><Button variant="link" onClick={() => document.getElementById("locations")?.scrollIntoView({ behavior: enabled ? "smooth" : "auto" })}>{t("scroll.skip")}<ArrowRight /></Button></div>
      </div>
    </section>
  );
}