"use client";

import { useState, useMemo, useEffect } from "react";
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
} from "lucide-react";
import { format } from "date-fns";
import { zhTW } from "date-fns/locale";
import { useLocations, type Location } from "@/hooks/useLocations";
import { useLocationServices, type LocationService } from "@/hooks/useLocationServices";
import { useBooking } from "@/contexts/BookingContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { z } from "zod";
import { toast } from "sonner";
import { SectionDecorations } from "./SectionDecorations";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
}

type Step = "location" | "service" | "details" | "confirm";

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
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const { data: locations, isLoading: locationsLoading } = useLocations();
  const {
    preselectedLocationId,
    setPreselectedLocationId,
    preselectedServiceType,
    setPreselectedServiceType,
    activeServiceTypeFilter,
    setActiveServiceTypeFilter,
  } = useBooking();
  const { t, translateData, language } = useLanguage();

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
      const locationExists = locations.find((l) => l.id === preselectedLocationId && !l.coming_soon);
      if (locationExists) {
        setFormData((prev) => ({ ...prev, location: preselectedLocationId }));
        setCurrentStep("service");
        // Clear the preselection after using it
        setPreselectedLocationId(null);
      }
    }
  }, [preselectedLocationId, locations, setPreselectedLocationId]);

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
    if (!activeServiceTypeFilter) return locations.filter((l) => !l.coming_soon);

    return locations.filter((l) => {
      if (l.coming_soon) return false;
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
    });
    setCurrentStep("location");
    setIsComplete(false);
    setValidationErrors({});
    setActiveServiceTypeFilter(null);
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

  const steps: { id: Step; label: string; icon: React.ElementType }[] = [
    { id: "location", label: t("booking.step1"), icon: MapPin },
    { id: "service", label: t("booking.step2"), icon: Plane },
    { id: "details", label: t("booking.step3"), icon: User },
    { id: "confirm", label: t("booking.step4"), icon: Check },
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
      case "confirm":
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep === "location") setCurrentStep("service");
    else if (currentStep === "service") setCurrentStep("details");
    else if (currentStep === "details") setCurrentStep("confirm");
  };

  const handleBack = () => {
    if (currentStep === "service") setCurrentStep("location");
    else if (currentStep === "details") setCurrentStep("service");
    else if (currentStep === "confirm") setCurrentStep("details");
  };

  const handleSubmit = async () => {
    // Validate form data before submission
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
      toast.error("Please fix the validation errors before submitting");
      return;
    }

    // Clear any previous validation errors
    setValidationErrors({});

    setIsSubmitting(true);
    // Simulate API call - will be replaced with actual submission
    // When implementing: use validationResult.data for sanitized/validated data
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsComplete(true);
  };

  // Get min date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  if (isComplete) {
    return (
      <section id="booking" className="relative py-24 bg-background overflow-hidden">
        <SectionDecorations />
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto text-center"
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
                    {translatedSelectedService?.service_name}
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
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                        isActive
                          ? "bg-accent-emerald text-white scale-110 shadow-lg shadow-accent-emerald/30"
                          : isCompleted
                            ? "bg-accent-emerald text-white"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-6 h-6" />
                      ) : (
                        <Icon className={`w-6 h-6 ${isActive ? "" : "opacity-80"}`} />
                      )}
                    </div>

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
                      className={`absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center ${
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
          <div className="bg-card rounded-3xl p-8 lg:p-12 clean-border elevated-shadow mobile-transparent-card">
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
                      {activeServiceTypeFilter === "aff" && (
                        <div className="mb-4 p-3 bg-accent-blue/10 rounded-lg flex items-center justify-between">
                          <span className="text-sm text-accent-blue font-medium">{t("booking.filter.showing")}</span>
                          <button
                            onClick={() => setActiveServiceTypeFilter(null)}
                            className="text-xs text-muted-foreground hover:text-foreground underline cursor-pointer"
                          >
                            {t("booking.showAll")}
                          </button>
                        </div>
                      )}
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
                      {locationServices?.map((service) => {
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
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-bold text-foreground text-lg">
                                    {translatedService.service_name}
                                  </h4>
                                  {service.is_popular && (
                                    <span className="bg-accent-orange text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                      {t("services.popular").toUpperCase()}
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground capitalize mb-2">
                                  {translateData(`serviceType.${service.service_type}`, service.service_type)}
                                </p>
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
                              <div className="text-right flex-shrink-0">
                                <p className="text-2xl font-black text-foreground">{service.price_display}</p>
                              </div>
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
                            format(new Date(formData.date), "PPP", { locale: language === "zh-TW" ? zhTW : undefined })
                          ) : (
                            <span>{t("booking.preferredDate")}</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-card border border-border shadow-lg z-50" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.date ? new Date(formData.date) : undefined}
                          onSelect={(date) => {
                            if (date) {
                              setFormData({ ...formData, date: format(date, "yyyy-MM-dd") });
                            }
                          }}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                    {validationErrors.date && <p className="text-red-500 text-xs mt-1">{validationErrors.date}</p>}
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
                          setFormData({ ...formData, participants: Math.min(10, formData.participants + 1) })
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
                      {validationErrors.email && <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>}
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
                      {validationErrors.phone && <p className="text-red-500 text-xs mt-1">{validationErrors.phone}</p>}
                    </div>

                    {/* Notes */}
                    <div>
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
                  </div>
                </motion.div>
              )}

              {/* Step 4: Confirm */}
              {currentStep === "confirm" && (
                <motion.div
                  key="confirm"
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
                        <p className="font-semibold text-foreground">{translatedSelectedService?.service_name}</p>
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
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground text-center">{t("booking.termsDisclaimer")}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
              {currentStep !== "location" ? (
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t("booking.back")}
                </button>
              ) : (
                <div />
              )}

              {currentStep !== "confirm" ? (
                <button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all cursor-pointer ${
                    canProceed()
                      ? "bg-accent-emerald text-white hover:bg-accent-emerald/90"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  {t("booking.next")}
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-8 py-3 rounded-lg font-semibold bg-accent-emerald text-white hover:bg-accent-emerald/90 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      {t("booking.submitting")}
                    </>
                  ) : (
                    <>
                      {t("booking.confirmBooking")}
                      <Check className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
