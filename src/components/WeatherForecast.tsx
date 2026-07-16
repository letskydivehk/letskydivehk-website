import { useState } from "react";
import { motion } from "framer-motion";
import { Cloud, ExternalLink, Thermometer, Wind, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useWeather, describeWeather } from "@/hooks/useWeather";

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

export function WeatherForecast() {
  const { t, translateData, language } = useLanguage();
  const [activeSlug, setActiveSlug] = useState(BASES[0].slug);
  const active = BASES.find((b) => b.slug === activeSlug) ?? BASES[0];
  const { data: weather, isLoading } = useWeather(active.lat, active.lon);

  const embedSrc = `https://embed.windy.com/embed2.html?lat=${active.lat}&lon=${active.lon}&zoom=8&level=surface&overlay=wind&menu=&message=&marker=true&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=default&metricTemp=default&radarRange=-1`;
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

        {/* Base tabs */}
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
          {/* Current summary */}
          <div className="bg-card rounded-2xl p-6 clean-border mobile-transparent-card lg:col-span-1">
            <h3 className="text-lg font-bold text-foreground mb-4">{activeName}</h3>
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-accent-blue" />
            ) : weather ? (
              <>
                <div className="flex items-baseline gap-2 mb-3">
                  <Thermometer className="w-6 h-6 text-accent-orange" />
                  <span className="text-4xl font-black text-foreground">{weather.temperature}°C</span>
                </div>
                <p className="text-muted-foreground mb-2">{describeWeather(weather.weatherCode, language)}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-2 mb-6">
                  <Wind className="w-4 h-4" />
                  {t("locationDetail.windSpeed")}: {weather.windSpeed} km/h
                </p>
              </>
            ) : (
              <p className="text-muted-foreground text-sm mb-6">—</p>
            )}
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

          {/* Windy embed */}
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
