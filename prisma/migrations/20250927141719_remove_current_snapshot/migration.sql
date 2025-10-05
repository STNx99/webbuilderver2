/*
  Warnings:

  - You are about to drop the `CurrentSnapshot` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."CurrentSnapshot" DROP CONSTRAINT "CurrentSnapshot_ProjectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."CurrentSnapshot" DROP CONSTRAINT "CurrentSnapshot_SnapshotId_fkey";

-- DropTable
DROP TABLE "public"."CurrentSnapshot";
