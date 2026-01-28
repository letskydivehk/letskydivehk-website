import { motion } from "framer-motion";
import { useState } from "react";
import { Trash2, Loader2, Play, ExternalLink } from "lucide-react";
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

interface GalleryViewerProps {
  item: GalleryItem | null;
  isAdmin: boolean;
  onDelete: () => void;
}

export function GalleryViewer({ item, isAdmin, onDelete }: GalleryViewerProps) {
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
    console.error("Failed to load media:", item.file_url);
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
      <motion.div
        key={item.id}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative bg-black/5 dark:bg-white/5 rounded-2xl overflow-hidden shadow-xl border min-h-[60vh]"
      >
        {/* Media Error State */}
        {mediaError ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-destructive/10 p-8">
            <p className="text-destructive font-medium mb-2">Failed to load image</p>
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
        ) : item.media_type === "video" ? (
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
              alt={item.title || "Gallery image"}
              className="max-w-full max-h-[70vh] object-contain"
              onError={handleMediaError}
            />
          </div>
        )}

        {/* Title and Description Overlay */}
        {(item.title || item.description) && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6">
            {item.title && <h3 className="text-white text-xl font-semibold mb-1">{item.title}</h3>}
            {item.description && <p className="text-white/90 text-sm">{item.description}</p>}
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
            <Play className="h-4 w-4 text-white" />
            <span className="text-white text-sm">{t("gallery.video")}</span>
          </div>
        )}
      </motion.div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("gallery.deleteConfirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>{t("gallery.deleteConfirmDesc")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("gallery.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              {t("gallery.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
