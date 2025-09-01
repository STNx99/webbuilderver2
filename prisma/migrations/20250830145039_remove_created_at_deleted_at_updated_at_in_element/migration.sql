/*
  Warnings:

  - You are about to drop the column `CreatedAt` on the `Element` table. All the data in the column will be lost.
  - You are about to drop the column `DeletedAt` on the `Element` table. All the data in the column will be lost.
  - You are about to drop the column `UpdatedAt` on the `Element` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Element" DROP COLUMN "CreatedAt",
DROP COLUMN "DeletedAt",
DROP COLUMN "UpdatedAt";
