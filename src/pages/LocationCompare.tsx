import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PageNavbar } from "@/components/PageNavbar";
import { Footer } from "@/components/Footer";
import { BackgroundDecorations } from "@/components/BackgroundDecorations";
import { SEO } from "@/components/SEO";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocations } from "@/hooks/useLocations";

export default function LocationCompare() {
  const { t, translateData } = useLanguage();
  const { data: locations = [] } = useLocations();
  const active = locations.filter((l: any) => l.is_active && !l.coming_soon);

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <SEO path="/compare" title={t("compare.metaTitle")} description={t("compare.subtitle")} />
      <BackgroundDecorations />
      <PageNavbar />

      <main className="relative z-10 pt-28 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl sm:text-5xl font-black mb-4">{t("compare.title")}</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              {t("compare.subtitle")}
            </p>
          </div>

          <div className="hidden md:block bg-card border border-border rounded-3xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-muted/50">
                <tr className="text-sm text-muted-foreground">
                  <th className="px-5 py-4 font-semibold">{t("compare.col.location")}</th>
                  <th className="px-5 py-4 font-semibold">{t("compare.col.travel")}</th>
                  <th className="px-5 py-4 font-semibold">{t("compare.col.best")}</th>
                  <th className="px-5 py-4 font-semibold">{t("compare.col.scenery")}</th>
                  <th className="px-5 py-4 font-semibold" />
                </tr>
              </thead>
              <tbody>
                {active.map((loc: any) => (
                  <tr key={loc.id} className="border-t border-border">
                    <td className="px-5 py-4">
                      <div className="font-bold text-foreground">
                        {translateData(loc.Name, loc.Name)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {translateData(loc.country, loc.country)}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">
                      {loc.getting_there_from_hk
                        ? translateData(loc.getting_there_from_hk, loc.getting_there_from_hk)
                        : "—"}
                    </td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">
                      {Array.isArray(loc.best_months) && loc.best_months.length
                        ? loc.best_months.slice(0, 4).join(", ")
                        : "—"}
                    </td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">
                      {Array.isArray(loc.highlights) && loc.highlights.length
                        ? translateData(loc.highlights[0], loc.highlights[0])
                        : loc.description
                          ? translateData(loc.description, loc.description).slice(0, 80) + "…"
                          : "—"}
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        to={`/location/${loc.slug}`}
                        className="inline-flex items-center gap-1 text-accent-orange font-semibold hover:gap-2 transition-all text-sm"
                      >
                        {t("compare.viewDetails")} <ArrowRight className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden grid gap-4">
            {active.map((loc: any) => (
              <div key={loc.id} className="bg-card border border-border rounded-2xl p-5">
                <div className="font-bold text-lg text-foreground">
                  {translateData(loc.Name, loc.Name)}
                </div>
                <div className="text-xs text-muted-foreground mb-3">
                  {translateData(loc.country, loc.country)}
                </div>
                <dl className="text-sm space-y-2">
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">{t("compare.col.travel")}</dt>
                    <dd className="text-right">
                      {loc.getting_there_from_hk
                        ? translateData(loc.getting_there_from_hk, loc.getting_there_from_hk)
                        : "—"}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">{t("compare.col.best")}</dt>
                    <dd className="text-right">
                      {Array.isArray(loc.best_months) && loc.best_months.length
                        ? loc.best_months.slice(0, 4).join(", ")
                        : "—"}
                    </dd>
                  </div>
                </dl>
                <Link
                  to={`/location/${loc.slug}`}
                  className="mt-4 inline-flex items-center gap-1 text-accent-orange font-semibold text-sm"
                >
                  {t("compare.viewDetails")} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
