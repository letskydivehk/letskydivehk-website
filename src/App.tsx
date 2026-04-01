import React, { Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';
import { BookingProvider } from './contexts/BookingContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { Toaster } from './components/ui/sonner';
import { WhatsAppButton } from './components/WhatsAppButton';
import Home from './pages/Home';

const MemberProfile = React.lazy(() => import('./pages/MemberProfile'));
const Gallery = React.lazy(() => import('./pages/Gallery'));
const LocationDetail = React.lazy(() => import('./pages/LocationDetail'));
const AuthCallback = React.lazy(() => import('./pages/AuthCallback'));
const Privacy = React.lazy(() => import('./pages/Privacy'));
const Terms = React.lazy(() => import('./pages/Terms'));
const Disclaimer = React.lazy(() => import('./pages/Disclaimer'));
const NotFound = React.lazy(() => import('./pages/NotFound'));
const Promotions = React.lazy(() => import('./pages/Promotions'));
const AdminCredits = React.lazy(() => import('./pages/AdminCredits'));
const AdminBlog = React.lazy(() => import('./pages/AdminBlog'));
const ServiceTandem = React.lazy(() => import('./pages/ServiceTandem'));
const ServiceALicence = React.lazy(() => import('./pages/ServiceALicence'));
const Blog = React.lazy(() => import('./pages/Blog'));
const BlogPost = React.lazy(() => import('./pages/BlogPost'));
const MembershipTiers = React.lazy(() => import('./pages/MembershipTiers'));

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
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/services/tandem-skydive" element={<ServiceTandem />} />
                <Route path="/services/a-licence" element={<ServiceALicence />} />
                <Route path="/location/:slug" element={<LocationDetail />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/membership" element={<MemberProfile />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/promotions" element={<Promotions />} />
                <Route path="/admin/credits" element={<AdminCredits />} />
                <Route path="/admin/blog" element={<AdminBlog />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/membership/tiers" element={<MembershipTiers />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/disclaimer" element={<Disclaimer />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
            <Toaster />
            <WhatsAppButton />
          </BookingProvider>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
    </HelmetProvider>
  );
}
