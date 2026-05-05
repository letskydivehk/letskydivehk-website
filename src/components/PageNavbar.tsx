import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AuthButton } from './AuthButton'
import { LanguageSwitcher } from './LanguageSwitcher'
import { useLanguage } from '@/contexts/LanguageContext'

export function PageNavbar() {
  const { t } = useLanguage()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset'
    return () => { document.body.style.overflow = 'unset' }
  }, [isMobileMenuOpen])

  const navLinks = [
    { label: t('nav.services'), href: '/#services' },
    { label: t('nav.locations'), href: '/#locations' },
    { label: t('nav.gallery'), href: '/gallery', isRoute: true },
    { label: t('nav.blog'), href: '/blog', isRoute: true },
    { label: t('nav.promotions'), href: '/promotions', isRoute: true },
    { label: t('nav.about'), href: '/#about' },
    { label: t('nav.faq'), href: '/#faq' },
    { label: t('nav.contact'), href: '/#contact' },
  ]

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="fixed top-0 left-0 right-0 w-full z-[110]"
      >
        <div className={`w-full px-6 sm:px-8 lg:px-12 py-4 transition-all duration-300 ease-out ${
          isScrolled ? 'bg-black/95 backdrop-blur-xl border-b border-white/10' : 'bg-black/90 backdrop-blur-xl'
        }`}>
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <span className="font-bagel text-white text-xl tracking-wider">LET'S SKYDIVE HK</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) =>
                link.isRoute ? (
                  <Link key={link.href} to={link.href} className="text-white hover:text-white/80 font-medium transition-all hover:scale-105">
                    {link.label}
                  </Link>
                ) : (
                  <a key={link.href} href={link.href} className="text-white hover:text-white/80 font-medium transition-all hover:scale-105">
                    {link.label}
                  </a>
                )
              )}
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <LanguageSwitcher />
              <AuthButton />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden bg-white/10 p-3 rounded-full text-white hover:bg-white/20 active:bg-white/30 transition-all cursor-pointer z-[120] relative"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-md z-[80] cursor-pointer"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: isMobileMenuOpen ? '0%' : '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="lg:hidden fixed top-0 right-0 h-full w-72 max-w-[85vw] bg-black/95 backdrop-blur-xl border-l border-white/10 z-[90]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-end p-4">
            <button onClick={() => setIsMobileMenuOpen(false)} className="bg-white/10 p-3 rounded-full text-white hover:bg-white/20 transition-all cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-col px-6 pb-6 h-full">
            <div className="flex flex-col space-y-4 text-white">
              {navLinks.map((link) =>
                link.isRoute ? (
                  <Link key={link.href} to={link.href} className="px-4 py-3 hover:bg-white/10 rounded-lg font-medium text-lg" onClick={() => setIsMobileMenuOpen(false)}>
                    {link.label}
                  </Link>
                ) : (
                  <a key={link.href} href={link.href} className="px-4 py-3 hover:bg-white/10 rounded-lg font-medium text-lg" onClick={() => setIsMobileMenuOpen(false)}>
                    {link.label}
                  </a>
                )
              )}
            </div>
            <Link
              to="/#booking"
              onClick={() => setIsMobileMenuOpen(false)}
              className="bg-accent-orange text-white font-semibold px-6 py-3 rounded-lg hover:bg-accent-orange/90 transition-all mt-8 text-center cursor-pointer"
            >
              {t('hero.cta.book')}
            </Link>
          </div>
        </div>
      </motion.div>
    </>
  )
}
