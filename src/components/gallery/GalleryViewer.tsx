import { motion } from 'framer-motion';
import { useState } from 'react';
import { Trash2, Loader2, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { GalleryItem, deleteGalleryItem } from '@/hooks/useGallery';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface GalleryViewerProps {
  item: GalleryItem | null;
  isAdmin: boolean;
  onDelete: () => void;
}

export function GalleryViewer({ item, isAdmin, onDelete }: GalleryViewerProps) {
  const { t } = useLanguage();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  if (!item) {
    return (
      <div className="aspect-video bg-muted/20 rounded-2xl flex items-center justify-center mb-6">
        <p className="text-muted-foreground">{t('gallery.selectItem')}</p>
      </div>
    );
  }

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteGalleryItem(item.id, item.file_path);
    setIsDeleting(false);
    setShowDeleteDialog(false);

    if (result.success) {
      toast.success(t('gallery.deleteSuccess'));
      onDelete();
    } else {
      toast.error(result.error || t('gallery.deleteError'));
    }
  };

  return (
    <>
      <motion.div
        key={item.id}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative aspect-video bg-black/20 rounded-2xl overflow-hidden mb-6 shadow-xl"
      >
        {item.media_type === 'video' ? (
          <video
            src={item.file_url}
            controls
            className="w-full h-full object-contain"
            poster={item.thumbnail_url || undefined}
          />
        ) : (
          <img
            src={item.file_url}
            alt={item.title || 'Gallery image'}
            className="w-full h-full object-contain"
          />
        )}

        {/* Title and Description Overlay */}
        {(item.title || item.description) && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
            {item.title && (
              <h3 className="text-white text-xl font-semibold mb-1">
                {item.title}
              </h3>
            )}
            {item.description && (
              <p className="text-white/80 text-sm">{item.description}</p>
            )}
          </div>
        )}

        {/* Admin Delete Button */}
        {isAdmin && (
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-4 right-4 opacity-80 hover:opacity-100"
            onClick={() => setShowDeleteDialog(true)}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        )}

        {/* Video Play Indicator */}
        {item.media_type === 'video' && (
          <div className="absolute top-4 left-4 bg-black/50 px-2 py-1 rounded flex items-center gap-1">
            <Play className="h-3 w-3 text-white" />
            <span className="text-white text-xs">{t('gallery.video')}</span>
          </div>
        )}
      </motion.div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('gallery.deleteConfirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('gallery.deleteConfirmDesc')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('gallery.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              {t('gallery.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
