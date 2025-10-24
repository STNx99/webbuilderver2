import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { imageService } from "@/services/image";
import { Image, ImageUploadResponse } from "@/interfaces/image.interface";
import { toast } from "sonner";
import {
  ImageFileSchema,
  Base64ImageSchema,
  ImageUploadResponseSchema,
  ImagesArraySchema,
} from "@/schema/zod/imageupload";

// Query keys
export const imageKeys = {
  all: ["images"] as const,
  lists: () => [...imageKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) =>
    [...imageKeys.lists(), filters] as const,
  details: () => [...imageKeys.all, "detail"] as const,
  detail: (id: string) => [...imageKeys.details(), id] as const,
};

// Hook to get all user images
export function useUserImages() {
  return useQuery({
    queryKey: imageKeys.lists(),
    queryFn: async () => {
      const images = await imageService.getUserImages();
      // Validate response
      return ImagesArraySchema.parse(images);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Hook to get a specific image by ID
export function useImage(imageId: string | null) {
  return useQuery({
    queryKey: imageKeys.detail(imageId || ""),
    queryFn: async () => {
      if (!imageId) throw new Error("Image ID is required");
      const image = await imageService.getImageByID(imageId);
      return image;
    },
    enabled: !!imageId,
  });
}

// Hook to upload an image file
export function useUploadImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      file,
      imageName,
    }: {
      file: File;
      imageName?: string;
    }) => {
      // Validate input
      ImageFileSchema.parse({ file, imageName });

      const response = await imageService.uploadImage(file, imageName);

      // Validate response
      return ImageUploadResponseSchema.parse(response);
    },
    onSuccess: (data) => {
      // Invalidate and refetch images list
      queryClient.invalidateQueries({ queryKey: imageKeys.lists() });

      // Optimistically add to cache
      queryClient.setQueryData<Image[]>(imageKeys.lists(), (old) => {
        const newImage: Image = {
          imageId: data.imageId,
          imageLink: data.imageLink,
          imageName: data.imageName,
          userId: "",
          createdAt: data.createdAt,
          updatedAt: data.createdAt,
          deletedAt: null,
        };
        return old ? [newImage, ...old] : [newImage];
      });

      toast.success("Image uploaded successfully!");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to upload image"
      );
    },
  });
}

// Hook to upload a base64 image
export function useUploadBase64Image() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      base64,
      imageName,
    }: {
      base64: string;
      imageName?: string;
    }) => {
      // Validate input
      Base64ImageSchema.parse({ base64, imageName });

      const response = await imageService.uploadBase64Image(base64, imageName);

      // Validate response
      return ImageUploadResponseSchema.parse(response);
    },
    onSuccess: (data) => {
      // Invalidate and refetch images list
      queryClient.invalidateQueries({ queryKey: imageKeys.lists() });

      // Optimistically add to cache
      queryClient.setQueryData<Image[]>(imageKeys.lists(), (old) => {
        const newImage: Image = {
          imageId: data.imageId,
          imageLink: data.imageLink,
          imageName: data.imageName,
          userId: "",
          createdAt: data.createdAt,
          updatedAt: data.createdAt,
          deletedAt: null,
        };
        return old ? [newImage, ...old] : [newImage];
      });

      toast.success("Image uploaded successfully!");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to upload image"
      );
    },
  });
}

// Hook to delete an image
export function useDeleteImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (imageId: string) => {
      await imageService.deleteImage(imageId);
      return imageId;
    },
    onMutate: async (imageId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: imageKeys.lists() });

      // Snapshot the previous value
      const previousImages = queryClient.getQueryData<Image[]>(
        imageKeys.lists()
      );

      // Optimistically update to remove the image
      queryClient.setQueryData<Image[]>(imageKeys.lists(), (old) =>
        old ? old.filter((img) => img.imageId !== imageId) : []
      );

      // Return context with snapshot
      return { previousImages };
    },
    onSuccess: () => {
      toast.success("Image deleted successfully!");
    },
    onError: (error, imageId, context) => {
      // Rollback on error
      if (context?.previousImages) {
        queryClient.setQueryData(imageKeys.lists(), context.previousImages);
      }
      toast.error(
        error instanceof Error ? error.message : "Failed to delete image"
      );
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: imageKeys.lists() });
    },
  });
}
