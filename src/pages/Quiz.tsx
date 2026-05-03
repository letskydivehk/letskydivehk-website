import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Sparkles, Loader2, Lock } from "lucide-react";
import { z } from "zod";
import { PageNavbar } from "@/components/PageNavbar";
import { Footer } from "@/components/Footer";
import { BackgroundDecorations } from "@/components/BackgroundDecorations";
import { SEO } from "@/components/SEO";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLocations } from "@/hooks/useLocations";
import { useQuiz, type DBQuizOption } from "@/hooks/useQuiz";
import { computeRecommendation, encodeAnswers, quizLabel, quizText } from "@/lib/quiz";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const leadSchema = z.object({
  full_name: z.string().trim().min(1).max(100),
  phone: z.string().trim().min(6).max(30),
  email: z.string().trim().email().max(255),
});

export default function Quiz() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: questions = [], isLoading } = useQuiz();
  const { data: locations = [] } = useLocations();

  const [step, setStep] = useState(0);
  const [answersById, setAnswersById] = useState<Record<string, DBQuizOption | null>>({});
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [lead, setLead] = useState({ full_name: "", phone: "", email: "" });
  const [submitting, setSubmitting] = useState(false);

  const totalSteps = questions.length;
  const currentQuestion = questions[step];
  const currentAnswer = currentQuestion ? answersById[currentQuestion.id] : null;
  const progress = totalSteps ? ((step + (currentAnswer ? 1 : 0)) / totalSteps) * 100 : 0;

  const orderedAnswers = useMemo(
    () => questions.map((q) => answersById[q.id] || null),
    [questions, answersById],
  );

  const handleSelect = (option: DBQuizOption) => {
    if (!currentQuestion) return;
    setAnswersById({ ...answersById, [currentQuestion.id]: option });
  };

  const handleNext = () => {
    if (!currentAnswer) return;
    if (step < totalSteps - 1) setStep(step + 1);
    else setShowLeadForm(true);
  };

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = leadSchema.safeParse(lead);
    if (!parsed.success) {
      toast.error(t("quiz.lead.invalid") || "Please check your details.");
      return;
    }
    setSubmitting(true);
    const code = encodeAnswers(questions, orderedAnswers);
    const selections = orderedAnswers.filter((a): a is DBQuizOption => !!a);
    const rec = computeRecommendation(selections, locations);
    try {
      const { data, error } = await supabase.functions.invoke("register-quiz-lead", {
        body: {
          full_name: parsed.data.full_name,
          phone: parsed.data.phone,
          email: parsed.data.email,
          answer_code: code,
          recommended_service: rec.service,
          recommended_location_slug: rec.primaryLocation?.slug || null,
          language,
        },
      });
      if (error) throw error;
      if (data?.isNew) {
        toast.success(
          t("quiz.lead.creditToast") ||
            "Account created! Check your inbox for your $100 credit and login link.",
        );
      }
    } catch (err) {
      if (import.meta.env.DEV) console.error("quiz lead submit failed", err);
      // proceed to result either way
    }
    setSubmitting(false);
    navigate(`/quiz/result?a=${encodeURIComponent(code)}`);
  };

  const handleBack = () => {
    if (showLeadForm) {
      setShowLeadForm(false);
      return;
    }
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <SEO path="/quiz" />
      <BackgroundDecorations />
      <PageNavbar />

      <main className="relative z-10 pt-28 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
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

          {isLoading || !currentQuestion ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-accent-orange" />
            </div>
          ) : showLeadForm ? (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmitLead}
              className="bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-xl"
            >
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent-orange/10 text-accent-orange mb-3">
                  <Lock className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold mb-2">
                  {t("quiz.lead.title") || "Almost there!"}
                </h2>
                <p className="text-muted-foreground text-sm">
                  {t("quiz.lead.subtitle") ||
                    "We'll create your account and email you a login link with $100 HKD credit toward your first booking."}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="lead-name">{t("quiz.lead.name") || "Full name"}</Label>
                  <Input
                    id="lead-name"
                    required
                    maxLength={100}
                    value={lead.full_name}
                    onChange={(e) => setLead({ ...lead, full_name: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="lead-phone">{t("quiz.lead.phone") || "Mobile number"}</Label>
                  <Input
                    id="lead-phone"
                    required
                    type="tel"
                    maxLength={30}
                    value={lead.phone}
                    onChange={(e) => setLead({ ...lead, phone: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="lead-email">{t("quiz.lead.email") || "Email"}</Label>
                  <Input
                    id="lead-email"
                    required
                    type="email"
                    maxLength={255}
                    value={lead.email}
                    onChange={(e) => setLead({ ...lead, email: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mt-8">
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center gap-1 px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
                >
                  <ChevronLeft className="w-4 h-4" />
                  {t("quiz.back")}
                </button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-1 bg-accent-orange text-white font-bold px-6 py-3 rounded-xl hover:bg-accent-orange/90 transition-colors disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      {t("quiz.seeResult")}
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </div>
            </motion.form>
          ) : (
            <>
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

              <div className="bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-xl min-h-[420px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQuestion.id}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-2xl font-bold mb-6">{quizText(currentQuestion, language)}</h2>
                    <div className="flex flex-col gap-3">
                      {currentQuestion.options.map((option) => {
                        const selected = currentAnswer?.id === option.id;
                        return (
                          <motion.button
                            key={option.id}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => handleSelect(option)}
                            className={`w-full text-left rounded-xl px-5 py-4 font-medium transition-all border ${
                              selected
                                ? "bg-accent-orange/10 border-accent-orange text-foreground"
                                : "bg-muted/40 border-border hover:bg-accent-orange/5 hover:border-accent-orange/40"
                            }`}
                          >
                            {quizLabel(option, language)}
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

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
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
