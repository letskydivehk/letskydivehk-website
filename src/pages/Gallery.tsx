import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { BackgroundDecorations } from "@/components/BackgroundDecorations";
import { Footer } from "@/components/Footer";
import { GalleryViewer } from "@/components/gallery/GalleryViewer";
import { GalleryThumbnails } from "@/components/gallery/GalleryThumbnails";
import { GalleryUpload } from "@/components/gallery/GalleryUpload";
import { useGallery, GalleryCategory } from "@/hooks/useGallery";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Upload, Loader2, RefreshCw, Camera, Video, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
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
  const [showUpload, setShowUpload] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Determine current category based on tabs
  const currentCategory: GalleryCategory = activeTab === "photos" ? "photos" : videoSubTab;
  
  const { items, isLoading, isAdmin, refetch } = useGallery(currentCategory);

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "instant" });
    }, 10);
    return () => clearTimeout(timer);
  }, []);

  // Reset selected index when items or category changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [currentCategory]);

  useEffect(() => {
    if (items.length > 0 && selectedIndex >= items.length) {
      setSelectedIndex(0);
    }
  }, [items.length, selectedIndex]);

  const selectedItem = items[selectedIndex] || null;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      toast.success("Gallery refreshed");
    } catch (error) {
      toast.error("Failed to refresh gallery");
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <BackgroundDecorations />
      <main className="relative z-10">
        {/* Header */}
        <div className="container mx-auto px-4 pt-8 pb-4">
          <div className="flex items-center justify-between">
            <Link to="/">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>

            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing} className="gap-2">
                {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                Refresh
              </Button>

              {isAdmin && (
                <Button onClick={() => setShowUpload(true)} className="gap-2 bg-primary hover:bg-primary/90">
                  <Upload className="h-4 w-4" />
                  Upload
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Gallery Title */}
        <div className="container mx-auto px-4 py-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Gallery</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Browse through our collection of photos and videos
            </p>
          </motion.div>
        </div>

        {/* Main Tabs: Photos / Videos */}
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as GalleryTab)} className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="photos" className="gap-2">
                <Camera className="h-4 w-4" />
                Photos
              </TabsTrigger>
              <TabsTrigger value="videos" className="gap-2">
                <Video className="h-4 w-4" />
                Videos
              </TabsTrigger>
            </TabsList>

            {/* Photos Tab */}
            <TabsContent value="photos">
              <GallerySection
                items={items}
                isLoading={isLoading}
                isAdmin={isAdmin}
                selectedIndex={selectedIndex}
                setSelectedIndex={setSelectedIndex}
                selectedItem={selectedItem}
                refetch={refetch}
                onUpload={() => setShowUpload(true)}
              />
            </TabsContent>

            {/* Videos Tab with Sub-tabs */}
            <TabsContent value="videos">
              <Tabs value={videoSubTab} onValueChange={(v) => setVideoSubTab(v as VideoSubTab)} className="w-full">
                <TabsList className="grid w-full max-w-lg mx-auto grid-cols-2 mb-6">
                  <TabsTrigger value="daily_videos" className="gap-2">
                    <Video className="h-4 w-4" />
                    Daily Videos
                  </TabsTrigger>
                  <TabsTrigger value="aff_videos" className="gap-2">
                    <GraduationCap className="h-4 w-4" />
                    AFF Course Videos
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="daily_videos">
                  <GallerySection
                    items={items}
                    isLoading={isLoading}
                    isAdmin={isAdmin}
                    selectedIndex={selectedIndex}
                    setSelectedIndex={setSelectedIndex}
                    selectedItem={selectedItem}
                    refetch={refetch}
                    onUpload={() => setShowUpload(true)}
                    emptyMessage="No daily videos yet"
                  />
                </TabsContent>

                <TabsContent value="aff_videos">
                  <GallerySection
                    items={items}
                    isLoading={isLoading}
                    isAdmin={isAdmin}
                    selectedIndex={selectedIndex}
                    setSelectedIndex={setSelectedIndex}
                    selectedItem={selectedItem}
                    refetch={refetch}
                    onUpload={() => setShowUpload(true)}
                    emptyMessage="No AFF course videos yet"
                  />
                </TabsContent>
              </Tabs>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />

      {/* Upload Modal */}
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

// Extracted gallery section component for reuse
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
  emptyMessage = "No items in this section yet",
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
            Upload First Item
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="pb-8">
      {/* Main Image/Video Viewer */}
      <div className="mb-8">
        <GalleryViewer
          item={selectedItem}
          isAdmin={isAdmin}
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

      {/* Thumbnail Gallery at Bottom */}
      <div className="mt-8 pt-8 border-t">
        <GalleryThumbnails items={items} selectedIndex={selectedIndex} onSelect={setSelectedIndex} />
      </div>
    </div>
  );
}
