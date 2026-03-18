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
import { LatestBlog } from "@/components/LatestBlog";

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
          className="block bg-accent-orange text-white py-10 px-6 text-center font-semibold hover:bg-accent-orange/90 transition-colors"
        >
          <div className="max-w-4xl mx-auto">
            <span className="inline-flex items-center justify-center gap-3 text-2xl sm:text-3xl md:text-4xl min-h-[40px]">
              {t("promo.homeBanner")}
              <span className="underline underline-offset-4 inline-flex items-center gap-2">
                {t("promo.homeBannerCta")}
                <ChevronRight className="w-5 h-5" />
              </span>
            </span>
            <div className="mt-3 flex justify-center">
              <CountdownTimer targetDate={new Date("2026-04-30T23:59:59")} compact />
            </div>
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
        <section id="blog" aria-label="Blog section">
          <LatestBlog />
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
    </div>
  );
}
