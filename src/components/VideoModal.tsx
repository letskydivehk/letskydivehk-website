import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface VideoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  videoUrl?: string;
}

export function VideoModal({
  open,
  onOpenChange,
  videoUrl = "https://www.youtube.com/embed/T-yG-njObAw",
}: VideoModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 bg-black border-none overflow-hidden">
        <DialogTitle className="sr-only">Skydiving Video</DialogTitle>
        <div className="relative w-full aspect-video">
          {open && (
            <iframe
              src={videoUrl}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Skydiving highlight reel"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
