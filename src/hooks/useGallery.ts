import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';

export interface GalleryItem {
  id: string;
  title: string | null;
  description: string | null;
  media_type: 'image' | 'video';
  file_path: string;
  file_url: string;
  thumbnail_url: string | null;
  display_order: number;
  is_featured: boolean;
  created_at: string;
}

export function useGallery() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is admin
  useEffect(() => {
    async function checkAdminRole() {
      if (!user) {
        setIsAdmin(false);
        return;
      }

      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();

      setIsAdmin(!error && !!data);
    }

    checkAdminRole();
  }, [user]);

  const { data: items = [], isLoading, refetch } = useQuery({
    queryKey: ['gallery-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery_items')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as GalleryItem[];
    },
  });

  return {
    items,
    isLoading,
    isAdmin,
    refetch,
  };
}

export async function uploadGalleryItem(
  file: File,
  title?: string,
  description?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    // Upload file to storage
    const { error: uploadError } = await supabase.storage
      .from('gallery')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('gallery')
      .getPublicUrl(filePath);

    const fileUrl = urlData.publicUrl;

    // Determine media type
    const mediaType = file.type.startsWith('video/') ? 'video' : 'image';

    // For videos, we might want to use a thumbnail later
    // For now, we'll use the same URL for images
    const thumbnailUrl = mediaType === 'image' ? fileUrl : null;

    // Insert gallery item record
    const { error: insertError } = await supabase
      .from('gallery_items')
      .insert({
        title: title || null,
        description: description || null,
        media_type: mediaType,
        file_path: filePath,
        file_url: fileUrl,
        thumbnail_url: thumbnailUrl,
      });

    if (insertError) throw insertError;

    return { success: true };
  } catch (error: any) {
    console.error('Upload error:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteGalleryItem(
  id: string,
  filePath: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('gallery')
      .remove([filePath]);

    if (storageError) {
      console.warn('Storage delete warning:', storageError);
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from('gallery_items')
      .delete()
      .eq('id', id);

    if (dbError) throw dbError;

    return { success: true };
  } catch (error: any) {
    console.error('Delete error:', error);
    return { success: false, error: error.message };
  }
}
