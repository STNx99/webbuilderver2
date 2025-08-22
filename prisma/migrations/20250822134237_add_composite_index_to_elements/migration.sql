-- DropIndex
DROP INDEX "public"."Element_ProjectId_idx";

-- CreateIndex
CREATE INDEX "Element_ProjectId_Order_idx" ON "public"."Element"("ProjectId", "Order");
