import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useCreditBalance } from "@/hooks/useCreditBalance";

interface Props {
  onBook: () => void;
  depositLabel?: string;
}

/**
 * Mobile-first sticky booking CTA. Slides up after the user scrolls past the hero.
 * Shows credit-aware label when the user is signed in with a positive balance.
 */
export function StickyTourCTA({ onBook, depositLabel = "$500" }: Props) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { balance } = useCreditBalance();
  const { scrolled } = useScrollDirection(420);

  const hasCredit = !!user && typeof balance === "number" && balance > 0;

  return (
    <AnimatePresence>
      {scrolled && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-16 md:bottom-4 inset-x-0 z-[60] px-4 pointer-events-none"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <div className="mx-auto max-w-md pointer-events-auto">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={onBook}
              className="group w-full flex items-center justify-between gap-3 px-5 py-3.5 rounded-2xl bg-accent-orange text-white shadow-[0_12px_32px_-8px_rgba(234,88,12,0.55)] border border-white/20 backdrop-blur-md hover:bg-accent-orange/95 transition-colors"
            >
              <span className="flex flex-col items-start leading-tight">
                <span className="font-bold text-base">{t("tour.bookTour")}</span>
                <span className="text-[11px] opacity-90">
                  {hasCredit
                    ? `${t("tour.deposit")} ${depositLabel} · −$${balance} ${t("credits.label") || ""}`.trim()
                    : `${t("tour.deposit")} ${depositLabel}`}
                </span>
              </span>
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/15 group-hover:bg-white/25 transition-colors">
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
