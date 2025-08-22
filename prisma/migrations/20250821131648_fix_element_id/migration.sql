/*
  Warnings:

  - The primary key for the `Element` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `PK_Elements` on the `Element` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `Element` table. All the data in the column will be lost.
  - You are about to drop the column `href` on the `Element` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Element` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `Element` table. All the data in the column will be lost.
  - You are about to drop the column `parentId` on the `Element` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `Element` table. All the data in the column will be lost.
  - You are about to drop the column `src` on the `Element` table. All the data in the column will be lost.
  - You are about to drop the column `styles` on the `Element` table. All the data in the column will be lost.
  - You are about to drop the column `tailwindStyles` on the `Element` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Element` table. All the data in the column will be lost.
  - The primary key for the `Image` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `imageId` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `imageLink` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `imageName` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Image` table. All the data in the column will be lost.
  - The primary key for the `Project` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `description` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `ownerId` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `published` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `styles` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `subdomain` on the `Project` table. All the data in the column will be lost.
  - The primary key for the `Setting` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `elementId` on the `Setting` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Setting` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Setting` table. All the data in the column will be lost.
  - You are about to drop the column `settingType` on the `Setting` table. All the data in the column will be lost.
  - You are about to drop the column `settings` on the `Setting` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - The primary key for the `__EFMigrationsHistory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `migrationId` on the `__EFMigrationsHistory` table. All the data in the column will be lost.
  - You are about to drop the column `productVersion` on the `__EFMigrationsHistory` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ElementId]` on the table `Setting` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `Id` to the `Element` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ProjectId` to the `Element` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Type` to the `Element` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ImageId` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UserId` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Id` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Name` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `OwnerId` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ElementId` to the `Setting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Id` to the `Setting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Name` to the `Setting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `SettingType` to the `Setting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Settings` to the `Setting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `CreatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Email` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Id` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UpdatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `MigrationId` to the `__EFMigrationsHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ProductVersion` to the `__EFMigrationsHistory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Element" DROP CONSTRAINT "Element_parentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Element" DROP CONSTRAINT "Element_projectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Image" DROP CONSTRAINT "FK_Images_Users_UserId";

-- DropForeignKey
ALTER TABLE "public"."Project" DROP CONSTRAINT "FK_Projects_Users_OwnerId";

-- DropForeignKey
ALTER TABLE "public"."Setting" DROP CONSTRAINT "FK_Settings_Elements_ElementId";

-- DropIndex
DROP INDEX "public"."Element_parentId_idx";

-- DropIndex
DROP INDEX "public"."Element_projectId_idx";

-- DropIndex
DROP INDEX "public"."IX_Images_UserId";

-- DropIndex
DROP INDEX "public"."IX_Projects_OwnerId";

-- DropIndex
DROP INDEX "public"."IX_Settings_ElementId";

-- DropIndex
DROP INDEX "public"."Setting_elementId_key";

-- AlterTable
ALTER TABLE "public"."Element" DROP CONSTRAINT "Element_pkey",
DROP COLUMN "PK_Elements",
DROP COLUMN "content",
DROP COLUMN "href",
DROP COLUMN "name",
DROP COLUMN "order",
DROP COLUMN "parentId",
DROP COLUMN "projectId",
DROP COLUMN "src",
DROP COLUMN "styles",
DROP COLUMN "tailwindStyles",
DROP COLUMN "type",
ADD COLUMN     "Content" TEXT,
ADD COLUMN     "Href" TEXT,
ADD COLUMN     "Id" TEXT NOT NULL,
ADD COLUMN     "Name" TEXT,
ADD COLUMN     "Order" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "ParentId" TEXT,
ADD COLUMN     "ProjectId" TEXT NOT NULL,
ADD COLUMN     "Src" TEXT,
ADD COLUMN     "Styles" JSONB,
ADD COLUMN     "TailwindStyles" TEXT,
ADD COLUMN     "Type" VARCHAR(32) NOT NULL,
ADD CONSTRAINT "Element_pkey" PRIMARY KEY ("Id");

-- AlterTable
ALTER TABLE "public"."Image" DROP CONSTRAINT "PK_Images",
DROP COLUMN "imageId",
DROP COLUMN "imageLink",
DROP COLUMN "imageName",
DROP COLUMN "userId",
ADD COLUMN     "ImageId" TEXT NOT NULL,
ADD COLUMN     "ImageLink" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "ImageName" TEXT,
ADD COLUMN     "UserId" TEXT NOT NULL,
ADD CONSTRAINT "PK_Images" PRIMARY KEY ("ImageId");

-- AlterTable
ALTER TABLE "public"."Project" DROP CONSTRAINT "PK_Projects",
DROP COLUMN "description",
DROP COLUMN "id",
DROP COLUMN "name",
DROP COLUMN "ownerId",
DROP COLUMN "published",
DROP COLUMN "styles",
DROP COLUMN "subdomain",
ADD COLUMN     "Description" TEXT,
ADD COLUMN     "Id" TEXT NOT NULL,
ADD COLUMN     "Name" TEXT NOT NULL,
ADD COLUMN     "OwnerId" TEXT NOT NULL,
ADD COLUMN     "Published" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "Styles" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "Subdomain" TEXT,
ADD CONSTRAINT "PK_Projects" PRIMARY KEY ("Id");

-- AlterTable
ALTER TABLE "public"."Setting" DROP CONSTRAINT "PK_Settings",
DROP COLUMN "elementId",
DROP COLUMN "id",
DROP COLUMN "name",
DROP COLUMN "settingType",
DROP COLUMN "settings",
ADD COLUMN     "ElementId" TEXT NOT NULL,
ADD COLUMN     "Id" TEXT NOT NULL,
ADD COLUMN     "Name" TEXT NOT NULL,
ADD COLUMN     "SettingType" TEXT NOT NULL,
ADD COLUMN     "Settings" TEXT NOT NULL,
ADD CONSTRAINT "PK_Settings" PRIMARY KEY ("Id");

-- AlterTable
ALTER TABLE "public"."User" DROP CONSTRAINT "PK_Users",
DROP COLUMN "createdAt",
DROP COLUMN "email",
DROP COLUMN "firstName",
DROP COLUMN "id",
DROP COLUMN "imageUrl",
DROP COLUMN "lastName",
DROP COLUMN "updatedAt",
ADD COLUMN     "CreatedAt" TIMESTAMPTZ(6) NOT NULL,
ADD COLUMN     "Email" TEXT NOT NULL,
ADD COLUMN     "FirstName" TEXT,
ADD COLUMN     "Id" TEXT NOT NULL,
ADD COLUMN     "ImageUrl" TEXT,
ADD COLUMN     "LastName" TEXT,
ADD COLUMN     "UpdatedAt" TIMESTAMPTZ(6) NOT NULL,
ADD CONSTRAINT "PK_Users" PRIMARY KEY ("Id");

-- AlterTable
ALTER TABLE "public"."__EFMigrationsHistory" DROP CONSTRAINT "PK___EFMigrationsHistory",
DROP COLUMN "migrationId",
DROP COLUMN "productVersion",
ADD COLUMN     "MigrationId" VARCHAR(150) NOT NULL,
ADD COLUMN     "ProductVersion" VARCHAR(32) NOT NULL,
ADD CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId");

-- CreateIndex
CREATE INDEX "Element_ParentId_idx" ON "public"."Element"("ParentId");

-- CreateIndex
CREATE INDEX "Element_ProjectId_idx" ON "public"."Element"("ProjectId");

-- CreateIndex
CREATE INDEX "IX_Images_UserId" ON "public"."Image"("UserId");

-- CreateIndex
CREATE INDEX "IX_Projects_OwnerId" ON "public"."Project"("OwnerId");

-- CreateIndex
CREATE UNIQUE INDEX "Setting_ElementId_key" ON "public"."Setting"("ElementId");

-- CreateIndex
CREATE INDEX "IX_Settings_ElementId" ON "public"."Setting"("ElementId");

-- AddForeignKey
ALTER TABLE "public"."Element" ADD CONSTRAINT "Element_ParentId_fkey" FOREIGN KEY ("ParentId") REFERENCES "public"."Element"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Element" ADD CONSTRAINT "Element_ProjectId_fkey" FOREIGN KEY ("ProjectId") REFERENCES "public"."Project"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Image" ADD CONSTRAINT "FK_Images_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "public"."User"("Id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Project" ADD CONSTRAINT "FK_Projects_Users_OwnerId" FOREIGN KEY ("OwnerId") REFERENCES "public"."User"("Id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Setting" ADD CONSTRAINT "FK_Settings_Elements_ElementId" FOREIGN KEY ("ElementId") REFERENCES "public"."Element"("Id") ON DELETE CASCADE ON UPDATE NO ACTION;
