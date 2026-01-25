"use client";

import { MapPin, Mail, Phone } from "lucide-react";
import { useLocations } from "@/hooks/useLocations";
import { useServices } from "@/hooks/useServices";

const countryFlags: Record<string, string> = {
  Thailand: "🇹🇭",
  China: "🇨🇳",
  "Hong Kong": "🇭🇰",
};

export function Footer() {
  const { data: locations = [] } = useLocations();
  const { data: services = [] } = useServices();

  const quickLinks = [
    { label: "Services", href: "#services" },
    { label: "Locations", href: "#locations" },
    { label: "About Us", href: "#about" },
    { label: "Book Now", href: "#booking" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <footer className="relative py-16 bg-foreground text-background">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="font-bagel text-background text-2xl tracking-wider mb-4">LET'S SKYDIVE HK</div>
            <p className="text-background/70 leading-relaxed mb-6">
              Experience the thrill of skydiving with Asia's premier dropzone network. Professional tandem jumps, AFF
              courses, and group events across Thailand and China.
            </p>
            {/* Social Media Icons */}
            <div className="flex items-center space-x-4">
              {/* Instagram */}
              <a
                href="https://instagram.com/letsskydivehk"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-background/10 rounded-full flex items-center justify-center hover:bg-background/20 transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-background">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="https://facebook.com/letsskydivehk"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-background/10 rounded-full flex items-center justify-center hover:bg-background/20 transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-background">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com/@letsskydivehk"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-background/10 rounded-full flex items-center justify-center hover:bg-background/20 transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-background">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>

              {/* TikTok */}
              <a
                href="https://tiktok.com/@letsskydivehk"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-background/10 rounded-full flex items-center justify-center hover:bg-background/20 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-background">
                  <path d="M19.321 5.562a5.122 5.122 0 0 1-.443-.258 6.228 6.228 0 0 1-1.137-.966c-.849-.936-1.315-2.117-1.315-3.338h-3.357v14.826c0 1.543-1.252 2.795-2.795 2.795s-2.795-1.252-2.795-2.795 1.252-2.795 2.795-2.795c.293 0 .576.045.843.13V9.804a6.67 6.67 0 0 0-.843-.054c-3.683 0-6.674 2.99-6.674 6.674s2.99 6.674 6.674 6.674 6.674-2.99 6.674-6.674V9.696a9.577 9.577 0 0 0 5.588 1.786V7.627c-1.319 0-2.54-.529-3.42-1.394a4.902 4.902 0 0 1-1.294-2.671z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg text-background mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-background/70 hover:text-background transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold text-lg text-background mb-4">Services</h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.id}>
                  <a href="#services" className="text-background/70 hover:text-background transition-colors">
                    {service.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h4 className="font-bold text-lg text-background mb-4">Our Locations</h4>
            <ul className="space-y-3">
              {locations.map((location) => (
                <li key={location.id}>
                  <a 
                    href={`#locations-${location.country.toLowerCase()}`} 
                    className="flex items-center gap-2 text-background/70 hover:text-background transition-colors"
                  >
                    <span>{countryFlags[location.country] || "🌍"}</span>
                    <span>{location.City ? `${location.City}, ${location.country}` : location.Name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Bar */}
        <div className="border-t border-background/20 pt-8 mb-8">
          <div className="flex flex-wrap justify-center gap-8 text-sm text-background/70">
            <a
              href="mailto:letskydivehk@gmail.com"
              className="flex items-center gap-2 hover:text-background transition-colors"
            >
              <Mail className="w-4 h-4" />
              letskydivehk@gmail.com
            </a>
            <a href="tel:+85212345678" className="flex items-center gap-2 hover:text-background transition-colors">
              <Phone className="w-4 h-4" />
              +852 1234 5678
            </a>
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Hong Kong (HQ)
            </span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-background/70">© 2025 Let's Skydive HK. All rights reserved.</div>
            <div className="flex gap-6 text-sm text-background/70">
              <a href="#" className="hover:text-background transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-background transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-background transition-colors">
                Safety Guidelines
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
