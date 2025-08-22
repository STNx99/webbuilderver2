/*
  Warnings:

  - Added the required column `CreatedAt` to the `Element` table without a default value. This is not possible if the table is not empty.
  - Added the required column `PageId` to the `Element` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UpdatedAt` to the `Element` table without a default value. This is not possible if the table is not empty.
  - Added the required column `CreatedAt` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UpdatedAt` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `CreatedAt` to the `Setting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UpdatedAt` to the `Setting` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Element" ADD COLUMN     "CreatedAt" TIMESTAMP(6) NOT NULL,
ADD COLUMN     "DeletedAt" TIMESTAMP(6),
ADD COLUMN     "PageId" TEXT NOT NULL,
ADD COLUMN     "UpdatedAt" TIMESTAMP(6) NOT NULL;

-- AlterTable
ALTER TABLE "public"."Image" ADD COLUMN     "CreatedAt" TIMESTAMP(6) NOT NULL,
ADD COLUMN     "DeletedAt" TIMESTAMP(6),
ADD COLUMN     "UpdatedAt" TIMESTAMP(6) NOT NULL;

-- AlterTable
ALTER TABLE "public"."Setting" ADD COLUMN     "CreatedAt" TIMESTAMP(6) NOT NULL,
ADD COLUMN     "DeletedAt" TIMESTAMP(6),
ADD COLUMN     "UpdatedAt" TIMESTAMP(6) NOT NULL;

-- CreateTable
CREATE TABLE "public"."Page" (
    "Id" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "Type" TEXT NOT NULL,
    "Styles" JSONB NOT NULL,
    "ProjectId" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(6) NOT NULL,
    "UpdatedAt" TIMESTAMP(6) NOT NULL,
    "DeletedAt" TIMESTAMP(6),

    CONSTRAINT "Page_pkey" PRIMARY KEY ("Id")
);

-- CreateIndex
CREATE INDEX "Page_ProjectId_idx" ON "public"."Page"("ProjectId");

-- CreateIndex
CREATE UNIQUE INDEX "Page_ProjectId_Name_key" ON "public"."Page"("ProjectId", "Name");

-- CreateIndex
CREATE INDEX "Element_PageId_idx" ON "public"."Element"("PageId");

-- AddForeignKey
ALTER TABLE "public"."Element" ADD CONSTRAINT "Element_PageId_fkey" FOREIGN KEY ("PageId") REFERENCES "public"."Page"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Page" ADD CONSTRAINT "Page_ProjectId_fkey" FOREIGN KEY ("ProjectId") REFERENCES "public"."Project"("Id") ON DELETE CASCADE ON UPDATE CASCADE;
