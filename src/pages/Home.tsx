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
import { SEO } from "@/components/SEO";
import { OrganizationJsonLd } from "@/components/JsonLd";
import { useLanguage } from "@/contexts/LanguageContext";
import { StickyBookingBar } from "@/components/StickyBookingBar";
import { SocialProofTicker } from "@/components/SocialProofTicker";
import { JumpQuiz } from "@/components/JumpQuiz";
import { CountdownTimer } from "@/components/CountdownTimer";
import { BackToTopButton } from "@/components/BackToTopButton";
import { SectionNav } from "@/components/SectionNav";


export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <SEO path="/" />
      <OrganizationJsonLd />
      <BackgroundDecorations />
      <main className="relative z-10" role="main">
        <section id="hero" aria-label="Hero section">
          <Hero />
        </section>

        {/* Social Proof Ticker */}
        <SocialProofTicker />

        {/* Promotion Banner */}
        <Link
          to="/promotions"
          className="block bg-accent-orange text-white py-8 px-6 text-center font-semibold hover:bg-accent-orange/90 transition-colors"
        >
          <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-x-3 gap-y-1 whitespace-nowrap">
            <span className="text-lg sm:text-xl md:text-2xl">
              {t("promo.homeBanner")}
            </span>
            <span className="text-lg sm:text-xl md:text-2xl underline underline-offset-4 inline-flex items-center gap-1">
              {t("promo.homeBannerCta")}
              <ChevronRight className="w-5 h-5" />
            </span>
            <CountdownTimer targetDate={(() => { const d = new Date(); d.setDate(d.getDate() + 3); d.setHours(23, 59, 59, 0); return d; })()} compact />
          </div>
        </Link>

        <section id="locations" aria-label="Locations section">
          <Locations />
        </section>
        <section id="services" aria-label="Services section">
          <Services />
        </section>
        {/* Jump Quiz */}
        <JumpQuiz />

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
      <StickyBookingBar />
      <BackToTopButton />
      <SectionNav />
    </div>
  );
}
