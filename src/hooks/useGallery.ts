import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";

export interface GalleryItem {
  id: string;
  title: string | null;
  description: string | null;
  media_type: "image" | "video";
  file_path: string;
  file_url: string;
  thumbnail_url: string | null;
  display_order: number;
  is_featured: boolean;
  created_at: string;
  // Optional flag for storage-only items
  is_storage_only?: boolean;
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
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      setIsAdmin(!error && !!data);
    }

    checkAdminRole();
  }, [user]);

  // Function to fetch files from Supabase Storage
  const fetchStorageFiles = async (): Promise<Partial<GalleryItem>[]> => {
    try {
      // List all files in the gallery bucket
      // Try both root and uploads folder
      const { data: files, error } = await supabase.storage.from("gallery").list("", {
        // Empty string for root folder
        limit: 100,
        offset: 0,
        sortBy: { column: "created_at", order: "desc" },
      });

      if (error) {
        console.error("Storage fetch error:", error);
        return [];
      }

      // Transform storage files to your format
      const storageFiles = await Promise.all(
        files.map(async (file) => {
          // Handle both root and nested paths
          const filePath = file.name.startsWith("uploads/") ? file.name : `uploads/${file.name}`;

          const { data: urlData } = supabase.storage.from("gallery").getPublicUrl(filePath);

          // Determine media type from file name
          const isVideo = /\.(mp4|mov|avi|wmv|flv|webm|mkv)$/i.test(file.name);
          const isImage = /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(file.name);
          const mediaType = isVideo ? "video" : isImage ? "image" : "image"; // Default to image

          return {
            id: `storage_${file.id || file.name.replace(/[^a-zA-Z0-9]/g, "_")}`,
            title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
            description: null,
            media_type: mediaType as "image" | "video",
            file_path: filePath,
            file_url: urlData.publicUrl,
            thumbnail_url: mediaType === "image" ? urlData.publicUrl : null,
            display_order: 0,
            is_featured: false,
            created_at: file.created_at || new Date().toISOString(),
            is_storage_only: true,
          };
        }),
      );

      return storageFiles;
    } catch (error) {
      console.error("Error fetching storage files:", error);
      return [];
    }
  };

  const {
    data: items = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["gallery-items"],
    queryFn: async () => {
      try {
        // Fetch from database
        const { data: dbItems, error } = await supabase
          .from("gallery_items")
          .select("*")
          .order("display_order", { ascending: true })
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Database fetch error:", error);
          // Continue with storage files even if DB fails
        }

        // Fetch from storage
        const storageFiles = await fetchStorageFiles();

        // If we have database items, combine them
        if (dbItems && dbItems.length > 0) {
          // Combine and deduplicate - check for files already in database
          const dbFilePaths = new Set(dbItems.map((item) => item.file_path));

          // Add storage files that aren't already in database
          const combinedItems: GalleryItem[] = [
            ...dbItems,
            ...storageFiles.filter((file) => !dbFilePaths.has(file.file_path!)).map((file) => file as GalleryItem),
          ];

          return combinedItems;
        } else {
          // If no database items, just return storage files
          return storageFiles as GalleryItem[];
        }
      } catch (error) {
        console.error("Error in gallery query:", error);
        // Fallback to just storage files
        const storageFiles = await fetchStorageFiles();
        return storageFiles as GalleryItem[];
      }
    },
  });

  return {
    items,
    isLoading,
    isAdmin,
    refetch,
  };
}

// Your existing functions remain the same
export async function uploadGalleryItem(
  file: File,
  title?: string,
  description?: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    // Upload file to storage
    const { error: uploadError } = await supabase.storage.from("gallery").upload(filePath, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: urlData } = supabase.storage.from("gallery").getPublicUrl(filePath);

    const fileUrl = urlData.publicUrl;

    // Determine media type
    const mediaType = file.type.startsWith("video/") ? "video" : "image";

    // For videos, we might want to use a thumbnail later
    const thumbnailUrl = mediaType === "image" ? fileUrl : null;

    // Insert gallery item record
    const { error: insertError } = await supabase.from("gallery_items").insert({
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
    console.error("Upload error:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteGalleryItem(id: string, filePath: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if it's a storage-only item
    if (id.startsWith("storage_")) {
      // Only delete from storage for storage-only items
      const { error: storageError } = await supabase.storage.from("gallery").remove([filePath]);

      if (storageError) {
        console.warn("Storage delete warning:", storageError);
      }
      return { success: true };
    }

    // For regular items, delete from both storage and database
    const { error: storageError } = await supabase.storage.from("gallery").remove([filePath]);

    if (storageError) {
      console.warn("Storage delete warning:", storageError);
    }

    // Delete from database
    const { error: dbError } = await supabase.from("gallery_items").delete().eq("id", id);

    if (dbError) throw dbError;

    return { success: true };
  } catch (error: any) {
    console.error("Delete error:", error);
    return { success: false, error: error.message };
  }
}
