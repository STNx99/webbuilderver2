/*
  Warnings:

  - A unique constraint covering the columns `[ProjectId]` on the table `MarketplaceItem` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `Name` to the `Snapshot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Type` to the `Snapshot` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SnapshotType" AS ENUM ('working', 'version');

-- CreateEnum
CREATE TYPE "CollaboratorRole" AS ENUM ('owner', 'editor', 'viewer');

-- AlterTable
ALTER TABLE "Snapshot" ADD COLUMN     "Name" TEXT NOT NULL,
ADD COLUMN     "Type" "SnapshotType" NOT NULL;

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "BankCode" TEXT,
ADD COLUMN     "CardType" TEXT,
ADD COLUMN     "Email" TEXT,
ADD COLUMN     "PayDate" TIMESTAMP(3),
ADD COLUMN     "TransactionNo" TEXT,
ALTER COLUMN "Status" SET DEFAULT 'pending',
ALTER COLUMN "Currency" SET DEFAULT 'VND';

-- CreateTable
CREATE TABLE "CustomElementType" (
    "Id" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "Description" TEXT,
    "Category" TEXT,
    "Icon" TEXT,
    "CreatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "CustomElementType_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "CustomElement" (
    "Id" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "TypeId" TEXT,
    "Description" TEXT,
    "Category" VARCHAR(100),
    "Icon" VARCHAR(255),
    "Thumbnail" VARCHAR(255),
    "Structure" JSONB NOT NULL,
    "DefaultProps" JSONB,
    "Tags" VARCHAR(500),
    "UserId" TEXT NOT NULL,
    "IsPublic" BOOLEAN NOT NULL DEFAULT false,
    "Version" VARCHAR(20) NOT NULL DEFAULT '1.0.0',
    "CreatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomElement_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Invitation" (
    "Id" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "ProjectId" TEXT NOT NULL,
    "Role" "CollaboratorRole" NOT NULL DEFAULT 'editor',
    "Token" TEXT NOT NULL,
    "ExpiresAt" TIMESTAMP(3) NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "AcceptedAt" TIMESTAMP(3),

    CONSTRAINT "Invitation_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Collaborator" (
    "Id" TEXT NOT NULL,
    "UserId" TEXT NOT NULL,
    "ProjectId" TEXT NOT NULL,
    "Role" "CollaboratorRole" NOT NULL DEFAULT 'editor',
    "CreatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "Collaborator_pkey" PRIMARY KEY ("Id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CustomElementType_Name_key" ON "CustomElementType"("Name");

-- CreateIndex
CREATE INDEX "CustomElement_UserId_idx" ON "CustomElement"("UserId");

-- CreateIndex
CREATE INDEX "CustomElement_TypeId_idx" ON "CustomElement"("TypeId");

-- CreateIndex
CREATE UNIQUE INDEX "Invitation_Token_key" ON "Invitation"("Token");

-- CreateIndex
CREATE INDEX "Invitation_ProjectId_idx" ON "Invitation"("ProjectId");

-- CreateIndex
CREATE INDEX "Invitation_Token_idx" ON "Invitation"("Token");

-- CreateIndex
CREATE INDEX "Collaborator_UserId_idx" ON "Collaborator"("UserId");

-- CreateIndex
CREATE INDEX "Collaborator_ProjectId_idx" ON "Collaborator"("ProjectId");

-- CreateIndex
CREATE UNIQUE INDEX "Collaborator_UserId_ProjectId_key" ON "Collaborator"("UserId", "ProjectId");

-- CreateIndex
CREATE UNIQUE INDEX "MarketplaceItem_ProjectId_key" ON "MarketplaceItem"("ProjectId");

-- AddForeignKey
ALTER TABLE "CustomElement" ADD CONSTRAINT "CustomElement_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomElement" ADD CONSTRAINT "CustomElement_TypeId_fkey" FOREIGN KEY ("TypeId") REFERENCES "CustomElementType"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_ProjectId_fkey" FOREIGN KEY ("ProjectId") REFERENCES "Project"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collaborator" ADD CONSTRAINT "Collaborator_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collaborator" ADD CONSTRAINT "Collaborator_ProjectId_fkey" FOREIGN KEY ("ProjectId") REFERENCES "Project"("Id") ON DELETE CASCADE ON UPDATE CASCADE;
