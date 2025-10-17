"use client";

import { useState } from "react";
import Image from "next/image";
import { useUserImages, useUploadImage, useDeleteImage } from "@/hooks/images";
import { Image as ImageType } from "@/interfaces/image.interface";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Upload,
  Loader2,
  Image as ImageIcon,
  Trash2,
  Check,
  Copy,
  Download,
  ArrowLeft,
  GripVertical,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

interface ImageGalleryViewProps {
  onImageSelect?: (imageUrl: string) => void;
  showBackButton?: boolean;
  onBack?: () => void;
}

export function ImageGalleryView({
  onImageSelect,
  showBackButton = false,
  onBack,
}: ImageGalleryViewProps) {
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);
  const [deleteImageId, setDeleteImageId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<ImageType | null>(null);

  // TanStack Query hooks
  const { data: images = [], isLoading } = useUserImages();
  const uploadMutation = useUploadImage();
  const deleteMutation = useDeleteImage();

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

      const newImage: ImageType = {
        imageId: response.imageId,
        imageLink: response.imageLink,
        imageName: response.imageName,
        userId: "",
        createdAt: response.createdAt,
        updatedAt: response.createdAt,
        deletedAt: null,
      };

      setSelectedImage(newImage);
      event.target.value = "";
    } catch (error) {
      // Error is handled by the mutation hook
      console.error("Upload error:", error);
    }
  };

  const handleImageSelect = (image: ImageType) => {
    setSelectedImage(image);
    if (onImageSelect) {
      onImageSelect(image.imageLink);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    try {
      await deleteMutation.mutateAsync(imageId);

      if (selectedImage?.imageId === imageId) {
        setSelectedImage(null);
      }
      if (previewImage?.imageId === imageId) {
        setPreviewImage(null);
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

  const downloadImage = async (imageUrl: string, imageName?: string | null) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = imageName || "image.jpg";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Image downloaded successfully!");
    } catch (error) {
      toast.error("Failed to download image.");
    }
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
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="border-b p-4 space-y-4">
        <div className="flex items-center justify-between">
          {showBackButton && (
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <h2 className="text-2xl font-bold flex-1">Image Gallery</h2>
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploadMutation.isPending}
            className="hidden"
            id="gallery-image-upload"
          />
          <label htmlFor="gallery-image-upload">
            <Button
              type="button"
              disabled={uploadMutation.isPending}
              asChild
              className="cursor-pointer"
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
                    Upload
                  </>
                )}
              </span>
            </Button>
          </label>
        </div>
        <p className="text-sm text-muted-foreground">
          {images.length} {images.length === 1 ? "image" : "images"} • Max 5MB
          per file • Drag images to editor components
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : images.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <ImageIcon className="h-20 w-20 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No images yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm mb-4">
              Upload your first image to get started. Images will be stored
              securely and accessible across your projects.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {images.map((image) => (
              <div
                key={image.imageId}
                draggable
                onDragStart={(e) => handleDragStart(e, image)}
                className={`group relative aspect-square overflow-hidden rounded-lg border-2 cursor-grab active:cursor-grabbing transition-all hover:shadow-lg ${
                  selectedImage?.imageId === image.imageId
                    ? "border-primary ring-2 ring-primary ring-offset-2"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => handleImageSelect(image)}
              >
                <Image
                  src={image.imageLink}
                  alt={image.imageName || "Uploaded image"}
                  fill
                  className="object-cover"
                  draggable={false}
                  unoptimized
                />
                <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 rounded p-0.5">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                </div>
                {selectedImage?.imageId === image.imageId && (
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                    <Check className="h-4 w-4" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-9 w-9"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewImage(image);
                    }}
                  >
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-9 w-9"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteImageId(image.imageId);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                {image.imageName && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white text-xs p-2 truncate">
                    {image.imageName}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview Dialog */}
      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {previewImage?.imageName || "Image Preview"}
            </DialogTitle>
            <DialogDescription>
              Uploaded on{" "}
              {previewImage?.createdAt &&
                new Date(previewImage.createdAt).toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative w-full max-h-[70vh] overflow-hidden rounded-lg border bg-muted">
              {previewImage && (
                <Image
                  src={previewImage.imageLink}
                  alt={previewImage.imageName || "Preview"}
                  width={1200}
                  height={800}
                  className="w-full h-full object-contain"
                  unoptimized
                />
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() =>
                  previewImage && copyToClipboard(previewImage.imageLink)
                }
                className="flex-1"
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy URL
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  previewImage &&
                  downloadImage(previewImage.imageLink, previewImage.imageName)
                }
                className="flex-1"
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  if (previewImage) {
                    handleImageSelect(previewImage);
                    setPreviewImage(null);
                  }
                }}
                className="flex-1"
              >
                <Check className="mr-2 h-4 w-4" />
                Select
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={deleteImageId !== null}
        onOpenChange={(open) => !open && setDeleteImageId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Image</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this image? This action cannot be
              undone and will remove the image from all projects using it.
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
