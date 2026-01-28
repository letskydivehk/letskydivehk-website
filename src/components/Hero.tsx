'use client';

import { motion } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { AuthButton } from './AuthButton';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';

export function Hero() {
  const { t, language } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle body scroll lock when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    if (isMobileMenuOpen) {
      window.addEventListener('scroll', handleScroll);
    }
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMobileMenuOpen]);
  const scrollToLocations = () => {
    const locationsSection = document.getElementById('locations');
    locationsSection?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  return <div className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
      backgroundImage: 'url(https://images.unsplash.com/photo-1601024445121-e5b82f020549?w=1920&h=1080&fit=crop)'
    }}>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </div>

      {/* Full-Width Navbar */}
      <motion.nav initial={{
      opacity: 0,
      y: -30
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.8,
      delay: 0.3
    }} className="fixed top-0 left-0 right-0 w-full z-[110]">
        <div className={`w-full px-6 sm:px-8 lg:px-12 py-4 transition-all duration-300 ease-out ${isScrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/10' : 'bg-transparent'}`}>
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div whileHover={{
            scale: 1.05
          }} className="flex items-center cursor-pointer" onClick={() => {
            window.scrollTo({
              top: 0,
              behavior: 'smooth'
            });
          }}>
              <span className="font-bagel text-white text-xl tracking-wider">LET'S SKYDIVE HK</span>
            </motion.div>

            {/* Navigation Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#services" className="text-white hover:text-white/80 font-medium gentle-animation hover:scale-105">
                {t('nav.services')}
              </a>
              <a href="#locations" className="text-white hover:text-white/80 font-medium gentle-animation hover:scale-105">
                {t('nav.locations')}
              </a>
              <a href="#about" className="text-white hover:text-white/80 font-medium gentle-animation hover:scale-105">
                {t('nav.about')}
              </a>
              <a href="#contact" className="text-white hover:text-white/80 font-medium gentle-animation hover:scale-105">
                {t('nav.contact')}
              </a>
            </div>

            {/* Right Side - Language + Auth + CTA + Mobile Menu */}
            <div className="flex items-center space-x-2 sm:space-x-3 relative">
              {/* Language Switcher */}
              <LanguageSwitcher />
              
              {/* Auth Button */}
              <AuthButton />
              
              {/* CTA Button - Hidden on mobile */}
              

              {/* Mobile Hamburger Menu Button */}
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden glass-effect p-3 rounded-full text-white hover:bg-white/20 active:bg-white/30 gentle-animation cursor-pointer z-[120] relative">
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} exit={{
      opacity: 0
    }} transition={{
      duration: 0.3
    }} className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-md z-[80] cursor-pointer" onClick={() => setIsMobileMenuOpen(false)} />}

      {/* Mobile Menu Panel */}
      <motion.div initial={{
      x: '100%'
    }} animate={{
      x: isMobileMenuOpen ? '0%' : '100%'
    }} transition={{
      type: 'spring',
      damping: 25,
      stiffness: 200
    }} className="md:hidden fixed top-0 right-0 h-full w-72 max-w-[85vw] bg-black/90 backdrop-blur-xl border-l border-white/10 z-[90] mobile-menu-panel pointer-events-auto" onClick={e => e.stopPropagation()}>
        <div className="flex flex-col h-full">
          {/* Close Button at the top */}
          <div className="flex justify-end p-4">
            <button onClick={() => setIsMobileMenuOpen(false)} className="glass-effect p-3 rounded-full text-white hover:bg-white/20 active:bg-white/30 gentle-animation cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex flex-col px-6 pb-6 h-full">
            {/* Mobile Navigation Links */}
            <div className="flex flex-col space-y-4 text-white">
              <a href="#services" className="mobile-menu-link px-4 py-3 hover:text-white/80 hover:bg-white/10 rounded-lg gentle-animation font-medium text-lg active:bg-white/20" onClick={() => setIsMobileMenuOpen(false)}>
                {t('nav.services')}
              </a>
              <a href="#locations" className="mobile-menu-link px-4 py-3 hover:text-white/80 hover:bg-white/10 rounded-lg gentle-animation font-medium text-lg active:bg-white/20" onClick={() => setIsMobileMenuOpen(false)}>
                {t('nav.locations')}
              </a>
              <a href="#about" className="mobile-menu-link px-4 py-3 hover:text-white/80 hover:bg-white/10 rounded-lg gentle-animation font-medium text-lg active:bg-white/20" onClick={() => setIsMobileMenuOpen(false)}>
                {t('nav.about')}
              </a>
              <a href="#contact" className="mobile-menu-link px-4 py-3 hover:text-white/80 hover:bg-white/10 rounded-lg gentle-animation font-medium text-lg active:bg-white/20" onClick={() => setIsMobileMenuOpen(false)}>
                {t('nav.contact')}
              </a>
            </div>

            {/* Mobile CTA Button */}
            <motion.button whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.95
          }} onClick={() => {
            scrollToLocations();
            setIsMobileMenuOpen(false);
          }} className="bg-accent-orange text-white font-semibold px-6 py-3 rounded-lg hover:bg-accent-orange/90 active:bg-accent-orange/80 gentle-animation mt-8 cursor-pointer">
              {t('hero.cta.book')}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Hero Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <motion.div initial={{
        opacity: 0,
        y: 30
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 1,
        delay: 0.5
      }} className="max-w-4xl">
          {/* Badge */}
          

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-tight mb-6">
            {language === 'zh-TW' ? (
              <span className="block">{t('hero.experienceThe')}<span className="text-accent-orange">{t('hero.ultimateThrill')}</span></span>
            ) : (
              <>
                <span className="block">{t('hero.experienceThe')}</span>
                <span className="block text-accent-orange">{t('hero.ultimateThrill')}</span>
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="text-xl lg:text-2xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed whitespace-pre-line">
            {t('hero.subtitle')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.95
          }} onClick={scrollToLocations} className="bg-accent-orange text-white font-bold px-8 py-4 rounded-lg text-lg hover:bg-accent-orange/90 gentle-animation cursor-pointer w-full sm:w-auto">
              {t('hero.cta.book')}
            </motion.button>
            <motion.a href="#services" whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.95
          }} className="bg-white/10 backdrop-blur-sm text-white font-semibold px-8 py-4 rounded-lg text-lg border border-white/20 hover:bg-white/20 gentle-animation cursor-pointer w-full sm:w-auto text-center">
              {t('hero.cta.explore')}
            </motion.a>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        delay: 2
      }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <motion.div animate={{
          y: [0, 10, 0]
        }} transition={{
          repeat: Infinity,
          duration: 2
        }} className="flex flex-col items-center text-white/60 cursor-pointer" onClick={() => {
          const servicesSection = document.getElementById('services');
          servicesSection?.scrollIntoView({
            behavior: 'smooth'
          });
        }}>
            <span className="text-sm mb-2">Scroll to explore</span>
            <ChevronDown className="w-6 h-6" />
          </motion.div>
        </motion.div>
      </div>

    </div>
  );
}