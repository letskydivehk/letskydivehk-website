"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, ExternalLink } from "lucide-react";
import { useLocations } from "@/hooks/useLocations";

// City coordinates for map markers
const cityCoordinates: Record<string, { lat: number; lng: number }> = {
  Pattaya: { lat: 12.697530110539647, lng: 101.63242084029467 },
  Chiang_Mai: { lat: 19.420020622237345, lng: 100.19635768945962 },
  Huizhou: { lat: 23.41358815164999, lng: 114.55790770229758 },
  Hainan: { lat: 19.640326830428453, lng: 109.14443672147532 },
  Luoding: { lat: 22.708941775990702, lng: 111.60880992560826 },
  Zhuhai: { lat: 22.059956965699126, lng: 113.10999751553187 },
};

export function LocationsMap() {
  const { data: locations, isLoading } = useLocations();
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  if (isLoading || !locations || locations.length === 0) {
    return null;
  }

  // Get locations with coordinates
  const mappedLocations = locations
    .filter((loc) => loc.City && cityCoordinates[loc.City])
    .map((loc) => ({
      ...loc,
      coords: cityCoordinates[loc.City!],
    }));

  if (mappedLocations.length === 0) {
    return null;
  }

  // Get selected location or default to first
  const activeLocation = selectedLocation
    ? mappedLocations.find((loc) => loc.id === selectedLocation)
    : mappedLocations[0];

  // Create OpenStreetMap embed URL
  const getMapUrl = (lat: number, lng: number) => {
    return `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.05}%2C${lat - 0.03}%2C${lng + 0.05}%2C${lat + 0.03}&layer=mapnik&marker=${lat}%2C${lng}`;
  };

  return (
    <div className="mt-16 max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-foreground mb-2">Explore Our Dropzones</h3>
        <p className="text-muted-foreground">Select a location to view on the map</p>
      </div>

      <div className="bg-card rounded-2xl clean-border overflow-hidden elevated-shadow mobile-transparent-card">
        {/* Location Selector */}
        <div className="flex flex-wrap gap-2 p-4 border-b border-border bg-muted/30">
          {mappedLocations.map((location) => (
            <button
              key={location.id}
              onClick={() => setSelectedLocation(location.id)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all cursor-pointer flex items-center gap-2 ${
                selectedLocation === location.id || (!selectedLocation && location.id === mappedLocations[0].id)
                  ? "bg-accent-orange text-white"
                  : "bg-card text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <MapPin className="w-4 h-4" />
              {location.City}
            </button>
          ))}
        </div>

        {/* Map Display */}
        <div className="aspect-[16/9] relative">
          {activeLocation && (
            <motion.div
              key={activeLocation.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full"
            >
              <iframe
                src={getMapUrl(activeLocation.coords.lat, activeLocation.coords.lng)}
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Map of ${activeLocation.Name}`}
              />
            </motion.div>
          )}
        </div>

        {/* Location Info */}
        {activeLocation && (
          <div className="p-6 border-t border-border bg-muted/20">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h4 className="text-xl font-bold text-foreground mb-1">{activeLocation.Name}</h4>
                <p className="text-muted-foreground flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {activeLocation.City}, {activeLocation.country}
                </p>
                {activeLocation.description && (
                  <p className="text-muted-foreground mt-2 max-w-xl">{activeLocation.description}</p>
                )}
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${activeLocation.coords.lat},${activeLocation.coords.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-accent-orange text-white rounded-lg font-medium hover:bg-accent-orange/90 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Open in Google Maps
              </a>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="inline-flex items-center gap-1 text-xs font-medium bg-accent-orange/10 text-accent-orange px-3 py-1 rounded-full">
                Tandem
              </span>
              {activeLocation.has_aff && (
                <span className="inline-flex items-center gap-1 text-xs font-medium bg-accent-blue/10 text-accent-blue px-3 py-1 rounded-full">
                  AFF
                </span>
              )}
              {activeLocation.has_group_events && (
                <span className="inline-flex items-center gap-1 text-xs font-medium bg-accent-blue/10 text-accent-blue px-3 py-1 rounded-full">
                  Groups
                </span>
              )}
              {activeLocation.coming_soon && (
                <span className="inline-flex items-center gap-1 text-xs font-medium bg-accent-blue text-white px-3 py-1 rounded-full">
                  Coming Soon
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
