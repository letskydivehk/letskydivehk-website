import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function StickyBookingBar() {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const heroEl = document.getElementById("hero");
    const bookingEl = document.getElementById("booking");

    const observer = new IntersectionObserver(
      (entries) => {
        const heroEntry = entries.find((e) => e.target.id === "hero");
        const bookingEntry = entries.find((e) => e.target.id === "booking");

        if (heroEntry) {
          // Show bar when hero is NOT in view
          if (!heroEntry.isIntersecting) {
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
        }
        if (bookingEntry && bookingEntry.isIntersecting) {
          setIsVisible(false);
        }
      },
      { threshold: 0.1 }
    );

    if (heroEl) observer.observe(heroEl);
    if (bookingEl) observer.observe(bookingEl);

    return () => observer.disconnect();
  }, []);

  const scrollToBooking = () => {
    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border shadow-[0_-4px_30px_rgba(0,0,0,0.15)]"
        >
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
            <div className="hidden sm:flex items-center gap-3 text-foreground">
              <div className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse" />
              <span className="text-sm font-medium">{t("sticky.message")}</span>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="sm:hidden text-sm font-medium text-foreground flex-1">
                {t("sticky.messageMobile")}
              </span>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={scrollToBooking}
                className="bg-accent-orange text-white font-bold px-6 py-2.5 rounded-lg text-sm hover:bg-accent-orange/90 transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap"
              >
                <Calendar className="w-4 h-4" />
                {t("common.bookNow")}
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
