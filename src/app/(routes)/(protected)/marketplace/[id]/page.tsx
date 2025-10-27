import { Suspense } from "react";
import { MarketplaceItemDetailWrapper } from "./MarketplaceItemDetailWrapper";

interface MarketplaceItemPageProps {
  params: Promise<{ id: string }>;
}

export default async function MarketplaceItemPage({
  params,
}: MarketplaceItemPageProps) {
  const { id } = await params;

  return (
    <Suspense fallback={
      <div className="min-h-screen min-w-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading template...</p>
        </div>
      </div>
    }>
      <MarketplaceItemDetailWrapper id={id} />
    </Suspense>
  );
}