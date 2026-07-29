import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cloud, CloudRain, ExternalLink, Loader2, RefreshCw, Thermometer, Wind, ChevronLeft, ChevronRight, Info } from "lucide-react";
import { useLanguage, type Language } from "@/contexts/LanguageContext";
import { describeWeather, readCachedWeather, useWeather, calculateJumpScore, type HourlyPoint } from "@/hooks/useWeather";
import { WeatherIcon } from "@/components/WeatherIcon";

interface Base {
  slug: string;
  nameKey: string;
  fallbackName: string;
  country: "thailand" | "china";
  lat: number;
  lon: number;
}

const BASES: Base[] = [
  { slug: "pattaya", nameKey: "location.pattaya", fallbackName: "Pattaya", country: "thailand", lat: 12.9236, lon: 100.8825 },
  { slug: "huizhou", nameKey: "location.huizhou", fallbackName: "Huizhou", country: "china", lat: 23.318, lon: 114.469 },
  { slug: "zhuhai", nameKey: "location.zhuhai", fallbackName: "Zhuhai", country: "china", lat: 22.011, lon: 113.103 },
  { slug: "hainan", nameKey: "location.hainan", fallbackName: "Hainan", country: "china", lat: 19.644, lon: 109.181 },
  { slug: "luoding", nameKey: "location.luoding", fallbackName: "Luoding", country: "china", lat: 22.7686, lon: 111.5698 },
];

const countryFlag: Record<Base["country"], string> = {
  thailand: "🇹🇭",
  china: "🇨🇳",
};

function useRelativeTime() {
  const { t } = useLanguage();
  return (ts: number | null | undefined) => {
    if (!ts) return "";
    const diffMs = Date.now() - ts;
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return t("weather.justNow");
    if (mins < 60) return t("weather.minutesAgo").replace("{n}", String(mins));
    const hours = Math.floor(mins / 60);
    if (hours < 24) return t("weather.hoursAgo").replace("{n}", String(hours));
    const days = Math.floor(hours / 24);
    return t("weather.daysAgo").replace("{n}", String(days));
  };
}

function formatHour(time: string, language: Language) {
  const d = new Date(time);
  if (language === "en") {
    return d.toLocaleTimeString("en-US", { hour: "numeric", hour12: true });
  }
  return d.toLocaleTimeString("zh-HK", { hour: "numeric", hour12: false });
}

