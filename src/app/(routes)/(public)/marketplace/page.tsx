import { MarketplaceHero } from "@/components/marketplace/MarketplaceHero";
import { MarketplaceFilters } from "@/components/marketplace/MarketplaceFilters";
import { MarketplaceGrid } from "@/components/marketplace/MarketplaceGrid";

export default function MarketplacePage() {
  return (
    <div className="min-h-screen w-screen bg-background">
      <MarketplaceHero />

      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex gap-8">
            <MarketplaceFilters />
            <div className="flex-1">
              <MarketplaceGrid />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
