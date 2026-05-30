import { MapPin, Sunrise, Sun, Moon } from "lucide-react";
import type { ItineraryDay } from "@/hooks/useLocationServices";
import { useLanguage } from "@/contexts/LanguageContext";

interface Props {
  itinerary: ItineraryDay[];
}

export function TourItinerary({ itinerary }: Props) {
  const { t, translateData } = useLanguage();

  if (!itinerary || itinerary.length === 0) {
    return (
      <div className="rounded-2xl bg-card clean-border mobile-transparent-card p-8 text-center text-muted-foreground">
        {t("tour.itineraryComingSoon")}
      </div>
    );
  }

  const periodMeta = {
    morning: { Icon: Sunrise, label: t("tour.morning"), color: "text-amber-500" },
    afternoon: { Icon: Sun, label: t("tour.afternoon"), color: "text-orange-500" },
    evening: { Icon: Moon, label: t("tour.evening"), color: "text-indigo-500" },
  } as const;

  return (
    <ol className="space-y-4">
      {itinerary.map((day) => {
        const segments = Array.isArray(day.segments) && day.segments.length > 0
          ? day.segments
          : [
              { period: "morning" as const, items: [] },
              { period: "afternoon" as const, items: [] },
              { period: "evening" as const, items: [] },
            ];
        return (
          <li key={day.day} className="rounded-xl bg-card clean-border mobile-transparent-card p-5">
            <div className="font-bold text-foreground mb-3 inline-flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-accent-orange text-white text-xs">
                {t("tour.day")} {day.day}
              </span>
              {day.title && <span>{translateData(`tour.dayTitle.${day.title}`, day.title)}</span>}
            </div>
            <div className="relative pl-4 border-l-2 border-accent-orange/30 space-y-3">
              {segments.map((seg) => {
                if (!seg.items || seg.items.length === 0) return null;
                const meta = periodMeta[seg.period];
                const Icon = meta.Icon;
                return (
                  <div key={seg.period} className="relative">
                    <span className="absolute -left-[1.4rem] top-0.5 w-5 h-5 rounded-full bg-background border-2 border-accent-orange/40 flex items-center justify-center">
                      <Icon className={`w-3 h-3 ${meta.color}`} />
                    </span>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                      {meta.label}
                    </div>
                    <ul className="space-y-1">
                      {seg.items.map((item, i) => (
                        <li key={i} className="text-sm text-foreground">
                          <span className="font-medium">{translateData(`tour.item.${item.title}`, item.title)}</span>
                          {item.location && (
                            <span className="ml-1.5 inline-flex items-center gap-0.5 text-muted-foreground">
                              <MapPin className="w-3 h-3" />
                              {translateData(`tour.item.${item.location}`, item.location)}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
