import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Calendar, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const sections = [
  { id: "locations", labelKey: "nav.locations", icon: MapPin },
  { id: "services", labelKey: "nav.services", icon: Sparkles },
  { id: "safety", labelKey: "safety.badge", icon: ShieldCheck },
];

export function SectionNav() {
  const [activeSection, setActiveSection] = useState("hero");
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useLanguage();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      const hero = document.getElementById("hero");
      setIsVisible((hero?.getBoundingClientRect().bottom ?? 0) < 140);
      let current = "hero";
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.45) current = section.id;
      }
      setActiveSection(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
  };

  if (!isVisible) return null;

  return (
      <motion.nav
        initial={{ opacity: 0, y: reducedMotion ? 0 : -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="home-floating-nav"
        aria-label={t("scroll.navigation")}
      >
        {sections.map(({ id, labelKey, icon: Icon }) => <Button key={id} variant="ghost" onClick={() => scrollTo(id)} aria-current={activeSection === id ? "location" : undefined} className={`home-nav-item ${activeSection === id ? "is-active" : ""}`}><Icon /><span>{t(labelKey)}</span></Button>)}
        <Button onClick={() => scrollTo("booking")} className="home-nav-book"><Calendar /><span>{t("common.bookNow")}</span></Button>
      </motion.nav>
  );
}
