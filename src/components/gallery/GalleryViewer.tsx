import { motion } from "framer-motion";
import { useState } from "react";
import { Trash2, Loader2, Play, AlertCircle, ExternalLink } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

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
        className="relative aspect-video bg-black/5 dark:bg-white/5 rounded-2xl overflow-hidden mb-6 shadow-xl border"
      >
        {/* Storage badge */}
        {item.is_storage_only && (
          <Badge
            variant="outline"
            className="absolute top-4 left-4 z-20 bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-300"
          >
            From Storage
          </Badge>
        )}

        {/* Media Error State */}
        {mediaError ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-destructive/10">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <p className="text-destructive font-medium mb-2">Failed to load media</p>
            <p className="text-muted-foreground text-sm mb-4 text-center px-4">{item.file_url}</p>
            <div className="flex gap-2">
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
          <video
            src={item.file_url}
            controls
            className="w-full h-full object-contain bg-black"
            poster={item.thumbnail_url || undefined}
            onError={handleMediaError}
          />
        ) : (
          <img
            src={item.file_url}
            alt={item.title || "Gallery image"}
            className="w-full h-full object-contain"
            onError={handleMediaError}
          />
        )}

        {/* Title and Description Overlay */}
        {(item.title || item.description) && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6">
            {item.title && <h3 className="text-white text-xl font-semibold mb-1">{item.title}</h3>}
            {item.description && <p className="text-white/90 text-sm">{item.description}</p>}
            {/* File info */}
            <div className="flex items-center gap-4 mt-2 text-white/70 text-xs">
              <span>{item.media_type.toUpperCase()}</span>
              {item.is_storage_only && (
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  Storage Import
                </span>
              )}
              {item.created_at && <span>{new Date(item.created_at).toLocaleDateString()}</span>}
            </div>
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
          <div className="absolute top-4 right-16 bg-black/50 px-2 py-1 rounded flex items-center gap-1">
            <Play className="h-3 w-3 text-white" />
            <span className="text-white text-xs">{t("gallery.video")}</span>
          </div>
        )}

        {/* Open in new tab button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute bottom-4 right-4 opacity-60 hover:opacity-100 z-20 bg-white/20 hover:bg-white/30"
          onClick={openInNewTab}
          title="Open in new tab"
        >
          <ExternalLink className="h-4 w-4 text-white" />
        </Button>
      </motion.div>

      {/* Debug info (development only) */}
      {process.env.NODE_ENV === "development" && (
        <div className="text-xs text-muted-foreground p-3 bg-muted/30 rounded-lg mb-4">
          <div className="font-mono break-all mb-1">ID: {item.id}</div>
          <div className="font-mono break-all mb-1">Path: {item.file_path}</div>
          <div className="font-mono break-all">URL: {item.file_url}</div>
          {item.is_storage_only && <div className="text-blue-500 mt-1">Storage-only item</div>}
        </div>
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {item.is_storage_only ? t("gallery.deleteFromStorage") : t("gallery.deleteConfirmTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {item.is_storage_only ? (
                <>
                  This item is only stored in Supabase Storage.
                  <br />
                  It will be removed from storage but no database record exists.
                </>
              ) : (
                t("gallery.deleteConfirmDesc")
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("gallery.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("gallery.deleting")}
                </>
              ) : (
                t("gallery.delete")
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
