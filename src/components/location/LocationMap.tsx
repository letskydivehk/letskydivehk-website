"use client";

import { motion } from "framer-motion";
import { MapPin, ExternalLink } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// City coordinates for map markers
export const cityCoordinates: Record<string, { lat: number; lng: number }> = {
  Pattaya: { lat: 12.697530110539647, lng: 101.63242084029467 },
  "Chiang Mai": { lat: 19.420020622237345, lng: 100.19635768945962 },
  Huizhou: { lat: 23.41358815164999, lng: 114.55790770229758 },
  Hainan: { lat: 19.640326830428453, lng: 109.14443672147532 },
  Luoding: { lat: 22.708941775990702, lng: 111.60880992560826 },
  Zhuhai: { lat: 22.059956965699126, lng: 113.10999751553187 },
};

interface LocationMapProps {
  city: string | null | undefined;
  name: string;
  cityLabel: string;
  countryLabel: string;
  fallbackEmbedUrl?: string | null;
}

export function LocationMap({ city, name, cityLabel, countryLabel, fallbackEmbedUrl }: LocationMapProps) {
  const { t } = useLanguage();
  const coords = city ? cityCoordinates[city] : undefined;

  if (!coords && !fallbackEmbedUrl) return null;

  const src = coords
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${coords.lng - 0.05}%2C${coords.lat - 0.03}%2C${coords.lng + 0.05}%2C${coords.lat + 0.03}&layer=mapnik&marker=${coords.lat}%2C${coords.lng}`
    : fallbackEmbedUrl!;

  return (
    <div className="bg-card rounded-2xl clean-border overflow-hidden elevated-shadow mobile-transparent-card">
      <div className="aspect-[16/9] relative">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full h-full"
        >
          <iframe
            src={src}
            className="w-full h-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Map of ${name}`}
          />
        </motion.div>
      </div>

      <div className="p-6 border-t border-border bg-muted/20 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h4 className="text-xl font-bold text-foreground mb-1">{name}</h4>
          <p className="text-muted-foreground flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {cityLabel}, {countryLabel}
          </p>
        </div>
        {coords && (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent-orange text-white rounded-lg font-medium hover:bg-accent-orange/90 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            {t("locations.map.openGoogleMaps")}
          </a>
        )}
      </div>
    </div>
  );
}
