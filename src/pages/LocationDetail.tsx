import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Plane, Car, Building, Users, GraduationCap, Star, Loader2, AlertTriangle } from "lucide-react";
import { getLocationNotice, isEffectivelyComingSoon } from "@/data/locationNotices";
import { useLocationBySlug, useLocationPhotos } from "@/hooks/useLocationDetail";
import { useLocationServices } from "@/hooks/useLocationServices";
import { useLocationTourism } from "@/hooks/useLocationTourism";
import { useLanguage } from "@/contexts/LanguageContext";
import { useBooking } from "@/contexts/BookingContext";
import { BackgroundDecorations } from "@/components/BackgroundDecorations";
import { ServiceNameDisplay } from "@/components/ServiceNameDisplay";
import { Footer } from "@/components/Footer";
import { PageNavbar } from "@/components/PageNavbar";
import { LocationPhotoGallery } from "@/components/location/LocationPhotoGallery";
import { LocationWeather } from "@/components/location/LocationWeather";
import { LocationMap } from "@/components/location/LocationMap";
import { DepartureSchedule } from "@/components/DepartureSchedule";

import { LocationAccommodations } from "@/components/location/LocationAccommodations";
import { LocationAttractions } from "@/components/location/LocationAttractions";
import { LocationFood } from "@/components/location/LocationFood";
import { LocationTravelTips } from "@/components/location/LocationTravelTips";
import { SEO } from "@/components/SEO";
import { LocalBusinessJsonLd } from "@/components/JsonLd";

