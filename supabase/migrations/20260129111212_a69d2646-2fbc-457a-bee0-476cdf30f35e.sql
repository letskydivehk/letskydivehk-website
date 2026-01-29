-- Add category column to gallery_items table for organizing content
ALTER TABLE public.gallery_items 
ADD COLUMN category text NOT NULL DEFAULT 'photos';

-- Add a comment for documentation
COMMENT ON COLUMN public.gallery_items.category IS 'Category for gallery items: photos, daily_videos, aff_videos';