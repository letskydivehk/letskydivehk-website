import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";

export type GalleryCategory = "photos" | "daily_videos" | "aff_videos";

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
  category: GalleryCategory;
  is_storage_only?: boolean;
}

export function useGallery(category?: GalleryCategory) {
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
      console.log("Fetching files from Supabase Storage...");

      // Try different folder paths to find where files are
      const folderPaths = ["", "uploads/", "gallery/", "public/"];

      let allFiles: any[] = [];

      for (const folder of folderPaths) {
        const { data: files, error } = await supabase.storage.from("gallery").list(folder, {
          limit: 100,
          offset: 0,
          sortBy: { column: "created_at", order: "desc" },
        });

        if (error) {
          console.log(`Error listing folder "${folder}":`, error.message);
          continue;
        }

        if (files && files.length > 0) {
          console.log(`Found ${files.length} files in folder "${folder}"`);
          allFiles = [
            ...allFiles,
            ...files.map((file) => ({
              ...file,
              folder: folder,
            })),
          ];
        }
      }

      if (allFiles.length === 0) {
        console.log("No files found in any folder");
        return [];
      }

      console.log(`Total files found: ${allFiles.length}`);

      // Transform storage files to your format
      const storageFiles = await Promise.all(
        allFiles.map(async (file) => {
          // Construct correct file path
          const filePath = file.folder ? `${file.folder}${file.name}`.replace(/\/\//g, "/") : file.name;

          console.log(`Processing file: ${filePath}`);

          // Get public URL
          const {
            data: { publicUrl },
          } = supabase.storage.from("gallery").getPublicUrl(filePath);

          console.log(`Generated URL for ${file.name}:`, publicUrl);

          // Test if URL is accessible
          let isUrlAccessible = false;
          try {
            const response = await fetch(publicUrl, { method: "HEAD" });
            isUrlAccessible = response.ok;
            console.log(`URL accessibility test for ${file.name}: ${response.ok ? "OK" : "FAILED"}`);
          } catch (error) {
            console.log(`URL test failed for ${file.name}:`, error);
          }

          // Determine media type from file name
          const isVideo = /\.(mp4|mov|avi|wmv|flv|webm|mkv)$/i.test(file.name);
          const isImage = /\.(jpg|jpeg|png|gif|webp|bmp|svg|heic|heif|PNG|JPG|JPEG)$/i.test(file.name);
          
          // Skip unknown file types
          if (!isVideo && !isImage) {
            return null;
          }
          
          const mediaType: "image" | "video" = isVideo ? "video" : "image";

          return {
            id: `storage_${file.id || file.name.replace(/[^a-zA-Z0-9]/g, "_")}`,
            title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
            description: null,
            media_type: mediaType,
            file_path: filePath,
            file_url: publicUrl,
            thumbnail_url: mediaType === "image" ? publicUrl : null,
            display_order: 0,
            is_featured: false,
            created_at: file.created_at || new Date().toISOString(),
            category: "photos" as GalleryCategory, // Default category for storage-only items
            is_storage_only: true,
            _debug: {
              originalName: file.name,
              folder: file.folder,
              urlAccessible: isUrlAccessible,
            },
          };
        }),
      );

      // Filter out null entries (unknown media types)
      const validFiles = storageFiles.filter((file): file is NonNullable<typeof file> => file !== null);
      console.log(`Valid gallery files: ${validFiles.length}/${storageFiles.length}`);

      return validFiles;
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
    queryKey: ["gallery-items", category],
    queryFn: async () => {
      try {
        console.log("Fetching gallery items...", category ? `for category: ${category}` : "all");

        // Fetch from database
        let typedDbItems: GalleryItem[] = [];
        try {
          let query = supabase
            .from("gallery_items")
            .select("*")
            .order("display_order", { ascending: true })
            .order("created_at", { ascending: false });
          
          // Filter by category if provided
          if (category) {
            query = query.eq("category", category);
          }

          const { data, error } = await query;

          if (error) {
            console.error("Database fetch error:", error);
          } else if (data) {
            typedDbItems = data.map((item) => ({
              ...item,
              media_type: item.media_type as "image" | "video",
              category: (item.category || "photos") as GalleryCategory,
            }));
            console.log(`Found ${typedDbItems.length} items in database`);
          }
        } catch (dbError) {
          console.error("Database error:", dbError);
        }

        // For photos category or no category, also fetch from storage
        if (!category || category === "photos") {
          const storageFiles = await fetchStorageFiles();

          // If we have database items, combine them
          if (typedDbItems.length > 0) {
            // Combine and deduplicate - check for files already in database
            const dbFilePaths = new Set(typedDbItems.map((item) => item.file_path));

            // Add storage files that aren't already in database
            const combinedItems: GalleryItem[] = [
              ...typedDbItems,
              ...(storageFiles
                .filter((file) => !dbFilePaths.has(file.file_path!))
                .map((file) => ({
                  ...file,
                  id: file.id!,
                  title: file.title || null,
                  description: file.description || null,
                  media_type: file.media_type!,
                  file_path: file.file_path!,
                  file_url: file.file_url!,
                  thumbnail_url: file.thumbnail_url || null,
                  display_order: file.display_order || 0,
                  is_featured: file.is_featured || false,
                  created_at: file.created_at!,
                  category: "photos" as GalleryCategory,
                  is_storage_only: true,
                })) as GalleryItem[]),
            ];

            console.log(`Total combined items: ${combinedItems.length}`);
            return combinedItems;
          } else {
            // If no database items, just return storage files
            const storageItems = storageFiles.map((file) => ({
              ...file,
              id: file.id!,
              title: file.title || null,
              description: file.description || null,
              media_type: file.media_type!,
              file_path: file.file_path!,
              file_url: file.file_url!,
              thumbnail_url: file.thumbnail_url || null,
              display_order: file.display_order || 0,
              is_featured: file.is_featured || false,
              created_at: file.created_at!,
              category: "photos" as GalleryCategory,
              is_storage_only: true,
            })) as GalleryItem[];

            console.log(`Returning ${storageItems.length} storage items`);
            return storageItems;
          }
        }

        return typedDbItems;
      } catch (error) {
        console.error("Error in gallery query:", error);
        // Fallback to just storage files for photos
        if (!category || category === "photos") {
          const storageFiles = await fetchStorageFiles();
          return storageFiles.map((file) => ({
            ...file,
            id: file.id!,
            title: file.title || null,
            description: file.description || null,
            media_type: file.media_type!,
            file_path: file.file_path!,
            file_url: file.file_url!,
            thumbnail_url: file.thumbnail_url || null,
            display_order: file.display_order || 0,
            is_featured: file.is_featured || false,
            created_at: file.created_at!,
            category: "photos" as GalleryCategory,
            is_storage_only: true,
          })) as GalleryItem[];
        }
        return [];
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

// Upload function with category support
export async function uploadGalleryItem(
  file: File,
  category: GalleryCategory = "photos",
  title?: string,
  description?: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    console.log(`Uploading file to: ${filePath}, category: ${category}`);

    // Upload file to storage
    const { error: uploadError } = await supabase.storage.from("gallery").upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw uploadError;
    }

    console.log("File uploaded successfully");

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("gallery").getPublicUrl(filePath);

    console.log("Generated public URL:", publicUrl);

    // Determine media type
    const mediaType = file.type.startsWith("video/") ? "video" : "image";

    // For videos, we might want to use a thumbnail later
    const thumbnailUrl = mediaType === "image" ? publicUrl : null;

    // Insert gallery item record with category
    const { error: insertError } = await supabase.from("gallery_items").insert({
      title: title || null,
      description: description || null,
      media_type: mediaType,
      file_path: filePath,
      file_url: publicUrl,
      thumbnail_url: thumbnailUrl,
      category: category,
    });

    if (insertError) {
      console.error("Insert error:", insertError);
      throw insertError;
    }

    console.log("Gallery item created in database with category:", category);
    return { success: true };
  } catch (error: any) {
    console.error("Upload error:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteGalleryItem(id: string, filePath: string): Promise<{ success: boolean; error?: string }> {
  try {
    console.log(`Deleting item: ${id}, path: ${filePath}`);

    // Check if it's a storage-only item
    if (id.startsWith("storage_")) {
      // Only delete from storage for storage-only items
      const { error: storageError } = await supabase.storage.from("gallery").remove([filePath]);

      if (storageError) {
        console.warn("Storage delete warning:", storageError);
      } else {
        console.log("Storage file deleted successfully");
      }
      return { success: true };
    }

    // For regular items, delete from both storage and database
    const { error: storageError } = await supabase.storage.from("gallery").remove([filePath]);

    if (storageError) {
      console.warn("Storage delete warning:", storageError);
    } else {
      console.log("Storage file deleted");
    }

    // Delete from database
    const { error: dbError } = await supabase.from("gallery_items").delete().eq("id", id);

    if (dbError) {
      console.error("Database delete error:", dbError);
      throw dbError;
    }

    console.log("Database record deleted");
    return { success: true };
  } catch (error: any) {
    console.error("Delete error:", error);
    return { success: false, error: error.message };
  }
}

// Test function to check Supabase Storage
export async function testSupabaseStorage() {
  console.log("=== Testing Supabase Storage ===");

  try {
    // Test 1: List buckets
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    if (bucketsError) {
      console.error("Error listing buckets:", bucketsError);
    } else {
      console.log("Available buckets:", buckets);
    }

    // Test 2: List files in gallery bucket
    const { data: files, error: filesError } = await supabase.storage.from("gallery").list("", { limit: 10 });

    if (filesError) {
      console.error("Error listing files:", filesError);
    } else {
      console.log("Files in gallery bucket:", files);

      // Test 3: Test URL generation for first file
      if (files && files.length > 0) {
        const testFile = files[0];
        const { data: urlData } = supabase.storage.from("gallery").getPublicUrl(testFile.name);

        console.log("Test file URL:", urlData.publicUrl);

        // Test 4: Try to fetch the file
        const response = await fetch(urlData.publicUrl, { method: "HEAD" });
        console.log("URL accessibility:", response.status, response.ok);
      }
    }

    return { success: true };
  } catch (error: any) {
    console.error("Storage test failed:", error);
    return { success: false, error: error.message };
  }
}
