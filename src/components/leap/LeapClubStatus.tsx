import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { leapCopy, leapTiers, lp, tierForJumps } from "@/lib/leapClubCopy";

export function LeapClubStatus({ totalJumps }: { totalJumps: number }) {
  const { language } = useLanguage();
  const idx = tierForJumps(totalJumps);
  const next = leapTiers[idx + 1];
  const prevMin = idx >= 0 ? leapTiers[idx].min : 0;
  const pct = next ? ((totalJumps - prevMin) / (next.min - prevMin)) * 100 : 100;
  return (
    <Card className="mobile-transparent-card">
      <CardContent className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{lp(leapCopy.myStatus, language)}</p>
          <Link to="/membership" className="text-sm text-primary hover:underline">{lp(leapCopy.learn, language)} →</Link>
        </div>
        <p className="text-xl font-bold text-foreground">
          {idx >= 0 ? `${lp(leapCopy.name, language)}・${lp(leapTiers[idx].name, language)}` : lp(leapCopy.notMember, language)}
        </p>
        <div className="flex gap-2">
          {leapTiers.map((t, i) => (
            <span key={t.key} className={`flex-1 rounded-full px-2 py-1 text-center text-xs ${i <= idx ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
              {lp(t.name, language)}
            </span>
          ))}
        </div>
        <Progress value={pct} />
        <p className="text-xs text-muted-foreground">
          {next ? lp(leapCopy.jumpsToNext, language).replace("{n}", String(next.min - totalJumps)) : lp(leapCopy.maxTier, language)}
        </p>
      </CardContent>
    </Card>
  );
}

export function LeapClubNote({ kind }: { kind: "location" | "promo" }) {
  const { language } = useLanguage();
  return (
    <Link to="/membership" className="block rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-foreground hover:bg-primary/10 transition-colors">
      ✦ {lp(kind === "location" ? leapCopy.locationNote : leapCopy.promoNote, language)}
    </Link>
  );
}

export function LeapClubTeaser() {
  const { language } = useLanguage();
  return (
    <section aria-label="Leap Club" className="container mx-auto px-4 py-16">
      <div className="rounded-3xl bg-card border border-border p-8 md:p-12 text-center shadow-lg">
        <p className="text-sm font-semibold text-primary tracking-widest">{lp(leapCopy.name, language)}</p>
        <h2 className="mt-2 text-3xl md:text-4xl font-bold text-foreground">{lp(leapCopy.teaserTitle, language)}</h2>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">{lp(leapCopy.intro, language)}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {leapTiers.map((t) => (
            <span key={t.key} className="rounded-full bg-muted px-4 py-1.5 text-sm text-foreground">{lp(t.name, language)}・{lp(t.req, language)}</span>
          ))}
        </div>
        <Link to="/membership" className="mt-8 inline-flex rounded-full bg-accent px-6 py-3 font-semibold text-accent-foreground hover:opacity-90">
          {lp(leapCopy.learn, language)} →
        </Link>
      </div>
    </section>
  );
}
