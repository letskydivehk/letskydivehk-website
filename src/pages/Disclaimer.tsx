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
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
              {t("disclaimer.title")}
            </h1>
            <p className="text-muted-foreground mb-8">
              {t("disclaimer.lastUpdated")}: January 2025
            </p>

            <div className="prose prose-lg max-w-none space-y-8">
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  {t("disclaimer.section1.title")}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t("disclaimer.section1.content")}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  {t("disclaimer.section2.title")}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t("disclaimer.section2.content")}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  {t("disclaimer.section3.title")}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t("disclaimer.section3.content")}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  {t("disclaimer.section4.title")}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t("disclaimer.section4.content")}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  {t("disclaimer.section5.title")}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t("disclaimer.section5.content")}
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
