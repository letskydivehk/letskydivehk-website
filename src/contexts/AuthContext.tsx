import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: { display_name?: string; avatar_url?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("Error getting session:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);

      if (event === "SIGNED_IN" && session?.user) {
        // Create or update user profile in database
        await createOrUpdateUserProfile(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Create/update user profile in database
  const createOrUpdateUserProfile = async (user: User) => {
    try {
      const { data: profile, error: fetchError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        // PGRST116 = no rows
        console.error("Error fetching profile:", fetchError);
        return;
      }

      const userData = {
        user_id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || user.user_metadata?.name || "",
        avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || "",
        updated_at: new Date().toISOString(),
      };

      if (!profile) {
        // Create new profile
        const { error: insertError } = await supabase
          .from("profiles")
          .insert([{ ...userData, created_at: new Date().toISOString() }]);

        if (insertError) {
          console.error("Error creating profile:", insertError);
        } else {
          console.log("Profile created successfully");
        }
      } else {
        // Update existing profile
        const { error: updateError } = await supabase.from("profiles").update(userData).eq("id", user.id);

        if (updateError) {
          console.error("Error updating profile:", updateError);
        }
      }
    } catch (error) {
      console.error("Error in createOrUpdateUserProfile:", error);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);

      // Always use the same approach - direct OAuth with redirect
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${getRedirectUrl()}/membership`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        console.error("Google OAuth error:", error);
        toast.error(`Google Sign-In failed: ${error.message}`);
        throw error;
      }

      // If we get a URL, we're doing server-side OAuth (custom domain)
      // If not, Supabase will handle the redirect automatically
      if (data?.url) {
        // Validate the URL for security
        const url = new URL(data.url);
        const allowedDomains = ["accounts.google.com", "supabase.co"];

        if (!allowedDomains.some((domain) => url.hostname.endsWith(domain))) {
          throw new Error("Invalid OAuth redirect URL");
        }

        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error("Sign in with Google failed:", error);
      toast.error(error.message || "Failed to sign in with Google");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get correct redirect URL
  const getRedirectUrl = () => {
    // For development
    if (window.location.hostname === "localhost") {
      return "http://localhost:3000";
    }

    // For production
    return window.location.origin;
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Email sign in error:", error);

        let errorMessage = "Sign in failed";
        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Invalid email or password";
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "Please verify your email address first";
        }

        toast.error(errorMessage);
        throw new Error(errorMessage);
      }

      toast.success("Signed in successfully!");
    } catch (error: any) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${getRedirectUrl()}/membership`,
          data: {
            signup_method: "email",
          },
        },
      });

      if (error) {
        console.error("Sign up error:", error);

        let errorMessage = "Sign up failed";
        if (error.message.includes("already registered")) {
          errorMessage = "Email already registered";
        } else if (error.message.includes("weak")) {
          errorMessage = "Password is too weak";
        }

        toast.error(errorMessage);
        throw new Error(errorMessage);
      }

      toast.success("Check your email to confirm your account!");
    } catch (error: any) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Sign out error:", error);
        toast.error("Failed to sign out");
        throw error;
      }

      toast.success("Signed out successfully");
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${getRedirectUrl()}/reset-password`,
      });

      if (error) throw error;
      toast.success("Password reset email sent!");
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset email");
      throw error;
    }
  };

  const updateProfile = async (data: { display_name?: string; avatar_url?: string }) => {
    if (!user) throw new Error("No user logged in");

    try {
      const { error } = await supabase.from("profiles").update(data).eq("id", user.id);

      if (error) throw error;
      toast.success("Profile updated!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
      throw error;
    }
  };

  const value = {
    user,
    session,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    resetPassword,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