export default function LocationDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t, translateData } = useLanguage();
  const { setPreselectedLocationId, setPreselectedServiceId, setPreselectedDate } = useBooking();

  const { data: location, isLoading, error } = useLocationBySlug(slug);
  const { data: photos } = useLocationPhotos(location?.id);
  const { data: services } = useLocationServices(location?.id);
  const { data: tourism } = useLocationTourism(location?.id);

  const loc = location as any;

  const indoorService = services?.find((s) => s.service_type === "indoor");

  const translatedName = location ? translateData(`location.${location.slug}`, location.Name) : "";
  const translatedDesc = location ? translateData(`location.${location.slug}.desc`, location.description || "") : "";
  const translatedCity = location ? translateData(`city.${location.City}`, location.City || "") : "";
  const translatedCountry = location ? translateData(`country.${location.country}`, location.country) : "";

  const handleBookHere = () => {
    if (location) {
      setPreselectedLocationId(location.id);
      navigate("/#booking");
      setTimeout(() => {
        document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  const TOUR_DETAIL_SLUGS = new Set(["pattaya", "pattaya-tsa", "huizhou", "hainan", "zhuhai"]);

  const parsePriceNum = (s?: string | null) => {
    if (!s) return null;
    const n = parseFloat(String(s).replace(/[^0-9.]/g, ""));
    return Number.isFinite(n) && n > 0 ? n : null;
  };

  const buildPriceText = (priceDisplay?: string | null, originalDisplay?: string | null) => {
    const price = priceDisplay ? translateData(`price.${priceDisplay}`, priceDisplay) : "";
    const cur = parsePriceNum(priceDisplay);
    const orig = parsePriceNum(originalDisplay);
    if (cur && orig && orig > cur) {
      const pct = Math.round((1 - cur / orig) * 100);
      return `${price} (${originalDisplay} → -${pct}%)`;
    }
    return price;
  };

  const handleWhatsAppBook = (service: any) => {
    if (!location) return;
    const serviceName = translateData(`service.${service.service_name}`, service.service_name);
    const message = t("locationDetail.whatsappBookMsg")
      .replace("{service}", serviceName)
      .replace("{location}", translatedName)
      .replace("{price}", buildPriceText(service.price_display, service.original_price_display));
    window.open(
      `https://wa.me/85269391570?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };


  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent-orange" />
      </div>
    );
  }

  if (error || !location) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">{t("locationDetail.notFound")}</h1>
          <button onClick={() => navigate("/")} className="text-accent-orange hover:underline cursor-pointer">
            {t("locationDetail.backToHome")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <SEO
        title={`Skydiving in ${translatedName}`}
        description={`${translatedDesc?.slice(0, 150) || `Experience skydiving at ${translatedName}, ${translatedCity}, ${translatedCountry}`}`}
        path={`/location/${slug}`}
        image={location.image_url || undefined}
      />
      <LocalBusinessJsonLd
        name={translatedName}
        description={translatedDesc || `Skydiving at ${translatedName}`}
        city={translatedCity}
        country={translatedCountry}
        url={`https://letskydivehk.lovable.app/location/${slug}`}
        image={location.image_url || undefined}
      />
      <BackgroundDecorations />
      <PageNavbar />
      <main className="relative z-10 pt-20">
        {/* Hero Section */}
        <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
          <img
            src={location.image_url || "/placeholder.svg"}
            alt={translatedName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

          {/* Back button */}
          <div className="absolute top-6 left-6 z-20">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 bg-card/80 backdrop-blur-sm text-foreground px-4 py-2 rounded-full clean-border hover:bg-card transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">{t("locationDetail.backToHome")}</span>
            </button>
          </div>

          {/* Location info overlay */}
          <div className="absolute bottom-8 left-0 right-0 z-10">
            <div className="container mx-auto px-6 sm:px-8 lg:px-12">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <MapPin className="w-4 h-4" />
                <span>
                  {translatedCity}, {translatedCountry}
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-foreground">{translatedName}</h1>
            </div>
          </div>
        </section>

        {/* Content */}
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-16">
          <div className="max-w-5xl mx-auto space-y-16">
            {/* Coming Soon / Closing Notice */}
            {isEffectivelyComingSoon(location) ? (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 p-4 rounded-2xl bg-accent-blue/10 border-2 border-accent-blue/40 text-foreground"
              >
                <AlertTriangle className="w-5 h-5 text-accent-blue flex-shrink-0 mt-0.5" />
                <p className="font-semibold leading-relaxed">{t("common.comingSoon")}</p>
              </motion.div>
            ) : getLocationNotice(location.slug)?.type === "closing" ? (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 p-4 rounded-2xl bg-accent-orange/10 border-2 border-accent-orange/40 text-foreground"
              >
                <AlertTriangle className="w-5 h-5 text-accent-orange flex-shrink-0 mt-0.5" />
                <p className="font-semibold leading-relaxed">{t("location.closing.banner")}</p>
              </motion.div>
            ) : null}

            {/* Description */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <p className="text-xl text-muted-foreground leading-relaxed">{translatedDesc}</p>
            </motion.div>

            {/* Features badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="flex flex-wrap gap-3"
            >
              <span className="inline-flex items-center gap-2 bg-accent-orange/10 text-accent-orange px-4 py-2 rounded-full font-medium">
                <Users className="w-4 h-4" />
                {t("locations.tandem")}
              </span>
              {location.has_aff && (
                <span className="inline-flex items-center gap-2 bg-accent-blue/10 text-accent-blue px-4 py-2 rounded-full font-medium">
                  <GraduationCap className="w-4 h-4" />
                  {t("locations.aff")}
                </span>
              )}
              {location.has_group_events && (
                <span className="inline-flex items-center gap-2 bg-accent-blue/10 text-accent-blue px-4 py-2 rounded-full font-medium">
                  <Users className="w-4 h-4" />
                  {t("locations.groups")}
                </span>
              )}
            </motion.div>

            {/* Highlights */}
            {location.highlights && location.highlights.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card rounded-2xl p-8 clean-border mobile-transparent-card"
              >
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                  <Star className="w-6 h-6 text-accent-orange" />
                  {t("locationDetail.highlights")}
                </h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {location.highlights.map((highlight, i) => (
                    <li key={i} className="flex items-start gap-3 text-muted-foreground">
                      <div className="w-2 h-2 bg-accent-orange rounded-full mt-2 flex-shrink-0" />
                      <span>{translateData(highlight, highlight)}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Distance & Transportation */}
            {(location.airport_distance || location.city_distance || location.transportation) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {location.airport_distance && (
                  <div className="bg-card rounded-2xl p-6 clean-border mobile-transparent-card text-center">
                    <Plane className="w-8 h-8 text-accent-blue mx-auto mb-3" />
                    <h3 className="font-semibold text-foreground mb-1">{t("locationDetail.fromAirport")}</h3>
                    <p className="text-muted-foreground">{translateData(location.airport_distance, location.airport_distance)}</p>
                  </div>
                )}
                {location.city_distance && (
                  <div className="bg-card rounded-2xl p-6 clean-border mobile-transparent-card text-center">
                    <Building className="w-8 h-8 text-accent-blue mx-auto mb-3" />
                    <h3 className="font-semibold text-foreground mb-1">{t("locationDetail.fromCity")}</h3>
                    <p className="text-muted-foreground">{translateData(location.city_distance, location.city_distance)}</p>
                  </div>
                )}
                {location.transportation && (
                  <div className="bg-card rounded-2xl p-6 clean-border mobile-transparent-card text-center">
                    <Car className="w-8 h-8 text-accent-blue mx-auto mb-3" />
                    <h3 className="font-semibold text-foreground mb-1">{t("locationDetail.transportation")}</h3>
                    <p className="text-muted-foreground">{translateData(location.transportation, location.transportation)}</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Scheduled departures (indoor skydiving) */}
            {indoorService && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26 }}>
                <DepartureSchedule
                  serviceId={indoorService.id}
                  locationName={translatedName}
                  onBook={(departure) => {
                    setPreselectedLocationId(location.id);
                    setPreselectedServiceId(indoorService.id);
                    setPreselectedDate(departure.departure_date);
                    navigate("/#booking");
                    setTimeout(() => {
                      document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
                    }, 100);
                  }}
                />
              </motion.div>
            )}

            {/* Services at this location */}
            {services && services.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.27 }}>
                <h2 className="text-2xl font-bold text-foreground mb-6">{t("locationDetail.servicesHere")}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {services.map((service) => {
                    const translatedServiceName = translateData(
                      `service.${service.service_name}`,
                      service.service_name,
                    );
                    const locationComingSoon = isEffectivelyComingSoon(location);
                    return (
                      <div
                        key={service.id}
                        className={`bg-card rounded-2xl p-6 clean-border mobile-transparent-card transition-all duration-300 group ${
                          locationComingSoon
                            ? "opacity-60"
                            : "hover:border-accent-orange/50 hover:shadow-lg"
                        }`}
                      >

                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-bold text-foreground text-lg"><ServiceNameDisplay name={translatedServiceName} /></h3>
                          {locationComingSoon ? (
                            <span className="text-xs font-bold bg-accent-blue text-white px-3 py-1 rounded-full">
                              {t("common.comingSoon")}
                            </span>
                          ) : service.is_popular && (
                            <span className="text-xs font-bold bg-accent-orange text-white px-3 py-1 rounded-full">
                              {t("services.popular")}
                            </span>
                          )}
                        </div>
                        {(() => {
                          const parseNum = (s?: string | null) => {
                            if (!s) return null;
                            const c = String(s).replace(/[^0-9.]/g, '');
                            const n = parseFloat(c);
                            return Number.isFinite(n) && n > 0 ? n : null;
                          };
                          const cur = parseNum(service.price_display);
                          const orig = parseNum(service.original_price_display);
                          const pct = cur && orig && orig > cur ? Math.round((1 - cur / orig) * 100) : null;
                          return (
                            <div className="flex items-baseline gap-2 mb-3 flex-wrap">
                              <p className="text-2xl font-black text-accent-orange">{translateData(`price.${service.price_display}`, service.price_display)}</p>
                              {service.original_price_display && (
                                <span className="text-sm text-muted-foreground line-through">{service.original_price_display}</span>
                              )}
                              {pct !== null && (
                                <span className="text-xs font-bold bg-accent-orange text-white px-2 py-0.5 rounded">-{pct}%</span>
                              )}
                            </div>
                          );
                        })()}
                        {service.includes && service.includes.length > 0 && (
                          <ul className="space-y-1">
                            {service.includes.map((item, i) => (
                              <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-accent-emerald rounded-full" />
                                {translateData(`include.${item}`, item)}
                              </li>
                            ))}
                          </ul>
                        )}
                        {service.add_ons && service.add_ons.length > 0 && (
                          <div className="mt-4 rounded-xl bg-muted/40 p-3">
                            <p className="text-xs font-semibold text-foreground mb-2">{t("locationDetail.upgradeOptions")}</p>
                            <ul className="space-y-1">
                              {service.add_ons.map((addon, i) => (
                                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                  <span className="text-accent-blue mt-0.5">＋</span>
                                  <span>
                                    {translateData(`addon.${addon.name}`, addon.name)}
                                    {addon.price ? (
                                      <span className="font-semibold text-accent-orange"> {addon.price}</span>
                                    ) : null}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {!locationComingSoon && (
                          <div className="mt-5 flex flex-col sm:flex-row gap-2">
                            <button
                              type="button"
                              onClick={() => handleWhatsAppBook(service)}
                              className="flex-1 inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold px-4 py-2.5 rounded-lg transition-colors text-sm cursor-pointer"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                              </svg>
                              {t("locationDetail.whatsappBook")}
                            </button>
                            {service.service_type === "Tour" && TOUR_DETAIL_SLUGS.has(location.slug) && (
                              <button
                                type="button"
                                onClick={() => navigate(`/tour/${location.slug}/${service.id}`)}
                                className="inline-flex items-center justify-center gap-2 border border-border text-foreground hover:bg-muted font-semibold px-4 py-2.5 rounded-lg transition-colors text-sm cursor-pointer"
                              >
                                {t("locationDetail.viewItinerary")}
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Weather & Climate */}
            {(loc?.weather_lat || loc?.climate_summary || loc?.best_months) && (
              <LocationWeather
                lat={loc.weather_lat ?? null}
                lon={loc.weather_lon ?? null}
                bestMonths={loc.best_months ?? null}
                climateSummary={loc.climate_summary ?? null}
              />
            )}

            {/* Travel Tips & Getting There */}
            {(loc?.travel_tips || loc?.getting_there_from_hk) && (
              <LocationTravelTips
                tips={loc.travel_tips ?? null}
                gettingThereFromHk={loc.getting_there_from_hk ?? null}
              />
            )}

            {/* Accommodations */}
            {tourism?.accommodations && tourism.accommodations.length > 0 && (
              <LocationAccommodations items={tourism.accommodations} />
            )}

            {/* Attractions */}
            {tourism?.attractions && tourism.attractions.length > 0 && (
              <LocationAttractions items={tourism.attractions} />
            )}

            {/* Food */}
            {tourism?.food && tourism.food.length > 0 && (
              <LocationFood items={tourism.food} />
            )}

            {/* Photo Gallery */}
            {photos && photos.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <h2 className="text-2xl font-bold text-foreground mb-6">{t("locationDetail.photos")}</h2>
                <LocationPhotoGallery photos={photos} />
              </motion.div>
            )}

            {/* Location Map */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <h2 className="text-2xl font-bold text-foreground mb-6">{t("locationDetail.map")}</h2>
              <LocationMap
                city={location.City}
                name={translatedName}
                cityLabel={translatedCity}
                countryLabel={translatedCountry}
                fallbackEmbedUrl={loc.google_maps_embed_url}
              />
            </motion.div>


            {/* Book CTA */}
            {!isEffectivelyComingSoon(location) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="text-center"
              >
                <div className="bg-card rounded-2xl p-10 clean-border mobile-transparent-card">
                  <h2 className="text-3xl font-black text-foreground mb-4">{t("locationDetail.readyToJump")}</h2>
                  <button
                    onClick={handleBookHere}
                    className="bg-accent-orange text-white font-semibold px-10 py-4 rounded-lg hover:bg-accent-orange/90 transition-colors text-lg cursor-pointer"
                  >
                    {t("locationDetail.bookHere")}
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
