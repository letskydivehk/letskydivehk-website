import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Sparkles, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const STORAGE_KEY = "exit-intent-shown";

export function ExitIntentModal() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Only show on home; never on /quiz; once per session
    if (location.pathname !== "/") return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    const onLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) trigger();
    };
    let mobileTimer: number | null = null;
    const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches;
    if (isMobile) {
      // Mobile fallback: time-based after 45s of being on home
      mobileTimer = window.setTimeout(trigger, 45000);
    } else {
      document.addEventListener("mouseout", onLeave);
    }

    function trigger() {
      if (sessionStorage.getItem(STORAGE_KEY)) return;
      sessionStorage.setItem(STORAGE_KEY, "1");
      setOpen(true);
    }

    return () => {
      document.removeEventListener("mouseout", onLeave);
      if (mobileTimer) clearTimeout(mobileTimer);
    };
  }, [location.pathname]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={() => setOpen(false)}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative bg-card border border-border rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setOpen(false)}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground p-1"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="w-12 h-12 rounded-full bg-accent-orange/10 text-accent-orange flex items-center justify-center mb-4">
          <Sparkles className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-black mb-3 text-foreground">{t("exit.title")}</h2>
        <p className="text-muted-foreground leading-relaxed mb-6">{t("exit.body")}</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              setOpen(false);
              navigate("/quiz");
            }}
            className="flex-1 bg-accent-orange text-white font-bold px-5 py-3 rounded-xl hover:bg-accent-orange/90 transition-colors"
          >
            {t("exit.primary")}
          </button>
          <button
            onClick={() => setOpen(false)}
            className="flex-1 bg-muted text-foreground font-semibold px-5 py-3 rounded-xl hover:bg-muted/80 transition-colors"
          >
            {t("exit.secondary")}
          </button>
        </div>
      </div>
    </div>
  );
}
