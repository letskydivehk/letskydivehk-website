import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { BackgroundDecorations } from "@/components/BackgroundDecorations";

export default function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("Completing sign in...");

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log("AuthCallback: Starting authentication process");
        console.log("Current URL:", window.location.href);
        console.log("Hash:", window.location.hash);
        console.log("Search:", window.location.search);

        // Check for error in URL params first
        const urlParams = new URLSearchParams(window.location.search);
        const urlError = urlParams.get("error");
        const urlErrorDescription = urlParams.get("error_description");
        
        if (urlError) {
          console.error("OAuth error in URL:", urlError, urlErrorDescription);
          setError(urlErrorDescription || urlError);
          return;
        }

        // Try to get session from hash params (implicit flow)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");
        const hashError = hashParams.get("error");
        const hashErrorDescription = hashParams.get("error_description");

        if (hashError) {
          console.error("OAuth error in hash:", hashError, hashErrorDescription);
          setError(hashErrorDescription || hashError);
          return;
        }

        // If we have tokens in the hash, set the session manually
        if (accessToken && refreshToken) {
          console.log("Found tokens in hash, setting session...");
          setStatus("Establishing session...");
          
          const { data, error: setSessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (setSessionError) {
            console.error("Error setting session from hash:", setSessionError);
            setError(setSessionError.message);
            return;
          }

          if (data.session) {
            console.log("Session established from hash tokens, user:", data.session.user.email);
            setStatus("Redirecting to profile...");
            
            // Clear hash from URL before navigating
            window.history.replaceState(null, "", window.location.pathname);
            
            // Small delay to ensure state updates
            setTimeout(() => {
              navigate("/membership", { replace: true });
            }, 100);
            return;
          }
        }

        // Try to get existing session
        setStatus("Checking session...");
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Error getting session:", sessionError);
          setError(sessionError.message);
          return;
        }

        if (sessionData.session) {
          console.log("Existing session found, user:", sessionData.session.user.email);
          setStatus("Redirecting to profile...");
          
          setTimeout(() => {
            navigate("/membership", { replace: true });
          }, 100);
          return;
        }

        // Check for authorization code (PKCE flow)
        const code = urlParams.get("code");
        if (code) {
          console.log("Found authorization code, exchanging...");
          setStatus("Exchanging authorization code...");
          
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          
          if (exchangeError) {
            console.error("Error exchanging code:", exchangeError);
            setError(exchangeError.message);
            return;
          }

          if (data.session) {
            console.log("Session established from code exchange, user:", data.session.user.email);
            setStatus("Redirecting to profile...");
            
            // Clear code from URL
            window.history.replaceState(null, "", window.location.pathname);
            
            setTimeout(() => {
              navigate("/membership", { replace: true });
            }, 100);
            return;
          }
        }

        // No tokens, no session, no code - something went wrong
        console.error("No authentication data found");
        setError("Authentication data not found. Please try signing in again.");
        
      } catch (err: any) {
        console.error("Unexpected error in auth callback:", err);
        setError(err.message || "An unexpected error occurred");
      }
    };

    // Run the callback handler
    handleAuthCallback();
  }, [navigate, location]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background relative">
        <BackgroundDecorations />
        <div className="text-center p-8 max-w-md relative z-10">
          <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Authentication Error</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate("/")}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Return to Home
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-muted text-muted-foreground rounded-md hover:bg-muted/80 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative">
      <BackgroundDecorations />
      <div className="text-center relative z-10">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
        <p className="text-lg text-foreground font-medium">{status}</p>
        <p className="text-sm text-muted-foreground mt-2">Please wait...</p>
      </div>
    </div>
  );
}
