import { motion } from "framer-motion";
import { Award, Lock, Camera, HelpCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useUserMagnets } from "@/hooks/useUserMagnets";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { rewardsCopy as c, pick, magnetTiers } from "@/lib/rewardsCopy";

interface Props {
  totalJumps?: number;
}

export function MagnetLadder({ totalJumps = 0 }: Props) {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { magnets } = useUserMagnets();
  const p = (t: any) => pick(t, language);
  const owned = new Set(magnets.map((m) => m.tier));

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-full bg-primary/10">
          <Award className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-foreground">{p(c.magnetsHeadline)}</h2>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">{p(c.magnetsIntro)}</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {magnetTiers.map((tier, i) => {
          const unlocked = user ? owned.has(tier.key) : totalJumps >= tier.jumps;
          return (
            <motion.div
              key={tier.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Card
                className={`mobile-transparent-card relative overflow-hidden border ${
                  unlocked ? "border-transparent shadow-lg" : "border-border/50 opacity-70"
                }`}
                style={unlocked ? { borderColor: `${tier.color}88` } : undefined}
              >
                <div className="h-1.5 w-full" style={{ backgroundColor: tier.color }} />
                <CardContent className="pt-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center border-2 shadow-inner"
                      style={{
                        backgroundColor: unlocked ? `${tier.color}33` : "hsl(var(--muted))",
                        borderColor: unlocked ? tier.color : "hsl(var(--border))",
                      }}
                    >
                      {unlocked ? (
                        <Award className="w-7 h-7" style={{ color: tier.color }} />
                      ) : (
                        <Lock className="w-6 h-6 text-muted-foreground" />
                      )}
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground">
                      {p(tier.jump)}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-foreground">{p(tier.name)}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {tier.jumps}+ {language === "en" ? "jump" + (tier.jumps > 1 ? "s" : "") : "跳"}
                    </p>
                  </div>

                  <p className="text-sm text-foreground/80 leading-relaxed">{p(tier.perk)}</p>

                  {!unlocked && (
                    <p className="text-[11px] text-muted-foreground">{p(c.locked)}</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="mobile-transparent-card">
          <CardContent className="pt-6 space-y-2">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Camera className="w-4 h-4 text-accent-orange" />
              {p(c.howReceiveTitle)}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{p(c.howReceiveBody)}</p>
          </CardContent>
        </Card>

        <Card className="mobile-transparent-card">
          <CardContent className="pt-6 space-y-2">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-primary" />
              {p(c.aboutMagnetTitle)}
            </h3>
            <ul className="text-sm text-muted-foreground space-y-1.5 list-disc pl-5">
              <li>{p(c.aboutMagnet1)}</li>
              <li>{p(c.aboutMagnet2)}</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {user && (
        <Card className="mobile-transparent-card border-primary/20">
          <CardContent className="pt-5 space-y-2.5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">{p(c.progressTitle)}</span>
              <span className="text-muted-foreground">
                {totalJumps} / 10
              </span>
            </div>
            <Progress value={Math.min(100, (totalJumps / 10) * 100)} className="h-2" />
            {(() => {
              const next = magnetTiers.find((t) => totalJumps < t.jumps);
              if (!next) return null;
              const need = next.jumps - totalJumps;
              return (
                <p className="text-xs text-muted-foreground">
                  {pick(c.nextMagnetProgress, language).replace("{n}", String(need))} —{" "}
                  <span style={{ color: next.color }} className="font-semibold">
                    {pick(next.name, language)}
                  </span>
                </p>
              );
            })()}
          </CardContent>
        </Card>
      )}
    </motion.section>
  );
}
