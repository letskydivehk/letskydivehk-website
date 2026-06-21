import { useEffect, useState } from "react";
import { Sunrise, Sun, Moon, ArrowRight, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { PREVIOUS_ITINERARIES } from "@/data/previousItineraries";
import type { ItineraryDay, ItinerarySegment, ItineraryItem } from "@/hooks/useLocationServices";
import { cn } from "@/lib/utils";

const PERIOD_META = {
  morning: { Icon: Sunrise, label: "Morning", color: "text-amber-500", bg: "bg-amber-500/10" },
  afternoon: { Icon: Sun, label: "Afternoon", color: "text-orange-500", bg: "bg-orange-500/10" },
  evening: { Icon: Moon, label: "Evening", color: "text-indigo-500", bg: "bg-indigo-500/10" },
} as const;

type DiffStatus = "same" | "added" | "removed" | "changed";

function itemKey(it: ItineraryItem) {
  return `${(it.title || "").trim().toLowerCase()}|${(it.location || "").trim().toLowerCase()}`;
}

function diffItems(prev: ItineraryItem[], curr: ItineraryItem[]) {
  const prevKeys = new Set(prev.map(itemKey));
  const currKeys = new Set(curr.map(itemKey));
  const prevAnnotated = prev.map((it) => ({
    it,
    status: (currKeys.has(itemKey(it)) ? "same" : "removed") as DiffStatus,
  }));
  const currAnnotated = curr.map((it) => ({
    it,
    status: (prevKeys.has(itemKey(it)) ? "same" : "added") as DiffStatus,
  }));
  return { prevAnnotated, currAnnotated };
}

function getSegment(day: ItineraryDay | undefined, period: keyof typeof PERIOD_META): ItineraryItem[] {
  if (!day?.segments) return [];
  return day.segments.find((s) => s.period === period)?.items ?? [];
}

function ItemRow({ item, status }: { item: ItineraryItem; status: DiffStatus }) {
  const tone =
    status === "added"
      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
      : status === "removed"
      ? "bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300 line-through opacity-80"
      : "bg-muted/40 border-border/60 text-foreground";
  return (
    <li className={cn("rounded-lg border px-3 py-2 text-sm", tone)}>
      <div className="font-medium">{item.title}</div>
      {item.location && (
        <div className="mt-0.5 flex items-center gap-1 text-xs opacity-80">
          <MapPin className="h-3 w-3" />
          {item.location}
        </div>
      )}
    </li>
  );
}

function DayCompare({ prev, curr }: { prev?: ItineraryDay; curr?: ItineraryDay }) {
  const periods: (keyof typeof PERIOD_META)[] = ["morning", "afternoon", "evening"];
  const titleChanged = (prev?.title || "") !== (curr?.title || "");
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="rounded-lg bg-muted/30 border border-border/60 px-4 py-2">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">Before</div>
          <div className="font-semibold">{prev?.title ?? "—"}</div>
        </div>
        <div className={cn(
          "rounded-lg border px-4 py-2",
          titleChanged ? "bg-emerald-500/10 border-emerald-500/30" : "bg-muted/30 border-border/60"
        )}>
          <div className="text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-1">
            After {titleChanged && <Badge variant="secondary" className="ml-1 h-4 text-[10px]">changed</Badge>}
          </div>
          <div className="font-semibold">{curr?.title ?? "—"}</div>
        </div>
      </div>

      {periods.map((period) => {
        const meta = PERIOD_META[period];
        const { Icon } = meta;
        const prevItems = getSegment(prev, period);
        const currItems = getSegment(curr, period);
        const { prevAnnotated, currAnnotated } = diffItems(prevItems, currItems);
        if (prevAnnotated.length === 0 && currAnnotated.length === 0) return null;
        return (
          <div key={period} className="rounded-xl border border-border/60 bg-card/50 p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className={cn("h-7 w-7 rounded-full grid place-items-center", meta.bg, meta.color)}>
                <Icon className="h-4 w-4" />
              </span>
              <span className="font-medium">{meta.label}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3 items-start">
              <ul className="space-y-2">
                {prevAnnotated.length === 0 ? (
                  <li className="text-xs text-muted-foreground italic">No items</li>
                ) : (
                  prevAnnotated.map((a, i) => <ItemRow key={`p-${i}`} item={a.it} status={a.status} />)
                )}
              </ul>
              <div className="hidden md:flex items-center justify-center pt-3">
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <ul className="space-y-2">
                {currAnnotated.length === 0 ? (
                  <li className="text-xs text-muted-foreground italic">No items</li>
                ) : (
                  currAnnotated.map((a, i) => <ItemRow key={`c-${i}`} item={a.it} status={a.status} />)
                )}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
}

interface CurrentRow {
  id: string;
  service_name: string;
  itinerary: ItineraryDay[];
}

export function AdminItineraryComparePanel() {
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState<Record<string, CurrentRow>>({});
  const ids = Object.keys(PREVIOUS_ITINERARIES);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("location_services")
        .select("id, service_name, itinerary")
        .in("id", ids);
      if (!error && data) {
        const map: Record<string, CurrentRow> = {};
        data.forEach((r: any) => (map[r.id] = r as CurrentRow));
        setCurrent(map);
      }
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border/60 bg-card/40 px-4 py-3 text-sm text-muted-foreground">
        Side-by-side review of the agency-style rewrite. <span className="text-emerald-600 dark:text-emerald-400 font-medium">Green</span> = added,
        {" "}<span className="text-rose-600 dark:text-rose-400 font-medium">red strikethrough</span> = removed, neutral = unchanged.
      </div>

      <Tabs defaultValue={ids[0]} className="w-full">
        <TabsList className="flex flex-wrap h-auto gap-1">
          {ids.map((id) => (
            <TabsTrigger key={id} value={id} className="text-xs md:text-sm">
              {PREVIOUS_ITINERARIES[id].name}
            </TabsTrigger>
          ))}
        </TabsList>
        {ids.map((id) => {
          const prev = PREVIOUS_ITINERARIES[id].itinerary;
          const curr = current[id]?.itinerary ?? [];
          const days = Array.from(
            new Set([...prev.map((d) => d.day), ...curr.map((d) => d.day)])
          ).sort((a, b) => a - b);
          return (
            <TabsContent key={id} value={id} className="space-y-6 mt-4">
              {days.map((d) => (
                <div key={d} className="rounded-2xl border border-border/60 bg-background/60 p-4 md:p-5">
                  <div className="mb-3 text-sm font-semibold text-accent-orange">Day {d}</div>
                  <DayCompare prev={prev.find((x) => x.day === d)} curr={curr.find((x) => x.day === d)} />
                </div>
              ))}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
