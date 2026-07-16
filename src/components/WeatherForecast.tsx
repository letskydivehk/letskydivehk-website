import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Cloud, CloudRain, ExternalLink, Loader2, RefreshCw, Thermometer, Wind } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { describeWeather, readCachedWeather, useWeather } from "@/hooks/useWeather";

interface Base {
  slug: string;
  nameKey: string;
  fallbackName: string;
  lat: number;
  lon: number;
}

const BASES: Base[] = [
  { slug: "pattaya", nameKey: "location.pattaya", fallbackName: "Pattaya", lat: 12.9236, lon: 100.8825 },
  { slug: "huizhou", nameKey: "location.huizhou", fallbackName: "Huizhou", lat: 23.1115, lon: 114.416 },
  { slug: "zhuhai", nameKey: "location.zhuhai", fallbackName: "Zhuhai", lat: 22.2711, lon: 113.5767 },
  { slug: "hainan", nameKey: "location.hainan", fallbackName: "Hainan", lat: 19.9, lon: 109.5 },
  { slug: "luoding", nameKey: "location.luoding", fallbackName: "Luoding", lat: 22.7686, lon: 111.5698 },
];

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

export function WeatherForecast() {
  const { t, translateData, language } = useLanguage();
  const [activeSlug, setActiveSlug] = useState(BASES[0].slug);
  const [overlay, setOverlay] = useState<"wind" | "rain">("wind");
  const active = BASES.find((b) => b.slug === activeSlug) ?? BASES[0];
  const { data: weather, isLoading, isError, isFetching, refetch, dataUpdatedAt } = useWeather(active.lat, active.lon);
  const relative = useRelativeTime();

  const cached = readCachedWeather(active.lat, active.lon);
  const displayWeather = weather ?? cached?.data ?? null;
  const displayUpdatedAt = dataUpdatedAt || cached?.updatedAt || 0;

  const embedSrc = `https://embed.windy.com/embed2.html?lat=${active.lat}&lon=${active.lon}&zoom=8&level=surface&overlay=${overlay}&menu=&message=&marker=true&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=default&metricTemp=default&radarRange=-1`;
  const liveUrl = `https://www.windy.com/?${active.lat},${active.lon},9`;
  const activeName = translateData(active.nameKey, active.fallbackName);

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

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {BASES.map((b) => {
            const isActive = b.slug === activeSlug;
            return (
              <button
                key={b.slug}
                onClick={() => setActiveSlug(b.slug)}
                className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all cursor-pointer ${
                  isActive
                    ? "bg-accent-orange text-white shadow-md"
                    : "bg-card text-muted-foreground hover:text-foreground clean-border"
                }`}
              >
                {translateData(b.nameKey, b.fallbackName)}
              </button>
            );
          })}
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-card rounded-2xl p-6 clean-border mobile-transparent-card lg:col-span-1">
            <h3 className="text-lg font-bold text-foreground mb-4">{activeName}</h3>
            {isLoading && !displayWeather ? (
              <Loader2 className="w-6 h-6 animate-spin text-accent-blue" />
            ) : displayWeather ? (
              <>
                <div className="flex items-baseline gap-2 mb-3">
                  <Thermometer className="w-6 h-6 text-accent-orange" />
                  <span className="text-4xl font-black text-foreground">{displayWeather.temperature}°C</span>
                </div>
                <p className="text-muted-foreground mb-2">{describeWeather(displayWeather.weatherCode, language)}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-2 mb-4">
                  <Wind className="w-4 h-4" />
                  {t("locationDetail.windSpeed")}: {displayWeather.windSpeed} km/h
                </p>
              </>
            ) : (
              <p className="text-muted-foreground text-sm mb-4">—</p>
            )}

            {isError ? (
              <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-xs">
                <div className="flex items-center gap-2 text-destructive font-semibold mb-1">
                  <AlertTriangle className="w-4 h-4" />
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
            <iframe
              key={active.slug}
              title={`Windy weather forecast for ${activeName}`}
              src={embedSrc}
              loading="lazy"
              className="w-full h-[420px] border-0"
            />
            <div className="px-4 py-2 text-xs text-muted-foreground text-right">{t("weather.poweredBy")}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
