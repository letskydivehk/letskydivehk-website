import { useState } from "react";
import { MapPin, Sunrise, Sun, Moon, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { ItineraryDay } from "@/hooks/useLocationServices";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface Props {
  itinerary: ItineraryDay[];
}

export function TourItinerary({ itinerary }: Props) {
  const { t, translateData } = useLanguage();
  const [activeDay, setActiveDay] = useState<number>(itinerary?.[0]?.day ?? 1);
  const [expandedSegment, setExpandedSegment] = useState<string | null>(null);

  if (!itinerary || itinerary.length === 0) {
    return (
      <div className="rounded-2xl bg-card clean-border mobile-transparent-card p-8 text-center text-muted-foreground">
        {t("tour.itineraryComingSoon")}
      </div>
    );
  }

  const periodMeta = {
    morning: { Icon: Sunrise, label: t("tour.morning"), color: "text-amber-500", ring: "ring-amber-500/30", bg: "bg-amber-500/10" },
    afternoon: { Icon: Sun, label: t("tour.afternoon"), color: "text-orange-500", ring: "ring-orange-500/30", bg: "bg-orange-500/10" },
    evening: { Icon: Moon, label: t("tour.evening"), color: "text-indigo-500", ring: "ring-indigo-500/30", bg: "bg-indigo-500/10" },
  } as const;

  const current = itinerary.find((d) => d.day === activeDay) ?? itinerary[0];
  const segments =
    Array.isArray(current.segments) && current.segments.length > 0
      ? current.segments
      : [
          { period: "morning" as const, items: [] },
          { period: "afternoon" as const, items: [] },
          { period: "evening" as const, items: [] },
        ];

  const toggleSegment = (key: string) =>
    setExpandedSegment((cur) => (cur === key ? null : key));

  return (
    <div className="space-y-4 md:space-y-5">
      {/* Day selector */}
      <div
        role="tablist"
        aria-label={t("tour.itinerary") || "Itinerary days"}
        className="flex gap-1.5 md:gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide snap-x snap-mandatory"
      >
        {itinerary.map((day) => {
          const isActive = day.day === activeDay;
          return (
            <button
              key={day.day}
              role="tab"
              aria-selected={isActive}
              onClick={() => {
                setActiveDay(day.day);
                setExpandedSegment(null);
              }}
              className={cn(
                "relative shrink-0 snap-start px-3 py-2 md:px-4 md:py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all duration-300",
                "border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-orange/60",
                isActive
                  ? "bg-accent-orange text-white border-accent-orange shadow-md shadow-accent-orange/30 scale-[1.02]"
                  : "bg-card/60 text-foreground border-border hover:border-accent-orange/50 hover:bg-accent-orange/5"
              )}
            >
              <div className="flex items-center gap-1.5 md:gap-2">
                <span
                  className={cn(
                    "inline-flex items-center justify-center w-5 h-5 md:w-6 md:h-6 rounded-md text-[10px] md:text-[11px] font-bold transition-colors",
                    isActive ? "bg-white/20 text-white" : "bg-accent-orange/10 text-accent-orange"
                  )}
                >
                  {day.day}
                </span>
                <span className="whitespace-nowrap max-w-[7rem] sm:max-w-none truncate">
                  {day.title
                    ? translateData(`tour.dayTitle.${day.title}`, day.title)
                    : `${t("tour.day")} ${day.day}`}
                </span>
              </div>
              {isActive && (
                <motion.span
                  layoutId="day-underline"
                  className="absolute inset-x-3 -bottom-1 h-0.5 rounded-full bg-white/80"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Active day card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.day}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl bg-card clean-border mobile-transparent-card p-4 md:p-6"
        >
          <div className="flex items-center gap-2 mb-3 md:mb-4 flex-wrap">
            <span className="px-2 py-0.5 md:px-2.5 md:py-1 rounded-md bg-accent-orange text-white text-[11px] md:text-xs font-semibold">
              {t("tour.day")} {current.day}
            </span>
            {current.title && (
              <h3 className="text-sm md:text-lg font-bold text-foreground">
                {translateData(`tour.dayTitle.${current.title}`, current.title)}
              </h3>
            )}
          </div>

          <div className="space-y-2.5">
            {segments.map((seg, segIdx) => {
              if (!seg.items || seg.items.length === 0) return null;
              const meta = periodMeta[seg.period];
              const Icon = meta.Icon;
              const key = `${current.day}-${seg.period}`;
              const isOpen = expandedSegment === key || expandedSegment === null;

              return (
                <motion.div
                  key={seg.period}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: segIdx * 0.06 }}
                  className={cn(
                    "rounded-xl border border-border bg-background/40 overflow-hidden transition-colors",
                    isOpen && "border-accent-orange/30"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => toggleSegment(key)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center gap-2.5 md:gap-3 px-3 md:px-4 py-2.5 md:py-3 text-left hover:bg-accent-orange/5 transition-colors"
                  >
                    <span
                      className={cn(
                        "inline-flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full ring-2 shrink-0",
                        meta.bg,
                        meta.ring
                      )}
                    >
                      <Icon className={cn("w-4 h-4", meta.color)} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] md:text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {meta.label}
                      </div>
                      <div className="text-[13px] md:text-sm font-medium text-foreground truncate">
                        {translateData(
                          `tour.item.${seg.items[0].title}`,
                          seg.items[0].title
                        )}
                        {seg.items.length > 1 && (
                          <span className="text-muted-foreground font-normal">
                            {" "}
                            +{seg.items.length - 1}
                          </span>
                        )}
                      </div>
                    </div>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                      className="text-muted-foreground shrink-0"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <ul className="px-3 md:px-4 pb-3 md:pb-4 pt-1 pl-[2.75rem] md:pl-[3.75rem] space-y-2">
                          {seg.items.map((item, i) => (
                            <motion.li
                              key={i}
                              initial={{ opacity: 0, x: -6 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: 0.05 + i * 0.05 }}
                              className="relative text-[13px] md:text-sm text-foreground flex flex-wrap items-center gap-x-2 gap-y-0.5 before:content-[''] before:absolute before:-left-3 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-accent-orange/60"
                            >
                              <span className="font-medium">
                                {translateData(`tour.item.${item.title}`, item.title)}
                              </span>
                              {item.location && (
                                <span className="inline-flex items-center gap-0.5 text-[11px] md:text-xs text-muted-foreground">
                                  <MapPin className="w-3 h-3" />
                                  {translateData(
                                    `tour.item.${item.location}`,
                                    item.location
                                  )}
                                </span>
                              )}
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
