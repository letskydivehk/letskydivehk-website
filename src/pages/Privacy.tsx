import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { BackgroundDecorations } from "@/components/BackgroundDecorations";

export default function Privacy() {
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
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
              {t("privacy.title")}
            </h1>
            <p className="text-muted-foreground mb-8">
              {t("privacy.lastUpdated")}: January 2025
            </p>

            {/* Introduction */}
            <p className="text-muted-foreground leading-relaxed mb-4">
              {t("privacy.introduction")}
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              {t("privacy.updateNotice")}
            </p>

            <div className="prose prose-lg max-w-none space-y-8">
              {/* Section 1 */}
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  {t("privacy.section1.title")}
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  {t("privacy.section1.content")}
                </p>
                <p
                  className="text-muted-foreground leading-relaxed mb-3"
                  dangerouslySetInnerHTML={{ __html: t("privacy.section1.list") }}
                />
                <p className="text-muted-foreground leading-relaxed">
                  {t("privacy.section1.note")}
                </p>
              </section>

              {/* Section 2 */}
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  {t("privacy.section2.title")}
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  {t("privacy.section2.content")}
                </p>
                <p
                  className="text-muted-foreground leading-relaxed mb-3"
                  dangerouslySetInnerHTML={{ __html: t("privacy.section2.list") }}
                />
                <p className="text-muted-foreground leading-relaxed">
                  {t("privacy.section2.note")}
                </p>
              </section>

              {/* Section 3 */}
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  {t("privacy.section3.title")}
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  {t("privacy.section3.content")}
                </p>
                <p
                  className="text-muted-foreground leading-relaxed mb-3"
                  dangerouslySetInnerHTML={{ __html: t("privacy.section3.list") }}
                />
                <p className="text-muted-foreground leading-relaxed">
                  {t("privacy.section3.note")}
                </p>
              </section>

              {/* Section 4 */}
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  {t("privacy.section4.title")}
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  {t("privacy.section4.content")}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {t("privacy.section4.retention")}
                </p>
              </section>

              {/* Section 5 */}
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  {t("privacy.section5.title")}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t("privacy.section5.content")}
                </p>
              </section>

              {/* Section 6 */}
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  {t("privacy.section6.title")}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t("privacy.section6.content")}
                </p>
              </section>

              {/* Section 7 */}
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  {t("privacy.section7.title")}
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  {t("privacy.section7.content")}
                </p>
                <p
                  className="text-muted-foreground leading-relaxed mb-3"
                  dangerouslySetInnerHTML={{ __html: t("privacy.section7.list") }}
                />
                <p className="text-muted-foreground leading-relaxed">
                  {t("privacy.section7.note")}
                </p>
              </section>

              {/* Section 8 */}
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  {t("privacy.section8.title")}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t("privacy.section8.content")}
                </p>
              </section>

              {/* Section 9 */}
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  {t("privacy.section9.title")}
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  {t("privacy.section9.content")}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {t("privacy.section9.email")}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {t("privacy.section9.phone")}
                </p>
              </section>

              {/* Final Note */}
              <section className="mt-8 pt-6 border-t border-border">
                <p
                  className="text-muted-foreground leading-relaxed italic"
                  dangerouslySetInnerHTML={{ __html: t("privacy.finalNote") }}
                />
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
