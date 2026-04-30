import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, RotateCcw, Sparkles, MapPin, Trophy, ArrowRight } from "lucide-react";
import { PageNavbar } from "@/components/PageNavbar";
import { Footer } from "@/components/Footer";
import { BackgroundDecorations } from "@/components/BackgroundDecorations";
import { SEO } from "@/components/SEO";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocations, type Location } from "@/hooks/useLocations";
import { useBooking } from "@/contexts/BookingContext";

type ServiceKey = "tandem" | "alicence" | "group";

interface QuestionOption {
  key: string;
  // partial scoring weights
  service?: Partial<Record<ServiceKey, number>>;
  // location attribute weights
  loc?: {
    country?: "Thailand" | "China";
    proximity?: number;       // higher = wants nearby (China)
    scenery?: number;         // higher = scenic (Thailand/Hainan)
    budget?: number;          // higher = budget conscious (China)
    needsAff?: boolean;       // require A-Licence dropzone
    needsGroup?: boolean;     // require group events dropzone
    monthPref?: number[];     // months they prefer to travel
  };
}

interface Question {
  key: string;
  options: QuestionOption[];
}

const QUESTIONS: Question[] = [
  {
    key: "quiz.q1",
    options: [
      { key: "quiz.q1.a", service: { tandem: 3 } },
      { key: "quiz.q1.b", service: { tandem: 1, alicence: 2 } },
      { key: "quiz.q1.c", service: { alicence: 4 } },
    ],
  },
  {
    key: "quiz.q2",
    options: [
      { key: "quiz.q2.a", service: { tandem: 1, alicence: 2 } },
      { key: "quiz.q2.b", service: { tandem: 3 } },
      { key: "quiz.q2.c", service: { group: 4, tandem: 1 }, loc: { needsGroup: true } },
      { key: "quiz.q2.d", service: { alicence: 3 } },
    ],
  },
  {
    key: "quiz.q3",
    options: [
      { key: "quiz.q3.a", service: { tandem: 2 } },
      { key: "quiz.q3.b", service: { tandem: 3, group: 1 } },
      { key: "quiz.q3.c", service: { alicence: 4 } },
    ],
  },
  {
    key: "quiz.q4",
    options: [
      { key: "quiz.q4.a", loc: { proximity: 3, country: "China", budget: 1 } },
      { key: "quiz.q4.b", loc: { proximity: 1, scenery: 2 } },
      { key: "quiz.q4.c", loc: { proximity: 0, scenery: 3, country: "Thailand" } },
    ],
  },
  {
    key: "quiz.q5",
    options: [
      { key: "quiz.q5.a", loc: { budget: 3, country: "China" } },
      { key: "quiz.q5.b", loc: { budget: 1 } },
      { key: "quiz.q5.c", loc: { budget: 0, scenery: 2 } },
    ],
  },
  {
    key: "quiz.q6",
    options: [
      { key: "quiz.q6.a", loc: { scenery: 3, country: "Thailand" } },
      { key: "quiz.q6.b", loc: { scenery: 2 } },
      { key: "quiz.q6.c", loc: { proximity: 2, country: "China" } },
      { key: "quiz.q6.d", loc: { scenery: 3 } },
    ],
  },
  {
    key: "quiz.q7",
    options: [
      { key: "quiz.q7.a", loc: { monthPref: [10, 11, 12] } },
      { key: "quiz.q7.b", loc: { monthPref: [1, 2, 3] } },
      { key: "quiz.q7.c", loc: { monthPref: [4, 5, 6, 7, 8, 9] } },
      { key: "quiz.q7.d", loc: {} },
    ],
  },
];

interface Recommendation {
  service: ServiceKey;
  primaryLocation: Location | null;
  alternateLocation: Location | null;
}

