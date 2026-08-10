"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar as CalendarIcon,
  MapPin,
  User,
  Mail,
  Phone,
  Check,
  ArrowRight,
  ArrowLeft,
  Plane,
  Loader2,
  CreditCard,
} from "lucide-react";
import { format } from "date-fns";
import { zhTW } from "date-fns/locale";
import { useLocations, type Location } from "@/hooks/useLocations";
import { useLocationServices, type LocationService } from "@/hooks/useLocationServices";
import { useServiceDepartures, isBookable } from "@/hooks/useServiceDepartures";
import { useBooking } from "@/contexts/BookingContext";
import { getLocationNotice, isEffectivelyComingSoon } from "@/data/locationNotices";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { toast } from "sonner";
import { SectionDecorations } from "./SectionDecorations";
import { ServiceNameDisplay } from "./ServiceNameDisplay";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

// Validation schema for booking form
const bookingDetailsSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(50, "First name must be less than 50 characters"),
  lastName: z.string().trim().min(1, "Last name is required").max(50, "Last name must be less than 50 characters"),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),
  phone: z.string().trim().min(1, "Phone number is required").max(20, "Phone number must be less than 20 characters"),
  date: z.string().min(1, "Please select a date"),
  participants: z.number().int().min(1, "At least 1 participant required").max(10, "Maximum 10 participants allowed"),
  notes: z.string().max(500, "Notes must be less than 500 characters").optional(),
});

// Sanitize text input to prevent XSS
const sanitizeText = (text: string): string => {
  return text
    .replace(/[<>]/g, "") // Remove angle brackets
    .trim();
};

interface BookingFormData {
  location: string;
  service: string;
  date: string;
  participants: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes: string;
  referralCode: string;
  dateOfBirth: string;
  selectedPromos: string[];
}

type Step = "location" | "service" | "details" | "preview" | "payment";

