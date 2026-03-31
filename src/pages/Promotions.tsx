import { SEO } from "@/components/SEO";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Users, Tag, Calendar, ChevronRight, GraduationCap, Cake, Clock, RotateCcw, Gift } from "lucide-react";
import { PageNavbar } from "@/components/PageNavbar";
import { useLanguage } from "@/contexts/LanguageContext";
import { Footer } from "@/components/Footer";
import { BackgroundDecorations } from "@/components/BackgroundDecorations";
import { toast } from "sonner";
import { CountdownTimer } from "@/components/CountdownTimer";
import { AuthModal } from "@/components/AuthModal";
const getExpiryDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  d.setHours(23, 59, 59, 0);
  return d;
};

const promotions = [
  {
    id: "signup-bonus",
    icon: Gift,
    titleKey: "promo.signup.title",
    descKey: "promo.signup.desc",
    detailsKey: "promo.signup.details",
    termsKey: "promo.signup.terms",
    highlight: "$100",
    highlightLabelKey: "promo.signup.credit",
    promoCode: "",
    active: true,
    expiresAt: null,
    isSignup: true,
  },
  {
    id: "group-discount-2",
    icon: Users,
    titleKey: "promo.group2.title",
    descKey: "promo.group2.desc",
    detailsKey: "promo.group2.details",
    termsKey: "promo.group2.terms",
    highlight: "$100",
    highlightLabelKey: "promo.perPerson",
    promoCode: "BUDDY100",
    active: true,
    expiresAt: getExpiryDate(),
  },
  {
    id: "student-discount",
    icon: GraduationCap,
    titleKey: "promo.student.title",
    descKey: "promo.student.desc",
    detailsKey: "promo.student.details",
    termsKey: "promo.student.terms",
    highlight: "$100",
    highlightLabelKey: "promo.off",
    promoCode: "STUDENT100",
    active: true,
    expiresAt: getExpiryDate(),
  },
  {
    id: "birthday-special",
    icon: Cake,
    titleKey: "promo.birthday.title",
    descKey: "promo.birthday.desc",
    detailsKey: "promo.birthday.details",
    termsKey: "promo.birthday.terms",
    highlight: "$100",
    highlightLabelKey: "promo.off",
    promoCode: "BDAY100",
    active: true,
    expiresAt: getExpiryDate(),
  },
  {
    id: "early-bird",
    icon: Clock,
    titleKey: "promo.earlybird.title",
    descKey: "promo.earlybird.desc",
    detailsKey: "promo.earlybird.details",
    termsKey: "promo.earlybird.terms",
    highlight: "10%",
    highlightLabelKey: "promo.off",
    promoCode: "EARLY10",
    active: true,
    expiresAt: getExpiryDate(),
  },
  {
    id: "repeat-jumper",
    icon: RotateCcw,
    titleKey: "promo.repeat.title",
    descKey: "promo.repeat.desc",
    detailsKey: "promo.repeat.details",
    termsKey: "promo.repeat.terms",
    highlight: "$150",
    highlightLabelKey: "promo.off",
    promoCode: "RETURN150",
    active: true,
    expiresAt: getExpiryDate(),
  },
];

export default function Promotions() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleClaimCoupon = (isSignup?: boolean) => {
    if (isSignup) {
      setShowAuth(true);
      return;
    }
    navigate("/");
    setTimeout(() => {
      document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <SEO title="Promotions" description="Exclusive skydiving deals and group discounts. Save on your next jump with Let's Skydive HK." path="/promotions" />
      
      <PageNavbar />

      <BackgroundDecorations />
      <main className="relative z-10 pt-24 pb-16">
        {/* Header */}
        <div className="max-w-4xl mx-auto px-6 mb-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("promo.backToHome")}
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 bg-accent-orange/10 text-accent-orange px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
              <Tag className="w-4 h-4" />
              {t("promo.badge")}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4">{t("promo.title")}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">{t("promo.subtitle")}</p>
          </motion.div>
        </div>

        {/* Promotions List */}
        <div className="max-w-4xl mx-auto px-6 space-y-8">
          {promotions.map((promo, index) => {
            const Icon = promo.icon;
            return (
              <motion.div
                key={promo.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-lg"
              >
                {/* Active badge */}
                {promo.active && (
                  <div className="absolute top-4 right-4 bg-accent-emerald text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {t("promo.active")}
                  </div>
                )}

                <div className="p-5 sm:p-8">
                  {/* Mobile: Row 1 - Discount + Claim Button */}
                  <button
                    onClick={() => handleClaimCoupon((promo as any).isSignup)}
                    className="group block w-full text-left bg-gradient-to-r from-accent-orange/10 to-accent-orange/5 border-2 border-dashed border-accent-orange/40 rounded-xl p-4 sm:p-5 mb-4 hover:border-accent-orange hover:from-accent-orange/20 hover:to-accent-orange/10 transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-10 h-10 sm:w-14 sm:h-14 rounded-xl bg-accent-orange/10 flex items-center justify-center">
                          <Icon className="w-5 h-5 sm:w-7 sm:h-7 text-accent-orange" />
                        </div>
                        <div>
                          <div className="text-3xl sm:text-5xl font-black text-accent-orange leading-none">{promo.highlight}</div>
                          <div className="font-semibold text-foreground text-sm sm:text-lg">{t(promo.highlightLabelKey)}</div>
                        </div>
                      </div>
                      <div className="flex-shrink-0 bg-accent-orange text-white font-bold px-3 py-2 sm:px-5 sm:py-2.5 rounded-lg group-hover:scale-105 transition-transform duration-200 flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
                        {(promo as any).isSignup ? t("promo.signup.cta") : t("promo.claimCoupon")}
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </button>

                  {/* Row 2 - Title + Description */}
                  <div className="mb-4 px-1">
                    <h2 className="text-xl sm:text-2xl font-bold mb-1">{t(promo.titleKey)}</h2>
                    <p className="text-sm sm:text-base text-muted-foreground">{t(promo.descKey)}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">{t(promo.detailsKey)}</p>
                  </div>

                  {/* Promo Code */}
                  {promo.promoCode && (
                    <div className="flex items-center gap-3 mb-6 px-1">
                      <span className="text-sm text-muted-foreground">{t("promo.code")}:</span>
                      <code className="bg-muted px-4 py-1.5 rounded-lg font-mono font-bold text-foreground tracking-widest text-sm border border-border">
                        {promo.promoCode}
                      </code>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(promo.promoCode);
                          toast.success(t("promo.codeCopied"));
                        }}
                        className="text-xs text-accent-orange hover:text-accent-orange/80 font-medium transition-colors cursor-pointer"
                      >
                        {t("promo.copyCode")}
                      </button>
                    </div>
                  )}

                  {/* Countdown Timer */}
                  {promo.expiresAt && (
                    <div className="mb-4">
                      <CountdownTimer targetDate={promo.expiresAt} />
                    </div>
                  )}

                  {/* Terms */}
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>
      <Footer />
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </div>
  );
}
