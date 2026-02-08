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

// Helper to detect if we're on a custom domain
const isCustomDomain = () => {
  const hostname = window.location.hostname;
  return (
    !hostname.includes("lovable.app") &&
    !hostname.includes("lovableproject.com") &&
    !hostname.includes("localhost") &&
    !hostname.includes("127.0.0.1")
  );
};

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
        
        // Send notification for new member registration (fire and forget)
        try {
          await supabase.functions.invoke('send-notification', {
            body: {
              type: 'registration',
              data: {
                fullName: session.user.user_metadata?.full_name || session.user.user_metadata?.name || '',
                registrationEmail: session.user.email,
              }
            }
          });
        } catch (notifyError) {
          console.error('Failed to send registration notification:', notifyError);
        }
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
        .eq("user_id", user.id)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
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
        const { error: updateError } = await supabase
          .from("profiles")
          .update(userData)
          .eq("user_id", user.id);

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

      // Build the callback URL
      const redirectUrl = `${window.location.origin}/auth/callback`;
      console.log("OAuth redirect URL:", redirectUrl);
      console.log("Is custom domain:", isCustomDomain());

      if (isCustomDomain()) {
        // For custom domains, use skipBrowserRedirect to bypass auth-bridge issues
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: redirectUrl,
            skipBrowserRedirect: true,
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

        if (data?.url) {
          // Validate the OAuth URL for security
          const oauthUrl = new URL(data.url);
          const allowedHosts = [
            "accounts.google.com",
            "xmelqjnxllsqofvkoccd.supabase.co",
          ];

          const isAllowed = allowedHosts.some(
            (host) =>
              oauthUrl.hostname === host || oauthUrl.hostname.endsWith(`.${host}`)
          );

          if (!isAllowed) {
            console.error("Invalid OAuth URL host:", oauthUrl.hostname);
            throw new Error("Invalid OAuth redirect URL");
          }

          console.log("Redirecting to OAuth provider:", data.url);
          window.location.href = data.url;
        }
      } else {
        // For Lovable preview domains, use normal flow
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: redirectUrl,
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
      }
    } catch (error: any) {
      console.error("Sign in with Google failed:", error);
      toast.error(error.message || "Failed to sign in with Google");
      throw error;
    } finally {
      setLoading(false);
    }
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

      const redirectUrl = `${window.location.origin}/auth/callback`;

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
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
      // Don't set loading to true during sign out to prevent UI flash/lag
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Sign out error:", error);
        toast.error("Failed to sign out");
        throw error;
      }

      // Clear user state immediately for smooth transition
      setUser(null);
      setSession(null);

      toast.success("Signed out successfully");
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const redirectUrl = `${window.location.origin}/auth/callback`;
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
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
      const { error } = await supabase
        .from("profiles")
        .update(data)
        .eq("user_id", user.id);

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
