-- AlterTable
ALTER TABLE "MarketplaceItem" ADD COLUMN     "ProjectId" TEXT;

-- CreateIndex
CREATE INDEX "MarketplaceItem_ProjectId_idx" ON "MarketplaceItem"("ProjectId");

-- AddForeignKey
ALTER TABLE "MarketplaceItem" ADD CONSTRAINT "MarketplaceItem_ProjectId_fkey" FOREIGN KEY ("ProjectId") REFERENCES "Project"("Id") ON DELETE SET NULL ON UPDATE CASCADE;
