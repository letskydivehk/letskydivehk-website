import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { Locations } from "@/components/Locations";
import { BookingSection } from "@/components/BookingSection";
import { WeatherForecast } from "@/components/WeatherForecast";
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
import { CountdownTimer } from "@/components/CountdownTimer";
import { BackToTopButton } from "@/components/BackToTopButton";
import { SectionNav } from "@/components/SectionNav";
import { SafetySection } from "@/components/SafetySection";
import { JumpDayTimeline } from "@/components/JumpDayTimeline";
import { LazySection } from "@/components/LazySection";
import { MobileTabBar } from "@/components/MobileTabBar";
import { TrustBar } from "@/components/TrustBar";
import { EligibilityChips } from "@/components/EligibilityChips";
import { ExploreMoreStrip } from "@/components/home/ExploreMoreStrip";
import { JumpDayStrip } from "@/components/home/JumpDayStrip";

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <SEO path="/" />
      <OrganizationJsonLd />
      <BackgroundDecorations />
      <main className="relative z-10 pb-20 md:pb-0" role="main">
        <section id="hero" aria-label="Hero section">
          <Hero />
        </section>

        {/* Trust + eligibility */}
        <section aria-label="Trust signals" className="bg-gradient-to-b from-sky-900/90 to-background pt-5 pb-4 px-4">
          <div className="max-w-5xl mx-auto flex flex-col items-center gap-2">
            <TrustBar />
            <EligibilityChips />
          </div>
        </section>

        {/* Slim Promotion Ribbon */}
        <Link
          to="/promotions"
          className="block bg-accent-orange text-white py-2.5 px-4 text-center font-medium hover:bg-accent-orange/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          aria-label={`${t("promo.homeBanner")} — ${t("promo.homeBannerCta")}`}
        >
          <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-x-3 gap-y-0.5 text-sm sm:text-base">
            <span className="truncate max-w-full">{t("promo.homeBanner")}</span>
            <span className="underline underline-offset-4 inline-flex items-center gap-0.5 whitespace-nowrap">
              {t("promo.homeBannerCta")}
              <ChevronRight className="w-4 h-4" />
            </span>
            <CountdownTimer
              targetDate={(() => {
                const d = new Date();
                d.setDate(d.getDate() + 3);
                d.setHours(23, 59, 59, 0);
                return d;
              })()}
              compact
            />
          </div>
        </Link>

        <LazySection minHeight={80}>
          <SocialProofTicker />
        </LazySection>

        {/* Compact click-through strip — replaces Quiz / Referral / Rewards / Souvenir full sections */}
        <ExploreMoreStrip />

        {/* Primary path: locations → services → book */}
        <section id="locations" aria-label="Locations section">
          <Locations />
        </section>
        <section id="services" aria-label="Services section">
          <Services />
        </section>
        <section id="booking" aria-label="Booking section">
          <BookingSection />
        </section>

        <section aria-label="Weather forecast section">
          <WeatherForecast />
        </section>

        {/* Compact strip → jumps to Safety / Timeline anchors below */}
        <JumpDayStrip />

        <LazySection minHeight={500} id="testimonials" aria-label="Testimonials section">
          <Testimonials />
        </LazySection>

        <LazySection minHeight={500} id="faq" aria-label="FAQ section">
          <FAQ />
        </LazySection>

        {/* Deep-content anchors kept mounted so strip cards can scroll to them */}
        <LazySection minHeight={400} id="safety" aria-label="Safety section">
          <SafetySection />
        </LazySection>
        <LazySection minHeight={400} id="timeline" aria-label="Jump day timeline section">
          <JumpDayTimeline />
        </LazySection>

        <LazySection minHeight={400} id="about" aria-label="About section">
          <About />
        </LazySection>
        <LazySection minHeight={400} id="contact" aria-label="Contact section">
          <Contact />
        </LazySection>
      </main>
      <Footer />
      <StickyBookingBar />
      <BackToTopButton />
      <SectionNav />
      <MobileTabBar />
    </div>
  );
}
