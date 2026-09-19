import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthButton } from "@/components/AuthButton";
import { CreditPill } from "@/components/CreditPill";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface HeroNavigationProps {
  onBook: () => void;
}

export function HeroNavigation({ onBook }: HeroNavigationProps) {
  const { t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const anchorItems = [
    ["#locations", "nav.locations"],
    ["#services", "nav.services"],
    ["#about", "nav.about"],
    ["#faq", "nav.faq"],
    ["#contact", "nav.contact"],
  ];
  const routeItems = [
    ["/gallery", "nav.gallery"],
    ["/blog", "nav.blog"],
    ["/promotions", "nav.promotions"],
    ["/souvenirs", "nav.souvenirs"],
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed inset-x-0 top-0 z-[110]"
      aria-label="Primary navigation"
    >
      <div className={`px-4 py-3 transition-all sm:px-8 lg:px-12 ${isScrolled || isOpen ? "border-b border-experience-border bg-experience/85 backdrop-blur-xl" : "bg-transparent"}`}>
        <div className="mx-auto flex max-w-[96rem] items-center justify-between gap-3">
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="font-bagel text-lg text-experience-foreground sm:text-xl" aria-label={t("nav.home")}>
            LET'S SKYDIVE HK
          </button>

          <div className="hidden items-center gap-5 xl:flex">
            {anchorItems.map(([href, key]) => <a key={href} href={href} className="text-sm font-medium text-experience-muted transition-colors hover:text-experience-foreground">{t(key)}</a>)}
            {routeItems.map(([to, key]) => <Link key={to} to={to} className="text-sm font-medium text-experience-muted transition-colors hover:text-experience-foreground">{t(key)}</Link>)}
          </div>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <div className="hidden sm:block"><CreditPill /></div>
            <div className="hidden sm:block"><AuthButton /></div>
            <Button size="sm" onClick={onBook} className="hidden bg-experience-orange text-experience-foreground hover:bg-experience-orange/90 lg:inline-flex">{t("common.bookNow")}</Button>
            <Button size="icon" variant="ghost" onClick={() => setIsOpen((value) => !value)} className="text-experience-foreground hover:bg-experience-panel hover:text-experience-foreground xl:hidden" aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={isOpen}>
              {isOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 top-[4.25rem] bg-experience/95 px-6 py-8 backdrop-blur-xl xl:hidden">
            <div className="mx-auto flex h-full max-w-md flex-col">
              <div className="grid gap-1">
                {anchorItems.map(([href, key]) => <a key={href} href={href} onClick={() => setIsOpen(false)} className="border-b border-experience-border py-3 text-xl font-semibold text-experience-foreground">{t(key)}</a>)}
                {routeItems.map(([to, key]) => <Link key={to} to={to} onClick={() => setIsOpen(false)} className="border-b border-experience-border py-3 text-xl font-semibold text-experience-foreground">{t(key)}</Link>)}
              </div>
              <div className="mt-auto grid gap-3 sm:hidden"><CreditPill /><AuthButton /></div>
              <Button onClick={() => { setIsOpen(false); onBook(); }} className="mt-6 bg-experience-orange text-experience-foreground hover:bg-experience-orange/90">{t("hero.cta.book")}</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}