import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowDown, Gauge, Mountain, Plane, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { EligibilityChips } from "@/components/EligibilityChips";
import { TrustBar } from "@/components/TrustBar";
import { useLanguage } from "@/contexts/LanguageContext";
import heroSkydiverVideo from "@/assets/hero-skydiver.mp4.asset.json";
import heroSkydiverVideo2 from "@/assets/hero-skydiver-2.mp4.asset.json";
import heroSkydiverVideo3 from "@/assets/hero-skydiver-3.mp4.asset.json";

const HERO_CLIPS = [heroSkydiverVideo.url, heroSkydiverVideo2.url, heroSkydiverVideo3.url];
const HERO_POSTER = "https://images.unsplash.com/photo-1601024445121-e5b82f020549?w=1920&h=1080&fit=crop";

interface CinematicExperienceProps {
  onBook: () => void;
  onWatchVideo: () => void;
}

export function CinematicExperience({ onBook, onWatchVideo }: CinematicExperienceProps) {
  const { t } = useLanguage();
  const trackRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const frameRef = useRef<number>();
  const targetProgressRef = useRef(0);
  const smoothProgressRef = useRef(0);
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [activeClip, setActiveClip] = useState(0);
  const [displayProgress, setDisplayProgress] = useState(0);
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 90, damping: 28, mass: 0.45 });

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 767px)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setIsMobile(mobileQuery.matches);
      setReducedMotion(motionQuery.matches);
    };
    update();
    mobileQuery.addEventListener("change", update);
    motionQuery.addEventListener("change", update);
    return () => {
      mobileQuery.removeEventListener("change", update);
      motionQuery.removeEventListener("change", update);
    };
  }, []);

  useMotionValueEvent(smoothProgress, "change", (latest) => {
    targetProgressRef.current = latest;
    setDisplayProgress(Math.round(latest * 100));
    if (!isMobile && !reducedMotion) setActiveClip(Math.min(2, Math.floor(latest * 3)));
  });

  useEffect(() => {
    if (isMobile || reducedMotion) return;
    const updateVideo = () => {
      smoothProgressRef.current += (targetProgressRef.current - smoothProgressRef.current) * 0.12;
      const local = Math.min(0.999, smoothProgressRef.current) * 3;
      const clipIndex = Math.min(2, Math.floor(local));
      const clipProgress = local - clipIndex;
      const video = videoRefs.current[clipIndex];
      if (video && Number.isFinite(video.duration) && video.duration > 0) {
        const desiredTime = clipProgress * Math.max(0, video.duration - 0.05);
        if (Math.abs(video.currentTime - desiredTime) > 0.04) video.currentTime = desiredTime;
      }
      frameRef.current = window.requestAnimationFrame(updateVideo);
    };
    frameRef.current = window.requestAnimationFrame(updateVideo);
    return () => {
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
    };
  }, [isMobile, reducedMotion]);

  const headlineOneOpacity = useTransform(smoothProgress, [0, 0.08, 0.25, 0.31], [1, 1, 1, 0]);
  const headlineTwoOpacity = useTransform(smoothProgress, [0.27, 0.36, 0.58, 0.67], [0, 1, 1, 0]);
  const headlineThreeOpacity = useTransform(smoothProgress, [0.64, 0.73, 0.94, 1], [0, 1, 1, 1]);
  const headlineOneScale = useTransform(smoothProgress, [0, 0.1], [0.94, 1]);
  const headlineTwoScale = useTransform(smoothProgress, [0.27, 0.4], [0.9, 1]);
  const headlineThreeScale = useTransform(smoothProgress, [0.64, 0.78], [0.9, 1]);
  const altitude = Math.round(15000 - (displayProgress / 100) * 12500);
  const speed = displayProgress < 24 ? Math.round((displayProgress / 24) * 200) : displayProgress < 70 ? 200 : Math.max(28, Math.round(200 - ((displayProgress - 70) / 30) * 172));
  const phaseKey = displayProgress < 30 ? "hero.experience.phase.exit" : displayProgress < 70 ? "hero.experience.phase.freefall" : "hero.experience.phase.canopy";
  const stories = [
    { eyebrow: "hero.experience.story1.eyebrow", title: "hero.experience.story1.title", body: "hero.experience.story1.body", opacity: headlineOneOpacity, scale: headlineOneScale },
    { eyebrow: "hero.experience.story2.eyebrow", title: "hero.experience.story2.title", body: "hero.experience.story2.body", opacity: headlineTwoOpacity, scale: headlineTwoScale },
    { eyebrow: "hero.experience.story3.eyebrow", title: "hero.experience.story3.title", body: "hero.experience.story3.body", opacity: headlineThreeOpacity, scale: headlineThreeScale },
  ];

  if (reducedMotion) {
    return (
      <section className="relative min-h-screen overflow-hidden bg-experience text-experience-foreground">
        <img src={HERO_POSTER} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-experience/50 via-experience/60 to-experience" />
        <div className="relative z-10 flex min-h-screen items-center justify-center px-6 pb-24 pt-28 text-center">
          <div className="max-w-4xl">
            <p className="mb-5 text-sm font-semibold uppercase tracking-widest text-experience-cyan">LET'S SKYDIVE HK</p>
            <h1 className="text-4xl font-black leading-tight sm:text-6xl lg:text-7xl">{t("hero.experience.story1.title")}</h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-experience-muted">{t("hero.experience.story1.body")}</p>
            <HeroActions onBook={onBook} onWatchVideo={onWatchVideo} t={t} />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={trackRef} className="relative h-[240vh] md:h-[300vh] bg-experience text-experience-foreground">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-0 bg-experience">
          {HERO_CLIPS.map((src, index) => (
            <video
              key={src}
              ref={(node) => { videoRefs.current[index] = node; }}
              src={src}
              poster={index === 0 ? HERO_POSTER : undefined}
              muted
              playsInline
              autoPlay={isMobile && index === activeClip}
              preload={index === 0 ? "auto" : "metadata"}
              onEnded={() => { if (isMobile) setActiveClip((index + 1) % HERO_CLIPS.length); }}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${activeClip === index ? "opacity-100" : "opacity-0"}`}
              aria-hidden="true"
              tabIndex={-1}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-experience/60 via-experience/25 to-experience/90" />
          <div className="absolute inset-0 bg-gradient-to-r from-experience/55 via-transparent to-experience/20" />
        </div>

        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6 pb-36 pt-24 sm:px-8 lg:px-12">
          <div className="relative h-[25rem] w-full max-w-5xl">
            {stories.map((story, index) => (
              <motion.article
                key={story.title}
                style={{ opacity: story.opacity, scale: story.scale }}
                className={`absolute inset-0 flex flex-col justify-center ${index === 1 ? "items-center text-center" : index === 2 ? "items-end text-right" : "items-start text-left"}`}
              >
                <div className="max-w-3xl">
                  <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-experience-cyan">
                    <span className="h-px w-8 bg-experience-cyan" />{t(story.eyebrow)}
                  </p>
                  <h1 className="text-4xl font-black leading-none sm:text-6xl lg:text-8xl">{t(story.title)}</h1>
                  <p className="mt-5 max-w-2xl text-base leading-relaxed text-experience-muted sm:text-xl lg:text-2xl">{t(story.body)}</p>
                  {index === 0 && <HeroActions onBook={onBook} onWatchVideo={onWatchVideo} t={t} />}
                  {index === 2 && (
                    <div className="mt-7 flex flex-col items-end gap-4">
                      <Button size="lg" onClick={onBook} className="h-12 bg-experience-orange px-7 text-experience-foreground hover:bg-experience-orange/90">
                        {t("hero.cta.book")} <Plane className="h-4 w-4" />
                      </Button>
                      <div className="max-w-3xl"><TrustBar /><EligibilityChips /></div>
                    </div>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        </div>

        <div className="absolute bottom-[5.25rem] left-1/2 z-20 w-[calc(100%-2rem)] max-w-4xl -translate-x-1/2 md:bottom-6">
          <div className="grid grid-cols-3 gap-3 rounded-lg border border-experience-border bg-experience-panel/85 px-4 py-3 shadow-2xl backdrop-blur-xl sm:grid-cols-[1fr_1fr_2fr] sm:px-5">
            <HudMetric icon={Mountain} label={t("hero.experience.altitude")} value={`${altitude.toLocaleString()} FT`} />
            <HudMetric icon={Gauge} label={t("hero.experience.speed")} value={`${speed} KPH`} />
            <div className="col-span-3 sm:col-span-1">
              <div className="mb-2 flex items-center justify-between text-[10px] font-bold uppercase text-experience-muted">
                <span>{t(phaseKey)}</span><span>{displayProgress}%</span>
              </div>
              <div className="h-1 overflow-hidden rounded-full bg-experience-border">
                <div className="h-full bg-experience-cyan transition-[width] duration-100" style={{ width: `${displayProgress}%` }} />
              </div>
            </div>
          </div>
        </div>

        {displayProgress < 8 && (
          <div className="absolute bottom-28 left-1/2 z-20 hidden -translate-x-1/2 items-center gap-2 text-xs text-experience-muted md:flex">
            {t("hero.scrollToExplore")} <ArrowDown className="h-4 w-4 animate-bounce" />
          </div>
        )}
      </div>
    </section>
  );
}

function HudMetric({ icon: Icon, label, value }: { icon: typeof Mountain; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 border-r border-experience-border last:border-0">
      <Icon className="h-4 w-4 text-experience-cyan" />
      <div>
        <p className="text-[9px] font-bold uppercase text-experience-muted">{label}</p>
        <p className="font-mono text-sm font-bold tabular-nums text-experience-foreground sm:text-base">{value}</p>
      </div>
    </div>
  );
}

function HeroActions({ onBook, onWatchVideo, t }: { onBook: () => void; onWatchVideo: () => void; t: (key: string) => string }) {
  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
      <Button size="lg" onClick={onBook} className="h-12 bg-experience-orange px-7 text-experience-foreground hover:bg-experience-orange/90">
        {t("hero.cta.book")} <Plane className="h-4 w-4" />
      </Button>
      <Button asChild size="lg" variant="outline" className="h-12 border-experience-border bg-experience-panel/70 px-7 text-experience-foreground hover:bg-experience-panel hover:text-experience-foreground">
        <Link to="/quiz"><Sparkles className="h-4 w-4 text-experience-cyan" />{t("hero.cta.quiz")}</Link>
      </Button>
      <Button size="lg" variant="ghost" onClick={onWatchVideo} className="h-12 px-5 text-experience-muted hover:bg-experience-panel hover:text-experience-foreground">
        {t("hero.cta.watchVideo")}
      </Button>
    </div>
  );
}