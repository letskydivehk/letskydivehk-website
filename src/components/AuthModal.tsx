import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Eye, EyeOff, Check, AlertCircle, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Password criteria checker
function PasswordCriteria({ password }: { password: string }) {
  const { t } = useLanguage();
  const criteria = [
    { key: "auth.criteria.length", met: password.length >= 8 },
    { key: "auth.criteria.lowercase", met: /[a-z]/.test(password) },
    { key: "auth.criteria.uppercase", met: /[A-Z]/.test(password) },
    { key: "auth.criteria.number", met: /[0-9]/.test(password) },
  ];

  return (
    <div className="space-y-1.5 mt-2">
      {criteria.map((c) => (
        <div key={c.key} className="flex items-center gap-2 text-xs">
          {c.met ? (
            <Check className="w-3.5 h-3.5 text-green-400 shrink-0" />
          ) : (
            <AlertCircle className="w-3.5 h-3.5 text-white/30 shrink-0" />
          )}
          <span className={c.met ? "text-green-400" : "text-white/40"}>
            {t(c.key)}
          </span>
        </div>
      ))}
    </div>
  );
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { user, signInWithGoogle, signInWithEmail, signUpWithEmail, resetPassword } = useAuth();
  const { t } = useLanguage();
  const [mode, setMode] = useState<"login" | "signup" | "reset">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Close modal when user becomes authenticated
  useEffect(() => {
    if (user && isOpen) {
      onClose();
    }
  }, [user, isOpen, onClose]);

  // Prevent background scrolling on mobile — use overflow:hidden only (no position:fixed)
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.overflow = "hidden";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.touchAction = "none";

      return () => {
        document.body.style.overflow = "";
        document.body.style.top = "";
        document.body.style.position = "";
        document.body.style.width = "";
        document.body.style.touchAction = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch (error: any) {
      if (import.meta.env.DEV) console.error("Google Sign-In error:", error);
      if (error.message?.includes("popup blocked") || error.message?.includes("third-party cookies")) {
        toast.error(t("auth.allowCookies"));
      } else if (error.message?.includes("access_denied")) {
        toast.error(t("auth.accessDenied"));
      } else {
        toast.error(error.message || t("auth.googleSignInFailed"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) return t("auth.passwordMinLength");
    if (!/[a-z]/.test(password)) return t("auth.passwordLowercase");
    if (!/[A-Z]/.test(password)) return t("auth.passwordUppercase");
    if (!/[0-9]/.test(password)) return t("auth.passwordNumber");
    return null;
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error(t("auth.enterEmailPassword"));
      return;
    }

    if (mode === "signup") {
      const passwordError = validatePassword(password);
      if (passwordError) {
        toast.error(passwordError);
        return;
      }
      if (password !== confirmPassword) {
        toast.error(t("auth.passwordsMismatch"));
        return;
      }
    }

    setIsLoading(true);
    try {
      if (mode === "login") {
        await signInWithEmail(email, password);
        toast.success(t("auth.signInSuccess"));
      } else {
        await signUpWithEmail(email, password);
        toast.success(t("auth.signUpSuccess"));
        switchMode("login");
      }
    } catch (error: any) {
      toast.error(error.message || t("auth.signInFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error(t("auth.enterEmail"));
      return;
    }
    setIsLoading(true);
    try {
      await resetPassword(email);
      toast.success(t("auth.resetEmailSent"));
      switchMode("login");
    } catch (error: any) {
      toast.error(error.message || t("auth.resetFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = (newMode: "login" | "signup" | "reset") => {
    setMode(newMode);
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    if (newMode !== "reset") setEmail("");
  };

  const getTitle = () => {
    if (mode === "reset") return t("auth.resetPassword");
    return mode === "login" ? t("auth.welcomeBack") : t("auth.createAccount");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200] 
                    flex items-center justify-center p-4
                    overscroll-none"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-md max-h-[85svh] flex flex-col
                      bg-gradient-to-br from-gray-900 to-black
                      border border-white/20 rounded-2xl shadow-2xl
                      overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 p-4 border-b border-white/10
                            bg-gradient-to-b from-gray-900 to-black
                            flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                {mode === "reset" && (
                  <button
                    onClick={() => switchMode("login")}
                    className="w-8 h-8 flex items-center justify-center
                             text-white/60 hover:text-white rounded-full
                             hover:bg-white/10 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                )}
                <h2 className="text-lg font-bold text-white">{getTitle()}</h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center
                         text-white/60 hover:text-white rounded-full
                         hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content — smooth momentum scrolling */}
            <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-4"
                 style={{ WebkitOverflowScrolling: "touch" }}>

              {/* Reset Password View */}
              {mode === "reset" && (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <p className="text-white/60 text-sm">{t("auth.resetDescription")}</p>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">{t("auth.emailAddress")}</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full bg-white/10 border border-white/20 rounded-lg
                                 py-3 pl-10 pr-4 text-white placeholder:text-white/40
                                 focus:outline-none focus:ring-2 focus:ring-blue-500
                                 min-h-[44px] text-base"
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white font-semibold py-3
                             rounded-lg hover:bg-blue-700 transition-colors
                             disabled:opacity-50 min-h-[44px]"
                  >
                    {isLoading ? t("auth.processing") : t("auth.sendResetLink")}
                  </button>
                </form>
              )}

              {/* Login / Signup View */}
              {mode !== "reset" && (
                <>
                  {/* Google Button */}
                  <button
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-3
                             bg-white text-gray-800 font-medium py-3 px-4
                             rounded-lg hover:bg-gray-100 transition-colors
                             disabled:opacity-50 min-h-[44px]"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    <span>{t("auth.signInWithGoogle")}</span>
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
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com"
                          className="w-full bg-white/10 border border-white/20 rounded-lg
                                   py-3 pl-10 pr-4 text-white placeholder:text-white/40
                                   focus:outline-none focus:ring-2 focus:ring-blue-500
                                   min-h-[44px] text-base"
                          required
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
                                   py-3 px-4 pr-12 text-white placeholder:text-white/40
                                   focus:outline-none focus:ring-2 focus:ring-blue-500
                                   min-h-[44px] text-base"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2
                                   text-white/40 hover:text-white/60 p-1"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                      {/* Password criteria — shown only during signup */}
                      {mode === "signup" && password.length > 0 && (
                        <PasswordCriteria password={password} />
                      )}
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
                                   py-3 px-4 text-white placeholder:text-white/40
                                   focus:outline-none focus:ring-2 focus:ring-blue-500
                                   min-h-[44px] text-base"
                          required
                        />
                        {confirmPassword.length > 0 && password !== confirmPassword && (
                          <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {t("auth.passwordsMismatch")}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Forgot Password Link — login mode only */}
                    {mode === "login" && (
                      <div className="text-right">
                        <button
                          type="button"
                          onClick={() => switchMode("reset")}
                          className="text-blue-400 hover:text-blue-300 text-sm underline"
                        >
                          {t("auth.forgotPassword")}
                        </button>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-blue-600 text-white font-semibold py-3
                               rounded-lg hover:bg-blue-700 transition-colors
                               disabled:opacity-50 min-h-[44px]"
                    >
                      {isLoading ? t("auth.processing") : mode === "login" ? t("auth.signIn") : t("auth.signUp")}
                    </button>
                  </form>

                  {/* Switch Mode */}
                  <p className="text-center text-white/60 text-sm">
                    {mode === "login" ? t("auth.noAccount") : t("auth.haveAccount")}{" "}
                    <button
                      onClick={() => switchMode(mode === "login" ? "signup" : "login")}
                      className="text-blue-400 hover:text-blue-300 font-medium underline"
                    >
                      {mode === "login" ? t("auth.signUp") : t("auth.signIn")}
                    </button>
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
