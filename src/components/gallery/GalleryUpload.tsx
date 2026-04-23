import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, Image, Video, Loader2, GraduationCap, Youtube, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { uploadGalleryItem, addYouTubeVideo, extractYouTubeId, getYouTubeThumbnail, GalleryCategory } from '@/hooks/useGallery';
import { toast } from 'sonner';

interface GalleryUploadProps {
  onClose: () => void;
  onSuccess: () => void;
  defaultCategory?: GalleryCategory;
}

export function GalleryUpload({ onClose, onSuccess, defaultCategory = 'photos' }: GalleryUploadProps) {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Common state
  const [category, setCategory] = useState<GalleryCategory>(defaultCategory);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  
  // File upload state
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  
  // YouTube state
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [youtubePreview, setYoutubePreview] = useState<string | null>(null);
  
  // Determine upload mode based on category
  const isVideoCategory = category === 'daily_videos' || category === 'aff_videos';
  const [uploadMode, setUploadMode] = useState<'file' | 'youtube'>(isVideoCategory ? 'youtube' : 'file');

  // Update upload mode when category changes
  const handleCategoryChange = (value: string) => {
    const newCategory = value as GalleryCategory;
    setCategory(newCategory);
    if (newCategory === 'photos') {
      setUploadMode('file');
    } else {
      setUploadMode('youtube');
    }
    // Reset state
    setFile(null);
    setPreview(null);
    setYoutubeUrl('');
    setYoutubePreview(null);
  };

  const handleFileSelect = (selectedFile: File) => {
    if (!selectedFile) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime'];
    if (!validTypes.includes(selectedFile.type)) {
      toast.error(t('gallery.invalidFileType'));
      return;
    }

    // Validate file size (50MB max)
    if (selectedFile.size > 52428800) {
      toast.error(t('gallery.fileTooLarge'));
      return;
    }

    setFile(selectedFile);

    // Create preview
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const handleYoutubeUrlChange = (url: string) => {
    setYoutubeUrl(url);
    const videoId = extractYouTubeId(url);
    if (videoId) {
      setYoutubePreview(getYouTubeThumbnail(videoId));
    } else {
      setYoutubePreview(null);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    setIsUploading(true);
    
    try {
      if (uploadMode === 'youtube') {
        // Add YouTube video
        if (!youtubeUrl) {
          toast.error('Please enter a YouTube URL');
          setIsUploading(false);
          return;
        }
        
        const result = await addYouTubeVideo(youtubeUrl, category, title, description);
        
        if (result.success) {
          toast.success('YouTube video added successfully!');
          onSuccess();
        } else {
          toast.error(result.error || 'Failed to add YouTube video');
        }
      } else {
        // Upload file
        if (!file) {
          toast.error('Please select a file');
          setIsUploading(false);
          return;
        }
        
        const result = await uploadGalleryItem(file, category, title, description);
        
        if (result.success) {
          toast.success(t('gallery.uploadSuccess'));
          onSuccess();
        } else {
          toast.error(result.error || t('gallery.uploadError'));
        }
      }
    } finally {
      setIsUploading(false);
    }
  };

  const canSubmit = uploadMode === 'youtube' ? !!youtubeUrl && !!extractYouTubeId(youtubeUrl) : !!file;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-lg bg-card rounded-2xl shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">
            {uploadMode === 'youtube' ? 'Add YouTube Video' : t('gallery.uploadTitle')}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Category Selection */}
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={handleCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="photos">
                  <div className="flex items-center gap-2">
                    <Image className="h-4 w-4" />
                    <span>Photos</span>
                  </div>
                </SelectItem>
                <SelectItem value="daily_videos">
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4" />
                    <span>Daily Videos</span>
                  </div>
                </SelectItem>
                <SelectItem value="aff_videos">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    <span>AFF Course Videos</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Upload Mode Tabs (only for video categories) */}
          {isVideoCategory && (
            <Tabs value={uploadMode} onValueChange={(v) => setUploadMode(v as 'file' | 'youtube')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="youtube" className="gap-2">
                  <Youtube className="h-4 w-4" />
                  YouTube Link
                </TabsTrigger>
                <TabsTrigger value="file" className="gap-2">
                  <Upload className="h-4 w-4" />
                  Upload File
                </TabsTrigger>
              </TabsList>
            </Tabs>
          )}

          {/* YouTube URL Input */}
          {uploadMode === 'youtube' && isVideoCategory && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="youtube-url" className="flex items-center gap-2">
                  <Youtube className="h-4 w-4 text-red-500" />
                  YouTube Video URL
                </Label>
                <Input
                  id="youtube-url"
                  value={youtubeUrl}
                  onChange={(e) => handleYoutubeUrlChange(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... or /shorts/..."
                />
                <p className="text-xs text-muted-foreground">
                  Supports regular videos, Shorts, and youtu.be links (e.g., youtube.com/shorts/xxxxx)
                </p>
              </div>
              
              {/* YouTube Preview */}
              {youtubePreview && (
                <div className="relative rounded-lg overflow-hidden border bg-muted">
                  <img
                    src={youtubePreview}
                    alt="YouTube thumbnail"
                    className="w-full aspect-video object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-red-600 rounded-full p-3">
                      <Youtube className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </div>
              )}
              
              {youtubeUrl && !youtubePreview && (
                <div className="p-4 bg-destructive/10 rounded-lg text-center">
                  <p className="text-sm text-destructive">Invalid YouTube URL</p>
                </div>
              )}
            </div>
          )}

          {/* File Drop Zone (for photos or when file mode selected) */}
          {(uploadMode === 'file' || !isVideoCategory) && (
            <div
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {file ? (
                <div className="space-y-4">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="max-h-48 mx-auto rounded-lg object-contain"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-32 bg-muted rounded-lg">
                      <Video className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground">{file.name}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFile(null);
                      setPreview(null);
                    }}
                  >
                    {t('gallery.removeFile')}
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex justify-center gap-4 mb-4">
                    <Image className="h-8 w-8 text-muted-foreground" />
                    {isVideoCategory && <Video className="h-8 w-8 text-muted-foreground" />}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {t('gallery.dragDrop')}
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {t('gallery.browseFiles')}
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept={isVideoCategory 
                      ? "video/mp4,video/webm,video/quicktime"
                      : "image/jpeg,image/png,image/gif,image/webp"
                    }
                    onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  />
                </>
              )}
            </div>
          )}

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">{t('gallery.titleLabel')}</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('gallery.titlePlaceholder')}
              maxLength={100}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">{t('gallery.descriptionLabel')}</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('gallery.descriptionPlaceholder')}
              maxLength={500}
              rows={3}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 border-t bg-muted/30">
          <Button variant="outline" onClick={onClose} disabled={isUploading}>
            {t('gallery.cancel')}
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!canSubmit || isUploading}
            className="gap-2"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {uploadMode === 'youtube' ? 'Adding...' : t('gallery.uploading')}
              </>
            ) : (
              <>
                {uploadMode === 'youtube' ? <Youtube className="h-4 w-4" /> : <Upload className="h-4 w-4" />}
                {uploadMode === 'youtube' ? 'Add Video' : t('gallery.uploadBtn')}
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}