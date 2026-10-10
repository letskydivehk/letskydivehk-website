"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Users, GraduationCap, Eye } from "lucide-react";
import { CardGridSkeleton } from "./skeletons/CardSkeleton";

import { useNavigate } from "react-router-dom";
import { useLocations, type Location } from "@/hooks/useLocations";
import { useBooking } from "@/contexts/BookingContext";
import { useLanguage } from "@/contexts/LanguageContext";

import { getLocationNotice, isEffectivelyComingSoon } from "@/data/locationNotices";
import { Button } from "@/components/ui/button";
import { HorizontalLocationTrack } from "@/components/home/HorizontalLocationTrack";

type Country = "Thailand" | "China";

export function Locations() {
  const [activeCountry, setActiveCountry] = useState<Country>("China");
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
    <section id="locations" className="home-editorial-section home-locations-section relative">
      <HorizontalLocationTrack key={activeCountry} country={activeCountry} count={currentLocations.length} heading={<div className="home-location-heading">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-5"
        >
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="w-8 h-px bg-accent-blue" />
            <span className="text-sm font-semibold text-muted-foreground">{t("locations.badge")}</span>
            <div className="w-8 h-px bg-accent-orange" />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-3 text-foreground">
            {t("locations.title")}
          </h2>

          <p className="text-base text-muted-foreground leading-relaxed max-w-3xl mx-auto">{t("locations.subtitle")}</p>
        </motion.div>

        {/* Country Tabs */}
        <div className="flex justify-center mb-5">
          <div className="inline-flex bg-card rounded-full p-1.5 clean-border shadow-sm mobile-transparent-card">
            {(["China", "Thailand"] as Country[]).map((country) => (
              <Button variant="ghost" aria-pressed={activeCountry === country}
                key={country}
                onClick={() => setActiveCountry(country)}
                className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 cursor-pointer ${
                  activeCountry === country
                     ? "bg-accent-orange text-accent-foreground hover:bg-accent-orange/90"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {country === "Thailand" ? t("locations.thailand") : t("locations.china")}
              </Button>
            ))}
          </div>
        </div>
      </div>}>

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
          <>
              {currentLocations.map((location, index) => (
                <LocationCard
                  key={location.id}
                  location={location}
                  translatedLocation={translateLocation(location)}
                  onBookClick={() => scrollToBookingWithLocation(location.id)}
                  onViewDetails={() => navigate(`/location/${location.slug}`)}
                  t={t}
                  index={index}
                />
              ))}
              {currentLocations.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">No locations available in {activeCountry} yet.</p>
                </div>
              )}
          </>
        )}
      </HorizontalLocationTrack>
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
  index: number;
}

function LocationCard({ location, translatedLocation, onBookClick, onViewDetails, t, index }: LocationCardProps) {
  const comingSoon = isEffectivelyComingSoon(location);
  const showClosingBadge = !comingSoon && getLocationNotice(location.slug)?.type === "closing";
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4, transition: { duration: 0.35 } }}
      className={`home-location-poster relative flex flex-col bg-card overflow-hidden clean-border group transition-all duration-500 ${
        comingSoon ? "opacity-75" : ""
      }`}
    >
      {/* Image */}
      <div className="home-location-photo relative shrink-0 overflow-hidden">
        <img
          src={location.image_url || "/placeholder.svg"}
          alt={translatedLocation.Name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="home-photo-shade absolute inset-0" />

        {/* Coming Soon Badge */}
        {comingSoon && (
          <div className="absolute top-4 right-4">
            <span className="bg-accent-blue text-accent-foreground text-xs font-bold px-3 py-1 rounded-full">
              {t("common.comingSoon").toUpperCase()}
            </span>
          </div>
        )}

        {/* Closing Soon Badge */}
        {showClosingBadge && (
          <div className="absolute top-4 right-4">
            <span className="bg-accent-orange text-accent-foreground text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              {t("location.closing.badge").toUpperCase()}
            </span>
          </div>
        )}

        {/* Location Name Overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-2 text-accent-foreground text-sm mb-1">
            <MapPin className="w-4 h-4" />
            <span>
              {translatedLocation.City}, {translatedLocation.country}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-accent-foreground">{translatedLocation.Name}</h3>
        </div>
      </div>

      {/* Content */}
      <div className="home-location-copy p-5 flex flex-col flex-1">
        {showClosingBadge && (
          <div className="mb-3 px-3 py-2 rounded-lg bg-accent-orange/10 border border-accent-orange/30 text-accent-orange text-xs font-semibold">
            {t("location.closing.lastJumps")}
          </div>
        )}
        <p className="home-location-description text-muted-foreground mb-4 leading-relaxed">{translatedLocation.description}</p>

        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-4 mt-auto">
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
        {!comingSoon ? (
          <div className="flex gap-3">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails();
              }}
              className="flex-1 bg-accent-orange text-accent-foreground font-semibold hover:bg-accent-orange/90"
            >
              <Eye className="w-4 h-4" />
              {t("locations.viewDetails")}
            </Button>
          </div>
        ) : (
          <Button
            disabled
            className="w-full py-3 bg-muted text-muted-foreground font-semibold rounded-lg cursor-not-allowed"
          >
            {t("common.comingSoon")}
          </Button>
        )}
      </div>
    </motion.div>
  );
}
