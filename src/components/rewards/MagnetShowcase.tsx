import { Award, Lock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUserMagnets } from "@/hooks/useUserMagnets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { rewardsCopy as c, pick, magnetTiers } from "@/lib/rewardsCopy";

interface Props {
  totalJumps: number;
}

export function MagnetShowcase({ totalJumps }: Props) {
  const { language } = useLanguage();
  const { magnets } = useUserMagnets();
  const p = (t: any) => pick(t, language);
  const owned = new Map(magnets.map((m) => [m.tier, m]));

  return (
    <Card className="mobile-transparent-card border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Award className="w-4 h-4 text-primary" />
          {p(c.accountMagnetTitle)}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-4 gap-2">
          {magnetTiers.map((t) => {
            const m = owned.get(t.key);
            const unlocked = !!m;
            return (
              <div key={t.key} className="text-center">
                <div
                  className="mx-auto w-14 h-14 rounded-lg overflow-hidden flex items-center justify-center border-2 mb-1"
                  style={{
                    borderColor: unlocked ? t.color : "hsl(var(--border))",
                    filter: unlocked ? "none" : "grayscale(1) opacity(0.5)",
                  }}
                  title={unlocked ? `${p(t.name)} · #${m?.jumps_at_award}` : p(c.locked)}
                >
                  <img src={t.image} alt={p(t.name)} className="w-full h-full object-cover" />
                  {!unlocked && (
                    <div className="absolute">
                      <Lock className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <p className="text-[10px] font-medium text-foreground">{p(t.name)}</p>
                <p className="text-[9px] text-muted-foreground">
                  {t.jumps}+
                </p>
              </div>
            );
          })}
        </div>

        {(() => {
          const next = magnetTiers.find((t) => totalJumps < t.jumps);
          if (!next) return null;
          const need = next.jumps - totalJumps;
          return (
            <p className="text-xs text-muted-foreground text-center pt-1 border-t border-border/40">
              {pick(c.nextMagnetProgress, language).replace("{n}", String(need))}
            </p>
          );
        })()}
      </CardContent>
    </Card>
  );
}
