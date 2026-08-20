import { useEffect, useState } from "react";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export function NewsletterPreferenceCard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [optIn, setOptIn] = useState(true);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      const { data } = await (supabase as any)
        .from("profiles")
        .select("newsletter_opt_in")
        .eq("user_id", user.id)
        .maybeSingle();
      if (!cancelled) {
        setOptIn(data?.newsletter_opt_in ?? true);
        setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const toggle = async (next: boolean) => {
    if (!user) return;
    setSaving(true);
    setOptIn(next);
    const { error } = await (supabase as any)
      .from("profiles")
      .update({ newsletter_opt_in: next })
      .eq("user_id", user.id);
    setSaving(false);
    if (error) {
      setOptIn(!next);
      toast.error(error.message);
      return;
    }
    toast.success(t("profile.newsletter.updated"));
  };

  if (!user || !ready) return null;

  return (
    <Card className="mobile-transparent-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Mail className="w-4 h-4" />
          {t("profile.newsletter.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">{t("profile.newsletter.desc")}</p>
        <Switch checked={optIn} disabled={saving} onCheckedChange={toggle} />
      </CardContent>
    </Card>
  );
}
