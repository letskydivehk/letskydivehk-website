import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const sections = [
  { id: "hero", labelKey: "nav.home" },
  { id: "locations", labelKey: "nav.locations" },
  { id: "services", labelKey: "nav.services" },
  { id: "booking", labelKey: "nav.booking" },
  { id: "testimonials", labelKey: "nav.testimonials" },
  { id: "about", labelKey: "nav.about" },
  { id: "faq", labelKey: "nav.faq" },
  { id: "contact", labelKey: "nav.contact" },
];

export function SectionNav() {
  const [activeSection, setActiveSection] = useState("hero");
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);

      const scrollPos = window.scrollY + window.innerHeight / 3;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  if (!isVisible) return null;

  return (
    <TooltipProvider delayDuration={200}>
      <motion.nav
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-3"
        aria-label="Section navigation"
      >
        {sections.map((section) => (
          <Tooltip key={section.id}>
            <TooltipTrigger asChild>
              <button
                onClick={() => scrollTo(section.id)}
                className="group relative flex items-center justify-center cursor-pointer"
                aria-label={t(section.labelKey)}
              >
                <span
                  className={`block rounded-full transition-all duration-300 ${
                    activeSection === section.id
                      ? "w-3 h-3 bg-accent-orange shadow-md shadow-accent-orange/40"
                      : "w-2 h-2 bg-muted-foreground/30 group-hover:bg-accent-orange/60 group-hover:scale-125"
                  }`}
                />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" className="text-xs">
              {t(section.labelKey)}
            </TooltipContent>
          </Tooltip>
        ))}
      </motion.nav>
    </TooltipProvider>
  );
}
