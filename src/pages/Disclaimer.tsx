import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { BackgroundDecorations } from "@/components/BackgroundDecorations";

export default function Disclaimer() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <BackgroundDecorations />
      <main className="relative z-10 py-20">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-4xl">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("legal.backToHome")}
          </Link>

          <div className="mobile-transparent-card bg-card/80 backdrop-blur-md rounded-2xl p-8 md:p-12 shadow-lg">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t("disclaimer.title")}</h1>
            <p className="text-muted-foreground mb-8">
              {t("disclaimer.lastUpdated")}
              {t("disclaimer.website") && <span className="block mt-1 text-sm">{t("disclaimer.website")}</span>}
            </p>

            <div className="prose prose-lg max-w-none space-y-10">
              {/* Section 1 */}
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">{t("disclaimer.section1.title")}</h2>
                <p className="text-muted-foreground leading-relaxed">{t("disclaimer.section1.content")}</p>
              </section>

              {/* Section 2 */}
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-6">{t("disclaimer.section2.title")}</h2>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-foreground">{t("disclaimer.section2.subtitle1")}</h3>
                  <p className="text-muted-foreground leading-relaxed">{t("disclaimer.section2.content1")}</p>
                  <div
                    className="text-muted-foreground leading-relaxed bg-muted/50 p-4 rounded-lg"
                    dangerouslySetInnerHTML={{ __html: t("disclaimer.section2.risks") }}
                  />

                  <h3 className="text-lg font-medium text-foreground mt-6">{t("disclaimer.section2.subtitle2")}</h3>
                  <p className="text-muted-foreground leading-relaxed">{t("disclaimer.section2.content2")}</p>
                  <div
                    className="text-muted-foreground leading-relaxed bg-muted/50 p-4 rounded-lg"
                    dangerouslySetInnerHTML={{ __html: t("disclaimer.section2.responsibilities") }}
                  />
                </div>
              </section>

              {/* Section 3 */}
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-6">{t("disclaimer.section3.title")}</h2>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-foreground">{t("disclaimer.section3.subtitle1")}</h3>
                  <p className="text-muted-foreground leading-relaxed">{t("disclaimer.section3.content1")}</p>

                  <h3 className="text-lg font-medium text-foreground mt-6">{t("disclaimer.section3.subtitle2")}</h3>
                  <p className="text-muted-foreground leading-relaxed">{t("disclaimer.section3.content2")}</p>
                </div>
              </section>

              {/* Section 4 */}
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-6">{t("disclaimer.section4.title")}</h2>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-foreground">{t("disclaimer.section4.subtitle1")}</h3>
                  <p className="text-muted-foreground leading-relaxed">{t("disclaimer.section4.content1")}</p>

                  <h3 className="text-lg font-medium text-foreground mt-6">{t("disclaimer.section4.subtitle2")}</h3>
                  <p className="text-muted-foreground leading-relaxed">{t("disclaimer.section4.content2")}</p>

                  <h3 className="text-lg font-medium text-foreground mt-6">{t("disclaimer.section4.subtitle3")}</h3>
                  <p className="text-muted-foreground leading-relaxed">{t("disclaimer.section4.content3")}</p>

                  <h3 className="text-lg font-medium text-foreground mt-6">{t("disclaimer.section4.subtitle4")}</h3>
                  <p className="text-muted-foreground leading-relaxed">{t("disclaimer.section4.content4")}</p>
                </div>
              </section>

              {/* Section 5 */}
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-6">{t("disclaimer.section5.title")}</h2>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-foreground">{t("disclaimer.section5.subtitle1")}</h3>
                  <p className="text-muted-foreground leading-relaxed">{t("disclaimer.section5.content1")}</p>

                  <h3 className="text-lg font-medium text-foreground mt-6">{t("disclaimer.section5.subtitle2")}</h3>
                  <p className="text-muted-foreground leading-relaxed">{t("disclaimer.section5.content2")}</p>

                  <h3 className="text-lg font-medium text-foreground mt-6">{t("disclaimer.section5.subtitle3")}</h3>
                  <p className="text-muted-foreground leading-relaxed">{t("disclaimer.section5.content3")}</p>

                  <h3 className="text-lg font-medium text-foreground mt-6">{t("disclaimer.section5.subtitle4")}</h3>
                  <p className="text-muted-foreground leading-relaxed">{t("disclaimer.section5.content4")}</p>
                </div>
              </section>

              {/* Sections 6, 7, 8 and Final Acknowledgement would follow similar pattern */}

              {/* Final Acknowledgement */}
              <section className="border-t pt-8 mt-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">{t("disclaimer.final.title")}</h2>
                <p className="text-muted-foreground leading-relaxed font-medium">{t("disclaimer.final.content")}</p>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
