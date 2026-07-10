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
  updateProfile: (data: { full_name?: string; avatar_url?: string }) => Promise<void>;
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
        if (import.meta.env.DEV) console.error("Error getting session:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);

      if (event === "SIGNED_IN" && session?.user) {
        // Defer async calls to avoid deadlock in onAuthStateChange
        const user = session.user;
        setTimeout(async () => {
          const isNewUser = await createOrUpdateUserProfile(user);
          // Only send registration notification for brand new users
          if (isNewUser) {
            supabase.functions.invoke('send-notification', {
              body: {
                type: 'registration',
                data: {
                  fullName: user.user_metadata?.full_name || user.user_metadata?.name || '',
                  registrationEmail: user.email,
                }
              }
            }).catch(err => { if (import.meta.env.DEV) console.error('Failed to send registration notification:', err); });
          }
        }, 0);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Create/update user profile in database. Returns true if new profile was created.
  const createOrUpdateUserProfile = async (user: User): Promise<boolean> => {
    try {
      const { data: profile, error: fetchError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        if (import.meta.env.DEV) console.error("Error fetching profile:", fetchError);
        return false;
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
          if (import.meta.env.DEV) console.error("Error creating profile:", insertError);
          return false;
        }
        console.log("Profile created successfully");
        return true;
      } else {
        // Update existing profile
        const { error: updateError } = await supabase
          .from("profiles")
          .update(userData)
          .eq("user_id", user.id);

        if (updateError) {
          if (import.meta.env.DEV) console.error("Error updating profile:", updateError);
        }
        return false;
      }
    } catch (error) {
      if (import.meta.env.DEV) console.error("Error in createOrUpdateUserProfile:", error);
      return false;
    }
  };

  // Detect if running inside an iframe (e.g. Lovable preview)
  const isInIframe = () => {
    try {
      return window.self !== window.top;
    } catch {
      return true;
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);

      const redirectUrl = `${window.location.origin}/auth/callback`;
      console.log("OAuth redirect URL:", redirectUrl);

      // Always use skipBrowserRedirect to get the URL, then decide how to open it
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
        if (import.meta.env.DEV) console.error("Google OAuth error:", error);
        toast.error(`Google Sign-In failed: ${error.message}`);
        throw error;
      }

      if (data?.url) {
        if (isInIframe()) {
          // Popup flow for iframe environments (Lovable preview)
          const popup = window.open(data.url, "oauth-popup", "width=500,height=600");

          if (!popup) {
            toast.error("Popup blocked. Please allow popups for this site and try again.");
            return;
          }

          // Listen for completion message from the popup's callback page
          const messageHandler = (event: MessageEvent) => {
            if (event.origin === window.location.origin && event.data?.type === "oauth-complete") {
              popup?.close();
              window.removeEventListener("message", messageHandler);
              // Reload to pick up the new session
              window.location.reload();
            }
          };
          window.addEventListener("message", messageHandler);
        } else {
          // Normal redirect for custom domains / non-iframe
          window.location.href = data.url;
        }
      }
    } catch (error: any) {
      if (import.meta.env.DEV) console.error("Sign in with Google failed:", error);
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
        if (import.meta.env.DEV) console.error("Email sign in error:", error);

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
        if (import.meta.env.DEV) console.error("Sign up error:", error);

        let errorMessage = "Sign up failed";
        if (error.message.includes("already registered")) {
          errorMessage = "Email already registered";
        } else if (error.message.includes("weak")) {
          errorMessage = "Password is too weak";
        }

        toast.error(errorMessage);
        throw new Error(errorMessage);
      }

      // Fire-and-forget welcome email with $200 voucher CTA
      const language =
        (typeof window !== "undefined" && localStorage.getItem("language")) || "zh-TW";
      supabase.functions
        .invoke("send-welcome-email", { body: { email, language } })
        .catch((e) => {
          if (import.meta.env.DEV) console.error("welcome email failed", e);
        });

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
        if (import.meta.env.DEV) console.error("Sign out error:", error);
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

  const updateProfile = async (data: { full_name?: string; avatar_url?: string }) => {
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
