import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ChevronRight, RotateCcw } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type Answer = string;

const questions = [
  { key: "quiz.q1", options: ["quiz.q1.a", "quiz.q1.b"] },
  { key: "quiz.q2", options: ["quiz.q2.a", "quiz.q2.b", "quiz.q2.c"] },
  { key: "quiz.q3", options: ["quiz.q3.a", "quiz.q3.b", "quiz.q3.c"] },
];

function getRecommendation(answers: Answer[]): string {
  // q1: first-time vs experienced
  // q2: solo, with-friends, team-building
  // q3: thrill-level casual, full-on, life-changing
  if (answers[0] === "quiz.q1.b") return "alicence"; // experienced -> A-Licence
  if (answers[1] === "quiz.q2.c") return "group"; // team-building -> Group
  if (answers[1] === "quiz.q2.b") return "tandem"; // with friends -> Tandem
  if (answers[2] === "quiz.q3.c") return "alicence"; // life-changing -> A-Licence
  return "tandem"; // default -> Tandem
}

export function JumpQuiz() {
  const { t } = useLanguage();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [result, setResult] = useState<string | null>(null);

  const handleAnswer = (option: string) => {
    const newAnswers = [...answers, option];
    setAnswers(newAnswers);

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setResult(getRecommendation(newAnswers));
    }
  };

  const reset = () => {
    setStep(0);
    setAnswers([]);
    setResult(null);
  };

  const scrollToBooking = () => {
    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-20 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-accent-orange/10 text-accent-orange px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4" />
            {t("quiz.badge")}
          </div>
          <h2 className="text-3xl sm:text-4xl font-black mb-3">{t("quiz.title")}</h2>
          <p className="text-muted-foreground mb-10">{t("quiz.subtitle")}</p>
        </motion.div>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-lg min-h-[280px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center w-full"
              >
                <div className="text-5xl mb-4">
                  {result === "tandem" ? "🪂" : result === "alicence" ? "🎓" : "👥"}
                </div>
                <h3 className="text-2xl font-bold mb-2">{t(`quiz.result.${result}.title`)}</h3>
                <p className="text-muted-foreground mb-6">{t(`quiz.result.${result}.desc`)}</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={scrollToBooking}
                    className="bg-accent-orange text-white font-bold px-6 py-3 rounded-lg hover:bg-accent-orange/90 transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    {t("quiz.bookThis")}
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                  <button
                    onClick={reset}
                    className="text-muted-foreground hover:text-foreground font-medium px-6 py-3 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
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
                className="w-full"
              >
                <div className="text-xs text-muted-foreground mb-4 font-medium">
                  {step + 1} / {questions.length}
                </div>
                <h3 className="text-xl font-bold mb-6">{t(questions[step].key)}</h3>
                <div className="flex flex-col gap-3">
                  {questions[step].options.map((option) => (
                    <motion.button
                      key={option}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswer(option)}
                      className="w-full text-left bg-muted/50 hover:bg-accent-orange/10 border border-border hover:border-accent-orange/30 rounded-xl px-5 py-4 font-medium transition-all cursor-pointer"
                    >
                      {t(option)}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
