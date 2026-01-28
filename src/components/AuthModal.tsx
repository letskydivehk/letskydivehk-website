import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const { t } = useLanguage();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [isOpen]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      onClose();
    } catch (error) {
      if (import.meta.env.DEV) console.error("Error signing in with Google:", error);
      toast.error(t("auth.googleSignInFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error(t("auth.enterEmailPassword"));
      return;
    }

    if (mode === "signup") {
      if (password !== confirmPassword) {
        toast.error(t("auth.passwordsMismatch"));
        return;
      }
      if (password.length < 6) {
        toast.error(t("auth.passwordTooShort"));
        return;
      }
    }

    setIsLoading(true);
    try {
      if (mode === "login") {
        await signInWithEmail(email, password);
        toast.success(t("auth.signInSuccess"));
        onClose();
      } else {
        await signUpWithEmail(email, password);
        toast.success(t("auth.signUpSuccess"));
        onClose();
      }
    } catch (error: any) {
      if (import.meta.env.DEV) console.error("Auth error:", error);
      if (error.message?.includes("Invalid login credentials")) {
        toast.error(t("auth.invalidCredentials"));
      } else if (error.message?.includes("User already registered")) {
        toast.error(t("auth.emailAlreadyRegistered"));
      } else if (error.message?.includes("Email not confirmed")) {
        toast.error(t("auth.emailNotConfirmed"));
      } else {
        toast.error(mode === "login" ? t("auth.signInFailed") : t("auth.signUpFailed"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
  };

  const switchMode = (newMode: "login" | "signup") => {
    setMode(newMode);
    resetForm();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Backdrop with safe area support */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-[200] 
                      flex items-center justify-center p-4
                      safe-area-inset"
            onClick={handleBackdropClick}
          >
            {/* Modal Container - Mobile Optimized */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
                mass: 0.8,
              }}
              className="w-full max-w-md max-h-[85svh] overflow-hidden 
                        bg-gradient-to-br from-gray-900/95 to-black/95 
                        border border-white/15 rounded-2xl shadow-2xl
                        flex flex-col
                        backdrop-blur-sm"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Sticky Header */}
              <div
                className="sticky top-0 bg-gradient-to-b from-gray-900/95 to-black/95 
                            backdrop-blur-sm z-10 border-b border-white/10 px-5 py-4
                            flex items-center justify-between shrink-0"
              >
                <h2 className="text-lg font-bold text-white truncate">
                  {mode === "login" ? t("auth.welcomeBack") : t("auth.createAccount")}
                </h2>
                <button
                  onClick={onClose}
                  className="flex-shrink-0 w-8 h-8 flex items-center justify-center 
                           text-white/60 hover:text-white hover:bg-white/10 
                           rounded-full transition-colors min-touch"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto px-5 py-4 safari-scroll">
                <div className="space-y-5">
                  {/* Google Sign In Button */}
                  <button
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-3 
                             bg-white text-gray-800 font-medium py-3 px-4 
                             rounded-xl hover:bg-gray-50 active:bg-gray-100 
                             transition-colors disabled:opacity-50 
                             min-touch active:scale-[0.98]"
                  >
                    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span className="text-sm truncate">{t("auth.signInWithGoogle")}</span>
                  </button>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/20"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="px-4 bg-gradient-to-br from-gray-900 to-black text-white/60 text-sm">
                        {t("auth.or")}
                      </span>
                    </div>
                  </div>

                  {/* Email Form */}
                  <form onSubmit={handleEmailSubmit} className="space-y-4">
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">{t("auth.emailAddress")}</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com"
                          className="w-full bg-white/10 border border-white/20 rounded-lg 
                                   py-3 pl-10 pr-4 text-base text-white 
                                   placeholder:text-white/40 
                                   focus:outline-none focus:ring-2 focus:ring-accent-orange/50 
                                   focus:border-accent-orange
                                   ios-input-fix min-touch"
                          autoComplete="email"
                          inputMode="email"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">{t("auth.password")}</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-white/10 border border-white/20 rounded-lg 
                                   py-3 px-4 pr-12 text-base text-white 
                                   placeholder:text-white/40 
                                   focus:outline-none focus:ring-2 focus:ring-accent-orange/50 
                                   focus:border-accent-orange
                                   ios-input-fix min-touch"
                          autoComplete={mode === "login" ? "current-password" : "new-password"}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 
                                   text-white/40 hover:text-white/60 p-1 min-touch"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {mode === "signup" && (
                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">
                          {t("auth.confirmPassword")}
                        </label>
                        <input
                          type={showPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-white/10 border border-white/20 rounded-lg 
                                   py-3 px-4 text-base text-white 
                                   placeholder:text-white/40 
                                   focus:outline-none focus:ring-2 focus:ring-accent-orange/50 
                                   focus:border-accent-orange
                                   ios-input-fix min-touch"
                          autoComplete="new-password"
                        />
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-accent-orange to-accent-orange/90 
                               text-white font-semibold py-3 px-4 rounded-xl 
                               hover:from-accent-orange/90 hover:to-accent-orange/80 
                               active:from-accent-orange/80 active:to-accent-orange/70 
                               transition-all disabled:opacity-50 
                               min-touch active:scale-[0.98]"
                    >
                      {isLoading ? t("auth.processing") : mode === "login" ? t("auth.signIn") : t("auth.signUp")}
                    </button>
                  </form>

                  {/* Switch Mode */}
                  <p className="text-center text-white/60 text-sm px-2">
                    {mode === "login" ? (
                      <>
                        {t("auth.noAccount")}{" "}
                        <button
                          onClick={() => switchMode("signup")}
                          className="text-accent-orange hover:underline font-medium min-touch"
                        >
                          {t("auth.signUp")}
                        </button>
                      </>
                    ) : (
                      <>
                        {t("auth.haveAccount")}{" "}
                        <button
                          onClick={() => switchMode("login")}
                          className="text-accent-orange hover:underline font-medium min-touch"
                        >
                          {t("auth.signIn")}
                        </button>
                      </>
                    )}
                  </p>
                </div>
              </div>

              {/* Bottom safe area spacer */}
              <div className="h-[env(safe-area-inset-bottom,12px)] shrink-0" />
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
