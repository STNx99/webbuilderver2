"use client";

import { useState } from "react";
import { MarketplaceCard } from "./MarketplaceCard";
import { marketplaceItems } from "@/lib/mock-data";
import { MarketplaceItem } from "@/lib/types";
import { Button } from "@/components/ui/button";

export function MarketplaceGrid() {
  const [displayCount, setDisplayCount] = useState(6);

  const loadMore = () => {
    setDisplayCount((prev) => Math.min(prev + 6, marketplaceItems.length));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {Math.min(displayCount, marketplaceItems.length)} of{" "}
          {marketplaceItems.length} templates
        </p>
        <select className="text-sm border border-border rounded-md px-3 py-1.5 bg-background">
          <option>Most Popular</option>
          <option>Most Recent</option>
          <option>Most Downloaded</option>
          <option>Most Liked</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {marketplaceItems
          .slice(0, displayCount)
          .map((item: MarketplaceItem) => (
            <MarketplaceCard key={item.id} item={item} />
          ))}
      </div>

      {displayCount < marketplaceItems.length && (
        <div className="flex justify-center pt-4">
          <Button onClick={loadMore} variant="outline" size="lg">
            Load More Templates
          </Button>
        </div>
      )}
    </div>
  );
}
