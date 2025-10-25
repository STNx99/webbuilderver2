import { Suspense } from "react";
import { MarketplaceHero } from "@/components/marketplace/MarketplaceHero";
import { MarketplaceFilters } from "@/components/marketplace/MarketplaceFilters";
import { MarketplaceGrid } from "@/components/marketplace/MarketplaceGrid";
import MarketplaceFooter from "@/components/marketplace/MarketplaceFooter";

export default async function MarketplacePage() {
  return (
    <div className="min-h-screen w-screen bg-background">
      <Suspense fallback={<div className="h-24" />}>
        <MarketplaceHero />
      </Suspense>

      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex gap-8">
            <Suspense fallback={<div className="w-64" />}>
              <MarketplaceFilters />
            </Suspense>
            <div className="flex-1">
              <Suspense fallback={<div className="flex-1" />}>
                <MarketplaceGrid />
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      <MarketplaceFooter />
    </div>
  );
}
