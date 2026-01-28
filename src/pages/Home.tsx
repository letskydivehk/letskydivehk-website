import { Hero } from '@/components/Hero';
import { Services } from '@/components/Services';
import { Locations } from '@/components/Locations';
import { BookingSection } from '@/components/BookingSection';
import { About } from '@/components/About';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';
import { BackgroundDecorations } from '@/components/BackgroundDecorations';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <BackgroundDecorations />
      <main className="relative z-10" role="main">
        <section id="hero" aria-label="Hero section">
          <Hero />
        </section>
        <section id="locations" aria-label="Locations section">
          <Locations />
        </section>
        <section id="services" aria-label="Services section">
          <Services />
        </section>
        <section id="booking" aria-label="Booking section">
          <BookingSection />
        </section>
        <section id="about" aria-label="About section">
          <About />
        </section>
        <section id="contact" aria-label="Contact section">
          <Contact />
        </section>
      </main>
      <Footer />
    </div>
  );
}
