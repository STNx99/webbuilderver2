"use client";

import { useState } from "react";
import Image from "next/image";
import { useUserImages, useUploadImage, useDeleteImage } from "@/hooks/images";
import { useImageStore } from "@/globalstore/imagestore";
import { Image as ImageType } from "@/interfaces/image.interface";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import {
  Upload,
  X,
  Loader2,
  Image as ImageIcon,
  Trash2,
  Check,
  GripVertical,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { ImageDragDataSchema } from "@/schema/zod/imageupload";

interface ImageUploadManagerProps {
  onImageSelect?: (imageUrl: string) => void;
}

export function ImageUploadManager({ onImageSelect }: ImageUploadManagerProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [deleteImageId, setDeleteImageId] = useState<string | null>(null);

  // TanStack Query hooks
  const { data: images = [], isLoading } = useUserImages();
  const uploadMutation = useUploadImage();
  const deleteMutation = useDeleteImage();

  // Image store
  const { deselectImage: deselectFromStore, isImageSelected } = useImageStore();

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    try {
      const response = await uploadMutation.mutateAsync({
        file,
        imageName: file.name,
      });

      setSelectedImage(response.imageLink);

      // Reset input
      event.target.value = "";
    } catch (error) {
      // Error is handled by the mutation hook
      console.error("Upload error:", error);
    }
  };

  const handleImageSelect = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    if (onImageSelect) {
      onImageSelect(imageUrl);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    try {
      await deleteMutation.mutateAsync(imageId);

      // Clear selection if deleted image was selected
      const deletedImage = images.find((img) => img.imageId === imageId);
      if (deletedImage && selectedImage === deletedImage.imageLink) {
        setSelectedImage(null);
      }

      // Also remove from selected images store if it was selected
      if (isImageSelected(imageId)) {
        deselectFromStore(imageId);
      }
    } catch (error) {
      // Error is handled by the mutation hook
      console.error("Delete error:", error);
    } finally {
      setDeleteImageId(null);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("Image URL copied to clipboard.");
  };

  const handleDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    image: ImageType,
  ) => {
    const dragData = {
      imageId: image.imageId,
      imageLink: image.imageLink,
      imageName: image.imageName,
      type: "image" as const,
    };

    // Validate drag data
    const validatedData = ImageDragDataSchema.parse(dragData);

    event.dataTransfer.setData(
      "application/json",
      JSON.stringify(validatedData),
    );
    event.dataTransfer.effectAllowed = "copy";

    // Create drag preview
    const dragImage = event.currentTarget.querySelector("img");
    if (dragImage) {
      event.dataTransfer.setDragImage(dragImage, 50, 50);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <div className="space-y-2">
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={uploadMutation.isPending}
          className="hidden"
          id="image-upload-input"
        />
        <label htmlFor="image-upload-input">
          <Button
            type="button"
            variant="outline"
            className="w-full cursor-pointer"
            disabled={uploadMutation.isPending}
            asChild
          >
            <span>
              {uploadMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Image
                </>
              )}
            </span>
          </Button>
        </label>
        <p className="text-xs text-muted-foreground text-center">
          Max size: 5MB. Supported: JPG, PNG, GIF, WebP
        </p>
      </div>

      {/* Selected Image Preview */}
      {selectedImage && (
        <Card>
          <CardHeader className="p-4">
            <CardTitle className="text-sm">Selected Image</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
              <img
                src={selectedImage}
                alt="Selected"
                className="h-full w-full object-cover"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6"
                onClick={() => setSelectedImage(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-2"
              onClick={() => copyToClipboard(selectedImage)}
            >
              Copy URL
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Image Gallery */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Your Images</h4>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : images.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
              <ImageIcon className="h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                No images uploaded yet
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Upload your first image to get started
              </p>
            </CardContent>
          </Card>
        ) : (
          <ScrollArea className="h-[400px] w-full rounded-md border">
            <div className="grid grid-cols-2 gap-2 p-2">
              {images.map((image) => (
                <div
                  key={image.imageId}
                  draggable
                  onDragStart={(e) => handleDragStart(e, image)}
                  className={`group relative aspect-square overflow-hidden rounded-lg border-2 cursor-grab active:cursor-grabbing transition-all ${
                    selectedImage === image.imageLink
                      ? "border-primary ring-2 ring-primary ring-offset-2"
                      : "border-transparent hover:border-muted-foreground"
                  }`}
                  onClick={() => handleImageSelect(image.imageLink)}
                >
                  <Image
                    src={image.imageLink}
                    alt={image.imageName || "Uploaded image"}
                    fill
                    className="object-cover"
                    draggable={false}
                    unoptimized
                  />
                  <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 rounded p-0.5">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                  </div>
                  {selectedImage === image.imageLink && (
                    <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full p-1">
                      <Check className="h-3 w-3" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteImageId(image.imageId);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {image.imageName && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 truncate">
                      {image.imageName}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteImageId !== null}
        onOpenChange={(open) => !open && setDeleteImageId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Image</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this image? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteImageId && handleDeleteImage(deleteImageId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
