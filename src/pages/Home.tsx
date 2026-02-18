import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { Locations } from "@/components/Locations";
import { BookingSection } from "@/components/BookingSection";
import { Testimonials } from "@/components/Testimonials";
import { About } from "@/components/About";
import { FAQ } from "@/components/FAQ";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { BackgroundDecorations } from "@/components/BackgroundDecorations";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <BackgroundDecorations />
      <main className="relative z-10" role="main">
        <section id="hero" aria-label="Hero section">
          <Hero />
        </section>

        {/* Promotion Banner */}
        <Link
          to="/promotions"
          className="block bg-accent-orange text-white py-10 px-6 text-center font-semibold hover:bg-accent-orange/90 transition-colors"
        >
          <span className="inline-flex items-center gap-4 text-5XL sm:text-base">
            {t("promo.homeBanner")}
            <span className="underline underline-offset-5 inline-flex items-center gap-3">
              {t("promo.homeBannerCta")}
              <ChevronRight className="w-6 h-6" />
            </span>
          </span>
        </Link>

        <section id="locations" aria-label="Locations section">
          <Locations />
        </section>
        <section id="services" aria-label="Services section">
          <Services />
        </section>
        <section id="booking" aria-label="Booking section">
          <BookingSection />
        </section>
        <section id="testimonials" aria-label="Testimonials section">
          <Testimonials />
        </section>
        <section id="about" aria-label="About section">
          <About />
        </section>
        <section id="faq" aria-label="FAQ section">
          <FAQ />
        </section>
        <section id="contact" aria-label="Contact section">
          <Contact />
        </section>
      </main>
      <Footer />
    </div>
  );
}
