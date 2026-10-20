import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { SEO } from "@/components/SEO";
import { PageNavbar } from "@/components/PageNavbar";
import { Footer } from "@/components/Footer";
import { BackgroundDecorations } from "@/components/BackgroundDecorations";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { LeapClubStatus } from "@/components/leap/LeapClubStatus";
import { leapCopy, leapDays, leapTiers, lp } from "@/lib/leapClubCopy";

export default function LeapClub() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { data: jumps } = useQuery({
    queryKey: ["leap-jumps", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("total_jumps").eq("user_id", user!.id).maybeSingle();
      return data?.total_jumps ?? 0;
    },
  });

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <SEO
        title="離地會籍｜Skydive Hong Kong｜E人帶你由驚到飛"
        description="專為驚但想試嘅香港人而設嘅跳傘會籍。完成第1跳自動成為銀級會員，儲磁石貼、賺積分、每季一齊離地。"
        path="/membership"
      />
      <BackgroundDecorations />
      <PageNavbar />
      <main className="relative z-10 pt-28 pb-20">
        <div className="container max-w-5xl mx-auto px-4 space-y-16">
          <header className="text-center">
            <p className="text-sm font-semibold text-primary tracking-widest">{lp(leapCopy.name, language)}</p>
            <h1 className="mt-3 text-3xl md:text-5xl font-bold leading-tight">{lp(leapCopy.slogan, language)}</h1>
            <p className="mt-5 text-muted-foreground max-w-2xl mx-auto">{lp(leapCopy.intro, language)}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90">
                <Link to="/#booking">{lp(leapCopy.cta, language)}</Link>
              </Button>
              {user && (
                <Button asChild size="lg" variant="outline" className="rounded-full">
                  <Link to="/member/profile">{lp(leapCopy.myStatus, language)}</Link>
                </Button>
              )}
            </div>
          </header>

          {user && <div className="max-w-xl mx-auto"><LeapClubStatus totalJumps={jumps ?? 0} /></div>}

          <section className="rounded-3xl bg-card border border-border p-8 md:p-10 shadow-sm">
            <h2 className="text-2xl font-bold">{lp(leapCopy.letterTitle, language)}</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{lp(leapCopy.letter, language)}</p>
            <p className="mt-4 font-semibold text-right">— E人</p>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">{lp(leapCopy.tiersTitle, language)}</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {leapTiers.map((t) => (
                <div key={t.key} className="rounded-2xl bg-card border border-border p-6 shadow-sm">
                  <p className="text-xl font-bold">{lp(t.name, language)}</p>
                  <p className="text-sm text-primary mt-1">{lp(t.req, language)}</p>
                  <ul className="mt-4 space-y-2">
                    {t.perks.map((p, i) => (
                      <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 mt-0.5 shrink-0 text-primary" />{lp(p, language)}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-center">{lp(leapCopy.leapTitle, language)}</h2>
            <p className="text-center text-muted-foreground mt-2 mb-8">{lp(leapCopy.leapSub, language)}</p>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {leapDays.map((d) => (
                <div key={d.q} className="rounded-2xl bg-card border border-border p-6 shadow-sm">
                  <span className="inline-block rounded-full bg-accent/15 text-accent px-3 py-1 text-xs font-bold">{d.q}</span>
                  <p className="mt-3 text-lg font-bold">{lp(d.place, language)}</p>
                  <p className="text-sm text-primary">{lp(d.theme, language)}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{lp(d.desc, language)}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