export function BookingSection() {
  const [currentStep, setCurrentStep] = useState<Step>("location");
  const [formData, setFormData] = useState<BookingFormData>({
    location: "",
    service: "",
    date: "",
    participants: 1,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    notes: "",
    referralCode: "",
    dateOfBirth: "",
    selectedPromos: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [bookingAccessToken, setBookingAccessToken] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [paymentClientSecret, setPaymentClientSecret] = useState<string | null>(null);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);
  const paymentContainerRef = useRef<HTMLDivElement>(null);
  const airwallexInitializedForIntent = useRef<string | null>(null);
  const isCreatingIntent = useRef(false);
  const successHandlerRef = useRef<((event: any) => void) | null>(null);
  const errorHandlerRef = useRef<((event: any) => void) | null>(null);

  const { data: locations, isLoading: locationsLoading } = useLocations();
  const { user } = useAuth();
  const {
    preselectedLocationId,
    setPreselectedLocationId,
    preselectedServiceId,
    setPreselectedServiceId,
    preselectedServiceType,
    setPreselectedServiceType,
    preselectedDate,
    setPreselectedDate,
    activeServiceTypeFilter,
    setActiveServiceTypeFilter,
  } = useBooking();
  const { t, translateData, language } = useLanguage();
  const isMobile = useIsMobile();

  // Helper function to translate location data
  const translateLocation = (location: Location) => ({
    ...location,
    Name: translateData(`location.${location.slug}`, location.Name),
    description: translateData(`location.${location.slug}.desc`, location.description || ""),
    City: translateData(`city.${location.City}`, location.City || ""),
    country: translateData(`country.${location.country}`, location.country),
  });

  // Helper function to translate service data
  const translateService = (service: LocationService) => ({
    ...service,
    service_name: translateData(`service.${service.service_name}`, service.service_name),
  });

  // Fetch location-specific services when a location is selected
  const { data: locationServices, isLoading: servicesLoading } = useLocationServices(formData.location || undefined);

  // Handle preselected location from Locations component
  useEffect(() => {
    if (preselectedLocationId && locations) {
      const locationExists = locations.find((l) => l.id === preselectedLocationId && !isEffectivelyComingSoon(l));
      if (locationExists) {
        setFormData((prev) => ({ ...prev, location: preselectedLocationId }));
        setCurrentStep("service");
        // Clear the preselection after using it
        setPreselectedLocationId(null);
      }
    }
  }, [preselectedLocationId, locations, setPreselectedLocationId]);

  // Handle preselected service ID (from LocationDetail page)
  useEffect(() => {
    if (preselectedServiceId && locationServices) {
      const serviceExists = locationServices.find((s) => s.id === preselectedServiceId);
      if (serviceExists) {
        setFormData((prev) => ({ ...prev, service: preselectedServiceId }));
        setCurrentStep("details");
        setPreselectedServiceId(null);
      }
    }
  }, [preselectedServiceId, locationServices, setPreselectedServiceId]);

  // Handle preselected service type from Services component - show location step to choose where
  useEffect(() => {
    if (preselectedServiceType) {
      // Reset form and start at location step so user can choose where to do this service
      setFormData((prev) => ({ ...prev, location: "", service: "" }));
      setCurrentStep("location");
      // Set the filter to show only locations that offer this service type
      setActiveServiceTypeFilter(preselectedServiceType);
      // Clear the preselection after using it
      setPreselectedServiceType(null);
    }
  }, [preselectedServiceType, setPreselectedServiceType, setActiveServiceTypeFilter]);

  // Filter locations based on active service type filter
  const filteredLocations = useMemo(() => {
    if (!locations) return [];
    if (!activeServiceTypeFilter) return locations.filter((l) => !isEffectivelyComingSoon(l));

    return locations.filter((l) => {
      if (isEffectivelyComingSoon(l)) return false;
      if (activeServiceTypeFilter === "aff") return l.has_aff;
      if (activeServiceTypeFilter === "group") return l.has_group_events;
      return true; // tandem is available everywhere
    });
  }, [locations, activeServiceTypeFilter]);

  // Clear filter when user manually navigates or resets
  const handleReset = () => {
    setFormData({
      location: "",
      service: "",
      date: "",
      participants: 1,
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      notes: "",
      referralCode: "",
      dateOfBirth: "",
      selectedPromos: [],
    });
    setCurrentStep("location");
    setIsComplete(false);
    setValidationErrors({});
    setActiveServiceTypeFilter(null);
    setPaymentIntentId(null);
    setPaymentClientSecret(null);
    setIsPaymentComplete(false);
    sessionStorage.removeItem("booking_payment_intent");
    airwallexInitializedForIntent.current = null;
    isCreatingIntent.current = false;
  };

  const selectedLocation = useMemo(
    () => locations?.find((l) => l.id === formData.location),
    [locations, formData.location],
  );

  const translatedSelectedLocation = selectedLocation ? translateLocation(selectedLocation) : null;

  const selectedService = useMemo(
    () => locationServices?.find((s) => s.id === formData.service),
    [locationServices, formData.service],
  );

  const translatedSelectedService = selectedService ? translateService(selectedService) : null;

  // Scheduled departures (indoor skydiving runs on fixed dates only)
  const isIndoorService = selectedService?.service_type === "indoor";
  const { data: serviceDepartures } = useServiceDepartures(isIndoorService ? formData.service : undefined);
  const bookableDepartures = useMemo(
    () => (serviceDepartures ?? []).filter(isBookable),
    [serviceDepartures],
  );
  const bookableDateSet = useMemo(
    () => new Set(bookableDepartures.map((d) => d.departure_date)),
    [bookableDepartures],
  );
  const selectedDeparture = useMemo(
    () => bookableDepartures.find((d) => d.departure_date === formData.date),
    [bookableDepartures, formData.date],
  );
  const maxParticipants = isIndoorService ? Math.max(1, selectedDeparture?.seats_left ?? 8) : 10;

  // Handle a departure date preselected from the location page
  useEffect(() => {
    if (preselectedDate) {
      setFormData((prev) => ({ ...prev, date: preselectedDate }));
      setPreselectedDate(null);
    }
  }, [preselectedDate, setPreselectedDate]);

  // Keep participants within the remaining seats for indoor departures
  useEffect(() => {
    if (isIndoorService && formData.participants > maxParticipants) {
      setFormData((prev) => ({ ...prev, participants: maxParticipants }));
    }
  }, [isIndoorService, maxParticipants, formData.participants]);


  const steps: { id: Step; label: string; icon: React.ElementType }[] = [
    { id: "location", label: t("booking.step1"), icon: MapPin },
    { id: "service", label: t("booking.step2"), icon: Plane },
    { id: "details", label: t("booking.step3"), icon: User },
    { id: "preview", label: t("booking.step4"), icon: Check },
    { id: "payment", label: t("booking.step5"), icon: CreditCard },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  const canProceed = () => {
    switch (currentStep) {
      case "location":
        return !!formData.location;
      case "service":
        return !!formData.service;
      case "details":
        return (
          formData.date &&
          formData.participants > 0 &&
          formData.firstName &&
          formData.lastName &&
          formData.email &&
          formData.phone
        );
      case "preview":
        return true;
      case "payment":
        return false; // payment widget handles completion
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep === "location") setCurrentStep("service");
    else if (currentStep === "service") setCurrentStep("details");
    else if (currentStep === "details") {
      // Validate before going to payment
      const validationResult = bookingDetailsSchema.safeParse({
        firstName: sanitizeText(formData.firstName),
        lastName: sanitizeText(formData.lastName),
        email: formData.email.trim(),
        phone: sanitizeText(formData.phone),
        date: formData.date,
        participants: formData.participants,
        notes: formData.notes ? sanitizeText(formData.notes) : undefined,
      });
      if (!validationResult.success) {
        const errors: Record<string, string> = {};
        validationResult.error.errors.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0] as string] = err.message;
          }
        });
        setValidationErrors(errors);
        toast.error(t("booking.fixErrors"));
        return;
      }
      setValidationErrors({});
      setCurrentStep("preview");
    } else if (currentStep === "preview") {
      setCurrentStep("payment");
      // Create payment intent when entering payment step
      createPaymentIntent();
    }
  };

  const handleBack = () => {
    if (currentStep === "service") setCurrentStep("location");
    else if (currentStep === "details") setCurrentStep("service");
    else if (currentStep === "preview") setCurrentStep("details");
    else if (currentStep === "payment") setCurrentStep("preview");
  };

  // Create Airwallex payment intent (with sessionStorage caching + concurrency lock)
  const createPaymentIntent = async () => {
    // Concurrency lock - prevent duplicate calls from rapid clicks
    if (isCreatingIntent.current) return;

    // Check in-memory state first - skip if already initialized for this intent
    if (paymentClientSecret && paymentIntentId) {
      if (airwallexInitializedForIntent.current === paymentIntentId) return;
      initAirwallexDropIn(paymentClientSecret, paymentIntentId);
      return;
    }

    // Check sessionStorage for a previously created intent
    const cached = sessionStorage.getItem("booking_payment_intent");
    if (cached) {
      try {
        const { client_secret, payment_intent_id } = JSON.parse(cached);
        if (client_secret && payment_intent_id) {
          if (airwallexInitializedForIntent.current === payment_intent_id) return;
          setPaymentClientSecret(client_secret);
          setPaymentIntentId(payment_intent_id);
          initAirwallexDropIn(client_secret, payment_intent_id);
          return;
        }
      } catch (e) {
        sessionStorage.removeItem("booking_payment_intent");
      }
    }

    // Lock before creating
    isCreatingIntent.current = true;
    setIsPaymentLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-payment-intent", {
        body: { service_id: formData.service, currency: "HKD" },
      });
      if (error) throw error;
      setPaymentClientSecret(data.client_secret);
      setPaymentIntentId(data.payment_intent_id);
      // Cache for reuse across navigation/refreshes
      sessionStorage.setItem(
        "booking_payment_intent",
        JSON.stringify({
          client_secret: data.client_secret,
          payment_intent_id: data.payment_intent_id,
        }),
      );
      setTimeout(() => initAirwallexDropIn(data.client_secret, data.payment_intent_id), 100);
    } catch (error) {
      if (import.meta.env.DEV) console.error("Failed to create payment intent:", error);
      toast.error(t("booking.paymentError"));
    } finally {
      setIsPaymentLoading(false);
      isCreatingIntent.current = false;
    }
  };

  // Initialize Airwallex Drop-in element (only once per intent)
  const initAirwallexDropIn = async (clientSecret: string, intentId: string) => {
    // Skip if already initialized for this exact intent
    if (airwallexInitializedForIntent.current === intentId) return;

    try {
      const Airwallex = (window as any).Airwallex;
      if (!Airwallex) {
        console.error("Airwallex SDK not loaded");
        toast.error(t("booking.paymentError"));
        return;
      }

      Airwallex.init({ env: "prod", origin: window.location.origin });

      const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      const element = Airwallex.createElement("dropIn", {
        intent_id: intentId,
        client_secret: clientSecret,
        currency: "HKD",
        mode: "payment",
        autoCapture: true,
        methods: ["card", "applepay", "googlepay"],
        style: {
          popupWidth: 400,
          popupHeight: 549,
        },
        ...(isMobileDevice && {
          autoRedirect: true,
          successUrl: `${window.location.origin}/#booking?payment_status=success&payment_intent_id=${intentId}`,
          failUrl: `${window.location.origin}/#booking?payment_status=failed`,
        }),
      });

      const container = paymentContainerRef.current;
      if (container) {
        container.innerHTML = "";
        element.mount(container);
      }

      // Remove previous listeners before adding new ones
      if (successHandlerRef.current) {
        window.removeEventListener("onSuccess", successHandlerRef.current);
      }
      if (errorHandlerRef.current) {
        window.removeEventListener("onError", errorHandlerRef.current);
      }

      // Create and store new handlers
      const successHandler = async (event: any) => {
        setIsPaymentComplete(true);
        toast.success(t("booking.paymentSuccess"));
        // Auto-submit booking to database after successful payment
        await handleSubmit();
      };
      const errorHandler = (event: any) => {
        if (import.meta.env.DEV) console.error("Payment error:", event.detail);
        toast.error(t("booking.paymentFailed"));
      };

      successHandlerRef.current = successHandler;
      errorHandlerRef.current = errorHandler;
      window.addEventListener("onSuccess", successHandler);
      window.addEventListener("onError", errorHandler);

      // Mark as initialized for this intent
      airwallexInitializedForIntent.current = intentId;
    } catch (error) {
      if (import.meta.env.DEV) console.error("Failed to init Airwallex:", error);
      toast.error(t("booking.paymentError"));
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Verify payment server-side before submitting booking
      if (paymentIntentId) {
        const { data: verifyData, error: verifyError } = await supabase.functions.invoke("verify-payment", {
          body: { payment_intent_id: paymentIntentId },
        });
        if (verifyError || !verifyData?.verified) {
          toast.error(t("booking.paymentFailed"));
          setIsSubmitting(false);
          return;
        }
      }

      // Insert booking via secure RPC function (payment_status is always NULL here)
      const { data, error } = await supabase.rpc("create_booking", {
        p_user_id: user?.id || null,
        p_location_id: formData.location,
        p_service_id: formData.service,
        p_preferred_date: formData.date,
        p_participants: formData.participants,
        p_first_name: sanitizeText(formData.firstName),
        p_last_name: sanitizeText(formData.lastName),
        p_email: formData.email.trim(),
        p_phone: sanitizeText(formData.phone),
        p_special_requests: formData.notes ? sanitizeText(formData.notes) : null,
        p_referral_code: formData.referralCode.trim() || null,
        p_payment_intent_id: paymentIntentId || null,
        p_selected_promos: formData.selectedPromos.length > 0 ? formData.selectedPromos : [],
      } as any);

      if (error) {
        if (import.meta.env.DEV) console.error("Booking submission error:", error);
        toast.error(t("booking.submitError"));
        return;
      }

      // Store access token for anonymous bookings
      const bookingData = data as Record<string, unknown> | null;

      // Store access token for anonymous bookings
      if (!user && bookingData?.access_token) {
        setBookingAccessToken(bookingData.access_token as string);
      }

      // Update payment status server-side after booking is created
      // Wrapped in try/catch so a failure here cannot block the notification email
      if (paymentIntentId && bookingData?.id) {
        try {
          await supabase.functions.invoke("verify-payment", {
            body: { payment_intent_id: paymentIntentId, booking_id: bookingData.id },
          });
        } catch (verifyErr) {
          if (import.meta.env.DEV) console.error("Post-booking payment verify failed:", verifyErr);
        }
      }

      // Send notification email (fire and forget - don't block success)
      try {
        await supabase.functions.invoke("send-notification", {
          body: {
            type: "booking",
            data: {
              bookingId: bookingData?.id,
              accessToken: bookingData?.access_token,
              firstName: sanitizeText(formData.firstName),
              lastName: sanitizeText(formData.lastName),
              email: formData.email.trim(),
              phone: sanitizeText(formData.phone),
              locationName: selectedLocation?.Name || "Unknown Location",
              serviceName: selectedService?.service_name || "Unknown Service",
              preferredDate: formData.date,
              participants: formData.participants,
              specialRequests: formData.notes ? sanitizeText(formData.notes) : undefined,
              selectedPromos: formData.selectedPromos.length > 0 ? formData.selectedPromos : undefined,
            },
          },
        });
      } catch (notifyError) {
        if (import.meta.env.DEV) console.error("Failed to send notification email:", notifyError);
      }

      // Clear cached payment intent after successful booking
      sessionStorage.removeItem("booking_payment_intent");
      setIsComplete(true);
      toast.success(t("booking.submitSuccess"));
    } catch (error) {
      if (import.meta.env.DEV) console.error("Booking submission error:", error);
      toast.error(t("booking.submitError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get min date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  // Handle return from mobile payment redirect
  useEffect(() => {
    const hash = window.location.hash;
    const hashParams = new URLSearchParams(hash.split("?")[1] || "");
    const redirectPaymentStatus = hashParams.get("payment_status");
    const redirectPaymentIntentId = hashParams.get("payment_intent_id");

    if (redirectPaymentStatus && redirectPaymentIntentId) {
      // Clean URL params
      const cleanHash = hash.split("?")[0];
      window.location.hash = cleanHash;

      if (redirectPaymentStatus === "success") {
        // Verify payment server-side
        const verifyRedirectPayment = async () => {
          try {
            const { data, error } = await supabase.functions.invoke("verify-payment", {
              body: { payment_intent_id: redirectPaymentIntentId },
            });
            if (!error && data?.verified) {
              setPaymentIntentId(redirectPaymentIntentId);
              setIsPaymentComplete(true);
              toast.success(t("booking.paymentSuccess"));
              // Auto-submit booking after verified redirect payment
              await handleSubmit();
            } else {
              toast.error(t("booking.paymentFailed"));
              setCurrentStep("payment");
            }
          } catch (err) {
            console.error("Payment verification failed:", err);
            toast.error(t("booking.paymentError"));
            setCurrentStep("payment");
          }
        };
        verifyRedirectPayment();
      } else {
        toast.error(t("booking.paymentFailed"));
        setCurrentStep("payment");
      }
    }
  }, []); // Run once on mount

  // Auto-scroll to booking section when complete
  useEffect(() => {
    if (isComplete) {
      // Small delay to ensure render is complete
      const timer = setTimeout(() => {
        const bookingSection = document.getElementById("booking");
        if (bookingSection) {
          bookingSection.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isComplete]);

  if (isComplete) {
    return (
      <section id="booking" className="relative py-24 bg-background overflow-hidden">
        <SectionDecorations />
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10 flex items-center justify-center min-h-[60vh]">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto text-center w-full"
          >
            <div className="bg-card rounded-3xl p-12 clean-border elevated-shadow mobile-transparent-card">
              <div className="w-20 h-20 bg-accent-emerald rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-black text-foreground mb-4">{t("booking.success")}</h2>
              <p className="text-muted-foreground mb-8 text-lg">
                {t("booking.successMessage").replace("{name}", formData.firstName)}
              </p>
              <div className="bg-accent-emerald/10 rounded-xl p-6 mb-8 text-left">
                <h3 className="font-bold text-foreground mb-3">{t("booking.summary")}</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">{t("booking.location")}:</span>{" "}
                    {translatedSelectedLocation?.Name}, {translatedSelectedLocation?.City}
                  </p>
                  <p>
                    <span className="font-medium text-foreground">{t("booking.service")}:</span>{" "}
                    <ServiceNameDisplay name={translatedSelectedService?.service_name || ""} />
                  </p>
                  <p>
                    <span className="font-medium text-foreground">{t("booking.date")}:</span> {formData.date}
                  </p>
                  <p>
                    <span className="font-medium text-foreground">{t("booking.participants")}:</span>{" "}
                    {formData.participants}
                  </p>
                  <p>
                    <span className="font-medium text-foreground">{t("booking.email")}:</span> {formData.email}
                  </p>
                </div>
              </div>
              <button
                onClick={handleReset}
                className="bg-foreground text-background font-semibold px-8 py-3 rounded-lg hover:bg-foreground/90 transition-colors cursor-pointer"
              >
                {t("booking.bookAnother")}
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" className="relative py-24 bg-background overflow-hidden">
      <SectionDecorations />
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-3 h-3 bg-accent-emerald rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-muted-foreground">{t("booking.badge")}</span>
            <div className="w-3 h-3 bg-accent-blue rounded-full animate-pulse" />
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6 text-foreground">
            {t("booking.title")}
          </h2>

          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">{t("booking.subtitle")}</p>
        </div>

        {/* Progress Steps - FIXED VERSION */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="relative">
            {/* Progress line (behind the icons) */}
            <div className="absolute top-6 left-0 right-0 h-1 bg-muted -translate-y-1/2">
              <div
                className="h-full bg-accent-emerald transition-all duration-500"
                style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
              />
            </div>

            {/* Steps container */}
            <div className="relative flex justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStepIndex === index;
                const isCompleted = currentStepIndex > index;

                return (
                  <div key={step.id} className="flex flex-col items-center relative z-10">
                    {/* Step circle */}
                    <motion.div
                      animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                      transition={{ type: "spring", stiffness: 280, damping: 18 }}
                      className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors duration-300 ${
                        isActive
                          ? "bg-accent-emerald text-white shadow-lg shadow-accent-emerald/40 animate-glow-pulse"
                          : isCompleted
                            ? "bg-accent-emerald text-white"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isCompleted ? (
                        <motion.div initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 300, damping: 18 }}>
                          <Check className="w-6 h-6" />
                        </motion.div>
                      ) : (
                        <Icon className={`w-6 h-6 ${isActive ? "" : "opacity-80"}`} />
                      )}
                    </motion.div>

                    {/* Step label */}
                    <span
                      className={`text-xs sm:text-sm font-medium transition-colors ${
                        isActive ? "text-foreground font-semibold" : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </span>

                    {/* Step number (optional) */}
                    <div
                      className={`absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center transition-colors ${
                        isActive
                          ? "bg-accent-blue text-white"
                          : isCompleted
                            ? "bg-accent-emerald/20 text-accent-emerald"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {index + 1}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-card rounded-3xl clean-border elevated-shadow mobile-transparent-card flex flex-col min-h-fit">
            {/* Content Area */}
            <div className="p-8 lg:p-12 pb-6 flex-1">
              <AnimatePresence mode="wait">
                {/* Step 1: Location Selection */}
                {currentStep === "location" && (
                  <motion.div
                    key="location"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-8">
                      <MapPin className="w-12 h-12 text-accent-emerald mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-foreground">{t("booking.whereJump")}</h3>
                      <p className="text-muted-foreground">{t("booking.selectDropzone")}</p>
                    </div>

                    {locationsLoading ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-accent-emerald" />
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {filteredLocations.map((location) => {
                            const translated = translateLocation(location);
                            return (
                              <button
                                key={location.id}
                                onClick={() => {
                                  // Clear service selection when changing location
                                  setFormData({ ...formData, location: location.id, service: "" });
                                  // Auto-advance to service selection
                                  setTimeout(() => setCurrentStep("service"), 150);
                                }}
                                className={`group overflow-hidden rounded-xl border-2 text-left transition-all cursor-pointer ${
                                  formData.location === location.id
                                    ? "border-accent-emerald bg-accent-emerald/5"
                                    : "border-border hover:border-accent-emerald/50"
                                }`}
                              >
                                {/* Location Image */}
                                <div className="relative h-32 overflow-hidden">
                                  <img
                                    src={location.image_url || "/placeholder.svg"}
                                    alt={translated.Name}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                  {formData.location === location.id && (
                                    <div className="absolute top-2 right-2 w-8 h-8 bg-accent-emerald rounded-full flex items-center justify-center">
                                      <Check className="w-5 h-5 text-white" />
                                    </div>
                                  )}
                                </div>
                                {/* Location Info */}
                                <div className="p-4">
                                  <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                                    <MapPin className="w-3 h-3" />
                                    <span>
                                      {translated.City}, {translated.country}
                                    </span>
                                  </div>
                                  <p className="font-semibold text-foreground">{translated.Name}</p>
                                </div>
                              </button>
                            );
                          })}
                          {filteredLocations.length === 0 && (
                            <div className="col-span-full text-center py-8 text-muted-foreground">
                              {t("booking.noLocations")}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </motion.div>
                )}

                {/* Step 2: Service Selection */}
                {currentStep === "service" && (
                  <motion.div
                    key="service"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-8">
                      <Plane className="w-12 h-12 text-accent-emerald mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-foreground">{t("booking.chooseService")}</h3>
                      <p className="text-muted-foreground">
                        {t("booking.selectPackage")} - {translatedSelectedLocation?.Name}
                      </p>
                    </div>

                    {servicesLoading ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-accent-emerald" />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {locationServices?.filter((s) => s.service_type !== 'Tour').map((service) => {
                          const translatedService = translateService(service);
                          return (
                            <button
                              key={service.id}
                              onClick={() => {
                                setFormData({ ...formData, service: service.id });
                                // Auto-advance to date & details
                                setTimeout(() => setCurrentStep("details"), 150);
                              }}
                              className={`w-full p-6 rounded-xl border-2 text-left transition-all cursor-pointer ${
                                formData.service === service.id
                                  ? "border-accent-emerald bg-accent-emerald/5"
                                  : "border-border hover:border-accent-emerald/50"
                              }`}
                            >
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-bold text-foreground text-lg">
                                    <ServiceNameDisplay name={translatedService.service_name} />
                                  </h4>
                                  {service.is_popular && (
                                    <span className="bg-accent-orange text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                      {t("services.popular").toUpperCase()}
                                    </span>
                                  )}
                                </div>
                                {(() => {
                                  const cleaned = service.price_display?.replace(/[^0-9.]/g, '') || ''
                                  const current = parseFloat(cleaned)
                                  if (service.service_type === 'tandem' && Number.isFinite(current) && current > 0) {
                                    const original = Math.round(current * 1.25)
                                    const prefix = service.price_display.match(/^[^\d]+/)?.[0] || '$'
                                    return (
                                      <div className="flex items-baseline gap-2 mb-2">
                                        <span className="text-sm text-muted-foreground line-through">{prefix}{original.toLocaleString()}</span>
                                        <span className="text-2xl font-black text-foreground">{service.price_display}</span>
                                        <span className="text-[10px] font-bold bg-accent-orange text-white px-1.5 py-0.5 rounded">{t('pricing.off')}</span>
                                      </div>
                                    )
                                  }
                                  return <p className="text-2xl font-black text-foreground mb-2">{service.price_display}</p>
                                })()}
                                {service.description && (
                                  <p className="text-muted-foreground text-sm">{service.description}</p>
                                )}
                                {service.includes && service.includes.length > 0 && (
                                  <div className="mt-3 flex flex-wrap gap-2">
                                    {service.includes.slice(0, 3).map((item, idx) => (
                                      <span
                                        key={idx}
                                        className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground"
                                      >
                                        {item}
                                      </span>
                                    ))}
                                    {service.includes.length > 3 && (
                                      <span className="text-xs text-muted-foreground">
                                        +{service.includes.length - 3} {t("booking.more")}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                              {formData.service === service.id && (
                                <div className="mt-4 pt-4 border-t border-border">
                                  <div className="flex items-center gap-2 text-accent-emerald">
                                    <Check className="w-4 h-4" />
                                    <span className="text-sm font-medium">{t("booking.selected")}</span>
                                  </div>
                                </div>
                              )}
                            </button>
                          );
                        })}
                        {(!locationServices || locationServices.length === 0) && !servicesLoading && (
                          <div className="text-center py-8">
                            <p className="text-muted-foreground">{t("booking.noServices")}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Step 3: Date & Details */}
                {currentStep === "details" && (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-8">
                      <CalendarIcon className="w-12 h-12 text-accent-emerald mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-foreground">{t("booking.whenJump")}</h3>
                      <p className="text-muted-foreground">{t("booking.selectDateDetails")}</p>
                    </div>

                    {/* Date Selection */}
                    <div className="overflow-hidden">
                      <label className="block text-lg font-semibold text-foreground mb-4">
                        {t("booking.preferredDate")}
                      </label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal h-14 rounded-xl border bg-background text-foreground hover:bg-muted",
                              !formData.date && "text-muted-foreground",
                              validationErrors.date ? "border-red-500" : "border-border",
                            )}
                          >
                            <CalendarIcon className="mr-3 h-5 w-5 text-muted-foreground" />
                            {formData.date ? (
                              format(new Date(formData.date), "PPP", {
                                locale: language === "zh-TW" ? zhTW : undefined,
                              })
                            ) : (
                              <span>{t("booking.preferredDate")}</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-[var(--radix-popover-trigger-width)] p-0 bg-card border border-border shadow-lg z-50"
                          align="start"
                        >
                          <Calendar
                            mode="single"
                            selected={formData.date ? new Date(formData.date) : undefined}
                            onSelect={(date) => {
                              if (date) {
                                setFormData({ ...formData, date: format(date, "yyyy-MM-dd") });
                              }
                            }}
                            disabled={(date) => {
                              if (date < new Date()) return true;
                              if (isIndoorService) return !bookableDateSet.has(format(date, "yyyy-MM-dd"));
                              const notice = getLocationNotice(selectedLocation?.slug);
                              if (notice?.type === "closing" && date >= new Date(notice.closedFrom)) return true;
                              return false;
                            }}
                            initialFocus
                            className={cn("p-3 pointer-events-auto w-full")}
                          />
                        </PopoverContent>
                      </Popover>
                      {validationErrors.date && <p className="text-red-500 text-xs mt-1">{validationErrors.date}</p>}
                      {isIndoorService && (
                        <p className="text-xs text-muted-foreground mt-2">
                          {t("departures.subtitle")}{" "}
                          {t("departures.minNotice")
                            .replace("{n}", String(serviceDepartures?.[0]?.min_participants ?? 3))
                            .replace("{d}", String(serviceDepartures?.[0]?.cutoff_days ?? 5))}
                        </p>
                      )}
                    </div>

                    {/* Participants */}
                    <div>
                      <label className="block text-lg font-semibold text-foreground mb-4">
                        {t("booking.numberOfJumpers")}
                      </label>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() =>
                            setFormData({ ...formData, participants: Math.max(1, formData.participants - 1) })
                          }
                          className="w-12 h-12 rounded-xl border border-border hover:border-accent-emerald/50 flex items-center justify-center text-xl font-bold cursor-pointer transition-colors"
                        >
                          -
                        </button>
                        <span className="text-2xl font-bold text-foreground w-12 text-center">
                          {formData.participants}
                        </span>
                        <button
                          onClick={() =>
                            setFormData({ ...formData, participants: Math.min(maxParticipants, formData.participants + 1) })
                          }
                          className="w-12 h-12 rounded-xl border border-border hover:border-accent-emerald/50 flex items-center justify-center text-xl font-bold cursor-pointer transition-colors"
                        >
                          +
                        </button>
                        <span className="text-muted-foreground">
                          {formData.participants !== 1 ? t("booking.jumpers") : t("booking.jumper")}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-border pt-6">
                      <h4 className="text-lg font-semibold text-foreground mb-4">{t("booking.contactDetails")}</h4>

                      {/* Name */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            {t("booking.firstName.label")}
                          </label>
                          <input
                            type="text"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            maxLength={50}
                            className={`w-full px-4 py-3 rounded-xl border bg-background text-foreground focus:ring-2 focus:ring-accent-emerald/20 outline-none transition-all ${
                              validationErrors.firstName
                                ? "border-red-500 focus:border-red-500"
                                : "border-border focus:border-accent-emerald"
                            }`}
                            placeholder="John"
                          />
                          {validationErrors.firstName && (
                            <p className="text-red-500 text-xs mt-1">{validationErrors.firstName}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            {t("booking.lastName.label")}
                          </label>
                          <input
                            type="text"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            maxLength={50}
                            className={`w-full px-4 py-3 rounded-xl border bg-background text-foreground focus:ring-2 focus:ring-accent-emerald/20 outline-none transition-all ${
                              validationErrors.lastName
                                ? "border-red-500 focus:border-red-500"
                                : "border-border focus:border-accent-emerald"
                            }`}
                            placeholder="Chan"
                          />
                          {validationErrors.lastName && (
                            <p className="text-red-500 text-xs mt-1">{validationErrors.lastName}</p>
                          )}
                        </div>
                      </div>

                      {/* Date of Birth */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-foreground mb-2">
                          {t("booking.dob.label")}
                        </label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal h-12 rounded-xl border bg-background text-foreground hover:bg-muted",
                                !formData.dateOfBirth && "text-muted-foreground",
                                "border-border",
                              )}
                            >
                              <CalendarIcon className="mr-3 h-5 w-5 text-muted-foreground" />
                              {formData.dateOfBirth ? (
                                format(new Date(formData.dateOfBirth), "PPP", {
                                  locale: language === "zh-TW" ? zhTW : undefined,
                                })
                              ) : (
                                <span>{t("booking.dob.placeholder")}</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-[var(--radix-popover-trigger-width)] p-0 bg-card border border-border shadow-lg z-50"
                            align="start"
                          >
                            <Calendar
                              mode="single"
                              selected={formData.dateOfBirth ? new Date(formData.dateOfBirth) : undefined}
                              onSelect={(date) => {
                                if (date) {
                                  setFormData({ ...formData, dateOfBirth: format(date, "yyyy-MM-dd") });
                                }
                              }}
                              disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                              initialFocus
                              className={cn("p-3 pointer-events-auto w-full")}
                              captionLayout="dropdown"
                              fromYear={1940}
                              toYear={new Date().getFullYear()}
                            />
                          </PopoverContent>
                        </Popover>
                        <p className="text-xs text-muted-foreground mt-1">{t("booking.dob.hint")}</p>
                      </div>

                      {/* Email */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-foreground mb-2">
                          {t("booking.email.label")}
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            maxLength={255}
                            className={`w-full pl-12 pr-4 py-3 rounded-xl border bg-background text-foreground focus:ring-2 focus:ring-accent-emerald/20 outline-none transition-all ${
                              validationErrors.email
                                ? "border-red-500 focus:border-red-500"
                                : "border-border focus:border-accent-emerald"
                            }`}
                            placeholder="sample@gmail.com"
                          />
                        </div>
                        {validationErrors.email && (
                          <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>
                        )}
                      </div>

                      {/* Phone */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-foreground mb-2">
                          {t("booking.phone.label")}
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            maxLength={20}
                            className={`w-full pl-12 pr-4 py-3 rounded-xl border bg-background text-foreground focus:ring-2 focus:ring-accent-emerald/20 outline-none transition-all ${
                              validationErrors.phone
                                ? "border-red-500 focus:border-red-500"
                                : "border-border focus:border-accent-emerald"
                            }`}
                            placeholder="+852 9876 5432"
                          />
                        </div>
                        {validationErrors.phone && (
                          <p className="text-red-500 text-xs mt-1">{validationErrors.phone}</p>
                        )}
                      </div>

                      {/* Notes */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-foreground mb-2">
                          {t("booking.specialRequests")}
                        </label>
                        <textarea
                          value={formData.notes}
                          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                          rows={3}
                          maxLength={500}
                          className={`w-full px-4 py-3 rounded-xl border bg-background text-foreground focus:ring-2 focus:ring-accent-emerald/20 outline-none transition-all resize-none ${
                            validationErrors.notes
                              ? "border-red-500 focus:border-red-500"
                              : "border-border focus:border-accent-emerald"
                          }`}
                          placeholder={t("booking.specialRequestsPlaceholder")}
                        />
                        <div className="flex justify-between mt-1">
                          {validationErrors.notes ? (
                            <p className="text-red-500 text-xs">{validationErrors.notes}</p>
                          ) : (
                            <span />
                          )}
                          <p className="text-muted-foreground text-xs">{formData.notes.length}/500</p>
                        </div>
                      </div>

                      {/* Promotion Selection */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-foreground mb-3">
                          {t("booking.promo.label")}
                        </label>
                        <div className="space-y-3">
                          {[
                            { id: "BUDDY100", labelKey: "promo.group2.title", detail: "$100" },
                            { id: "STUDENT100", labelKey: "promo.student.title", detail: "$100" },
                            { id: "BDAY100", labelKey: "promo.birthday.title", detail: "$100" },
                            { id: "EARLY10", labelKey: "promo.earlybird.title", detail: "10%" },
                            { id: "RETURN150", labelKey: "promo.repeat.title", detail: "$150" },
                          ].map((promo) => (
                            <label
                              key={promo.id}
                              className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                                formData.selectedPromos.includes(promo.id)
                                  ? "border-accent-emerald bg-accent-emerald/5"
                                  : "border-border hover:border-accent-emerald/30"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={formData.selectedPromos.includes(promo.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setFormData({
                                      ...formData,
                                      selectedPromos: [...formData.selectedPromos, promo.id],
                                    });
                                  } else {
                                    setFormData({
                                      ...formData,
                                      selectedPromos: formData.selectedPromos.filter((p) => p !== promo.id),
                                    });
                                  }
                                }}
                                className="w-4 h-4 rounded border-border text-accent-emerald focus:ring-accent-emerald accent-[hsl(var(--accent-emerald))]"
                              />
                              <span className="flex-1 text-sm font-medium text-foreground">{t(promo.labelKey)}</span>
                              <span className="text-xs font-bold text-accent-orange">
                                {promo.detail} {t("promo.off")}
                              </span>
                            </label>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">{t("booking.promo.hint")}</p>
                      </div>

                      {/* Referral Code */}
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">{t("referral.label")}</label>
                        <input
                          type="text"
                          value={formData.referralCode}
                          onChange={(e) => setFormData({ ...formData, referralCode: e.target.value.toUpperCase() })}
                          maxLength={8}
                          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-accent-emerald/20 focus:border-accent-emerald outline-none transition-all uppercase tracking-widest"
                          placeholder={t("referral.placeholder")}
                        />
                        <p className="text-xs text-muted-foreground mt-1">{t("referral.description")}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Preview */}
                {currentStep === "preview" && (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-8">
                      <Check className="w-16 h-16 text-accent-emerald mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-foreground">{t("booking.reviewBooking")}</h3>
                      <p className="text-muted-foreground">{t("booking.confirmDetails")}</p>
                    </div>

                    <div className="bg-accent-emerald/5 rounded-xl p-6 space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">{t("booking.location")}</p>
                          <p className="font-semibold text-foreground">{translatedSelectedLocation?.Name}</p>
                          <p className="text-xs text-muted-foreground">
                            {translatedSelectedLocation?.City}, {translatedSelectedLocation?.country}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">{t("booking.service")}</p>
                          <p className="font-semibold text-foreground">
                            <ServiceNameDisplay name={translatedSelectedService?.service_name || ""} />
                          </p>
                          <p className="text-xs text-muted-foreground">{selectedService?.price_display}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">{t("booking.date")}</p>
                          <p className="font-semibold text-foreground">{formData.date}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">{t("booking.participants")}</p>
                          <p className="font-semibold text-foreground">
                            {formData.participants}{" "}
                            {formData.participants !== 1 ? t("booking.jumpers") : t("booking.jumper")}
                          </p>
                        </div>
                      </div>
                      <div className="border-t border-border pt-4">
                        <p className="text-muted-foreground text-sm">{t("booking.contact")}</p>
                        <p className="font-semibold text-foreground">
                          {formData.firstName} {formData.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formData.email} • {formData.phone}
                        </p>
                        {formData.dateOfBirth && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {t("booking.dob.label")}: {formData.dateOfBirth}
                          </p>
                        )}
                      </div>
                      {formData.selectedPromos.length > 0 && (
                        <div className="border-t border-border pt-4">
                          <p className="text-muted-foreground text-sm mb-2">{t("booking.promo.label")}</p>
                          <div className="flex flex-wrap gap-2">
                            {formData.selectedPromos.map((code) => (
                              <span
                                key={code}
                                className="text-xs bg-accent-orange/10 text-accent-orange font-bold px-3 py-1 rounded-full"
                              >
                                {code}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="bg-accent-orange/10 border border-accent-orange/30 rounded-xl p-4 flex items-start gap-3">
                      <CreditCard className="w-5 h-5 text-accent-orange mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-foreground">{t("booking.depositReminder")}</p>
                        <p className="text-xs text-muted-foreground mt-1">{t("booking.depositReminderNote")}</p>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground text-center">{t("booking.termsDisclaimer")}</p>
                  </motion.div>
                )}

                {/* Step 5: Payment */}
                {currentStep === "payment" && (
                  <motion.div
                    key="payment"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-8">
                      <CreditCard className="w-12 h-12 text-accent-emerald mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-foreground">{t("booking.paymentTitle")}</h3>
                      <p className="text-muted-foreground">{t("booking.paymentSubtitle")}</p>
                    </div>

                    <div className="bg-accent-emerald/5 rounded-xl p-6 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-foreground font-medium">{t("booking.depositAmount")}</span>
                        <span className="text-2xl font-black text-foreground">HKD ${(selectedService?.deposit_amount ?? 500).toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">{t("booking.depositNote")}</p>
                    </div>

                    {isPaymentLoading ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-accent-emerald" />
                        <span className="ml-3 text-muted-foreground">{t("booking.paymentProcessing")}</span>
                      </div>
                    ) : (
                      <div ref={paymentContainerRef} className="min-h-[300px]" />
                    )}

                    {isPaymentComplete && (
                      <div className="flex items-center gap-2 text-accent-emerald justify-center">
                        <Check className="w-5 h-5" />
                        <span className="font-medium">{t("booking.paymentSuccess")}</span>
                      </div>
                    )}

                    {isSubmitting && (
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>{t("booking.submitting")}</span>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Navigation Buttons - Always visible at bottom */}
            <div className="flex items-center justify-between p-6 lg:p-8 border-t border-border bg-card rounded-b-3xl">
              {currentStep !== "location" ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t("booking.back")}
                </button>
              ) : (
                <div />
              )}

              {currentStep !== "payment" ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all cursor-pointer ${
                    canProceed()
                      ? "bg-accent-emerald text-white hover:bg-accent-emerald/90 shadow-md"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  {t("booking.next")}
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div /> /* Payment step: no Next button, payment widget handles completion */
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
