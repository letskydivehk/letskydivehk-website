import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import { motion } from "framer-motion";
import { ArrowLeft, User, Phone, Mail, UserPlus, Save, Loader2, Calendar, MapPin } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { z } from "zod";
import { BackgroundDecorations } from "@/components/BackgroundDecorations";
import { Footer } from "@/components/Footer";

// Validation schema for profile data
const phoneRegex = /^(\+?[1-9]\d{0,14})?$/;

const profileSchema = z.object({
  full_name: z
    .string()
    .max(100, "Name must be less than 100 characters")
    .optional()
    .nullable()
    .transform((val) => val?.trim() || null),
  phone: z
    .string()
    .max(20, "Phone number too long")
    .regex(phoneRegex, "Invalid phone format")
    .optional()
    .nullable()
    .transform((val) => val?.trim() || null),
  emergency_contact_name: z
    .string()
    .max(100, "Name must be less than 100 characters")
    .optional()
    .nullable()
    .transform((val) => val?.trim() || null),
  emergency_contact_phone: z
    .string()
    .max(20, "Phone number too long")
    .regex(phoneRegex, "Invalid phone format")
    .optional()
    .nullable()
    .transform((val) => val?.trim() || null),
  emergency_contact_relationship: z
    .string()
    .max(50, "Relationship must be less than 50 characters")
    .optional()
    .nullable()
    .transform((val) => val?.trim() || null),
});

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  emergency_contact_relationship: string | null;
}

interface Booking {
  id: string;
  preferred_date: string;
  status: string;
  participants: number;
  created_at: string;
  locations: { Name: string; City: string | null } | null;
  location_services: { service_name: string; price_display: string } | null;
}

export default function MemberProfile() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    emergency_contact_relationship: "",
  });

  // Redirect to home if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/");
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (user) {
      console.log("User detected, fetching profile...");
      fetchProfile();
      fetchBookings();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle();

      if (error) throw error;

      if (data) {
        console.log("Profile loaded:", data);
        setProfile(data);
        setFormData({
          full_name: data.full_name || "",
          phone: data.phone || "",
          emergency_contact_name: data.emergency_contact_name || "",
          emergency_contact_phone: data.emergency_contact_phone || "",
          emergency_contact_relationship: data.emergency_contact_relationship || "",
        });
      } else {
        console.log("No profile found, creating one...");
        // Create profile if it doesn't exist
        const { error: createError } = await supabase.from("profiles").insert({
          user_id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.user_metadata?.name || "",
          avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || "",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        if (createError) {
          console.error("Error creating profile:", createError);
        } else {
          console.log("Profile created, refetching...");
          fetchProfile(); // Refetch to get the new profile
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error(t("profile.loadError") || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("bookings")
        .select(
          `
          id,
          preferred_date,
          status,
          participants,
          created_at,
          locations:location_id (Name, City),
          location_services:service_id (service_name, price_display)
        `,
        )
        .eq("user_id", user.id)
        .order("preferred_date", { ascending: false })
        .limit(10);

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const validationResult = profileSchema.safeParse(formData);

      if (!validationResult.success) {
        const firstError = validationResult.error.errors[0];
        toast.error(firstError.message || t("profile.validationError") || "Validation error");
        setSaving(false);
        return;
      }

      const validatedData = validationResult.data;

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: validatedData.full_name,
          phone: validatedData.phone,
          emergency_contact_name: validatedData.emergency_contact_name,
          emergency_contact_phone: validatedData.emergency_contact_phone,
          emergency_contact_relationship: validatedData.emergency_contact_relationship,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      if (error) throw error;

      toast.success(t("profile.updateSuccess") || "Profile updated successfully");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error(t("profile.updateError") || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500/20 text-green-400";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400";
      case "cancelled":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2">Loading profile...</span>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <BackgroundDecorations />

      <main className="relative z-10 pt-8 pb-20">
        <div className="container max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link to="/">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">{t("profile.title") || "My Profile"}</h1>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Profile Card */}
            <Card className="md:col-span-2 mobile-transparent-card">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage
                      src={user?.user_metadata?.avatar_url || profile?.avatar_url}
                      alt={formData.full_name || "User"}
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                      {(formData.full_name?.[0] || user?.email?.[0] || "U").toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-lg text-foreground">
                      {formData.full_name || t("auth.member") || "Member"}
                    </p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {t("profile.basicInfo") || "Basic Information"}
                  </h3>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="full_name">{t("profile.fullName") || "Full Name"}</Label>
                      <Input
                        id="full_name"
                        value={formData.full_name}
                        onChange={(e) => handleChange("full_name", e.target.value)}
                        placeholder={t("profile.namePlaceholder") || "Enter your full name"}
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">{t("auth.emailAddress") || "Email Address"}</Label>
                      <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-md h-10">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground text-sm truncate">{user?.email}</span>
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <Label htmlFor="phone">{t("profile.phone") || "Phone Number"}</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        placeholder={t("profile.phonePlaceholder") || "+1 (555) 123-4567"}
                      />
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    {t("profile.emergencyContact") || "Emergency Contact"}{" "}
                    <span className="text-muted-foreground font-normal">({t("profile.optional") || "Optional"})</span>
                  </h3>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="emergency_contact_name">{t("profile.name") || "Name"}</Label>
                      <Input
                        id="emergency_contact_name"
                        value={formData.emergency_contact_name}
                        onChange={(e) => handleChange("emergency_contact_name", e.target.value)}
                        placeholder={t("profile.emergencyNamePlaceholder") || "Emergency contact name"}
                      />
                    </div>

                    <div>
                      <Label htmlFor="emergency_contact_phone">{t("profile.phone") || "Phone"}</Label>
                      <Input
                        id="emergency_contact_phone"
                        value={formData.emergency_contact_phone}
                        onChange={(e) => handleChange("emergency_contact_phone", e.target.value)}
                        placeholder={t("profile.emergencyPhonePlaceholder") || "+1 (555) 123-4567"}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <Label htmlFor="emergency_contact_relationship">
                        {t("profile.relationship") || "Relationship"}
                      </Label>
                      <Input
                        id="emergency_contact_relationship"
                        value={formData.emergency_contact_relationship}
                        onChange={(e) => handleChange("emergency_contact_relationship", e.target.value)}
                        placeholder={t("profile.relationshipPlaceholder") || "e.g., Spouse, Parent, Friend"}
                      />
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Button onClick={handleSave} disabled={saving} className="w-full">
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    {saving ? t("profile.saving") || "Saving..." : t("profile.save") || "Save Changes"}
                  </Button>
                </motion.div>
              </CardContent>
            </Card>

            {/* Sidebar - Bookings */}
            <div className="space-y-4">
              <Card className="mobile-transparent-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {t("profile.myBookings") || "My Bookings"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {bookings.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground text-sm mb-4">
                        {t("profile.noBookings") || "No bookings yet"}
                      </p>
                      <Link to="/#booking">
                        <Button size="sm" variant="outline">
                          {t("common.bookNow") || "Book Now"}
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {bookings.map((booking) => (
                        <div key={booking.id} className="p-3 bg-muted/50 rounded-lg border border-border">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <p className="font-medium text-sm">
                              {booking.location_services?.service_name || "Skydive"}
                            </p>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(booking.status)}`}>
                              {booking.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            {booking.locations?.Name || "Location"}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(booking.preferred_date).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Sign Out */}
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="w-full text-destructive hover:text-destructive"
              >
                {t("auth.signOut") || "Sign Out"}
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
