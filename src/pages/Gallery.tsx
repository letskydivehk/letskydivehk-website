import { SEO } from "@/components/SEO";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { BackgroundDecorations } from "@/components/BackgroundDecorations";
import { Footer } from "@/components/Footer";
import { PageNavbar } from "@/components/PageNavbar";
import { GalleryViewer } from "@/components/gallery/GalleryViewer";
import { GalleryThumbnails } from "@/components/gallery/GalleryThumbnails";
import { GalleryUpload } from "@/components/gallery/GalleryUpload";
import { useGallery, GalleryCategory } from "@/hooks/useGallery";
import { useAuth } from "@/contexts/AuthContext";
import { Upload, Loader2, RefreshCw, Camera, Video, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type GalleryTab = "photos" | "videos";
type VideoSubTab = "daily_videos" | "aff_videos";

export default function Gallery() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<GalleryTab>("photos");
  const [videoSubTab, setVideoSubTab] = useState<VideoSubTab>("daily_videos");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState(0);
  const [showUpload, setShowUpload] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const currentCategory: GalleryCategory = activeTab === "photos" ? "photos" : videoSubTab;
  const { items, isLoading, isAdmin, refetch } = useGallery(currentCategory);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "instant" });
    }, 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setSelectedIndex(0);
    setSlideDirection(0);
  }, [currentCategory]);

  useEffect(() => {
    if (items.length > 0 && selectedIndex >= items.length) {
      setSelectedIndex(0);
    }
  }, [items.length, selectedIndex]);

  const handleSelectIndex = (newIndex: number) => {
    setSlideDirection(newIndex > selectedIndex ? 1 : -1);
    setSelectedIndex(newIndex);
  };

  const selectedItem = items[selectedIndex] || null;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      toast.success(t("gallery.refreshSuccess"));
    } catch (error) {
      toast.error(t("gallery.refreshError"));
    } finally {
      setIsRefreshing(false);
    }
  };

return (
    <div className="min-h-screen bg-background text-foreground relative">
      <SEO title={t("gallery.title")} description={t("gallery.subtitle")} path="/gallery" />
      
      {/* Custom dark navbar wrapper */}
      <div className="fixed top-0 left-0 right-0 z-50">
        {/* Dark background layer */}
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md border-b border-white/10" />
        
        {/* Content layer */}
        <div className="relative container mx-auto px-4">
          <PageNavbar />
        </div>
      </div>
      
      <BackgroundDecorations />
      
      <main className="relative z-10 pt-24">
        <div className="container mx-auto px-4 pt-8 pb-4">
          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing} className="gap-2">
              {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              {t("gallery.refresh")}
            </Button>

            {isAdmin && (
              <Button onClick={() => setShowUpload(true)} className="gap-2 bg-primary hover:bg-primary/90">
                <Upload className="h-4 w-4" />
                {t("gallery.upload")}
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
)
        {/* Gallery Title */}
        <div className="container mx-auto px-4 py-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("gallery.title")}</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">{t("gallery.subtitle")}</p>
          </motion.div>
        </div>

        {/* Main Tabs */}
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as GalleryTab)} className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="photos" className="gap-2">
                <Camera className="h-4 w-4" />
                {t("gallery.photos")}
              </TabsTrigger>
              <TabsTrigger value="videos" className="gap-2">
                <Video className="h-4 w-4" />
                {t("gallery.videos")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="photos">
              <GallerySection
                items={items}
                isLoading={isLoading}
                isAdmin={isAdmin}
                selectedIndex={selectedIndex}
                setSelectedIndex={handleSelectIndex}
                selectedItem={selectedItem}
                refetch={refetch}
                onUpload={() => setShowUpload(true)}
                emptyMessage={t("gallery.empty")}
                slideDirection={slideDirection}
                t={t}
              />
            </TabsContent>

            <TabsContent value="videos">
              <Tabs value={videoSubTab} onValueChange={(v) => setVideoSubTab(v as VideoSubTab)} className="w-full">
                <TabsList className="grid w-full max-w-lg mx-auto grid-cols-2 mb-6">
                  <TabsTrigger value="daily_videos" className="gap-2">
                    <Video className="h-4 w-4" />
                    {t("gallery.dailyVideos")}
                  </TabsTrigger>
                  <TabsTrigger value="aff_videos" className="gap-2">
                    <GraduationCap className="h-4 w-4" />
                    {t("gallery.affVideos")}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="daily_videos">
                  <GallerySection
                    items={items}
                    isLoading={isLoading}
                    isAdmin={isAdmin}
                    selectedIndex={selectedIndex}
                    setSelectedIndex={handleSelectIndex}
                    selectedItem={selectedItem}
                    refetch={refetch}
                    onUpload={() => setShowUpload(true)}
                    emptyMessage={t("gallery.noDailyVideos")}
                    slideDirection={slideDirection}
                    t={t}
                  />
                </TabsContent>

                <TabsContent value="aff_videos">
                  <GallerySection
                    items={items}
                    isLoading={isLoading}
                    isAdmin={isAdmin}
                    selectedIndex={selectedIndex}
                    setSelectedIndex={handleSelectIndex}
                    selectedItem={selectedItem}
                    refetch={refetch}
                    onUpload={() => setShowUpload(true)}
                    emptyMessage={t("gallery.noAffVideos")}
                    slideDirection={slideDirection}
                    t={t}
                  />
                </TabsContent>
              </Tabs>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />

      <AnimatePresence>
        {showUpload && (
          <GalleryUpload
            onClose={() => setShowUpload(false)}
            onSuccess={() => {
              setShowUpload(false);
              refetch();
            }}
            defaultCategory={currentCategory}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

interface GallerySectionProps {
  items: any[];
  isLoading: boolean;
  isAdmin: boolean;
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  selectedItem: any;
  refetch: () => void;
  onUpload: () => void;
  emptyMessage?: string;
  slideDirection?: number;
  t: (key: string) => string;
}

function GallerySection({
  items,
  isLoading,
  isAdmin,
  selectedIndex,
  setSelectedIndex,
  selectedItem,
  refetch,
  onUpload,
  emptyMessage,
  slideDirection = 0,
  t,
}: GallerySectionProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-muted-foreground text-lg">{emptyMessage}</p>
        {isAdmin && (
          <Button onClick={onUpload} className="mt-4 gap-2">
            <Upload className="h-4 w-4" />
            {t("gallery.uploadFirst")}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="pb-8">
      <div className="mb-8">
        <GalleryViewer
          item={selectedItem}
          isAdmin={isAdmin}
          direction={slideDirection}
          onDelete={() => {
            refetch();
            if (selectedIndex > 0) {
              setSelectedIndex(selectedIndex - 1);
            } else {
              setSelectedIndex(0);
            }
          }}
        />
      </div>
      <div className="mt-8 pt-8 border-t">
        <GalleryThumbnails items={items} selectedIndex={selectedIndex} onSelect={setSelectedIndex} />
      </div>
    </div>
  );
}
