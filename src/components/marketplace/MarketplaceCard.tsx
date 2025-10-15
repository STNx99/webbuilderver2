import type { MarketplaceItem } from "@/lib/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Heart,
  ExternalLink,
  CheckCircle2,
  Layers,
} from "lucide-react";
import Image from "next/image";

interface MarketplaceCardProps {
  item: MarketplaceItem;
}

export function MarketplaceCard({ item }: MarketplaceCardProps) {
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

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-border bg-card p-0">
      <div className="relative aspect-video overflow-hidden bg-muted">
        <Image
          src={item.preview || "/placeholder.svg"}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        <div className="absolute top-3 left-3">
          <Badge
            variant="secondary"
            className="text-xs backdrop-blur-sm bg-background/80"
          >
            {getTemplateTypeLabel(item.templateType)}
          </Badge>
        </div>
        <button className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-background">
          <ExternalLink className="h-4 w-4" />
        </button>
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-base leading-tight line-clamp-1">
            {item.title}
          </h3>
          {item.featured && (
            <Badge variant="secondary" className="text-xs shrink-0">
              Featured
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {item.description}
        </p>
        {item.pageCount && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
            <Layers className="h-3.5 w-3.5" />
            <span>{item.pageCount} pages included</span>
          </div>
        )}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {item.tags.slice(0, 3).map((tag: string) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Download className="h-3.5 w-3.5" />
            {item.downloads?.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <Heart className="h-3.5 w-3.5" />
            {item.likes?.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <span className="line-clamp-1">{item.author.name}</span>
          {item.author.verified && (
            <CheckCircle2 className="h-3.5 w-3.5 text-blue-500 shrink-0" />
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
