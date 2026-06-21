import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Calendar, MapPin, User, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const WHATSAPP_URL = "https://wa.me/85269391570";

/**
 * Mobile-only persistent bottom tab bar.
 * Auto-hides on scroll-down, reveals on scroll-up. Respects iOS safe area.
 */
export function MobileTabBar() {
  const { t } = useLanguage();
  const location = useLocation();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let lastY = window.scrollY;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y < 80) setVisible(true);
        else if (y > lastY + 8) setVisible(false);
        else if (y < lastY - 8) setVisible(true);
        lastY = y;
        raf = 0;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const isHome = location.pathname === "/";
  const bookHref = isHome ? "#booking" : "/#booking";
  const locHref = isHome ? "#locations" : "/#locations";

  type Item = {
    key: string;
    labelKey: string;
    icon: typeof Calendar;
    href: string;
    primary?: boolean;
    external?: boolean;
  };
  const items: Item[] = [
    { key: "book", labelKey: "common.bookNow", icon: Calendar, href: bookHref, primary: true },
    { key: "loc", labelKey: "nav.locations", icon: MapPin, href: locHref },
    { key: "me", labelKey: "profile.title", icon: User, href: "/membership" },
    { key: "chat", labelKey: "whatsapp.title", icon: MessageCircle, href: WHATSAPP_URL, external: true },
  ];


  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-card/90 backdrop-blur-xl border-t border-border shadow-[0_-4px_30px_rgba(0,0,0,0.12)]"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          aria-label="Mobile primary navigation"
        >
          <ul className="grid grid-cols-4 gap-1 px-2 pt-1.5">
            {items.map(({ key, labelKey, icon: Icon, href, primary, external }) => {
              const isActive =
                (key === "me" && location.pathname.startsWith("/membership")) ||
                (key === "loc" && (location.hash === "#locations" || location.pathname.startsWith("/locations"))) ||
                (key === "book" && location.hash === "#booking");
              const inner = (
                <motion.span
                  whileTap={{ scale: 0.92 }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                  className={`flex flex-col items-center justify-center gap-0.5 py-1.5 px-1 rounded-lg min-h-11 transition-colors ${
                    primary || isActive ? "text-accent-orange" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <motion.span
                    animate={isActive || primary ? { scale: 1.1 } : { scale: 1 }}
                    transition={{ type: "spring", stiffness: 380, damping: 20 }}
                    className="relative inline-flex"
                  >
                    <Icon className="w-5 h-5" />
                    {primary && (
                      <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-accent-orange animate-ping opacity-75" />
                    )}
                  </motion.span>
                  <span className={`text-[10px] leading-tight truncate max-w-full ${isActive || primary ? "font-bold" : "font-medium"}`}>
                    {t(labelKey) || labelKey}
                  </span>
                </motion.span>
              );
              return (
                <li key={key}>
                  {external ? (
                    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={t(labelKey) || labelKey}>
                      {inner}
                    </a>
                  ) : href.startsWith("/") && !href.includes("#") ? (
                    <Link to={href} aria-label={t(labelKey) || labelKey}>
                      {inner}
                    </Link>
                  ) : (
                    <a href={href} aria-label={t(labelKey) || labelKey}>
                      {inner}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
