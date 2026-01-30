import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { BackgroundDecorations } from "@/components/BackgroundDecorations";

export default function Terms() {
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
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("terms.title")}
            </h1>
            <p className="text-muted-foreground mb-8">
              {t("terms.lastUpdated")}
            </p>

            <div className="prose prose-lg max-w-none space-y-8">
              {/* Preamble */}
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  {t("terms.preamble.title")}
                </h2>
                <p
                  className="text-muted-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: t("terms.preamble.content") }}
                />
              </section>

              {/* Article 1 */}
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  {t("terms.article1.title")}
                </h2>
                <p
                  className="text-muted-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: t("terms.article1.content") }}
                />
              </section>

              {/* Article 2 */}
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  {t("terms.article2.title")}
                </h2>
                <p
                  className="text-muted-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: t("terms.article2.content") }}
                />
              </section>

              {/* Article 3 */}
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  {t("terms.article3.title")}
                </h2>
                <p
                  className="text-muted-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: t("terms.article3.content") }}
                />
              </section>

              {/* Article 4 */}
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  {t("terms.article4.title")}
                </h2>
                <p
                  className="text-muted-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: t("terms.article4.content") }}
                />
              </section>

              {/* Article 5 */}
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  {t("terms.article5.title")}
                </h2>
                <p
                  className="text-muted-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: t("terms.article5.content") }}
                />
              </section>

              {/* Article 6 */}
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  {t("terms.article6.title")}
                </h2>
                <p
                  className="text-muted-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: t("terms.article6.content") }}
                />
              </section>

              {/* Article 7 */}
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  {t("terms.article7.title")}
                </h2>
                <p
                  className="text-muted-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: t("terms.article7.content") }}
                />
              </section>

              {/* Additional Notes */}
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  {t("terms.additionalNotes.title")}
                </h2>
                <p
                  className="text-muted-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: t("terms.additionalNotes.content") }}
                />
              </section>

              {/* Important Confirmation */}
              <section className="mt-8 pt-6 border-t border-border">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  {t("terms.importantConfirmation.title")}
                </h2>
                <p
                  className="text-muted-foreground leading-relaxed font-medium"
                  dangerouslySetInnerHTML={{ __html: t("terms.importantConfirmation.content") }}
                />
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
