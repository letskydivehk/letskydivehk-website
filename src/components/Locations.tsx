"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Users, GraduationCap, Eye } from "lucide-react";
import { CardGridSkeleton } from "./skeletons/CardSkeleton";

import { useNavigate } from "react-router-dom";
import { useLocations, type Location } from "@/hooks/useLocations";
import { useBooking } from "@/contexts/BookingContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { LocationsMap } from "./LocationsMap";
import { getLocationNotice } from "@/data/locationNotices";

type Country = "Thailand" | "China";

export function Locations() {
  const [activeCountry, setActiveCountry] = useState<Country>("Thailand");
  const { data: locations, isLoading, error } = useLocations();
  const { t, translateData } = useLanguage();
  const navigate = useNavigate();

  // Helper function to translate location data
  const translateLocation = (location: Location) => ({
    ...location,
    Name: translateData(`location.${location.slug}`, location.Name),
    description: translateData(`location.${location.slug}.desc`, location.description || ""),
    City: translateData(`city.${location.City}`, location.City || ""),
    country: translateData(`country.${location.country}`, location.country),
  });

  // Listen for hash changes to switch country
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === "#locations-china") {
        setActiveCountry("China");
        setTimeout(() => {
          document.getElementById("locations")?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else if (hash === "#locations-thailand") {
        setActiveCountry("Thailand");
        setTimeout(() => {
          document.getElementById("locations")?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const { setPreselectedLocationId } = useBooking();

  const currentLocations = useMemo(() => {
    if (!locations) return [];
    return locations.filter((loc) => loc.country === activeCountry);
  }, [locations, activeCountry]);

  const scrollToBookingWithLocation = (locationId: string) => {
    setPreselectedLocationId(locationId);
    const bookingSection = document.getElementById("booking");
    bookingSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="locations" className="relative py-24 bg-card/30">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-3 h-3 bg-accent-blue rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-muted-foreground">{t("locations.badge")}</span>
            <div className="w-3 h-3 bg-accent-orange rounded-full animate-pulse" />
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6 text-foreground">
            {t("locations.title")}
          </h2>

          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">{t("locations.subtitle")}</p>
        </motion.div>

        {/* Country Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-card rounded-full p-1 clean-border mobile-transparent-card">
            {(["Thailand", "China"] as Country[]).map((country) => (
              <button
                key={country}
                onClick={() => setActiveCountry(country)}
                className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 cursor-pointer ${
                  activeCountry === country
                    ? "bg-accent-orange text-white"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {country === "Thailand" ? t("locations.thailand") : t("locations.china")}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <CardGridSkeleton count={4} className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto" />
        )}


        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <p className="text-destructive">Failed to load locations. Please try again later.</p>
          </div>
        )}

        {/* Locations Grid */}
        {!isLoading && !error && (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCountry}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto justify-items-center"
            >
              {currentLocations.map((location) => (
                <LocationCard
                  key={location.id}
                  location={location}
                  translatedLocation={translateLocation(location)}
                  onBookClick={() => scrollToBookingWithLocation(location.id)}
                  onViewDetails={() => navigate(`/location/${location.slug}`)}
                  t={t}
                />
              ))}
              {currentLocations.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">No locations available in {activeCountry} yet.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Interactive Map */}
        <LocationsMap />
      </div>
    </section>
  );
}

interface TranslatedLocation {
  Name: string;
  description: string;
  City: string;
  country: string;
}

interface LocationCardProps {
  location: Location;
  translatedLocation: TranslatedLocation;
  onBookClick: (locationId: string) => void;
  onViewDetails: () => void;
  t: (key: string) => string;
}

function LocationCard({ location, translatedLocation, onBookClick, onViewDetails, t }: LocationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      onClick={onViewDetails}
      className={`relative bg-card rounded-2xl overflow-hidden clean-border group hover:elevated-shadow transition-all duration-300 mobile-transparent-card cursor-pointer ${
        location.coming_soon ? "opacity-75" : ""
      }`}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={location.image_url || "/placeholder.svg"}
          alt={translatedLocation.Name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Coming Soon Badge */}
        {location.coming_soon && (
          <div className="absolute top-4 right-4">
            <span className="bg-accent-blue text-white text-xs font-bold px-3 py-1 rounded-full">
              {t("common.comingSoon").toUpperCase()}
            </span>
          </div>
        )}

        {/* Closing Soon Badge */}
        {!location.coming_soon && getLocationNotice(location.slug)?.type === "closing" && (
          <div className="absolute top-4 right-4">
            <span className="bg-accent-orange text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              {t("location.closing.badge").toUpperCase()}
            </span>
          </div>
        )}

        {/* Location Name Overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-2 text-white/80 text-sm mb-1">
            <MapPin className="w-4 h-4" />
            <span>
              {translatedLocation.City}, {translatedLocation.country}
            </span>
          </div>
          <h3 className="text-xl font-bold text-white">{translatedLocation.Name}</h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {!location.coming_soon && getLocationNotice(location.slug)?.type === "closing" && (
          <div className="mb-3 px-3 py-2 rounded-lg bg-accent-orange/10 border border-accent-orange/30 text-accent-orange text-xs font-semibold">
            {t("location.closing.lastJumps")}
          </div>
        )}
        <p className="text-muted-foreground mb-4 leading-relaxed">{translatedLocation.description}</p>

        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="inline-flex items-center gap-1 text-xs font-medium bg-accent-orange/10 text-accent-orange px-3 py-1 rounded-full">
            <Users className="w-3 h-3" />
            {t("locations.tandem")}
          </span>
          {location.has_aff && (
            <span className="inline-flex items-center gap-1 text-xs font-medium bg-accent-blue/10 text-accent-blue px-3 py-1 rounded-full">
              <GraduationCap className="w-3 h-3" />
              {t("locations.aff")}
            </span>
          )}
          {location.has_group_events && (
            <span className="inline-flex items-center gap-1 text-xs font-medium bg-accent-blue/10 text-accent-blue px-3 py-1 rounded-full">
              <Users className="w-3 h-3" />
              {t("locations.groups")}
            </span>
          )}
        </div>

        {/* CTAs */}
        {!location.coming_soon ? (
          <div className="flex gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails();
              }}
              className="flex-1 py-3 bg-accent-orange text-white font-semibold rounded-lg hover:bg-accent-orange/90 transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" />
              {t("locations.viewDetails")}
            </button>
          </div>
        ) : (
          <button
            disabled
            className="w-full py-3 bg-muted text-muted-foreground font-semibold rounded-lg cursor-not-allowed"
          >
            {t("common.comingSoon")}
          </button>
        )}
      </div>
    </motion.div>
  );
}
