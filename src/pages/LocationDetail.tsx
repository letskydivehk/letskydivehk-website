import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Plane, Car, Building, Users, GraduationCap, Star, Loader2 } from "lucide-react";
import { useLocationBySlug, useLocationPhotos } from "@/hooks/useLocationDetail";
import { useLocationServices } from "@/hooks/useLocationServices";
import { useLanguage } from "@/contexts/LanguageContext";
import { useBooking } from "@/contexts/BookingContext";
import { BackgroundDecorations } from "@/components/BackgroundDecorations";
import { ServiceNameDisplay } from "@/components/ServiceNameDisplay";
import { Footer } from "@/components/Footer";
import { LocationPhotoGallery } from "@/components/location/LocationPhotoGallery";
import { SEO } from "@/components/SEO";
import { LocalBusinessJsonLd } from "@/components/JsonLd";

export default function LocationDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t, translateData } = useLanguage();
  const { setPreselectedLocationId, setPreselectedServiceId } = useBooking();

  const { data: location, isLoading, error } = useLocationBySlug(slug);
  const { data: photos } = useLocationPhotos(location?.id);
  const { data: services } = useLocationServices(location?.id);

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

  const handleServiceClick = (serviceId: string) => {
    if (location) {
      setPreselectedLocationId(location.id);
      setPreselectedServiceId(serviceId);
      navigate("/#booking");
      setTimeout(() => {
        document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
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
      <main className="relative z-10">
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
                      <span>{highlight}</span>
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
                    <p className="text-muted-foreground">{location.airport_distance}</p>
                  </div>
                )}
                {location.city_distance && (
                  <div className="bg-card rounded-2xl p-6 clean-border mobile-transparent-card text-center">
                    <Building className="w-8 h-8 text-accent-blue mx-auto mb-3" />
                    <h3 className="font-semibold text-foreground mb-1">{t("locationDetail.fromCity")}</h3>
                    <p className="text-muted-foreground">{location.city_distance}</p>
                  </div>
                )}
                {location.transportation && (
                  <div className="bg-card rounded-2xl p-6 clean-border mobile-transparent-card text-center">
                    <Car className="w-8 h-8 text-accent-blue mx-auto mb-3" />
                    <h3 className="font-semibold text-foreground mb-1">{t("locationDetail.transportation")}</h3>
                    <p className="text-muted-foreground">{location.transportation}</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Photo Gallery */}
            {photos && photos.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <h2 className="text-2xl font-bold text-foreground mb-6">{t("locationDetail.photos")}</h2>
                <LocationPhotoGallery photos={photos} />
              </motion.div>
            )}

            {/* Services at this location */}
            {services && services.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                <h2 className="text-2xl font-bold text-foreground mb-6">{t("locationDetail.servicesHere")}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {services.map((service) => {
                    const translatedServiceName = translateData(
                      `service.${service.service_name}`,
                      service.service_name,
                    );
                    return (
                      <div
                        key={service.id}
                        onClick={() => handleServiceClick(service.id)}
                        className="bg-card rounded-2xl p-6 clean-border mobile-transparent-card cursor-pointer hover:border-accent-orange/50 hover:shadow-lg transition-all duration-300 group"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-bold text-foreground text-lg"><ServiceNameDisplay name={translatedServiceName} /></h3>
                          {service.is_popular && (
                            <span className="text-xs font-bold bg-accent-orange text-white px-3 py-1 rounded-full">
                              {t("services.popular")}
                            </span>
                          )}
                        </div>
                        <p className="text-2xl font-black text-accent-orange mb-3">{translateData(`price.${service.price_display}`, service.price_display)}</p>
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
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Google Maps Embed */}
            {location.google_maps_embed_url && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <h2 className="text-2xl font-bold text-foreground mb-6">{t("locationDetail.map")}</h2>
                <div className="rounded-2xl overflow-hidden clean-border aspect-video">
                  <iframe
                    src={location.google_maps_embed_url}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Map of ${translatedName}`}
                  />
                </div>
              </motion.div>
            )}

            {/* Book CTA */}
            {!location.coming_soon && (
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
