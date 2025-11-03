/*
  Warnings:

  - You are about to drop the column `CustomStyles` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "CustomStyles",
ADD COLUMN     "Header" JSONB;

-- CreateTable
CREATE TABLE "ContentType" (
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Description" TEXT,
    "Id" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentType_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "ContentField" (
    "ContentTypeId" TEXT NOT NULL,
    "Id" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "Required" BOOLEAN NOT NULL DEFAULT false,
    "Type" TEXT NOT NULL,

    CONSTRAINT "ContentField_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "ContentFieldValue" (
    "ContentItemId" TEXT NOT NULL,
    "FieldId" TEXT NOT NULL,
    "Id" TEXT NOT NULL,
    "Value" TEXT,

    CONSTRAINT "ContentFieldValue_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "ContentItem" (
    "ContentTypeId" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Id" TEXT NOT NULL,
    "Published" BOOLEAN NOT NULL DEFAULT false,
    "Slug" TEXT NOT NULL,
    "Title" TEXT NOT NULL,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentItem_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "MarketplaceItem" (
    "Id" TEXT NOT NULL,
    "Title" TEXT NOT NULL,
    "Description" TEXT NOT NULL,
    "Preview" TEXT,
    "TemplateType" TEXT NOT NULL DEFAULT 'block',
    "Featured" BOOLEAN NOT NULL DEFAULT false,
    "PageCount" INTEGER,
    "Downloads" INTEGER NOT NULL DEFAULT 0,
    "Likes" INTEGER NOT NULL DEFAULT 0,
    "AuthorId" TEXT NOT NULL,
    "AuthorName" TEXT NOT NULL,
    "Verified" BOOLEAN NOT NULL DEFAULT false,
    "CreatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(6) NOT NULL,
    "DeletedAt" TIMESTAMP(6),

    CONSTRAINT "MarketplaceItem_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Category" (
    "Id" TEXT NOT NULL,
    "Name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "Id" TEXT NOT NULL,
    "Name" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "MarketplaceItemTag" (
    "ItemId" TEXT NOT NULL,
    "TagId" TEXT NOT NULL,

    CONSTRAINT "MarketplaceItemTag_pkey" PRIMARY KEY ("ItemId","TagId")
);

-- CreateTable
CREATE TABLE "MarketplaceItemCategory" (
    "ItemId" TEXT NOT NULL,
    "CategoryId" TEXT NOT NULL,

    CONSTRAINT "MarketplaceItemCategory_pkey" PRIMARY KEY ("ItemId","CategoryId")
);

-- CreateIndex
CREATE UNIQUE INDEX "ContentType_Name_key" ON "ContentType"("Name");

-- CreateIndex
CREATE UNIQUE INDEX "ContentField_ContentTypeId_Name_key" ON "ContentField"("ContentTypeId", "Name");

-- CreateIndex
CREATE UNIQUE INDEX "ContentFieldValue_ContentItemId_FieldId_key" ON "ContentFieldValue"("ContentItemId", "FieldId");

-- CreateIndex
CREATE UNIQUE INDEX "ContentItem_Slug_key" ON "ContentItem"("Slug");

-- CreateIndex
CREATE INDEX "MarketplaceItem_AuthorId_idx" ON "MarketplaceItem"("AuthorId");

-- CreateIndex
CREATE INDEX "MarketplaceItem_TemplateType_idx" ON "MarketplaceItem"("TemplateType");

-- CreateIndex
CREATE INDEX "MarketplaceItem_Featured_idx" ON "MarketplaceItem"("Featured");

-- CreateIndex
CREATE UNIQUE INDEX "Category_Name_key" ON "Category"("Name");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_Name_key" ON "Tag"("Name");

-- CreateIndex
CREATE INDEX "MarketplaceItemTag_TagId_idx" ON "MarketplaceItemTag"("TagId");

-- CreateIndex
CREATE INDEX "MarketplaceItemCategory_CategoryId_idx" ON "MarketplaceItemCategory"("CategoryId");

-- AddForeignKey
ALTER TABLE "ContentField" ADD CONSTRAINT "ContentField_ContentTypeId_fkey" FOREIGN KEY ("ContentTypeId") REFERENCES "ContentType"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentFieldValue" ADD CONSTRAINT "ContentFieldValue_ContentItemId_fkey" FOREIGN KEY ("ContentItemId") REFERENCES "ContentItem"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentFieldValue" ADD CONSTRAINT "ContentFieldValue_FieldId_fkey" FOREIGN KEY ("FieldId") REFERENCES "ContentField"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentItem" ADD CONSTRAINT "ContentItem_ContentTypeId_fkey" FOREIGN KEY ("ContentTypeId") REFERENCES "ContentType"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketplaceItem" ADD CONSTRAINT "MarketplaceItem_AuthorId_fkey" FOREIGN KEY ("AuthorId") REFERENCES "User"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketplaceItemTag" ADD CONSTRAINT "MarketplaceItemTag_ItemId_fkey" FOREIGN KEY ("ItemId") REFERENCES "MarketplaceItem"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketplaceItemTag" ADD CONSTRAINT "MarketplaceItemTag_TagId_fkey" FOREIGN KEY ("TagId") REFERENCES "Tag"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketplaceItemCategory" ADD CONSTRAINT "MarketplaceItemCategory_ItemId_fkey" FOREIGN KEY ("ItemId") REFERENCES "MarketplaceItem"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketplaceItemCategory" ADD CONSTRAINT "MarketplaceItemCategory_CategoryId_fkey" FOREIGN KEY ("CategoryId") REFERENCES "Category"("Id") ON DELETE CASCADE ON UPDATE CASCADE;