function computeRecommendation(
  selections: QuestionOption[],
  locations: Location[],
): Recommendation {
  // ---- Service scoring ----
  const sScore: Record<ServiceKey, number> = { tandem: 0, alicence: 0, group: 0 };
  selections.forEach((opt) => {
    if (opt.service) {
      (Object.keys(opt.service) as ServiceKey[]).forEach((k) => {
        sScore[k] += opt.service![k] || 0;
      });
    }
  });
  const service = (Object.entries(sScore).sort((a, b) => b[1] - a[1])[0][0] as ServiceKey) || "tandem";

  // ---- Aggregate location prefs ----
  const agg = {
    proximity: 0,
    scenery: 0,
    budget: 0,
    countryBoost: { Thailand: 0, China: 0 } as Record<string, number>,
    monthPref: new Set<number>(),
    needsAff: service === "alicence",
    needsGroup: false,
  };
  selections.forEach((opt) => {
    const l = opt.loc;
    if (!l) return;
    if (l.proximity) agg.proximity += l.proximity;
    if (l.scenery) agg.scenery += l.scenery;
    if (l.budget) agg.budget += l.budget;
    if (l.country) agg.countryBoost[l.country] = (agg.countryBoost[l.country] || 0) + 2;
    if (l.needsAff) agg.needsAff = true;
    if (l.needsGroup) agg.needsGroup = true;
    if (l.monthPref) l.monthPref.forEach((m) => agg.monthPref.add(m));
  });

  // Per-location heuristic profile (slug-based)
  const profile: Record<string, { proximity: number; scenery: number; budget: number }> = {
    pattaya: { proximity: 0, scenery: 3, budget: 0 },
    "chiang-mai": { proximity: 0, scenery: 3, budget: 1 },
    huizhou: { proximity: 3, scenery: 1, budget: 3 },
    luoding: { proximity: 3, scenery: 2, budget: 3 },
    zhuhai: { proximity: 3, scenery: 2, budget: 2 },
    hainan: { proximity: 1, scenery: 3, budget: 2 },
  };

  const candidates = locations
    .filter((l) => l.is_active && !l.coming_soon)
    .filter((l) => (agg.needsAff ? l.has_aff : true))
    .filter((l) => (agg.needsGroup ? l.has_group_events : true));

  const ranked = candidates
    .map((l) => {
      const p = profile[l.slug] || { proximity: 1, scenery: 2, budget: 1 };
      let score = 0;
      score += p.proximity * agg.proximity;
      score += p.scenery * agg.scenery;
      score += p.budget * agg.budget;
      score += agg.countryBoost[l.country] || 0;
      // month overlap
      if (agg.monthPref.size > 0 && l.best_months) {
        const overlap = (l.best_months as number[]).filter((m) => agg.monthPref.has(m)).length;
        score += overlap * 1.5;
      }
      return { loc: l, score };
    })
    .sort((a, b) => b.score - a.score);

  return {
    service,
    primaryLocation: ranked[0]?.loc || null,
    alternateLocation: ranked[1]?.loc || null,
  };
}

