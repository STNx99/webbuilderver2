-- CreateTable
CREATE TABLE "public"."Element" (
    "PK_Elements" TEXT NOT NULL,
    "type" VARCHAR(32) NOT NULL,
    "content" TEXT,
    "name" TEXT,
    "styles" JSONB,
    "tailwindStyles" TEXT,
    "src" TEXT,
    "href" TEXT,
    "parentId" TEXT,
    "projectId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Element_pkey" PRIMARY KEY ("PK_Elements")
);

-- CreateTable
CREATE TABLE "public"."Image" (
    "imageId" TEXT NOT NULL,
    "imageName" TEXT,
    "userId" TEXT NOT NULL,
    "imageLink" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "PK_Images" PRIMARY KEY ("imageId")
);

-- CreateTable
CREATE TABLE "public"."Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "ownerId" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "subdomain" TEXT,
    "styles" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "PK_Projects" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Setting" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "settingType" TEXT NOT NULL,
    "settings" TEXT NOT NULL,
    "elementId" TEXT NOT NULL,

    CONSTRAINT "PK_Settings" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "PK_Users" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."__EFMigrationsHistory" (
    "migrationId" VARCHAR(150) NOT NULL,
    "productVersion" VARCHAR(32) NOT NULL,

    CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("migrationId")
);

-- CreateIndex
CREATE INDEX "Element_parentId_idx" ON "public"."Element"("parentId");

-- CreateIndex
CREATE INDEX "Element_projectId_idx" ON "public"."Element"("projectId");

-- CreateIndex
CREATE INDEX "IX_Images_UserId" ON "public"."Image"("userId");

-- CreateIndex
CREATE INDEX "IX_Projects_OwnerId" ON "public"."Project"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "Setting_elementId_key" ON "public"."Setting"("elementId");

-- CreateIndex
CREATE INDEX "IX_Settings_ElementId" ON "public"."Setting"("elementId");

-- AddForeignKey
ALTER TABLE "public"."Element" ADD CONSTRAINT "Element_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."Element"("PK_Elements") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Element" ADD CONSTRAINT "Element_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Image" ADD CONSTRAINT "FK_Images_Users_UserId" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Project" ADD CONSTRAINT "FK_Projects_Users_OwnerId" FOREIGN KEY ("ownerId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Setting" ADD CONSTRAINT "FK_Settings_Elements_ElementId" FOREIGN KEY ("elementId") REFERENCES "public"."Element"("PK_Elements") ON DELETE CASCADE ON UPDATE NO ACTION;
