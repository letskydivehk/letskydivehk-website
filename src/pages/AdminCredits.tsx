import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Coins, FileText, Loader2, HelpCircle, Plane, GitCompare } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BackgroundDecorations } from "@/components/BackgroundDecorations";
import { Footer } from "@/components/Footer";
import { AdminCreditsPanel } from "@/components/admin/AdminCreditsPanel";
import { AdminBlogPanel } from "@/components/admin/AdminBlogPanel";
import { AdminQuizPanel } from "@/components/admin/AdminQuizPanel";
import { AdminToursPanel } from "@/components/admin/AdminToursPanel";
import { AdminItineraryComparePanel } from "@/components/admin/AdminItineraryComparePanel";

export default function AdminCredits() {
  const { user, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/", { replace: true });
      return;
    }
    const checkRole = async () => {
      const { data } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
      if (!data) {
        navigate("/membership", { replace: true });
        return;
      }
      setIsAdmin(true);
      setCheckingAdmin(false);
    };
    checkRole();
  }, [authLoading, user, navigate]);

  if (authLoading || checkingAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <BackgroundDecorations />

      <main className="relative z-10 pt-8 pb-20">
        <div className="container max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link to="/membership">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Admin Panel
            </h1>
          </div>

          <Tabs defaultValue="credits" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="credits" className="gap-2">
                <Coins className="w-4 h-4" />
                {t("admin.title") || "Credits"}
              </TabsTrigger>
              <TabsTrigger value="blog" className="gap-2">
                <FileText className="w-4 h-4" />
                Blog
              </TabsTrigger>
              <TabsTrigger value="quiz" className="gap-2">
                <HelpCircle className="w-4 h-4" />
                Quiz
              </TabsTrigger>
              <TabsTrigger value="tours" className="gap-2">
                <Plane className="w-4 h-4" />
                Tours
              </TabsTrigger>
            </TabsList>

            <TabsContent value="credits">
              {isAdmin && <AdminCreditsPanel />}
            </TabsContent>

            <TabsContent value="blog">
              {isAdmin && <AdminBlogPanel />}
            </TabsContent>

            <TabsContent value="quiz">
              {isAdmin && <AdminQuizPanel />}
            </TabsContent>

            <TabsContent value="tours">
              {isAdmin && <AdminToursPanel />}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