export default function Quiz() {
  const { t, translateData } = useLanguage();
  const navigate = useNavigate();
  const { data: locations = [] } = useLocations();
  const { setPreselectedLocationId, setPreselectedServiceType, setActiveServiceTypeFilter } = useBooking();

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<(QuestionOption | null)[]>(
    () => Array(QUESTIONS.length).fill(null),
  );
  const [showResult, setShowResult] = useState(false);

  const totalSteps = QUESTIONS.length;
  const currentQuestion = QUESTIONS[step];
  const currentAnswer = answers[step];
  const progress = ((step + (currentAnswer ? 1 : 0)) / totalSteps) * 100;

  const recommendation = useMemo(() => {
    if (!showResult) return null;
    return computeRecommendation(
      answers.filter((a): a is QuestionOption => a !== null),
      locations,
    );
  }, [showResult, answers, locations]);

  const handleSelect = (option: QuestionOption) => {
    const next = [...answers];
    next[step] = option;
    setAnswers(next);
  };

  const handleNext = () => {
    if (!currentAnswer) return;
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleBack = () => {
    if (showResult) {
      setShowResult(false);
      return;
    }
    if (step > 0) setStep(step - 1);
  };

  const reset = () => {
    setStep(0);
    setAnswers(Array(QUESTIONS.length).fill(null));
    setShowResult(false);
  };

  const handleBookRecommendation = () => {
    if (!recommendation) return;
    if (recommendation.primaryLocation) {
      setPreselectedLocationId(recommendation.primaryLocation.id);
    }
    const serviceTypeMap: Record<ServiceKey, string> = {
      tandem: "tandem",
      alicence: "aff",
      group: "group",
    };
    setPreselectedServiceType(serviceTypeMap[recommendation.service]);
    setActiveServiceTypeFilter(serviceTypeMap[recommendation.service]);
    navigate("/#booking");
    setTimeout(() => {
      document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <SEO path="/quiz" />
      <BackgroundDecorations />
      <PageNavbar />

      <main className="relative z-10 pt-28 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 bg-accent-orange/10 text-accent-orange px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
              <Sparkles className="w-4 h-4" />
              {t("quiz.badge")}
            </div>
            <h1 className="text-4xl sm:text-5xl font-black mb-3">{t("quiz.page.title")}</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">{t("quiz.page.subtitle")}</p>
          </motion.div>

          {/* Progress */}
          {!showResult && (
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2 font-medium">
                <span>
                  {t("quiz.progress")} {step + 1} / {totalSteps}
                </span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-accent-orange"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>
          )}

          {/* Card */}
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-xl min-h-[420px]">
            <AnimatePresence mode="wait">
              {showResult && recommendation ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <div className="text-6xl mb-3">
                      {recommendation.service === "tandem"
                        ? "🪂"
                        : recommendation.service === "alicence"
                          ? "🎓"
                          : "👥"}
                    </div>
                    <div className="inline-flex items-center gap-2 text-xs font-semibold text-accent-orange bg-accent-orange/10 px-3 py-1 rounded-full mb-3">
                      <Trophy className="w-3 h-3" />
                      {t("quiz.result.recommendedFor")}
                    </div>
                    <h2 className="text-3xl font-black mb-2">
                      {t(`quiz.result.${recommendation.service}.title`)}
                    </h2>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      {t(`quiz.result.${recommendation.service}.desc`)}
                    </p>
                  </div>

                  {recommendation.primaryLocation && (
                    <div className="bg-muted/40 border border-border rounded-2xl p-5">
                      <div className="flex items-start gap-4">
                        {recommendation.primaryLocation.image_url && (
                          <img
                            src={recommendation.primaryLocation.image_url}
                            alt={recommendation.primaryLocation.Name || ""}
                            className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                            loading="lazy"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold mb-1">
                            <MapPin className="w-3 h-3" />
                            {t("quiz.result.bestLocation")}
                          </div>
                          <h3 className="text-xl font-bold mb-1">
                            {translateData(
                              `location.${recommendation.primaryLocation.slug}.name`,
                              recommendation.primaryLocation.Name || "",
                            )}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {translateData(
                              `location.${recommendation.primaryLocation.slug}.description`,
                              recommendation.primaryLocation.description || "",
                            )}
                          </p>
                        </div>
                      </div>
                      <Link
                        to={`/location/${recommendation.primaryLocation.slug}`}
                        className="inline-flex items-center gap-1 text-sm font-semibold text-accent-orange mt-3 hover:underline"
                      >
                        {t("quiz.result.viewLocation")}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}

                  {recommendation.alternateLocation && (
                    <div className="text-sm text-muted-foreground text-center">
                      {t("quiz.result.alsoConsider")}{" "}
                      <Link
                        to={`/location/${recommendation.alternateLocation.slug}`}
                        className="text-foreground font-semibold hover:underline"
                      >
                        {translateData(
                          `location.${recommendation.alternateLocation.slug}.name`,
                          recommendation.alternateLocation.Name || "",
                        )}
                      </Link>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleBookRecommendation}
                      className="flex-1 bg-accent-orange text-white font-bold px-6 py-3.5 rounded-xl hover:bg-accent-orange/90 transition-colors flex items-center justify-center gap-2"
                    >
                      {t("quiz.result.bookNow")}
                      <ChevronRight className="w-4 h-4" />
                    </motion.button>
                    <button
                      onClick={reset}
                      className="text-muted-foreground hover:text-foreground font-medium px-6 py-3.5 rounded-xl border border-border transition-colors flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      {t("quiz.tryAgain")}
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-bold mb-6">{t(currentQuestion.key)}</h2>
                  <div className="flex flex-col gap-3">
                    {currentQuestion.options.map((option) => {
                      const selected = currentAnswer?.key === option.key;
                      return (
                        <motion.button
                          key={option.key}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => handleSelect(option)}
                          className={`w-full text-left rounded-xl px-5 py-4 font-medium transition-all border ${
                            selected
                              ? "bg-accent-orange/10 border-accent-orange text-foreground"
                              : "bg-muted/40 border-border hover:bg-accent-orange/5 hover:border-accent-orange/40"
                          }`}
                        >
                          {t(option.key)}
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Nav buttons */}
          {!showResult && (
            <div className="flex items-center justify-between mt-6">
              <button
                onClick={handleBack}
                disabled={step === 0}
                className="inline-flex items-center gap-1 px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                {t("quiz.back")}
              </button>
              <motion.button
                whileHover={currentAnswer ? { scale: 1.03 } : {}}
                whileTap={currentAnswer ? { scale: 0.97 } : {}}
                onClick={handleNext}
                disabled={!currentAnswer}
                className="inline-flex items-center gap-1 bg-accent-orange text-white font-bold px-6 py-3 rounded-xl hover:bg-accent-orange/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {step === totalSteps - 1 ? t("quiz.seeResult") : t("quiz.next")}
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
