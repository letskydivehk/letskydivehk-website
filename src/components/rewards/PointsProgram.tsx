import { motion } from "framer-motion";
import { Coins, Check, Sparkles, Clock, Info } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { rewardsCopy as c, pick } from "@/lib/rewardsCopy";

export function PointsProgram() {
  const { language } = useLanguage();
  const p = (t: any) => pick(t, language);

  const rules: [any, any][] = [
    [c.ruleMinLabel, c.ruleMinValue],
    [c.ruleExpiryLabel, c.ruleExpiryValue],
    [c.ruleRemindLabel, c.ruleRemindValue],
    [c.ruleCheckLabel, c.ruleCheckValue],
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-full bg-primary/10">
          <Coins className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-foreground">{p(c.pointsHeadline)}</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="mobile-transparent-card">
          <CardContent className="pt-6 space-y-2">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent-orange" />
              {p(c.pointsEarnTitle)}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{p(c.pointsEarnBody)}</p>
          </CardContent>
        </Card>

        <Card className="mobile-transparent-card">
          <CardContent className="pt-6 space-y-2">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500" />
              {p(c.pointsUseTitle)}
            </h3>
            <ul className="text-sm text-muted-foreground space-y-1.5 list-disc pl-5">
              <li>{p(c.pointsUse1)}</li>
              <li>{p(c.pointsUse2)}</li>
              <li className="text-amber-600 dark:text-amber-400">{p(c.pointsUse3)}</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="mobile-transparent-card">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-foreground mb-3">{p(c.redeemRulesTitle)}</h3>
          <dl className="divide-y divide-border/50">
            {rules.map(([k, v], i) => (
              <div key={i} className="grid grid-cols-3 gap-4 py-2.5 text-sm">
                <dt className="text-muted-foreground">{p(k)}</dt>
                <dd className="col-span-2 text-foreground">{p(v)}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      <Card className="mobile-transparent-card border-accent-orange/30 bg-accent-orange/5">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-foreground flex items-center gap-2 mb-2">
            <Info className="w-4 h-4 text-accent-orange" />
            {p(c.exampleTitle)}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{p(c.exampleBody)}</p>
        </CardContent>
      </Card>

      <Card className="mobile-transparent-card">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-foreground flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            {p(c.termsTitle)}
          </h3>
          <ul className="text-xs text-muted-foreground space-y-1.5 list-disc pl-5">
            <li>{p(c.term1)}</li>
            <li>{p(c.term2)}</li>
            <li>{p(c.term3)}</li>
          </ul>
        </CardContent>
      </Card>
    </motion.section>
  );
}
