import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useState } from "react";
import { Trash2, Loader2, Play, ExternalLink, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { GalleryItem, deleteGalleryItem } from "@/hooks/useGallery";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Helper to check if a gallery item is a YouTube video
function isYouTubeVideo(item: GalleryItem): boolean {
  return item.file_path?.startsWith("youtube:") || item.file_url?.includes("youtube.com/embed");
}

interface GalleryViewerProps {
  item: GalleryItem | null;
  isAdmin: boolean;
  onDelete: () => void;
  direction?: number;
}

export function GalleryViewer({ item, isAdmin, onDelete, direction = 0 }: GalleryViewerProps) {
  const { t } = useLanguage();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [mediaError, setMediaError] = useState(false);

  if (!item) {
    return (
      <div className="aspect-video bg-muted/20 rounded-2xl flex items-center justify-center mb-6">
        <p className="text-muted-foreground">{t("gallery.selectItem")}</p>
      </div>
    );
  }

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteGalleryItem(item.id, item.file_path);
    setIsDeleting(false);
    setShowDeleteDialog(false);

    if (result.success) {
      toast.success(t("gallery.deleteSuccess"));
      onDelete();
    } else {
      toast.error(result.error || t("gallery.deleteError"));
    }
  };

  const handleMediaError = () => {
    setMediaError(true);
  };

  const handleRetry = () => {
    setMediaError(false);
  };

  const openInNewTab = () => {
    window.open(item.file_url, "_blank", "noopener,noreferrer");
  };

   return (
    <>
      <AnimatePresence mode="popLayout" custom={direction}>
        <motion.div
          key={item.id}
          custom={direction}
          variants={{
            enter: (d: number) => ({ opacity: 0, x: (d || 1) > 0 ? 100 : -100, scale: 0.97 }),
            center: { opacity: 1, x: 0, scale: 1 },
            exit: (d: number) => ({ opacity: 0, x: (d || 1) > 0 ? -100 : 100, scale: 0.97 }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: 'spring', stiffness: 200, damping: 28, mass: 0.8 }}
          className="relative bg-black/5 dark:bg-white/5 rounded-2xl overflow-hidden shadow-xl border min-h-[60vh]"
        >
        {/* Media Error State */}
        {mediaError ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-destructive/10 p-8">
            <p className="text-destructive font-medium mb-2">{t("gallery.loadError")}</p>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm" onClick={handleRetry}>
                Retry
              </Button>
              <Button variant="outline" size="sm" onClick={openInNewTab}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Directly
              </Button>
            </div>
          </div>
        ) : item.media_type === "video" && isYouTubeVideo(item) ? (
          // YouTube Video Embed
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-full aspect-video max-h-[70vh]">
              <iframe
                src={item.file_url}
                title={item.title || "YouTube Video"}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full rounded-lg"
              />
            </div>
          </div>
        ) : item.media_type === "video" ? (
          // Regular Video (from Supabase storage)
          <div className="w-full h-full flex items-center justify-center">
            <video
              src={item.file_url}
              controls
              className="w-full h-full max-h-[70vh] object-contain"
              poster={item.thumbnail_url || undefined}
              onError={handleMediaError}
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center p-4">
            <img
              src={item.file_url}
              alt="Gallery image"
              className="max-w-full max-h-[70vh] object-contain"
              onError={handleMediaError}
            />
          </div>
        )}

        {/* Admin Delete Button */}
        {isAdmin && (
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-4 right-4 opacity-80 hover:opacity-100 z-20"
            onClick={() => setShowDeleteDialog(true)}
            disabled={isDeleting}
          >
            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          </Button>
        )}

        {/* Video Play Indicator */}
        {item.media_type === "video" && !mediaError && (
          <div className="absolute top-4 left-4 bg-black/50 px-3 py-2 rounded flex items-center gap-2">
            {isYouTubeVideo(item) ? (
              <Youtube className="h-4 w-4 text-red-500" />
            ) : (
              <Play className="h-4 w-4 text-white" />
            )}
            <span className="text-white text-sm">{isYouTubeVideo(item) ? "YouTube" : "Video"}</span>
          </div>
        )}
      </motion.div>
      </AnimatePresence>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Photo</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this photo? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
