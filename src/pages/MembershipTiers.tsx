import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Award, Star, Crown, Gem, Check, ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { SEO } from "@/components/SEO";
import { PageNavbar } from "@/components/PageNavbar";
import { Footer } from "@/components/Footer";
import { BackgroundDecorations } from "@/components/BackgroundDecorations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { PointsProgram } from "@/components/rewards/PointsProgram";
import { MagnetLadder } from "@/components/rewards/MagnetLadder";
import { rewardsCopy, pick } from "@/lib/rewardsCopy";

const iconMap: Record<string, any> = { award: Award, star: Star, crown: Crown, gem: Gem };

function getLocalizedField(row: any, field: string, language: Language): string {
  if (language === "zh-TW" && row[`${field}_zh_tw`]) return row[`${field}_zh_tw`];
  if (language === "zh-CN" && row[`${field}_zh_cn`]) return row[`${field}_zh_cn`];
  return row[field] || "";
}

function getLocalizedArray(row: any, field: string, language: Language): string[] {
  if (language === "zh-TW" && row[`${field}_zh_tw`]?.length) return row[`${field}_zh_tw`];
  if (language === "zh-CN" && row[`${field}_zh_cn`]?.length) return row[`${field}_zh_cn`];
  return row[field] || [];
}

export default function MembershipTiers() {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") ?? "points";
  const p = (x: any) => pick(x, language);

  const { data: tiers = [] } = useQuery({
    queryKey: ["membership-tiers"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("membership_tiers")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return (data || []) as any[];
    },
  });

  const { data: profile } = useQuery({
    queryKey: ["profile-jumps", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("total_jumps")
        .eq("user_id", user!.id)
        .maybeSingle();
      return data;
    },
  });

  const totalJumps = useMemo(() => (profile as any)?.total_jumps ?? 0, [profile]);

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <SEO title={p(rewardsCopy.heroTitle)} description={p(rewardsCopy.heroSub)} path="/membership/tiers" />
      <PageNavbar />
      <BackgroundDecorations />

      <main className="relative z-10 pt-24 pb-20">
        <div className="container max-w-6xl mx-auto px-4">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            {t("legal.backToHome")}
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <Award className="w-3 h-3 mr-1" />
              {p(rewardsCopy.heroBadge)}
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-3">
              {p(rewardsCopy.heroTitle)}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">{p(rewardsCopy.heroSub)}</p>
          </motion.div>

          <Tabs
            value={activeTab}
            onValueChange={(v) => setSearchParams({ tab: v })}
            className="w-full"
          >
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8 h-auto">
              <TabsTrigger value="points" className="py-2.5">
                {p(rewardsCopy.tabPoints)}
              </TabsTrigger>
              <TabsTrigger value="magnets" className="py-2.5">
                {p(rewardsCopy.tabMagnets)}
              </TabsTrigger>
              <TabsTrigger value="tiers" className="py-2.5">
                {p(rewardsCopy.tabTiers)}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="points">
              <PointsProgram />
            </TabsContent>

            <TabsContent value="magnets">
              <MagnetLadder totalJumps={totalJumps} />
            </TabsContent>

            <TabsContent value="tiers">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {tiers.map((tier: any, index: number) => {
                  const IconComp = iconMap[tier.icon] || Award;
                  const perks = getLocalizedArray(tier, "perks", language);
                  const tierName = getLocalizedField(tier, "name", language);

                  return (
                    <motion.div
                      key={tier.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`rounded-xl border bg-card p-6 relative overflow-hidden mobile-transparent-card ${
                        tier.name === "Gold" ? "border-[#FFD700]/50 shadow-lg shadow-[#FFD700]/10" : "border-border"
                      }`}
                    >
                      {tier.name === "Gold" && (
                        <div className="absolute top-0 right-0 bg-[#FFD700] text-black text-xs font-bold px-3 py-1 rounded-bl-lg">
                          {t("services.popular")}
                        </div>
                      )}

                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-full" style={{ backgroundColor: `${tier.color}20` }}>
                          <IconComp className="w-6 h-6" style={{ color: tier.color }} />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-foreground">{tierName}</h3>
                          <p className="text-xs text-muted-foreground">
                            {tier.min_jumps}+ {t("tiers.jumps")}
                          </p>
                        </div>
                      </div>

                      <div className="mb-4 p-3 bg-muted/50 rounded-lg text-center">
                        <p className="text-2xl font-bold text-foreground">{tier.credit_multiplier}x</p>
                        <p className="text-xs text-muted-foreground">{t("tiers.creditMultiplier")}</p>
                      </div>

                      <ul className="space-y-2">
                        {perks.map((perk: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <Check className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: tier.color }} />
                            <span className="text-foreground/80">{perk}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-16 text-center p-8 rounded-xl bg-primary/5 border border-primary/10">
            <h2 className="text-xl font-bold text-foreground mb-2">{t("tiers.ctaTitle")}</h2>
            <p className="text-muted-foreground mb-4">{t("tiers.ctaSubtitle")}</p>
            <Link to="/#booking">
              <Button className="bg-primary text-primary-foreground">{t("common.bookNow")}</Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
