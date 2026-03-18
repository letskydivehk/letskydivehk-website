import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';
import { BookingProvider } from './contexts/BookingContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { Toaster } from './components/ui/sonner';
import { WhatsAppButton } from './components/WhatsAppButton';
import Home from './pages/Home';
import MemberProfile from './pages/MemberProfile';
import Gallery from './pages/Gallery';
import LocationDetail from './pages/LocationDetail';
import AuthCallback from './pages/AuthCallback';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Disclaimer from './pages/Disclaimer';
import NotFound from './pages/NotFound';
import Promotions from './pages/Promotions';
import AdminCredits from './pages/AdminCredits';
import AdminBlog from './pages/AdminBlog';
import ServiceTandem from './pages/ServiceTandem';
import ServiceALicence from './pages/ServiceALicence';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import MembershipTiers from './pages/MembershipTiers';

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
