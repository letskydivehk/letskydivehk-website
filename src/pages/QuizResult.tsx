import { useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Trophy,
  MapPin,
  ArrowRight,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Calendar,
  CreditCard,
  Send,
  Share2,
  ChevronRight,
  Plane,
} from "lucide-react";
import { PageNavbar } from "@/components/PageNavbar";
import { Footer } from "@/components/Footer";
import { BackgroundDecorations } from "@/components/BackgroundDecorations";
import { SEO } from "@/components/SEO";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocations } from "@/hooks/useLocations";
import { useBooking } from "@/contexts/BookingContext";
import { computeRecommendation, decodeAnswers, type ServiceKey } from "@/lib/quiz";
import { toast } from "sonner";

const SERVICE_EMOJI: Record<ServiceKey, string> = {
  tandem: "🪂",
  alicence: "🎓",
  group: "👥",
};

const SERVICE_TYPE_MAP: Record<ServiceKey, string> = {
  tandem: "tandem",
  alicence: "aff",
  group: "group",
};

export default function QuizResult() {
  const { t, translateData } = useLanguage();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { data: locations = [], isLoading } = useLocations();
  const { setPreselectedLocationId, setPreselectedServiceType, setActiveServiceTypeFilter } =
    useBooking();

  const code = params.get("a") || "";
  const selections = useMemo(() => decodeAnswers(code), [code]);

  const recommendation = useMemo(() => {
    if (locations.length === 0 || selections.length === 0) return null;
    return computeRecommendation(selections, locations);
  }, [selections, locations]);

  // Empty / invalid state
  if (!isLoading && (!recommendation || selections.length === 0)) {
    return (
      <div className="min-h-screen bg-background text-foreground relative">
        <SEO path="/quiz/result" />
        <BackgroundDecorations />
        <PageNavbar />
        <main className="relative z-10 pt-32 pb-20 px-6">
          <div className="max-w-xl mx-auto text-center bg-card border border-border rounded-3xl p-10 shadow-xl">
            <h1 className="text-2xl font-bold mb-3">{t("quiz.result.empty.title")}</h1>
            <p className="text-muted-foreground mb-6">{t("quiz.result.empty.desc")}</p>
            <Link
              to="/quiz"
              className="inline-flex items-center gap-2 bg-accent-orange text-white font-bold px-6 py-3 rounded-xl hover:bg-accent-orange/90"
            >
              {t("quiz.result.empty.cta")}
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleBookRecommendation = () => {
    if (!recommendation) return;
    if (recommendation.primaryLocation) {
      setPreselectedLocationId(recommendation.primaryLocation.id);
    }
    setPreselectedServiceType(SERVICE_TYPE_MAP[recommendation.service]);
    setActiveServiceTypeFilter(SERVICE_TYPE_MAP[recommendation.service]);
    navigate("/#booking");
    setTimeout(() => {
      document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
    }, 150);
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: t("quiz.result.share.title"),
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success(t("quiz.result.share.copied"));
      }
    } catch {
      // user cancelled
    }
  };

  if (!recommendation) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const { service, primaryLocation, alternateLocation, ranked, reasons } = recommendation;
  const serviceBookingType = service === "tandem" ? "direct" : "contact";

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <SEO path="/quiz/result" />
      <BackgroundDecorations />
      <PageNavbar />

      <main className="relative z-10 pt-28 pb-20 px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Hero result card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent-orange via-accent-orange to-orange-500 text-white p-8 sm:p-12 shadow-2xl"
          >
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-12 -left-8 w-48 h-48 bg-white/10 rounded-full blur-3xl" />

            <div className="relative text-center">
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold mb-4">
                <Trophy className="w-3.5 h-3.5" />
                {t("quiz.result.recommendedFor")}
              </div>
              <div className="text-6xl mb-3">{SERVICE_EMOJI[service]}</div>
              <h1 className="text-4xl sm:text-5xl font-black mb-3 leading-tight">
                {t(`quiz.result.${service}.title`)}
              </h1>
              {primaryLocation && (
                <div className="inline-flex items-center gap-2 text-white/95 text-lg sm:text-xl font-semibold">
                  <MapPin className="w-5 h-5" />
                  {translateData(
                    `location.${primaryLocation.slug}.name`,
                    primaryLocation.Name || "",
                  )}
                </div>
              )}
              <p className="text-white/90 max-w-xl mx-auto mt-4 text-sm sm:text-base">
                {t(`quiz.result.${service}.desc`)}
              </p>
            </div>
          </motion.div>

          {/* Summary grid: location + reasons */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Location card */}
            {primaryLocation && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card border border-border rounded-2xl overflow-hidden shadow-md"
              >
                {primaryLocation.image_url && (
                  <img
                    src={primaryLocation.image_url}
                    alt={primaryLocation.Name || ""}
                    className="w-full h-44 object-cover"
                    loading="lazy"
                  />
                )}
                <div className="p-5">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold mb-1.5">
                    <MapPin className="w-3 h-3" />
                    {t("quiz.result.bestLocation")}
                  </div>
                  <h2 className="text-xl font-bold mb-2">
                    {translateData(
                      `location.${primaryLocation.slug}.name`,
                      primaryLocation.Name || "",
                    )}
                  </h2>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {translateData(
                      `location.${primaryLocation.slug}.description`,
                      primaryLocation.description || "",
                    )}
                  </p>
                  <Link
                    to={`/location/${primaryLocation.slug}`}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-accent-orange hover:underline"
                  >
                    {t("quiz.result.viewLocation")}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            )}

            {/* Why this match */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-card border border-border rounded-2xl p-5 shadow-md"
            >
              <div className="flex items-center gap-2 text-xs font-semibold text-accent-orange mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                {t("quiz.result.whyMatch")}
              </div>
              <h3 className="text-lg font-bold mb-4">{t("quiz.result.whyMatchTitle")}</h3>
              <ul className="space-y-3">
                {reasons.length > 0 ? (
                  reasons.map((r) => (
                    <li key={r} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-foreground/85">{t(r)}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-muted-foreground">{t("quiz.reason.default")}</li>
                )}
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-foreground/85">
                    {t(`quiz.reason.service.${service}`)}
                  </span>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Alternates */}
          {ranked.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card border border-border rounded-2xl p-6 shadow-md"
            >
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Plane className="w-4 h-4 text-accent-orange" />
                {t("quiz.result.otherOptions")}
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {ranked.slice(1, 4).map(({ loc }) => (
                  <Link
                    key={loc.id}
                    to={`/location/${loc.slug}`}
                    className="group flex items-center gap-3 p-3 rounded-xl bg-muted/40 hover:bg-accent-orange/5 border border-transparent hover:border-accent-orange/30 transition-all"
                  >
                    {loc.image_url && (
                      <img
                        src={loc.image_url}
                        alt=""
                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                        loading="lazy"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-sm truncate">
                        {translateData(`location.${loc.slug}.name`, loc.Name || "")}
                      </div>
                      <div className="text-xs text-muted-foreground">{loc.country}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-accent-orange flex-shrink-0" />
                  </Link>
                ))}
              </div>
            </motion.div>
          )}

          {/* Next steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-md"
          >
            <h3 className="text-xl font-bold mb-5 flex items-center gap-2">
              <ChevronRight className="w-5 h-5 text-accent-orange" />
              {t("quiz.result.nextSteps")}
            </h3>
            <ol className="space-y-4">
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-accent-orange/10 text-accent-orange font-bold text-sm flex items-center justify-center flex-shrink-0">
                  1
                </div>
                <div>
                  <div className="font-semibold flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-accent-orange" />
                    {t("quiz.result.step1.title")}
                  </div>
                  <p className="text-sm text-muted-foreground">{t("quiz.result.step1.desc")}</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-accent-orange/10 text-accent-orange font-bold text-sm flex items-center justify-center flex-shrink-0">
                  2
                </div>
                <div>
                  <div className="font-semibold flex items-center gap-2">
                    {serviceBookingType === "direct" ? (
                      <CreditCard className="w-4 h-4 text-accent-orange" />
                    ) : (
                      <Send className="w-4 h-4 text-accent-orange" />
                    )}
                    {t(
                      serviceBookingType === "direct"
                        ? "quiz.result.step2.direct.title"
                        : "quiz.result.step2.contact.title",
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t(
                      serviceBookingType === "direct"
                        ? "quiz.result.step2.direct.desc"
                        : "quiz.result.step2.contact.desc",
                    )}
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-accent-orange/10 text-accent-orange font-bold text-sm flex items-center justify-center flex-shrink-0">
                  3
                </div>
                <div>
                  <div className="font-semibold flex items-center gap-2">
                    <Plane className="w-4 h-4 text-accent-orange" />
                    {t("quiz.result.step3.title")}
                  </div>
                  <p className="text-sm text-muted-foreground">{t("quiz.result.step3.desc")}</p>
                </div>
              </li>
            </ol>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleBookRecommendation}
              className="flex-1 bg-accent-orange text-white font-bold px-6 py-4 rounded-xl hover:bg-accent-orange/90 transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              {t("quiz.result.bookNow")}
              <ChevronRight className="w-4 h-4" />
            </motion.button>
            <button
              onClick={handleShare}
              className="font-semibold px-6 py-4 rounded-xl border border-border hover:bg-muted/50 transition-colors flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              {t("quiz.result.share")}
            </button>
            <Link
              to="/quiz"
              className="font-semibold px-6 py-4 rounded-xl border border-border hover:bg-muted/50 transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              {t("quiz.tryAgain")}
            </Link>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