function HourlyTimeline({ hourly, language }: { hourly: HourlyPoint[]; language: Language }) {
  const { t } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  if (!hourly || hourly.length === 0) return null;

  const temps = hourly.map((h) => h.temperature);
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);
  const range = Math.max(maxTemp - minTemp, 1);

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
          <Info className="w-4 h-4 text-accent-blue" />
          {t("weather.next24h")}
        </h4>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-4 -mx-2 px-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
      >
        {hourly.map((h, i) => {
          const heightPct = ((h.temperature - minTemp) / range) * 60 + 20;
          const isHovered = hoverIndex === i;
          return (
            <button
              key={h.time}
              type="button"
              className="flex-shrink-0 w-14 flex flex-col items-center gap-2 group"
              onMouseEnter={() => setHoverIndex(i)}
              onMouseLeave={() => setHoverIndex(null)}
              onFocus={() => setHoverIndex(i)}
              onBlur={() => setHoverIndex(null)}
            >
              <span className="text-[10px] text-muted-foreground font-medium">{formatHour(h.time, language)}</span>
              <div className="relative h-20 w-full flex items-end justify-center">
                <motion.div
                  className="w-2 rounded-full bg-gradient-to-t from-accent-blue/40 to-accent-orange/60"
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPct}%` }}
                  transition={{ duration: 0.5, delay: i * 0.03 }}
                />
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute -top-8 left-1/2 -translate-x-1/2 z-10 bg-card text-foreground text-[10px] font-bold px-2 py-1 rounded shadow-lg clean-border whitespace-nowrap"
                    >
                      {h.temperature}°
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <span className="text-xs font-bold text-foreground">{h.temperature}°</span>
              <div className="flex flex-col items-center gap-0.5 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-0.5">
                  <Wind className="w-3 h-3" />
                  {h.windSpeed}
                </span>
                {h.precipitation > 0 && (
                  <span className="flex items-center gap-0.5 text-accent-blue">
                    <CloudRain className="w-3 h-3" />
                    {h.precipitation}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function WeatherForecast() {
  const { t, translateData, language } = useLanguage();
  const [activeSlug, setActiveSlug] = useState(BASES[0].slug);
  const [overlay, setOverlay] = useState<"wind" | "rain">("wind");
  const [direction, setDirection] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const active = BASES.find((b) => b.slug === activeSlug) ?? BASES[0];
  const { data: weather, isLoading, isError, isFetching, refetch, dataUpdatedAt } = useWeather(active.lat, active.lon);
  const relative = useRelativeTime();

  const cached = readCachedWeather(active.lat, active.lon);
  const displayWeather = weather ?? cached?.data ?? null;
  const displayUpdatedAt = dataUpdatedAt || cached?.updatedAt || 0;

  const embedSrc = `https://embed.windy.com/embed2.html?lat=${active.lat}&lon=${active.lon}&zoom=8&level=surface&overlay=${overlay}&menu=&message=&marker=true&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=default&metricTemp=default&radarRange=-1`;
  const liveUrl = `https://www.windy.com/?${active.lat},${active.lon},11`;
  const activeName = translateData(active.nameKey, active.fallbackName);
  const jumpScore = calculateJumpScore(displayWeather);

  const scoreColor = {
    excellent: "bg-accent-emerald text-white",
    good: "bg-accent-emerald/80 text-white",
    moderate: "bg-accent-orange text-white",
    poor: "bg-destructive/80 text-white",
    noJump: "bg-destructive text-white",
  }[jumpScore.level];

  const handlePrev = () => {
    const idx = BASES.findIndex((b) => b.slug === activeSlug);
    const next = BASES[(idx - 1 + BASES.length) % BASES.length];
    setDirection(-1);
    setActiveSlug(next.slug);
  };

  const handleNext = () => {
    const idx = BASES.findIndex((b) => b.slug === activeSlug);
    const next = BASES[(idx + 1) % BASES.length];
    setDirection(1);
    setActiveSlug(next.slug);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const diff = touchStartX.current - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
    touchStartX.current = null;
  };

  // Auto-refresh relative time display
  const [, tick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => tick((n) => n + 1), 60000);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="weather" className="relative py-20 bg-card/20">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <Cloud className="w-6 h-6 text-accent-blue" />
            <span className="text-sm font-semibold text-muted-foreground">{t("weather.updatedDaily")}</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black mb-4 text-foreground">{t("weather.forecastTitle")}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("weather.forecastSubtitle")}</p>
        </motion.div>

        <div className="flex items-center justify-center gap-2 mb-6">
          <button
            onClick={handlePrev}
            className="p-2 rounded-full bg-card clean-border text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Previous base"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-wrap justify-center gap-2 max-w-3xl">
            {BASES.map((b) => {
              const isActive = b.slug === activeSlug;
              const baseWeather = readCachedWeather(b.lat, b.lon)?.data;
              return (
                <button
                  key={b.slug}
                  onClick={() => {
                    setDirection(b.slug > activeSlug ? 1 : -1);
                    setActiveSlug(b.slug);
                  }}
                  className={`group relative flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                    isActive
                      ? "bg-accent-blue text-white shadow-md ring-2 ring-accent-blue/30"
                      : "bg-card text-muted-foreground hover:text-foreground clean-border hover:shadow-sm"
                  }`}
                >
                  <span className="text-base">{countryFlag[b.country]}</span>
                  <span>{translateData(b.nameKey, b.fallbackName)}</span>
                  {baseWeather && !isActive && (
                    <span className="text-[10px] opacity-70">{baseWeather.temperature}°</span>
                  )}
                </button>
              );
            })}
          </div>
          <button
            onClick={handleNext}
            className="p-2 rounded-full bg-card clean-border text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Next base"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={activeSlug}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 40 : -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -40 : 40 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-card rounded-2xl p-6 clean-border mobile-transparent-card lg:col-span-1">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <span className="text-xl">{countryFlag[active.country]}</span>
                    {activeName}
                  </h3>
                  {displayWeather && (
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${scoreColor}`}>
                      {t(jumpScore.labelKey)}
                    </span>
                  )}
                </div>

                {isLoading && !displayWeather ? (
                  <div className="flex items-center justify-center h-40">
                    <Loader2 className="w-8 h-8 animate-spin text-accent-blue" />
                  </div>
                ) : displayWeather ? (
                  <>
                    <div className="flex items-center gap-4 mb-4">
                      <WeatherIcon code={displayWeather.weatherCode} isDay={displayWeather.isDay} size={64} />
                      <div>
                        <div className="flex items-baseline gap-2">
                          <Thermometer className="w-5 h-5 text-accent-orange" />
                          <span className="text-4xl font-black text-foreground">{displayWeather.temperature}°C</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{describeWeather(displayWeather.weatherCode, language)}</p>
                      </div>
                    </div>

                    {displayWeather && (
                      <div className="mb-4 p-3 rounded-xl bg-muted/40 border border-border/50">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{t("weather.jumpScore")}</span>
                          <span className="text-lg font-black text-foreground">{jumpScore.score}</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden mb-2">
                          <motion.div
                            className={`h-full rounded-full ${scoreColor.split(" ")[0]}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${jumpScore.score}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                          />
                        </div>
                        <p className="text-sm text-foreground">{t(jumpScore.adviceKey)}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-background/50 rounded-xl p-3">
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                          <Wind className="w-3.5 h-3.5" />
                          {t("locationDetail.windSpeed")}
                        </p>
                        <p className="text-lg font-bold text-foreground">{displayWeather.windSpeed} <span className="text-xs font-normal text-muted-foreground">km/h</span></p>
                      </div>
                      <div className="bg-background/50 rounded-xl p-3">
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                          <CloudRain className="w-3.5 h-3.5" />
                          {t("weather.precipitation")}
                        </p>
                        <p className="text-lg font-bold text-foreground">{displayWeather.precipitation} <span className="text-xs font-normal text-muted-foreground">mm</span></p>
                      </div>
                    </div>

                    <HourlyTimeline hourly={displayWeather.hourly} language={language} />
                  </>
                ) : (
                  <p className="text-muted-foreground text-sm mb-4">—</p>
                )}

                {isError ? (
                  <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-xs">
                    <div className="flex items-center gap-2 text-destructive font-semibold mb-1">
                      <CloudRain className="w-4 h-4" />
                      {t("weather.updateFailed")}
                    </div>
                    {displayUpdatedAt > 0 && (
                      <p className="text-muted-foreground">
                        {t("weather.lastUpdated")}: {relative(displayUpdatedAt)}
                      </p>
                    )}
                    <button
                      onClick={() => refetch()}
                      disabled={isFetching}
                      className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-destructive text-destructive-foreground font-semibold hover:opacity-90 transition disabled:opacity-60"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`} />
                      {t("weather.retry")}
                    </button>
                  </div>
                ) : displayUpdatedAt > 0 ? (
                  <p className="text-xs text-muted-foreground mb-4">
                    {t("weather.lastUpdated")}: {relative(displayUpdatedAt)}
                  </p>
                ) : null}

                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent-blue text-white font-semibold rounded-lg hover:bg-accent-blue/90 transition-colors text-sm w-full justify-center"
                >
                  {t("weather.viewLive")}
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              <div className="bg-card rounded-2xl overflow-hidden clean-border mobile-transparent-card lg:col-span-2">
                <div className="flex gap-1 p-2 border-b border-border/50">
                  {(["wind", "rain"] as const).map((o) => (
                    <button
                      key={o}
                      onClick={() => setOverlay(o)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                        overlay === o ? "bg-accent-blue text-white" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {o === "wind" ? <Wind className="w-3.5 h-3.5" /> : <CloudRain className="w-3.5 h-3.5" />}
                      {t(o === "wind" ? "weather.overlayWind" : "weather.overlayRain")}
                    </button>
                  ))}
                </div>
                <iframe
                  key={`${active.slug}-${overlay}`}
                  title={`Windy weather forecast for ${activeName}`}
                  src={embedSrc}
                  loading="lazy"
                  className="w-full h-[420px] border-0"
                />
                <div className="px-4 py-2 text-xs text-muted-foreground text-right">{t("weather.poweredBy")}</div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
