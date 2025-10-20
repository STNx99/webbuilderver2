"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Download,
  Heart,
  Calendar,
  User,
  CheckCircle2,
  Layers,
  ArrowLeft,
} from "lucide-react";
import Image from "next/image";
import { MarketplaceItemWithRelations } from "@/interfaces/market.interface";
import { useDownloadMarketplaceItem, useIncrementLikes } from "@/hooks";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface MarketplaceItemDetailProps {
  item: MarketplaceItemWithRelations;
}

export function MarketplaceItemDetail({ item }: MarketplaceItemDetailProps) {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  const downloadItem = useDownloadMarketplaceItem();
  const incrementLikes = useIncrementLikes();

  const getTemplateTypeLabel = (type: string) => {
    switch (type) {
      case "full-site":
        return "Full Site";
      case "page":
        return "Page";
      case "section":
        return "Section";
      case "block":
        return "Block";
      default:
        return type;
    }
  };

  const handleDownload = async () => {
    try {
      await downloadItem.mutateAsync(item.id);
    } catch (error) {
      console.error("Failed to download template:", error);
    }
  };

  const handleLike = async () => {
    if (isLiked) return;

    try {
      await incrementLikes.mutateAsync(item.id);
      setIsLiked(true);
    } catch (error) {
      console.error("Failed to like item:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => router.push("/marketplace")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Marketplace
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Preview Image */}
            <Card className="overflow-hidden">
              <div className="relative aspect-video bg-muted">
                <Image
                  src={item.preview || "/placeholder.svg"}
                  alt={item.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </Card>

            {/* Title and Description */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">{item.title}</h1>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">
                      {getTemplateTypeLabel(item.templateType)}
                    </Badge>
                    {item.featured && (
                      <Badge variant="default" className="bg-yellow-500">
                        Featured
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {item.description}
              </p>
            </div>

            <Separator />

            {/* Additional Details */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {item.pageCount && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Layers className="h-5 w-5" />
                    <span>
                      <strong className="text-foreground">
                        {item.pageCount}
                      </strong>{" "}
                      pages included
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Download className="h-5 w-5" />
                  <span>
                    <strong className="text-foreground">
                      {(item.downloads || 0).toLocaleString()}
                    </strong>{" "}
                    downloads
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Heart className="h-5 w-5" />
                  <span>
                    <strong className="text-foreground">
                      {(item.likes || 0).toLocaleString()}
                    </strong>{" "}
                    likes
                  </span>
                </div>
                {item.createdAt && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-5 w-5" />
                    <span>
                      Created{" "}
                      <strong className="text-foreground">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </strong>
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h2 className="text-xl font-semibold">Tags</h2>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag: string) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Categories */}
            {item.categories && item.categories.length > 0 && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h2 className="text-xl font-semibold">Categories</h2>
                  <div className="flex flex-wrap gap-2">
                    {item.categories.map((category) => (
                      <Badge key={category.id} variant="secondary">
                        {category.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6 space-y-4">
                {/* Author Info */}
                {item.author && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase">
                      Created By
                    </h3>
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium">{item.author.name}</span>
                          {item.author.verified && (
                            <CheckCircle2 className="h-4 w-4 text-blue-500" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Template Creator
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <Separator />

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleDownload}
                    disabled={downloadItem.isPending}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {downloadItem.isPending ? "Downloading..." : "Download Template"}
                  </Button>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full",
                      isLiked && "border-red-500 text-red-500"
                    )}
                    size="lg"
                    onClick={handleLike}
                    disabled={incrementLikes.isPending || isLiked}
                  >
                    <Heart
                      className={cn(
                        "h-4 w-4 mr-2",
                        isLiked && "fill-current"
                      )}
                    />
                    {isLiked ? "Liked" : "Like This Template"}
                  </Button>
                </div>

                <Separator />

                {/* Stats Summary */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase">
                    Template Stats
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Downloads</span>
                      <span className="font-medium">
                        {(item.downloads || 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Likes</span>
                      <span className="font-medium">
                        {(item.likes || 0).toLocaleString()}
                      </span>
                    </div>
                    {item.pageCount && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Pages</span>
                        <span className="font-medium">{item.pageCount}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
