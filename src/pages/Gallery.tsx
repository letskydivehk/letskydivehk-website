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
import {
  ArrowLeft,
  Upload,
  Loader2,
  RefreshCw,
  Database,
  HardDrive,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export default function Gallery() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { items, isLoading, isAdmin, refetch } = useGallery();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showUpload, setShowUpload] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  // Reset selected index when items change
  useEffect(() => {
    if (items.length > 0 && selectedIndex >= items.length) {
      setSelectedIndex(0);
    }
  }, [items.length, selectedIndex]);

  const selectedItem = items[selectedIndex] || null;

  // Filter items based on active tab
  const filteredItems =
    activeTab === "all"
      ? items
      : activeTab === "database"
        ? items.filter((item) => !item.is_storage_only)
        : items.filter((item) => item.is_storage_only);

  // Navigation handlers
  const handleNext = () => {
    if (selectedIndex < filteredItems.length - 1) {
      setSelectedIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (selectedIndex > 0) {
      setSelectedIndex((prev) => prev - 1);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      toast.success("Gallery refreshed successfully");
    } catch (error) {
      toast.error("Failed to refresh gallery");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Sync selected index with filtered items
  useEffect(() => {
    if (filteredItems.length > 0 && selectedIndex >= filteredItems.length) {
      setSelectedIndex(0);
    }
  }, [filteredItems.length, selectedIndex]);

  // Debug function
  const debugGallery = () => {
    console.log("=== GALLERY DEBUG INFO ===");
    console.log("Total items:", items.length);
    console.log("Database items:", items.filter((item) => !item.is_storage_only).length);
    console.log("Storage items:", items.filter((item) => item.is_storage_only).length);
    console.log("Filtered items:", filteredItems.length);
    console.log("Selected index:", selectedIndex);

    if (selectedItem) {
      console.log("Selected item:", selectedItem);
      console.log("Selected item URL:", selectedItem.file_url);
      console.log("Is storage-only:", selectedItem.is_storage_only);
    }

    // Test first few URLs
    items.slice(0, 3).forEach((item, index) => {
      console.log(`Item ${index}:`, {
        id: item.id,
        title: item.title,
        url: item.file_url,
        storage: item.is_storage_only,
      });
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <BackgroundDecorations />
      <main className="relative z-10">
        {/* Header */}
        <div className="container mx-auto px-4 pt-8 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  {t("gallery.backToHome")}
                </Button>
              </Link>

              {/* Debug button (development only) */}
              {process.env.NODE_ENV === "development" && (
                <Button variant="outline" size="sm" onClick={debugGallery} className="gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Debug
                </Button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing} className="gap-2">
                {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                {isRefreshing ? "Refreshing..." : "Refresh"}
              </Button>

              {isAdmin && (
                <Button onClick={() => setShowUpload(true)} className="gap-2 bg-primary hover:bg-primary/90">
                  <Upload className="h-4 w-4" />
                  {t("gallery.upload")}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Gallery Title */}
        <div className="container mx-auto px-4 py-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              {t("gallery.badge")}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("gallery.title")}</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">{t("gallery.subtitle")}</p>
          </motion.div>
        </div>

        {/* Stats */}
        {!isLoading && items.length > 0 && (
          <div className="container mx-auto px-4 mb-6">
            <div className="flex flex-wrap gap-4 items-center justify-center">
              <Badge variant="outline" className="gap-2">
                <Database className="h-3 w-3" />
                {items.filter((item) => !item.is_storage_only).length} from Database
              </Badge>
              <Badge variant="outline" className="gap-2">
                <HardDrive className="h-3 w-3" />
                {items.filter((item) => item.is_storage_only).length} from Storage
              </Badge>
              <Badge variant="outline" className="gap-2">
                <Eye className="h-3 w-3" />
                {items.length} Total Items
              </Badge>
            </div>
          </div>
        )}

        {/* Gallery Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading gallery...</p>
              <p className="text-sm text-muted-foreground mt-2">Fetching from Supabase Database & Storage</p>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="container mx-auto px-4 py-20 text-center">
            <div className="max-w-md mx-auto">
              <HardDrive className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Gallery is Empty</h3>
              <p className="text-muted-foreground mb-6">
                No items found in database or storage. Upload photos/videos or check if your Supabase storage has files.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {isAdmin && (
                  <Button onClick={() => setShowUpload(true)} className="gap-2">
                    <Upload className="h-4 w-4" />
                    {t("gallery.uploadFirst")}
                  </Button>
                )}
                <Button variant="outline" onClick={handleRefresh} className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Check Storage Again
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="container mx-auto px-4 pb-8">
            {/* Filter Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
                <TabsTrigger value="all" className="gap-2">
                  All Items ({items.length})
                </TabsTrigger>
                <TabsTrigger value="database" className="gap-2">
                  <Database className="h-3 w-3" />
                  Database ({items.filter((item) => !item.is_storage_only).length})
                </TabsTrigger>
                <TabsTrigger value="storage" className="gap-2">
                  <HardDrive className="h-3 w-3" />
                  Storage ({items.filter((item) => item.is_storage_only).length})
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Selected Item Viewer */}
            <div className="relative mb-8">
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

              {/* Navigation buttons */}
              {filteredItems.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    className={cn(
                      "absolute left-4 top-1/2 transform -translate-y-1/2 z-20",
                      selectedIndex === 0 && "opacity-50 cursor-not-allowed",
                    )}
                    onClick={handlePrev}
                    disabled={selectedIndex === 0}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    className={cn(
                      "absolute right-4 top-1/2 transform -translate-y-1/2 z-20",
                      selectedIndex === filteredItems.length - 1 && "opacity-50 cursor-not-allowed",
                    )}
                    onClick={handleNext}
                    disabled={selectedIndex === filteredItems.length - 1}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </>
              )}

              {/* Viewer info */}
              {selectedItem && (
                <div className="flex justify-center items-center gap-4 mt-4 text-sm text-muted-foreground">
                  <span>
                    {selectedIndex + 1} of {filteredItems.length}
                  </span>
                  {selectedItem.is_storage_only ? (
                    <Badge variant="secondary" className="gap-1">
                      <HardDrive className="h-3 w-3" />
                      Storage Import
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="gap-1">
                      <Database className="h-3 w-3" />
                      Database
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {/* Thumbnail Scroll Gallery */}
            {filteredItems.length > 0 ? (
              <GalleryThumbnails items={filteredItems} selectedIndex={selectedIndex} onSelect={setSelectedIndex} />
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No items found in the "{activeTab}" category.</p>
                <Button variant="outline" onClick={() => setActiveTab("all")} className="mt-4">
                  View All Items
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Debug panel (development only) */}
        {process.env.NODE_ENV === "development" && items.length > 0 && (
          <div className="container mx-auto px-4 mt-8 p-4 border rounded-lg bg-muted/30">
            <h4 className="font-semibold mb-2">Debug Information</h4>
            <div className="text-sm space-y-1">
              <div>Total items: {items.length}</div>
              <div>Database items: {items.filter((item) => !item.is_storage_only).length}</div>
              <div>Storage items: {items.filter((item) => item.is_storage_only).length}</div>
              <div>Selected item URL: {selectedItem?.file_url}</div>
              <div>Selected item ID: {selectedItem?.id}</div>
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
              toast.success("Upload successful!");
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
