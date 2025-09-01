-- DropForeignKey
ALTER TABLE "public"."Element" DROP CONSTRAINT "Element_ParentId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Element" ADD CONSTRAINT "Element_ParentId_fkey" FOREIGN KEY ("ParentId") REFERENCES "public"."Element"("Id") ON DELETE CASCADE ON UPDATE CASCADE;
