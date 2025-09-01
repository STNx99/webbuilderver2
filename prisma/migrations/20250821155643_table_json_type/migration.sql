/*
  Warnings:

  - The `Styles` column on the `Project` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `Settings` on the `Setting` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."Project" DROP COLUMN "Styles",
ADD COLUMN     "Styles" JSONB;

-- AlterTable
ALTER TABLE "public"."Setting" DROP COLUMN "Settings",
ADD COLUMN     "Settings" JSONB NOT NULL;
