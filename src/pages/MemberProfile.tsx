import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, User, Phone, Mail, UserPlus, Save, Loader2, Calendar, MapPin, Coins, TrendingUp, TrendingDown, Shield, Copy, Clock, Award, Star, Crown, Gem, Check } from "lucide-react";
import { SEO } from "@/components/SEO";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { z } from "zod";
import { BackgroundDecorations } from "@/components/BackgroundDecorations";
import { Footer } from "@/components/Footer";
import { MagnetShowcase } from "@/components/rewards/MagnetShowcase";
import { ExpiringCreditsNote } from "@/components/rewards/ExpiringCreditsNote";


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
  referral_code: string | null;
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
  const { user, loading: authLoading } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [creditBalance, setCreditBalance] = useState<number>(0);
  const [pendingBalance, setPendingBalance] = useState<number>(0);
  const [creditTransactions, setCreditTransactions] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  const [memberTier, setMemberTier] = useState<any>(null);
  const [allTiers, setAllTiers] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    emergency_contact_relationship: "",
  });

  const fetchProfile = useCallback(async (userId: string) => {
    setProfileLoading(true);
    try {
      // First try to get existing profile
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }

      if (data) {
        console.log("Profile loaded:", data.id);
        setProfile(data);
        setFormData({
          full_name: data.full_name || "",
          phone: data.phone || "",
          emergency_contact_name: data.emergency_contact_name || "",
          emergency_contact_phone: data.emergency_contact_phone || "",
          emergency_contact_relationship: data.emergency_contact_relationship || "",
        });
      } else {
        // Profile doesn't exist - the database trigger should have created it
        // Brief retry in case trigger is still processing
        console.log("No profile found, retrying...");
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const { data: retryData, error: retryError } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", userId)
          .maybeSingle();
        
        if (retryError) throw retryError;
        
        if (retryData) {
          console.log("Profile found on retry:", retryData.id);
          setProfile(retryData);
          setFormData({
            full_name: retryData.full_name || "",
            phone: retryData.phone || "",
            emergency_contact_name: retryData.emergency_contact_name || "",
            emergency_contact_phone: retryData.emergency_contact_phone || "",
            emergency_contact_relationship: retryData.emergency_contact_relationship || "",
          });
        } else {
          console.log("Profile still not found after retry");
          // Set empty profile state - user can still use the form
          setProfile(null);
        }
      }
    } catch (error) {
      console.error("Error in fetchProfile:", error);
      toast.error(t("profile.loadError") || "Failed to load profile");
    } finally {
      setProfileLoading(false);
    }
  }, [t]);

  const fetchBookings = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          id,
          preferred_date,
          status,
          participants,
          created_at,
          locations:location_id (Name, City),
          location_services:service_id (service_name, price_display)
        `)
        .eq("user_id", userId)
        .order("preferred_date", { ascending: false })
        .limit(10);

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  }, []);

  const fetchCredits = useCallback(async (userId: string) => {
    try {
      const [balanceRes, pendingRes, txRes] = await Promise.all([
        supabase.rpc('get_credit_balance', { _user_id: userId }),
        supabase.rpc('get_pending_credit_balance', { _user_id: userId }),
        supabase
          .from('credit_transactions')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(10),
      ]);
      setCreditBalance(balanceRes.data || 0);
      setPendingBalance(pendingRes.data || 0);
      setCreditTransactions(txRes.data || []);
    } catch (error) {
      console.error('Error fetching credits:', error);
    }
  }, []);

  const checkAdminRole = useCallback(async (userId: string) => {
    try {
      const { data } = await supabase.rpc('has_role', { _user_id: userId, _role: 'admin' });
      setIsAdmin(!!data);
    } catch (error) {
      console.error('Error checking admin role:', error);
    }
  }, []);

  const fetchTiers = useCallback(async (totalJumps: number) => {
    try {
      const { data, error } = await (supabase as any)
        .from("membership_tiers")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      const tiers = data || [];
      setAllTiers(tiers);
      // Find current tier based on total_jumps
      const currentTier = [...tiers].reverse().find((t: any) => totalJumps >= t.min_jumps);
      setMemberTier(currentTier || tiers[0]);
    } catch (error) {
      console.error("Error fetching tiers:", error);
    }
  }, []);


  useEffect(() => {
    if (authLoading) return;
    
    setHasCheckedAuth(true);
    
    if (!user) {
      // Not logged in - redirect to home
      navigate("/", { replace: true });
      return;
    }

    // User is logged in - fetch their data
    console.log("User authenticated, fetching profile data...");
    fetchProfile(user.id);
    fetchBookings(user.id);
    fetchCredits(user.id);
    checkAdminRole(user.id);
    fetchTiers(0); // Will update when profile loads
  }, [authLoading, user, navigate, fetchProfile, fetchBookings, fetchTiers]);

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

      // Check if profile exists
      if (profile) {
        // Update existing profile
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
      } else {
        // Create new profile
        const { data: newProfile, error } = await supabase
          .from("profiles")
          .insert({
            user_id: user.id,
            email: user.email,
            full_name: validatedData.full_name,
            phone: validatedData.phone,
            emergency_contact_name: validatedData.emergency_contact_name,
            emergency_contact_phone: validatedData.emergency_contact_phone,
            emergency_contact_relationship: validatedData.emergency_contact_relationship,
            avatar_url: user.user_metadata?.avatar_url || "",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (error) throw error;
        if (newProfile) setProfile(newProfile);
      }

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
      const { signOut } = await import("@/contexts/AuthContext").then(m => {
        // Get signOut from context
        return { signOut: async () => await supabase.auth.signOut() };
      });
      await supabase.auth.signOut();
      toast.success("Signed out successfully");
      navigate("/", { replace: true });
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

  // Show loading while checking auth or fetching profile
  if (authLoading || (!hasCheckedAuth)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2 text-foreground">Loading...</span>
      </div>
    );
  }

  // After auth check, if no user, don't render (redirect will happen)
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2 text-foreground">Redirecting...</span>
      </div>
    );
  }

  // Show loading while fetching profile data
  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2 text-foreground">Loading profile...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <SEO title="My Profile" description="Manage your skydiving profile, bookings, and credits." path="/membership" />
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
                      src={user?.user_metadata?.avatar_url || profile?.avatar_url || undefined}
                      alt={formData.full_name || "User"}
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                      {(formData.full_name?.[0] || user?.email?.[0] || "U").toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-lg text-foreground">
                      {formData.full_name || user?.user_metadata?.full_name || t("auth.member") || "Member"}
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

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Membership Tier Card */}
              {memberTier && (
                <Card className="mobile-transparent-card border-primary/20 overflow-hidden">
                  <div className="h-1.5 w-full" style={{ backgroundColor: memberTier.color }} />
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Award className="w-4 h-4" style={{ color: memberTier.color }} />
                      {t("tiers.membershipTier")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-center py-2">
                      <p className="text-2xl font-bold" style={{ color: memberTier.color }}>
                        {language === "zh-TW" ? memberTier.name_zh_tw : language === "zh-CN" ? memberTier.name_zh_cn : memberTier.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {(profile as any)?.total_jumps || 0} {t("tiers.jumpsCompleted")} · {memberTier.credit_multiplier}x {t("tiers.creditMultiplier")}
                      </p>
                    </div>

                    {/* Progress to next tier */}
                    {(() => {
                      const currentIdx = allTiers.findIndex((t: any) => t.id === memberTier.id);
                      const nextTier = allTiers[currentIdx + 1];
                      if (!nextTier) return null;
                      const totalJumps = (profile as any)?.total_jumps || 0;
                      const progress = Math.min(100, ((totalJumps - memberTier.min_jumps) / (nextTier.min_jumps - memberTier.min_jumps)) * 100);
                      const nextName = language === "zh-TW" ? nextTier.name_zh_tw : language === "zh-CN" ? nextTier.name_zh_cn : nextTier.name;
                      return (
                        <div>
                          <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>{t("tiers.nextTier")}: {nextName}</span>
                            <span>{nextTier.min_jumps - totalJumps} {t("tiers.jumpsToGo")}</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>
                      );
                    })()}

                    <Link to="/membership/tiers" className="block">
                      <Button variant="outline" size="sm" className="w-full text-xs">
                        {t("tiers.viewAllTiers")}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}

              {/* Credit Balance Card */}
              <Card className="mobile-transparent-card border-primary/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Coins className="w-4 h-4 text-primary" />
                    {t("credit.balance") || "Credit Balance"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-2">
                    <p className="text-3xl font-bold text-primary">${creditBalance}</p>
                    <p className="text-xs text-muted-foreground mt-1">HKD</p>
                  </div>

                  <Button
                    onClick={() => navigate("/#booking")}
                    className="w-full mt-3 bg-accent-orange hover:bg-accent-orange/90 text-white font-bold py-5 text-sm shadow-lg"
                  >
                    {t("member.bookNowCta") || "立即預約跳傘 →"}
                  </Button>


                  {pendingBalance > 0 && (
                    <div className="flex items-center justify-between p-2 bg-yellow-500/10 rounded-md mt-2">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 text-yellow-500" />
                        <span className="text-xs text-yellow-600 dark:text-yellow-400">{t("credit.pendingBalance") || "Pending"}</span>
                      </div>
                      <span className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">${pendingBalance}</span>
                    </div>
                  )}

                  <ExpiringCreditsNote />


                  {creditTransactions.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase">
                        {t("credit.history") || "Transaction History"}
                      </h4>
                      {creditTransactions.map((tx) => (
                        <div key={tx.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                          <div className="flex items-center gap-2">
                            {tx.status === 'pending' ? (
                              <Clock className="w-3 h-3 text-yellow-500" />
                            ) : tx.amount > 0 ? (
                              <TrendingUp className="w-3 h-3 text-green-500" />
                            ) : (
                              <TrendingDown className="w-3 h-3 text-red-500" />
                            )}
                            <div>
                              <span className="text-xs">{t(`credit.${tx.type}`) || tx.type}</span>
                              {tx.status === 'pending' && (
                                <span className="text-[10px] ml-1 text-yellow-600 dark:text-yellow-400">({t("credit.pending")})</span>
                              )}
                            </div>
                          </div>
                          <span className={`text-sm font-semibold ${
                            tx.status === 'pending' ? 'text-yellow-600 dark:text-yellow-400' :
                            tx.amount > 0 ? 'text-green-500' : 'text-red-500'
                          }`}>
                            {tx.amount > 0 ? '+' : ''}{tx.amount}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Referral Code Card */}
              {profile?.referral_code && (
                <Card className="mobile-transparent-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Copy className="w-4 h-4" />
                      {t("referral.title") || "My Referral Code"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(profile.referral_code || '');
                        toast.success(t("referral.copied") || "Copied!");
                      }}
                      className="w-full p-3 bg-primary/10 rounded-lg text-center cursor-pointer hover:bg-primary/20 transition-colors"
                    >
                      <p className="text-2xl font-mono font-bold text-primary tracking-[0.3em]">{profile.referral_code}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">{t("referral.description")}</p>
                    </button>
                  </CardContent>
                </Card>
              )}

              {/* Admin Link */}
              {isAdmin && (
                <Link to="/admin/credits">
                  <Button variant="outline" className="w-full flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    {t("admin.title") || "Admin - Credit Management"}
                  </Button>
                </Link>
              )}

              {/* Bookings */}
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
