/*
  Warnings:

  - You are about to drop the `__EFMigrationsHistory` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `CreatedAt` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UpdatedAt` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Project" ADD COLUMN     "CreatedAt" TIMESTAMP(6) NOT NULL,
ADD COLUMN     "DeletedAt" TIMESTAMP(6),
ADD COLUMN     "UpdatedAt" TIMESTAMP(6) NOT NULL;

-- DropTable
DROP TABLE "public"."__EFMigrationsHistory";
