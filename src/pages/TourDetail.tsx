import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Calendar, MapPin, Loader2, Wallet } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { LocationService } from "@/hooks/useLocationServices";
import { useLocationBySlug } from "@/hooks/useLocationDetail";
import { useBooking } from "@/contexts/BookingContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageNavbar } from "@/components/PageNavbar";
import { Footer } from "@/components/Footer";
import { BackgroundDecorations } from "@/components/BackgroundDecorations";
import { TourItinerary } from "@/components/tour/TourItinerary";
import { SEO } from "@/components/SEO";

const ALLOWED_SLUGS = new Set(["pattaya", "huizhou", "hainan", "zhuhai"]);

function useTourService(serviceId?: string) {
  return useQuery({
    queryKey: ["location-service", serviceId],
    enabled: !!serviceId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("location_services")
        .select("*")
        .eq("id", serviceId!)
        .maybeSingle();
      if (error) throw error;
      return data as unknown as LocationService | null;
    },
  });
}

export default function TourDetail() {
  const { locationSlug, serviceId } = useParams<{ locationSlug: string; serviceId: string }>();
  const navigate = useNavigate();
  const { t, translateData } = useLanguage();
  const { setPreselectedLocationId, setPreselectedServiceId } = useBooking();

  const { data: location, isLoading: locLoading } = useLocationBySlug(locationSlug);
  const { data: tour, isLoading: tourLoading } = useTourService(serviceId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [serviceId]);

  const isLoading = locLoading || tourLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent-orange" />
      </div>
    );
  }

  if (!location || !tour || !ALLOWED_SLUGS.has(location.slug) || tour.location_id !== location.id) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">{t("locationDetail.notFound")}</h1>
          <button
            onClick={() => navigate("/")}
            className="text-accent-orange hover:underline cursor-pointer"
          >
            {t("locationDetail.backToHome")}
          </button>
        </div>
      </div>
    );
  }

  const translatedLocName = translateData(`location.${location.slug}`, location.Name);
  const translatedCity = translateData(`city.${location.City}`, location.City || "");
  const translatedCountry = translateData(`country.${location.country}`, location.country);
  const translatedTourName = translateData(`tour.name.${tour.service_name}`, tour.service_name);
  const heroImage = tour.photos?.[0] || location.image_url || "/placeholder.svg";
  const dayCount = tour.itinerary?.length || 0;

  const handleBook = () => {
    setPreselectedLocationId(location.id);
    setPreselectedServiceId(tour.id);
    navigate("/#booking");
    setTimeout(() => {
      document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <SEO
        title={`${translatedTourName} · ${translatedLocName}`}
        description={tour.description || `${translatedTourName} skydiving tour in ${translatedLocName}.`}
        path={`/tour/${location.slug}/${tour.id}`}
        image={heroImage}
      />
      <BackgroundDecorations />
      <PageNavbar />

      <main className="relative z-10 pt-20 pb-24 md:pb-16">
        {/* Hero */}
        <section className="relative h-[55vh] min-h-[420px] overflow-hidden">
          <img src={heroImage} alt={translatedTourName} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

          <div className="absolute top-6 left-6 z-20">
            <button
              onClick={() => navigate(`/location/${location.slug}`)}
              className="flex items-center gap-2 bg-card/80 backdrop-blur-sm text-foreground px-4 py-2 rounded-full clean-border hover:bg-card transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">{translatedLocName}</span>
            </button>
          </div>

          <div className="absolute bottom-8 left-0 right-0 z-10">
            <div className="container mx-auto px-6 sm:px-8 lg:px-12">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <MapPin className="w-4 h-4" />
                <span>
                  {translatedCity}, {translatedCountry}
                </span>
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-foreground max-w-4xl">
                {translatedTourName}
              </h1>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-12">
          <div className="max-w-4xl mx-auto space-y-10">
            {/* Quick facts + CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-2xl clean-border mobile-transparent-card p-6 sm:p-8 flex flex-col md:flex-row md:items-center gap-6"
            >
              <div className="flex-1 grid grid-cols-3 gap-4">
                <Fact
                  icon={<span className="text-2xl font-black text-accent-orange">$</span>}
                  label={t("tour.price") || "Price"}
                  value={translateData(`price.${tour.price_display}`, tour.price_display)}
                />
                <Fact
                  icon={<Wallet className="w-6 h-6 text-accent-blue" />}
                  label={t("tour.deposit")}
                  value={`HKD $${tour.deposit_amount}`}
                />
                {dayCount > 0 && (
                  <Fact
                    icon={<Calendar className="w-6 h-6 text-accent-blue" />}
                    label={t("tour.duration") || "Duration"}
                    value={`${dayCount} ${dayCount === 1 ? "Day" : "Days"}`}
                  />
                )}
              </div>
              <button
                onClick={handleBook}
                className="inline-flex items-center justify-center gap-2 bg-accent-orange text-white font-semibold px-8 py-4 rounded-lg hover:bg-accent-orange/90 transition-colors shrink-0"
              >
                {t("tour.bookTour")} <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>

            {/* Description */}
            {tour.description && (
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="text-lg text-muted-foreground leading-relaxed"
              >
                {translateData(`tour.desc.${tour.service_name}`, tour.description)}
              </motion.p>
            )}

            {/* Itinerary */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-2xl sm:text-3xl font-black text-foreground mb-6">
                {t("tour.itinerary")}
              </h2>
              <TourItinerary itinerary={tour.itinerary || []} />
            </motion.section>

            {/* Bottom CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-card rounded-2xl clean-border mobile-transparent-card p-8 text-center"
            >
              <h3 className="text-2xl font-black text-foreground mb-4">
                {t("locationDetail.readyToJump")}
              </h3>
              <button
                onClick={handleBook}
                className="inline-flex items-center gap-2 bg-accent-orange text-white font-semibold px-10 py-4 rounded-lg hover:bg-accent-orange/90 transition-colors text-lg"
              >
                {t("tour.bookTour")} <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Mobile sticky CTA */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-card/95 backdrop-blur border-t border-border p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <div className="text-xs text-muted-foreground truncate">{translatedTourName}</div>
            <div className="text-base font-bold text-accent-orange">
              {translateData(`price.${tour.price_display}`, tour.price_display)}
            </div>
          </div>
          <button
            onClick={handleBook}
            className="inline-flex items-center gap-1.5 bg-accent-orange text-white font-semibold px-5 py-3 rounded-lg shrink-0"
          >
            {t("tour.bookTour")} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function Fact({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="flex justify-center mb-1">{icon}</div>
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-sm sm:text-base font-bold text-foreground">{value}</div>
    </div>
  );
}
