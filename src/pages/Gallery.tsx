import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { BackgroundDecorations } from "@/components/BackgroundDecorations";
import { Footer } from "@/components/Footer";
import { GalleryViewer } from "@/components/gallery/GalleryViewer";
import { GalleryThumbnails } from "@/components/gallery/GalleryThumbnails";
import { GalleryUpload } from "@/components/gallery/GalleryUpload";
import { useGallery } from "@/hooks/useGallery";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Upload, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function Gallery() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { items, isLoading, isAdmin, refetch } = useGallery();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showUpload, setShowUpload] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 🔥 CRITICAL FIX: Scroll to top when page loads
  useEffect(() => {
    // Scroll to top immediately
    window.scrollTo(0, 0);

    // Also scroll to top when component mounts (double safety)
    const timer = setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth", // Optional: adds smooth scrolling
      });
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Reset selected index when items change
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
            <Link
              to="/"
              onClick={() => window.scrollTo(0, 0)} // Also fix back button
            >
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Photo Gallery</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Browse through our collection of photos and videos
            </p>
          </motion.div>
        </div>

        {/* Gallery Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : items.length === 0 ? (
          <div className="container mx-auto px-4 py-20 text-center">
            <p className="text-muted-foreground text-lg">No photos in the gallery yet</p>
            {isAdmin && (
              <Button onClick={() => setShowUpload(true)} className="mt-4 gap-2">
                <Upload className="h-4 w-4" />
                Upload First Photo
              </Button>
            )}
          </div>
        ) : (
          <div className="container mx-auto px-4 pb-8">
            {/* Main Image Viewer */}
            <div className="mb-8">
              <GalleryViewer
                item={selectedItem}
                isAdmin={isAdmin}
                onDelete={() => {
                  refetch();
                  // If we deleted the selected item, move to previous or reset
                  if (selectedIndex > 0) {
                    setSelectedIndex((prev) => prev - 1);
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
        )}
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
          />
        )}
      </AnimatePresence>
    </div>
  );
}
