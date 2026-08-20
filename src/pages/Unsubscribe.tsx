import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { BackgroundDecorations } from "@/components/BackgroundDecorations";
import { PageNavbar } from "@/components/PageNavbar";
import { SEO } from "@/components/SEO";

export default function Unsubscribe() {
  const { t } = useLanguage();
  const [params] = useSearchParams();
  const token = params.get("token");
  const [state, setState] = useState<"loading" | "done" | "error">("loading");
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      if (!token) {
        setState("error");
        return;
      }
      const { data, error } = await supabase.rpc("newsletter_unsubscribe" as any, {
        _token: token,
      });
      const result = data as any;
      if (error || !result?.success) {
        setState("error");
        return;
      }
      setEmail(result.email ?? null);
      setState("done");
    };
    run();
  }, [token]);

  return (
    <div className="min-h-screen relative">
      <SEO title={t("newsletter.unsub.metaTitle")} description={t("newsletter.unsub.metaDesc")} />
      <BackgroundDecorations />
      <PageNavbar />
      <main className="relative z-10 max-w-lg mx-auto px-4 pt-28 pb-20 text-center">
        {state === "loading" && (
          <Loader2 className="w-10 h-10 animate-spin mx-auto text-primary" />
        )}
        {state === "done" && (
          <>
            <CheckCircle2 className="w-14 h-14 mx-auto text-emerald-500 mb-4" />
            <h1 className="text-2xl font-bold mb-3">{t("newsletter.unsub.doneTitle")}</h1>
            <p className="text-muted-foreground mb-2">{t("newsletter.unsub.doneBody")}</p>
            {email && <p className="text-sm text-muted-foreground/80 mb-6">{email}</p>}
            <Button asChild>
              <Link to="/">{t("newsletter.unsub.backHome")}</Link>
            </Button>
          </>
        )}
        {state === "error" && (
          <>
            <XCircle className="w-14 h-14 mx-auto text-destructive mb-4" />
            <h1 className="text-2xl font-bold mb-3">{t("newsletter.unsub.errorTitle")}</h1>
            <p className="text-muted-foreground mb-6">{t("newsletter.unsub.errorBody")}</p>
            <Button asChild variant="outline">
              <Link to="/">{t("newsletter.unsub.backHome")}</Link>
            </Button>
          </>
        )}
      </main>
    </div>
  );
}
