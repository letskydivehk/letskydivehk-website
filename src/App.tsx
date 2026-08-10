import React, { Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';
import { BookingProvider } from './contexts/BookingContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { Toaster } from './components/ui/sonner';
import { IdleMount } from './components/IdleMount';
import Home from './pages/Home';
import { ExitIntentModal } from './components/ExitIntentModal';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { pageVariants } from '@/lib/motion';
import { lazyWithRetry } from '@/lib/lazyWithRetry';



function AnimatedRoutes() {
  const location = useLocation();
  const reduce = useReducedMotion();

  const routes = (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<Home />} />
      <Route path="/services/tandem-skydive" element={<ServiceTandem />} />
      <Route path="/services/a-licence" element={<ServiceALicence />} />
      <Route path="/services/skydiving-tour" element={<ServiceSkydivingTour />} />
      <Route path="/location/:slug" element={<LocationDetail />} />
      <Route path="/tour/:locationSlug/:serviceId" element={<TourDetail />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/membership" element={<MemberProfile />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/promotions" element={<Promotions />} />
      <Route path="/admin/credits" element={<AdminCredits />} />
      <Route path="/admin/blog" element={<AdminBlog />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
      <Route path="/membership/tiers" element={<MembershipTiers />} />
      <Route path="/quiz" element={<Quiz />} />
      <Route path="/quiz/result" element={<QuizResult />} />
      <Route path="/compare" element={<LocationCompare />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/disclaimer" element={<Disclaimer />} />
      <Route path="/souvenirs" element={<Souvenirs />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );

  if (reduce) return routes;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial="hidden"
        animate="show"
        exit="exit"
        variants={pageVariants}
        style={{ willChange: 'transform, opacity' }}
      >
        {routes}
      </motion.div>
    </AnimatePresence>
  );
}

const MemberProfile = lazyWithRetry(() => import('./pages/MemberProfile'));
const Gallery = lazyWithRetry(() => import('./pages/Gallery'));
const LocationDetail = lazyWithRetry(() => import('./pages/LocationDetail'));
const AuthCallback = lazyWithRetry(() => import('./pages/AuthCallback'));
const Privacy = lazyWithRetry(() => import('./pages/Privacy'));
const Terms = lazyWithRetry(() => import('./pages/Terms'));
const Disclaimer = lazyWithRetry(() => import('./pages/Disclaimer'));
const NotFound = lazyWithRetry(() => import('./pages/NotFound'));
const Promotions = lazyWithRetry(() => import('./pages/Promotions'));
const AdminCredits = lazyWithRetry(() => import('./pages/AdminCredits'));
const AdminBlog = lazyWithRetry(() => import('./pages/AdminBlog'));
const ServiceTandem = lazyWithRetry(() => import('./pages/ServiceTandem'));
const ServiceALicence = lazyWithRetry(() => import('./pages/ServiceALicence'));
const ServiceSkydivingTour = lazyWithRetry(() => import('./pages/ServiceSkydivingTour'));
const TourDetail = lazyWithRetry(() => import('./pages/TourDetail'));
const Blog = lazyWithRetry(() => import('./pages/Blog'));
const BlogPost = lazyWithRetry(() => import('./pages/BlogPost'));
const MembershipTiers = lazyWithRetry(() => import('./pages/MembershipTiers'));
const Quiz = lazyWithRetry(() => import('./pages/Quiz'));
const QuizResult = lazyWithRetry(() => import('./pages/QuizResult'));
const LocationCompare = lazyWithRetry(() => import('./pages/LocationCompare'));
const Souvenirs = lazyWithRetry(() => import('./pages/Souvenirs'));


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes - data stays fresh
      gcTime: 1000 * 60 * 30, // 30 minutes - cache retention
      refetchOnWindowFocus: false, // Don't refetch on tab focus
      retry: 1, // Only retry once on failure
    },
  },
});

export default function App() {
  return (
    <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <BookingProvider>
            <BrowserRouter>
              <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>}>
                <AnimatedRoutes />
              </Suspense>
              <ExitIntentModal />
            </BrowserRouter>
            <Toaster />
            <IdleMount load={() => import('./components/WhatsAppButton').then(m => ({ default: m.WhatsAppButton }))} />
          </BookingProvider>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
    </HelmetProvider>
  );
}
