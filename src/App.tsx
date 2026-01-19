import { Hero } from './components/Hero'
import { Services } from './components/Services'
import { Locations } from './components/Locations'
import { BookingSection } from './components/BookingSection'
import { About } from './components/About'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="relative" role="main">
        <section id="hero" aria-label="Hero section">
          <Hero />
        </section>
        <section aria-label="Services section">
          <Services />
        </section>
        <section aria-label="Locations section">
          <Locations />
        </section>
        <section aria-label="Booking section">
          <BookingSection />
        </section>
        <section aria-label="About section">
          <About />
        </section>
        <section aria-label="Contact section">
          <Contact />
        </section>
      </main>
      <Footer />
    </div>
  )
}
