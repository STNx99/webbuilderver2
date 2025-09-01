/*
  Warnings:

  - You are about to drop the column `CreatedAt` on the `Setting` table. All the data in the column will be lost.
  - You are about to drop the column `DeletedAt` on the `Setting` table. All the data in the column will be lost.
  - You are about to drop the column `UpdatedAt` on the `Setting` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Setting" DROP COLUMN "CreatedAt",
DROP COLUMN "DeletedAt",
DROP COLUMN "UpdatedAt";
