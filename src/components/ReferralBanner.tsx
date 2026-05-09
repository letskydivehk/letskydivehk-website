import { Gift, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

export function ReferralBanner() {
  const { t } = useLanguage();
  return (
    <section className="py-12 px-6">
      <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-r from-accent-blue to-emerald-500 text-white p-6 sm:p-10 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
            <Gift className="w-8 h-8" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-black mb-2">
              {t("referral.banner.title")}
            </h3>
            <p className="text-white/90 leading-relaxed">{t("referral.banner.body")}</p>
          </div>
          <Link
            to="/membership"
            className="inline-flex items-center gap-2 bg-white text-accent-blue font-bold px-5 py-3 rounded-xl hover:bg-white/90 transition-colors shrink-0"
          >
            {t("referral.banner.cta")} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
