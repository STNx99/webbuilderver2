This file is a merged representation of the entire codebase, combined into a single document by Repomix.
The content has been processed where content has been compressed (code blocks are separated by ⋮---- delimiter).

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Content has been compressed - code blocks are separated by ⋮---- delimiter
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
.codacy/
  codacy.yaml
prisma/
  migrations/
    20250821115631_update_element_schema/
      migration.sql
    20250821131648_fix_element_id/
      migration.sql
    20250821151948_add_deleted_at_to_project/
      migration.sql
    20250821155643_table_json_type/
      migration.sql
    20250822095607_add_page/
      migration.sql
    20250822134237_add_composite_index_to_elements/
      migration.sql
    20250822153417_make_page_id_optional/
      migration.sql
    20250830144931_remove_created_at_deleted_at_updated_at_in_setting/
      migration.sql
    20250830145039_remove_created_at_deleted_at_updated_at_in_element/
      migration.sql
    20250901081619_add_cascadedelete_for_element_children/
      migration.sql
    20250902112021_describe_change/
      migration.sql
    20250927114344_add_current_snapshot/
      migration.sql
    20250927141613_add_current_snapshot_model/
      migration.sql
    20250927141719_remove_current_snapshot/
      migration.sql
    migration_lock.toml
  schema.prisma
public/
  file.svg
  globe.svg
  next.svg
  vercel.svg
  window.svg
src/
  app/
    (routes)/
      (auth)/
        sign-in/
          [[...login]]/
            page.tsx
        sign-up/
          [[...signup]]/
            page.tsx
        layout.tsx
      (proctected)/
        dashboard/
          dashboard.tsx
          layout.tsx
          page.tsx
        editor/
          [id]/
            editor.tsx
            layout.tsx
            page.tsx
        projectsettings/
          [id]/
            page.tsx
      (public)/
        (main)/
          page.tsx
        preview/
          [id]/
            page.tsx
    actions/
      pageAction.ts
      projectAction.ts
    api/
      gettoken/
        route.ts
    globals.css
    layout.tsx
  client/
    queryclient.ts
  components/
    dashboard/
      CreateProjectDialog.tsx
      DashboardSidebar.tsx
    editor/
      ai/
        AiChatPanel.tsx
        GenerateButton.tsx
      editor/
        CssTextareaImporter.tsx
        EditorCanvas.tsx
        EditorHeader.tsx
        PreviewContainer.tsx
      editorcomponents/
        BaseComponent.tsx
        ButtonComponent.tsx
        CarouselComponent.tsx
        CMSContentGridComponent.tsx
        CMSContentItemComponent.tsx
        CMSContentListComponent.tsx
        DataLoaderComponent.tsx
        FormComponent.tsx
        FrameComponent.tsx
        ImageComponent.tsx
        InputComponent.tsx
        ListComponent.tsx
        SectionComponent.tsx
        SelectComponent.tsx
      resizehandler/
        ResizeHandler.tsx
        ResizeTooltip.tsx
      sidebar/
        cmsmanager/
          tabs/
            ContentFieldsTab.tsx
            ContentItemsTab.tsx
            ContentTypesTab.tsx
          CMSManager.tsx
        configurations/
          AppearanceAccordion.tsx
          BreakpointSelector.tsx
          CarouselConfiguration.tsx
          CMSConfiguration.tsx
          Configurations.tsx
          DataLoaderConfiguration.tsx
          FormConfiguration.tsx
          InputConfiguration.tsx
          LinkConfiguration.tsx
          TailwindAccordion.tsx
          TypographyAccordion.tsx
          ValidationConfigration.tsx
        ComponentHolder.tsx
        EditorSideBar.tsx
        ElementSelector.tsx
        ElementTreeItem.tsx
        LayoutSideBar.tsx
      skeleton/
        ElementLoading.tsx
      ComponentTooltip.tsx
      EditorContextMenu.tsx
      ElementLoader.tsx
      ProjectPageCommand.tsx
      ResponsivePreviewer.tsx
    landingpage/
      LandingPageFAQ.tsx
      LandingPageFeature.tsx
      LandingPageHero.tsx
      LandingPagePricing.tsx
    projectsettings/
      ColorInput.tsx
      ProjectPreview.tsx
      ProjectSettings.tsx
    ui/
      accordion.tsx
      alert-dialog.tsx
      avatar.tsx
      badge.tsx
      breadcrumb.tsx
      button.tsx
      card.tsx
      carousel.tsx
      collapsible.tsx
      command.tsx
      context-menu.tsx
      dialog.tsx
      drawer.tsx
      dropdown-menu.tsx
      form.tsx
      input.tsx
      label.tsx
      popover.tsx
      select.tsx
      separator.tsx
      sheet.tsx
      sidebar.tsx
      skeleton.tsx
      slider.tsx
      switch.tsx
      table.tsx
      tabs.tsx
      textarea.tsx
      tooltip.tsx
    TestCarousel.tsx
    ThemeSwticher.tsx
  constants/
    direciton.ts
    elements.tsx
    endpoints.ts
    viewports.ts
  data/
    page.ts
    project.ts
  globalstore/
    elementstore.tsx
    pagestore.tsx
    projectstore.tsx
    selectionstore.tsx
  hooks/
    use-mobile.ts
    useCMSContent.ts
    useCMSManager.ts
    useEditor.ts
    useElementHandler.ts
    useGridEditor.ts
    useResizeHandler.ts
  interfaces/
    cms.interface.ts
    editor.interface.ts
    elements.interface.ts
    page.interface.ts
    project.interface.ts
    snapshot.interface.ts
    validate.interface.ts
  lib/
    customcomponents/
      card/
        cardComponents.ts
      footer/
        footerComponents.ts
      form/
        formComponents.ts
      header/
        headerComponents.ts
      landingpage/
        landingPageComponents.ts
      navbar/
        navbarComponents.ts
      sidebar/
        sidebarLeftComponents.ts
        sidebarRightComponents.ts
      advancedComponents.ts
      customComponents.ts
    utils/
      element/
        create/
          createElements.ts
          elementCreateStrategy.ts
          elementStrategyMap.ts
        computeTailwindFromStyles.ts
        elementhelper.ts
        handleSwap.ts
        keyBoardEvents.ts
      projectsettings/
        designSystemUtils.ts
      geturl.ts
      prepareElements.ts
    prisma.ts
    utils.ts
  providers/
    aiprovider.tsx
    editorprovider.tsx
    queryprovider.tsx
    rootprovider.tsx
    themeprovider.tsx
  schema/
    zod/
      cms.ts
      element.ts
      image.ts
      index.ts
      page.ts
      project.ts
      setting.ts
      user.ts
  services/
    apiclient.ts
    cms.ts
    element.ts
    project.ts
    token.ts
  types/
    editor.tsx
    global.type.ts
  middleware.ts
.gitignore
components.json
next.config.ts
package.json
postcss.config.mjs
README.md
tailwind.config.ts
tsconfig.json
```

# Files

## File: .codacy/codacy.yaml
````yaml
runtimes:
    - dart@3.7.2
    - go@1.22.3
    - java@17.0.10
    - node@22.2.0
    - python@3.11.11
tools:
    - dartanalyzer@3.7.2
    - eslint@8.57.0
    - lizard@1.17.31
    - pmd@7.11.0
    - pylint@3.3.6
    - revive@1.7.0
    - semgrep@1.78.0
    - trivy@0.66.0
````

## File: prisma/migrations/20250821115631_update_element_schema/migration.sql
````sql
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
````

## File: prisma/migrations/20250821131648_fix_element_id/migration.sql
````sql
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
````

## File: prisma/migrations/20250821151948_add_deleted_at_to_project/migration.sql
````sql
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
````

## File: prisma/migrations/20250821155643_table_json_type/migration.sql
````sql
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
````

## File: prisma/migrations/20250822095607_add_page/migration.sql
````sql
/*
  Warnings:

  - Added the required column `CreatedAt` to the `Element` table without a default value. This is not possible if the table is not empty.
  - Added the required column `PageId` to the `Element` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UpdatedAt` to the `Element` table without a default value. This is not possible if the table is not empty.
  - Added the required column `CreatedAt` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UpdatedAt` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `CreatedAt` to the `Setting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UpdatedAt` to the `Setting` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Element" ADD COLUMN     "CreatedAt" TIMESTAMP(6) NOT NULL,
ADD COLUMN     "DeletedAt" TIMESTAMP(6),
ADD COLUMN     "PageId" TEXT NOT NULL,
ADD COLUMN     "UpdatedAt" TIMESTAMP(6) NOT NULL;

-- AlterTable
ALTER TABLE "public"."Image" ADD COLUMN     "CreatedAt" TIMESTAMP(6) NOT NULL,
ADD COLUMN     "DeletedAt" TIMESTAMP(6),
ADD COLUMN     "UpdatedAt" TIMESTAMP(6) NOT NULL;

-- AlterTable
ALTER TABLE "public"."Setting" ADD COLUMN     "CreatedAt" TIMESTAMP(6) NOT NULL,
ADD COLUMN     "DeletedAt" TIMESTAMP(6),
ADD COLUMN     "UpdatedAt" TIMESTAMP(6) NOT NULL;

-- CreateTable
CREATE TABLE "public"."Page" (
    "Id" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "Type" TEXT NOT NULL,
    "Styles" JSONB NOT NULL,
    "ProjectId" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(6) NOT NULL,
    "UpdatedAt" TIMESTAMP(6) NOT NULL,
    "DeletedAt" TIMESTAMP(6),

    CONSTRAINT "Page_pkey" PRIMARY KEY ("Id")
);

-- CreateIndex
CREATE INDEX "Page_ProjectId_idx" ON "public"."Page"("ProjectId");

-- CreateIndex
CREATE UNIQUE INDEX "Page_ProjectId_Name_key" ON "public"."Page"("ProjectId", "Name");

-- CreateIndex
CREATE INDEX "Element_PageId_idx" ON "public"."Element"("PageId");

-- AddForeignKey
ALTER TABLE "public"."Element" ADD CONSTRAINT "Element_PageId_fkey" FOREIGN KEY ("PageId") REFERENCES "public"."Page"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Page" ADD CONSTRAINT "Page_ProjectId_fkey" FOREIGN KEY ("ProjectId") REFERENCES "public"."Project"("Id") ON DELETE CASCADE ON UPDATE CASCADE;
````

## File: prisma/migrations/20250822134237_add_composite_index_to_elements/migration.sql
````sql
-- DropIndex
DROP INDEX "public"."Element_ProjectId_idx";

-- CreateIndex
CREATE INDEX "Element_ProjectId_Order_idx" ON "public"."Element"("ProjectId", "Order");
````

## File: prisma/migrations/20250822153417_make_page_id_optional/migration.sql
````sql
-- AlterTable
ALTER TABLE "public"."Element" ALTER COLUMN "PageId" DROP NOT NULL;
````

## File: prisma/migrations/20250830144931_remove_created_at_deleted_at_updated_at_in_setting/migration.sql
````sql
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
````

## File: prisma/migrations/20250830145039_remove_created_at_deleted_at_updated_at_in_element/migration.sql
````sql
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
````

## File: prisma/migrations/20250901081619_add_cascadedelete_for_element_children/migration.sql
````sql
-- DropForeignKey
ALTER TABLE "public"."Element" DROP CONSTRAINT "Element_ParentId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Element" ADD CONSTRAINT "Element_ParentId_fkey" FOREIGN KEY ("ParentId") REFERENCES "public"."Element"("Id") ON DELETE CASCADE ON UPDATE CASCADE;
````

## File: prisma/migrations/20250902112021_describe_change/migration.sql
````sql
-- AlterTable
ALTER TABLE "public"."Project" ADD COLUMN     "CustomStyles" TEXT;
````

## File: prisma/migrations/20250927114344_add_current_snapshot/migration.sql
````sql
-- CreateTable
CREATE TABLE "public"."Snapshot" (
    "Id" TEXT NOT NULL,
    "ProjectId" TEXT NOT NULL,
    "Elements" JSONB NOT NULL,
    "Timestamp" BIGINT NOT NULL,
    "CreatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Snapshot_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."CurrentSnapshot" (
    "Id" TEXT NOT NULL,
    "ProjectId" TEXT NOT NULL,
    "SnapshotId" TEXT NOT NULL,
    "UpdatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CurrentSnapshot_pkey" PRIMARY KEY ("Id")
);

-- CreateIndex
CREATE INDEX "Snapshot_ProjectId_Timestamp_idx" ON "public"."Snapshot"("ProjectId", "Timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "CurrentSnapshot_ProjectId_key" ON "public"."CurrentSnapshot"("ProjectId");

-- CreateIndex
CREATE UNIQUE INDEX "CurrentSnapshot_SnapshotId_key" ON "public"."CurrentSnapshot"("SnapshotId");

-- CreateIndex
CREATE INDEX "CurrentSnapshot_ProjectId_idx" ON "public"."CurrentSnapshot"("ProjectId");

-- AddForeignKey
ALTER TABLE "public"."Snapshot" ADD CONSTRAINT "Snapshot_ProjectId_fkey" FOREIGN KEY ("ProjectId") REFERENCES "public"."Project"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CurrentSnapshot" ADD CONSTRAINT "CurrentSnapshot_ProjectId_fkey" FOREIGN KEY ("ProjectId") REFERENCES "public"."Project"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CurrentSnapshot" ADD CONSTRAINT "CurrentSnapshot_SnapshotId_fkey" FOREIGN KEY ("SnapshotId") REFERENCES "public"."Snapshot"("Id") ON DELETE CASCADE ON UPDATE CASCADE;
````

## File: prisma/migrations/20250927141613_add_current_snapshot_model/migration.sql
````sql
-- AlterTable
ALTER TABLE "public"."CurrentSnapshot" ADD COLUMN     "CreatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;
````

## File: prisma/migrations/20250927141719_remove_current_snapshot/migration.sql
````sql
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
````

## File: prisma/migrations/migration_lock.toml
````toml
# Please do not edit this file manually
# It should be added in your version-control system (e.g., Git)
provider = "postgresql"
````

## File: prisma/schema.prisma
````
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Element {
  Content        String?
  Href           String?
  Id             String    @id @map("Id")
  Name           String?
  Order          Int       @default(0)
  ParentId       String?
  ProjectId      String
  Src            String?
  Styles         Json?
  TailwindStyles String?
  Type           String    @db.VarChar(32)
  PageId         String?
  Page           Page?     @relation(fields: [PageId], references: [Id], onDelete: Cascade)
  Parent         Element?  @relation("ElementChildren", fields: [ParentId], references: [Id], onDelete: Cascade)
  Elements       Element[] @relation("ElementChildren")
  Project        Project   @relation(fields: [ProjectId], references: [Id], onDelete: Cascade)
  Settings       Setting?  @relation("ElementSettings")

  @@index([ParentId])
  @@index([PageId])
  @@index([ProjectId, Order])
}

model Image {
  ImageId   String    @id(map: "PK_Images")
  ImageLink String    @default("")
  ImageName String?
  UserId    String
  CreatedAt DateTime  @db.Timestamp(6)
  DeletedAt DateTime? @db.Timestamp(6)
  UpdatedAt DateTime  @db.Timestamp(6)
  User      User      @relation(fields: [UserId], references: [Id], onDelete: Cascade, onUpdate: NoAction, map: "FK_Images_Users_UserId")

  @@index([UserId], map: "IX_Images_UserId")
}

model Project {
  Description String?
  Id          String     @id(map: "PK_Projects")
  Name        String
  OwnerId     String
  Published   Boolean    @default(false)
  Subdomain   String?
  CreatedAt   DateTime   @db.Timestamp(6)
  DeletedAt   DateTime?  @db.Timestamp(6)
  UpdatedAt   DateTime   @db.Timestamp(6)
  Styles      Json?
  Header      Json?
  Elements    Element[]
  Pages       Page[]
  Owner       User       @relation(fields: [OwnerId], references: [Id], onDelete: Cascade, onUpdate: NoAction, map: "FK_Projects_Users_OwnerId")
  Snapshots   Snapshot[]

  @@index([OwnerId], map: "IX_Projects_OwnerId")
}

model Page {
  Id        String    @id @map("Id")
  Name      String
  Type      String
  Styles    Json
  ProjectId String
  CreatedAt DateTime  @db.Timestamp(6)
  UpdatedAt DateTime  @db.Timestamp(6)
  DeletedAt DateTime? @db.Timestamp(6)
  Elements  Element[]
  Project   Project   @relation(fields: [ProjectId], references: [Id], onDelete: Cascade)

  @@unique([ProjectId, Name])
  @@index([ProjectId])
}

model Setting {
  ElementId   String  @unique
  Id          String  @id(map: "PK_Settings")
  Name        String
  SettingType String
  Settings    Json
  Element     Element @relation("ElementSettings", fields: [ElementId], references: [Id], onDelete: Cascade, onUpdate: NoAction, map: "FK_Settings_Elements_ElementId")

  @@index([ElementId], map: "IX_Settings_ElementId")
}

model Snapshot {
  Id        String   @id @map("Id")
  ProjectId String
  Elements  Json
  Timestamp BigInt
  CreatedAt DateTime @default(now()) @db.Timestamp(6)
  Project   Project  @relation(fields: [ProjectId], references: [Id], onDelete: Cascade)

  @@index([ProjectId, Timestamp])
}

model User {
  CreatedAt DateTime  @db.Timestamptz(6)
  Email     String
  FirstName String?
  Id        String    @id(map: "PK_Users")
  ImageUrl  String?
  LastName  String?
  UpdatedAt DateTime  @db.Timestamptz(6)
  Images    Image[]
  Projects  Project[]
}

model ContentType {
  CreatedAt   DateTime       @default(now())
  Description String?
  Id          String         @id @default(cuid())
  Name        String         @unique
  UpdatedAt   DateTime       @updatedAt
  Fields      ContentField[]
  Items       ContentItem[]
}

model ContentField {
  ContentTypeId String
  Id            String              @id @default(cuid())
  Name          String
  Required      Boolean             @default(false)
  Type          String
  ContentType   ContentType         @relation(fields: [ContentTypeId], references: [Id], onDelete: Cascade)
  Values        ContentFieldValue[]

  @@unique([ContentTypeId, Name])
}

model ContentFieldValue {
  ContentItemId String
  FieldId       String
  Id            String       @id @default(cuid())
  Value         String?
  ContentItem   ContentItem  @relation(fields: [ContentItemId], references: [Id], onDelete: Cascade)
  Field         ContentField @relation(fields: [FieldId], references: [Id], onDelete: Cascade)

  @@unique([ContentItemId, FieldId])
}

model ContentItem {
  ContentTypeId String
  CreatedAt     DateTime            @default(now())
  Id            String              @id @default(cuid())
  Published     Boolean             @default(false)
  Slug          String              @unique
  Title         String
  UpdatedAt     DateTime            @updatedAt
  FieldValues   ContentFieldValue[]
  ContentType   ContentType         @relation(fields: [ContentTypeId], references: [Id], onDelete: Cascade)
}
````

## File: public/file.svg
````
<svg fill="none" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M14.5 13.5V5.41a1 1 0 0 0-.3-.7L9.8.29A1 1 0 0 0 9.08 0H1.5v13.5A2.5 2.5 0 0 0 4 16h8a2.5 2.5 0 0 0 2.5-2.5m-1.5 0v-7H8v-5H3v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1M9.5 5V2.12L12.38 5zM5.13 5h-.62v1.25h2.12V5zm-.62 3h7.12v1.25H4.5zm.62 3h-.62v1.25h7.12V11z" clip-rule="evenodd" fill="#666" fill-rule="evenodd"/></svg>
````

## File: public/globe.svg
````
<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><g clip-path="url(#a)"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.27 14.1a6.5 6.5 0 0 0 3.67-3.45q-1.24.21-2.7.34-.31 1.83-.97 3.1M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.48-1.52a7 7 0 0 1-.96 0H7.5a4 4 0 0 1-.84-1.32q-.38-.89-.63-2.08a40 40 0 0 0 3.92 0q-.25 1.2-.63 2.08a4 4 0 0 1-.84 1.31zm2.94-4.76q1.66-.15 2.95-.43a7 7 0 0 0 0-2.58q-1.3-.27-2.95-.43a18 18 0 0 1 0 3.44m-1.27-3.54a17 17 0 0 1 0 3.64 39 39 0 0 1-4.3 0 17 17 0 0 1 0-3.64 39 39 0 0 1 4.3 0m1.1-1.17q1.45.13 2.69.34a6.5 6.5 0 0 0-3.67-3.44q.65 1.26.98 3.1M8.48 1.5l.01.02q.41.37.84 1.31.38.89.63 2.08a40 40 0 0 0-3.92 0q.25-1.2.63-2.08a4 4 0 0 1 .85-1.32 7 7 0 0 1 .96 0m-2.75.4a6.5 6.5 0 0 0-3.67 3.44 29 29 0 0 1 2.7-.34q.31-1.83.97-3.1M4.58 6.28q-1.66.16-2.95.43a7 7 0 0 0 0 2.58q1.3.27 2.95.43a18 18 0 0 1 0-3.44m.17 4.71q-1.45-.12-2.69-.34a6.5 6.5 0 0 0 3.67 3.44q-.65-1.27-.98-3.1" fill="#666"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h16v16H0z"/></clipPath></defs></svg>
````

## File: public/next.svg
````
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 394 80"><path fill="#000" d="M262 0h68.5v12.7h-27.2v66.6h-13.6V12.7H262V0ZM149 0v12.7H94v20.4h44.3v12.6H94v21h55v12.6H80.5V0h68.7zm34.3 0h-17.8l63.8 79.4h17.9l-32-39.7 32-39.6h-17.9l-23 28.6-23-28.6zm18.3 56.7-9-11-27.1 33.7h17.8l18.3-22.7z"/><path fill="#000" d="M81 79.3 17 0H0v79.3h13.6V17l50.2 62.3H81Zm252.6-.4c-1 0-1.8-.4-2.5-1s-1.1-1.6-1.1-2.6.3-1.8 1-2.5 1.6-1 2.6-1 1.8.3 2.5 1a3.4 3.4 0 0 1 .6 4.3 3.7 3.7 0 0 1-3 1.8zm23.2-33.5h6v23.3c0 2.1-.4 4-1.3 5.5a9.1 9.1 0 0 1-3.8 3.5c-1.6.8-3.5 1.3-5.7 1.3-2 0-3.7-.4-5.3-1s-2.8-1.8-3.7-3.2c-.9-1.3-1.4-3-1.4-5h6c.1.8.3 1.6.7 2.2s1 1.2 1.6 1.5c.7.4 1.5.5 2.4.5 1 0 1.8-.2 2.4-.6a4 4 0 0 0 1.6-1.8c.3-.8.5-1.8.5-3V45.5zm30.9 9.1a4.4 4.4 0 0 0-2-3.3 7.5 7.5 0 0 0-4.3-1.1c-1.3 0-2.4.2-3.3.5-.9.4-1.6 1-2 1.6a3.5 3.5 0 0 0-.3 4c.3.5.7.9 1.3 1.2l1.8 1 2 .5 3.2.8c1.3.3 2.5.7 3.7 1.2a13 13 0 0 1 3.2 1.8 8.1 8.1 0 0 1 3 6.5c0 2-.5 3.7-1.5 5.1a10 10 0 0 1-4.4 3.5c-1.8.8-4.1 1.2-6.8 1.2-2.6 0-4.9-.4-6.8-1.2-2-.8-3.4-2-4.5-3.5a10 10 0 0 1-1.7-5.6h6a5 5 0 0 0 3.5 4.6c1 .4 2.2.6 3.4.6 1.3 0 2.5-.2 3.5-.6 1-.4 1.8-1 2.4-1.7a4 4 0 0 0 .8-2.4c0-.9-.2-1.6-.7-2.2a11 11 0 0 0-2.1-1.4l-3.2-1-3.8-1c-2.8-.7-5-1.7-6.6-3.2a7.2 7.2 0 0 1-2.4-5.7 8 8 0 0 1 1.7-5 10 10 0 0 1 4.3-3.5c2-.8 4-1.2 6.4-1.2 2.3 0 4.4.4 6.2 1.2 1.8.8 3.2 2 4.3 3.4 1 1.4 1.5 3 1.5 5h-5.8z"/></svg>
````

## File: public/vercel.svg
````
<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1155 1000"><path d="m577.3 0 577.4 1000H0z" fill="#fff"/></svg>
````

## File: public/window.svg
````
<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.5 2.5h13v10a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1zM0 1h16v11.5a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 0 12.5zm3.75 4.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M7 4.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m1.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5" fill="#666"/></svg>
````

## File: src/app/(routes)/(auth)/sign-in/[[...login]]/page.tsx
````typescript
import React from "react";
import { SignIn } from "@clerk/nextjs";
⋮----
const LoginPage: React.FC = () =>
````

## File: src/app/(routes)/(auth)/sign-up/[[...signup]]/page.tsx
````typescript
import React from "react";
import { SignUp } from "@clerk/nextjs";
⋮----
const SignUpPage: React.FC = () =>
````

## File: src/app/(routes)/(auth)/layout.tsx
````typescript
import React, { PropsWithChildren } from "react";
⋮----
const AuthLayout: React.FC<PropsWithChildren> = (
````

## File: src/app/(routes)/(proctected)/dashboard/dashboard.tsx
````typescript
import { useState } from "react";
import {
  Grid,
  List,
  Plus,
  Search,
  SortAsc,
  SortDesc,
  Eye,
  MoreHorizontal,
  Trash2,
  BarChart3,
  Calendar,
  Filter,
} from "lucide-react";
⋮----
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Image from "next/image";
import CreateProjectDialog from "@/components/dashboard/CreateProjectDialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { projectService } from "@/services/project";
import { useQuery } from "@tanstack/react-query";
import type { Project } from "@/interfaces/project.interface";
⋮----
type SortOption = "name" | "views" | "created" | "modified";
type ViewMode = "grid" | "list";
⋮----
{/* No thumbnail property on Project, so use placeholder */}
⋮----
{/* Header with Sidebar Trigger and Breadcrumbs */}
⋮----
{/* Header */}
⋮----
{/* Create Project Dialog */}
⋮----
{/* Filters and Controls */}
⋮----
{/* Projects Display */}
⋮----
{/* Delete Confirmation Dialog */}
````

## File: src/app/(routes)/(proctected)/dashboard/layout.tsx
````typescript
import type React from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
⋮----
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
})
````

## File: src/app/(routes)/(proctected)/dashboard/page.tsx
````typescript
import Dashboard from "./dashboard";
⋮----
export default async function DashboardPage()
````

## File: src/app/(routes)/(proctected)/editor/[id]/editor.tsx
````typescript
import React from "react";
import EditorHeader from "@/components/editor/editor/EditorHeader";
import PreviewContainer from "@/components/editor/editor/PreviewContainer";
import EditorCanvas from "@/components/editor/editor/EditorCanvas";
import { useEditor } from "@/hooks/useEditor";
⋮----
type EditorProps = {
  id: string;
  pageId: string;
};
⋮----
export default function Editor(
````

## File: src/app/(routes)/(proctected)/editor/[id]/layout.tsx
````typescript
import EditorProvider from "@/providers/editorprovider";
⋮----
export default function Layout(
````

## File: src/app/(routes)/(proctected)/editor/[id]/page.tsx
````typescript
import { getQueryClient } from "@/client/queryclient";
import { projectService } from "@/services/project";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import Editor from "./editor";
⋮----
export default async function EditorPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page: string }>;
})
⋮----
<HydrationBoundary state=
````

## File: src/app/(routes)/(proctected)/projectsettings/[id]/page.tsx
````typescript
import ProjectSettings from "@/components/projectsettings/ProjectSettings";
⋮----
export default function ProjectSettingsPage()
````

## File: src/app/(routes)/(public)/(main)/page.tsx
````typescript
import { ArrowRight, Sparkles, Star, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
⋮----
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import ThemeSwitcher from "@/components/ThemeSwticher";
import LandingPageHero from "@/components/landingpage/LandingPageHero";
import LandingPagePricing from "@/components/landingpage/LandingPagePricing";
import LandingPageFAQ from "@/components/landingpage/LandingPageFAQ";
import LandingPageFeature from "@/components/landingpage/LandingPageFeature";
⋮----
function useInView(options =
⋮----
// Intersection observer refs for each section
⋮----
const handleScroll = () =>
⋮----
// Trigger initial animations
⋮----
// features array removed - now using LandingPageFeature component
⋮----
{/* Header */}
⋮----
{/* Desktop Navigation */}
⋮----
{/* Mobile Menu */}
⋮----
{/* Hero Section */}
⋮----
{/* Stats Section */}
⋮----
{/* Features Section */}
⋮----
{/* Testimonials Section */}
⋮----
{/* Pricing Section */}
⋮----
{/* Call to Action Section */}
⋮----
{/* Footer */}
````

## File: src/app/(routes)/(public)/preview/[id]/page.tsx
````typescript
export default function Page()
````

## File: src/app/actions/pageAction.ts
````typescript
import { pageDAL } from "@/data/page";
import { Page } from "@/interfaces/page.interface";
import { PageSchema } from "@/schema/zod";
import { auth } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from "uuid";
⋮----
export default async function createPage(page: Partial<Page>)
````

## File: src/app/actions/projectAction.ts
````typescript
import { projectDAL } from "@/data/project";
import { Project } from "@/interfaces/project.interface";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";
⋮----
export default async function createProject(project: Partial<Project>)
````

## File: src/app/api/gettoken/route.ts
````typescript
import { auth, clerkClient } from "@clerk/nextjs/server";
⋮----
// In-memory cache for tokens with short TTL to match JWT lifetime
interface CachedToken {
  jwt: string;
  expiresAt: number;
}
⋮----
function getCachedToken(sessionId: string): string | null
⋮----
// Check if token has expired (with safety buffer)
⋮----
function setCachedToken(sessionId: string, jwt: string): void
⋮----
// Cleanup expired tokens every 2 minutes
function cleanupExpiredTokens(): void
⋮----
// Run cleanup periodically
⋮----
export async function GET()
⋮----
// Check cache first (only valid for 45 seconds)
⋮----
"Cache-Control": "private, no-cache", // Don't cache in browser due to short lifetime
⋮----
// Fetch new token if not cached or expired
⋮----
// Cache the token for 45 seconds
⋮----
"Cache-Control": "private, no-cache", // Don't cache in browser
````

## File: src/app/globals.css
````css
:root {
⋮----
.dark {
⋮----
@theme inline {
⋮----
body {
⋮----
@theme {
⋮----
@layer base {
⋮----
* {
⋮----
*,
⋮----
@layer utilities {
⋮----
.font {
⋮----
.editor-element-enter {
⋮----
.editor-element-exit {
⋮----
.editor-element-dragging {
⋮----
.resize-handle {
⋮----
.resize-handle:hover {
⋮----
.animate-fade-in {
⋮----
.animate-fade-in-delay-1 {
⋮----
.animate-fade-in-delay-2 {
⋮----
.animate-fade-in-delay-3 {
⋮----
.animate-fade-in-delay-4 {
⋮----
.animate-fade-in-delay-5 {
⋮----
html,
````

## File: src/app/layout.tsx
````typescript
// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
⋮----
import RootProviders from "@/providers/rootprovider";
⋮----
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>)
````

## File: src/client/queryclient.ts
````typescript
import { isServer, QueryClient } from "@tanstack/react-query";
⋮----
export function makeQueryClient()
⋮----
staleTime: 1000 * 60 * 5, // 5 minutes
⋮----
export function getQueryClient()
````

## File: src/components/dashboard/CreateProjectDialog.tsx
````typescript
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import createProject from "@/app/actions/projectAction";
import React from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
⋮----
type CreateProjectDialogProps = {
  children?: React.ReactNode;
  isCreateDialogOpen: boolean;
  setIsCreateDialogOpen: (open: boolean) => void;
};
⋮----
// TanStack  mutation for create project
⋮----
// Use TanStacddk Query mutation for create
const handleSubmit = async (data: z.infer<typeof projectSchema>) =>
⋮----
onSubmit=
````

## File: src/components/dashboard/DashboardSidebar.tsx
````typescript
import {
  BarChart3,
  Settings,
  User,
  FolderOpen,
  Plus,
  Home,
  Bell,
  HelpCircle,
  LogOut,
  ChevronUp,
} from "lucide-react";
⋮----
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CreateProjectDialog from "./CreateProjectDialog";
import Link from "next/link";
⋮----
// Navigation items
⋮----
// Mock user data
⋮----
interface DashboardSidebarProps extends React.ComponentProps<typeof Sidebar> {}
````

## File: src/components/editor/ai/AiChatPanel.tsx
````typescript
import { useEffect, useRef, useCallback, useTransition } from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  ImageIcon,
  MonitorIcon,
  Paperclip,
  SendIcon,
  XIcon,
  LoaderIcon,
  Sparkles,
  Command,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
⋮----
import { Button } from "@/components/ui/button";
import { useAiChat } from "@/providers/aiprovider";
import { useSidebar } from "@/components/ui/sidebar";
import { useElementStore } from "@/globalstore/elementstore";
import { useSelectionStore } from "@/globalstore/selectionstore";
⋮----
interface UseAutoResizeTextareaProps {
  minHeight: number;
  maxHeight?: number;
}
⋮----
function useAutoResizeTextarea({
  minHeight,
  maxHeight,
}: UseAutoResizeTextareaProps)
⋮----
const handleResize = ()
⋮----
interface CommandSuggestion {
  icon: React.ReactNode;
  label: string;
  description: string;
  prefix: string;
}
⋮----
interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  containerClassName?: string;
  showRing?: boolean;
}
⋮----
const handleMouseMove = (e: MouseEvent) =>
⋮----
const handleClickOutside = (event: MouseEvent) =>
⋮----
const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) =>
⋮----
const handleSendMessage = () =>
⋮----
const handleAttachFile = () =>
⋮----
const removeAttachment = (index: number) =>
⋮----
const selectCommandSuggestion = (index: number) =>
⋮----
{/* Selected element */}
⋮----
setValue(e.target.value);
adjustHeight();
⋮----
document.head.appendChild(style);
````

## File: src/components/editor/ai/GenerateButton.tsx
````typescript
import { Button } from "@/components/ui/button";
import { useElementStore } from "@/globalstore/elementstore";
import { EditorElement } from "@/types/global.type";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import React from "react";
import { z } from "zod";
⋮----
export default function GenerateButton()
⋮----
// Use useEffect to add the generated element when object changes
⋮----
const handleGenerate = () =>
⋮----
// Optionally handle error here
````

## File: src/components/editor/editor/CssTextareaImporter.tsx
````typescript
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useProjectStore } from "@/globalstore/projectstore";
import Link from "next/link";
⋮----
type Props = {
  maxInlineSize?: number;
};
⋮----
const validateCss = (text: string): string | null =>
⋮----
const handleInject = async () =>
⋮----
// ignore
⋮----
const handleClear = async () =>
⋮----
const handleFileChange = async (f?: File | null) =>
⋮----
https://tweakcn.com
⋮----
onChange=
````

## File: src/components/editor/editor/EditorCanvas.tsx
````typescript
import React, { useEffect, useRef } from "react";
import { EditorElement } from "@/types/global.type";
import ElementLoader from "@/components/editor/ElementLoader";
import ElementLoading from "@/components/editor/skeleton/ElementLoading";
import { Button } from "@/components/ui/button";
import { KeyboardEvent as KeyboardEventClass } from "@/lib/utils/element/keyBoardEvents";
⋮----
type EditorCanvasProps = {
  isDraggingOver: boolean;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  isLoading: boolean;
  selectedElement: EditorElement | null;
  addNewSection: () => void;
};
⋮----
const handleKeyDown = (e: KeyboardEvent) =>
````

## File: src/components/editor/editor/EditorHeader.tsx
````typescript
import React from "react";
import { Input } from "@/components/ui/input";
import { Monitor, Smartphone, Tablet } from "lucide-react";
import { Viewport } from "@/hooks/useEditor";
import CssTextareaImporter from "./CssTextareaImporter";
import { Button } from "@/components/ui/button";
⋮----
type EditorHeaderProps = {
  handlePageNavigation: (e: React.FocusEvent<HTMLInputElement>) => void;
  currentView: Viewport;
  setCurrentView: (view: Viewport) => void;
};
````

## File: src/components/editor/editor/PreviewContainer.tsx
````typescript
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import { createPortal } from "react-dom";
import { viewportSizes } from "@/constants/viewports";
import { Viewport } from "@/hooks/useEditor";
import { cn } from "@/lib/utils";
import { useProjectStore } from "@/globalstore/projectstore";
import ElementLoading from "@/components/editor/skeleton/ElementLoading";
⋮----
type PreviewContainerProps = {
  currentView: Viewport;
  children: React.ReactNode;
  isLoading?: boolean;
};
⋮----
/**
 * PreviewContainer
 *
 * - Always renders an iframe for all viewports so the preview is isolated from
 *   the editor DOM. Children are portaled into the iframe's `#react-iframe-root`.
 * - Copies stylesheet <link> and <style> tags from the parent document head
 *   and injects project custom styles into the iframe head so Tailwind / CSS is
 *   available inside the iframe.
 * - Shows the same ElementLoading skeleton used by the EditorCanvas while
 *   content is loading or while the iframe hasn't mounted yet.
 */
⋮----
const handleLoad = () =>
⋮----
// If iframe already ready, attempt to handle immediately.
⋮----
// When projectHead (injected CSS/links) changes we must ensure the iframe
// head is updated in-place so the preview reflects the new styles without
// waiting for a full iframe reload. We add/remove a marker element ID and
// append the new nodes directly into the iframe head.
//
// Special handling: If the injected content contains a <link rel="stylesheet"
// href="blob:..."> we can't rely on simply copying the <link> into the iframe
// in some environments. Instead, fetch the blob URL content and inject it as
// a <style> tag so the styles take effect reliably.
⋮----
// Only attempt to update after the mount node (iframe content) exists.
⋮----
// Remove any previous injected nodes
⋮----
// If there's nothing to inject, we're done.
⋮----
// Create a temporary container to parse the HTML snippet (which may
// contain <style> and/or <link> tags) and examine them.
⋮----
// Helper to append a <style> with given CSS text into the iframe head.
const appendStyle = (cssText: string) =>
⋮----
// ignore failures to append style
⋮----
// Collect any async fetch promises (for blob: links)
⋮----
// If it's a blob: URL, fetch its contents and inject as <style>.
⋮----
// silently ignore fetch failures
⋮----
// If it's a style node, import it
⋮----
// ignore
⋮----
// Fallback: try to import any other node types (meta, etc.)
⋮----
// ignore
⋮----
// Wait for blob fetches to complete (fire-and-forget is also ok, but waiting
// helps ensure styles are applied quickly). Errors are ignored.
⋮----
// Ignore cross-origin or other unexpected errors silently.
⋮----
<div className=
````

## File: src/components/editor/editorcomponents/BaseComponent.tsx
````typescript
import React from "react";
import DOMPurify from "dompurify";
import { useElementHandler } from "@/hooks/useElementHandler";
import { EditorComponentProps } from "@/interfaces/editor.interface";
import { TextElement } from "@/interfaces/elements.interface";
import { elementHelper } from "@/lib/utils/element/elementhelper";
⋮----
// Apply placeholder replacement if content is from element.content and data is available
⋮----
// Show raw content with placeholders when editing, replaced content when not editing
````

## File: src/components/editor/editorcomponents/ButtonComponent.tsx
````typescript
import React from "react";
import { useElementHandler } from "@/hooks/useElementHandler";
import DOMPurify from "dompurify";
import { EditorComponentProps } from "@/interfaces/editor.interface";
import { ButtonElement } from "@/interfaces/elements.interface";
import { elementHelper } from "@/lib/utils/element/elementhelper";
````

## File: src/components/editor/editorcomponents/CarouselComponent.tsx
````typescript
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useElementHandler } from "@/hooks/useElementHandler";
import { EditorComponentProps } from "@/interfaces/editor.interface";
import {
  CarouselElement,
  CarouselSettings,
} from "@/interfaces/elements.interface";
import { cn } from "@/lib/utils";
import { EditorElement } from "@/types/global.type";
import { elementHelper } from "@/lib/utils/element/elementhelper";
import React from "react";
import ElementLoader from "../ElementLoader";
````

## File: src/components/editor/editorcomponents/CMSContentGridComponent.tsx
````typescript
import React, { useEffect } from "react";
import { useElementHandler } from "@/hooks/useElementHandler";
import { EditorComponentProps } from "@/interfaces/editor.interface";
import { CMSContentGridElement } from "@/interfaces/elements.interface";
import { LayoutGroup } from "framer-motion";
import ElementLoader from "../ElementLoader";
import { Database } from "lucide-react";
import { useCMSContent, getFieldValue } from "@/hooks/useCMSContent";
import { elementHelper } from "@/lib/utils/element/elementhelper";
⋮----
// Get CMS settings
⋮----
// Apply limit
⋮----
src=
⋮----
{/* Content field (fallback if no excerpt) */}
````

## File: src/components/editor/editorcomponents/CMSContentItemComponent.tsx
````typescript
import React from "react";
import { useElementHandler } from "@/hooks/useElementHandler";
import { EditorComponentProps } from "@/interfaces/editor.interface";
import { CMSContentItemElement } from "@/interfaces/elements.interface";
import ElementLoader from "../ElementLoader";
import { Database } from "lucide-react";
import { useCMSContentItem, getFieldValue } from "@/hooks/useCMSContent";
import { elementHelper } from "@/lib/utils/element/elementhelper";
⋮----
// Use child elements as template
⋮----
// Default rendering
````

## File: src/components/editor/editorcomponents/CMSContentListComponent.tsx
````typescript
import React from "react";
import { useElementHandler } from "@/hooks/useElementHandler";
import { EditorComponentProps } from "@/interfaces/editor.interface";
import { CMSContentListElement } from "@/interfaces/elements.interface";
import { LayoutGroup } from "framer-motion";
import ElementLoader from "../ElementLoader";
import { Database } from "lucide-react";
import { useCMSContent } from "@/hooks/useCMSContent";
import { elementHelper } from "@/lib/utils/element/elementhelper";
import { getFieldValue } from "@/hooks/useCMSContent";
⋮----
// Get CMS settings
⋮----
// Use provided data or CMS content
⋮----
// Apply limit
⋮----
// Use child elements as template
⋮----
// Default rendering
````

## File: src/components/editor/editorcomponents/DataLoaderComponent.tsx
````typescript
import React, { useState, useEffect } from "react";
import { useElementHandler } from "@/hooks/useElementHandler";
import { EditorComponentProps } from "@/interfaces/editor.interface";
import { DataLoaderElement } from "@/interfaces/elements.interface";
import ElementLoader from "../ElementLoader";
import { elementHelper } from "@/lib/utils/element/elementhelper";
⋮----
const DataLoaderComponent = (
⋮----
const fetchData = async () =>
````

## File: src/components/editor/editorcomponents/FormComponent.tsx
````typescript
import { Button } from "@/components/ui/button";
import { useElementHandler } from "@/hooks/useElementHandler";
import { EditorElement } from "@/types/global.type";
import { elementHelper } from "@/lib/utils/element/elementhelper";
import { useParams, useSearchParams } from "next/navigation";
import { useElementStore } from "@/globalstore/elementstore";
import { useSelectionStore } from "@/globalstore/selectionstore";
import { FormElement, InputElement } from "@/interfaces/elements.interface";
import { EditorComponentProps } from "@/interfaces/editor.interface";
import ElementLoader from "../ElementLoader";
⋮----
const handleAddField = () =>
⋮----
const handleChildChange = (index: number, updatedChild: EditorElement) =>
````

## File: src/components/editor/editorcomponents/FrameComponent.tsx
````typescript
import React from "react";
import { useElementHandler } from "@/hooks/useElementHandler";
import { EditorComponentProps } from "@/interfaces/editor.interface";
import { FrameElement } from "@/interfaces/elements.interface";
import ElementLoader from "../ElementLoader";
import { elementHelper } from "@/lib/utils/element/elementhelper";
⋮----
const FrameComponent = (
````

## File: src/components/editor/editorcomponents/ImageComponent.tsx
````typescript
import React from "react";
import { EditorElement } from "@/types/global.type";
import { EditorComponentProps } from "@/interfaces/editor.interface";
import Image from "next/image";
import { elementHelper } from "@/lib/utils/element/elementhelper";
⋮----
type Props = EditorComponentProps;
````

## File: src/components/editor/editorcomponents/InputComponent.tsx
````typescript
import { useElementHandler } from "@/hooks/useElementHandler";
import { EditorComponentProps } from "@/interfaces/editor.interface";
import { InputElement } from "@/interfaces/elements.interface";
import React from "react";
import { elementHelper } from "@/lib/utils/element/elementhelper";
⋮----
const InputComponent = (
````

## File: src/components/editor/editorcomponents/ListComponent.tsx
````typescript
import React from "react";
import { useElementHandler } from "@/hooks/useElementHandler";
import { EditorComponentProps } from "@/interfaces/editor.interface";
import { ListElement } from "@/interfaces/elements.interface";
import { LayoutGroup } from "framer-motion";
import ElementLoader from "../ElementLoader";
import { elementHelper } from "@/lib/utils/element/elementhelper";
⋮----
// If data is an array, render each item using child elements as template
⋮----
// If data is array, pass the item data to child elements
⋮----
// Otherwise, render the element directly
````

## File: src/components/editor/editorcomponents/SectionComponent.tsx
````typescript
import React from "react";
import { elementHelper } from "@/lib/utils/element/elementhelper";
import { useElementHandler } from "@/hooks/useElementHandler";
import { SectionElement } from "@/interfaces/elements.interface";
import { EditorComponentProps } from "@/interfaces/editor.interface";
import { Button } from "@/components/ui/button";
import { useParams, useSearchParams } from "next/navigation";
import { useElementStore } from "@/globalstore/elementstore";
import { useSelectionStore } from "@/globalstore/selectionstore";
import ElementLoader from "../ElementLoader";
⋮----
const handleCreateSeciont = () =>
````

## File: src/components/editor/editorcomponents/SelectComponent.tsx
````typescript
import { EditorComponentProps } from "@/interfaces/editor.interface";
import { SelectElement } from "@/interfaces/elements.interface";
import React from "react";
import { elementHelper } from "@/lib/utils/element/elementhelper";
````

## File: src/components/editor/resizehandler/ResizeHandler.tsx
````typescript
import { useElementStore } from "@/globalstore/elementstore";
import { useSelectionStore } from "@/globalstore/selectionstore";
import { useElementHandler } from "@/hooks/useElementHandler";
import { useResizeHandler } from "@/hooks/useResizeHandler";
import { cn } from "@/lib/utils";
import type { EditorElement } from "@/types/global.type";
import type React from "react";
import { type ReactNode, useRef } from "react";
import {
  type ResizeDirection,
  directionalClasses,
  getResizeHandles,
  hasGap,
} from "@/constants/direciton";
import ResizeTooltip from "./ResizeTooltip";
⋮----
interface ResizeHandlerProps {
  element: EditorElement;
  children: ReactNode;
}
⋮----
const handleMouseDown = (e: React.MouseEvent) =>
⋮----
// Get resize handles, excluding the gap handle
⋮----
// Use imported hasGap to determine if gap handles should be rendered
⋮----
// Helper for rendering gap handle in the center
function GapHandle({
    onResizeStart,
    isResizing,
    currentResizeDirection,
  }: {
onResizeStart: (direction: ResizeDirection, e: React.MouseEvent)
⋮----
onPointerDown=
⋮----
e.stopPropagation();
handleDoubleClick(e, element);
````

## File: src/components/editor/resizehandler/ResizeTooltip.tsx
````typescript
import type { EditorElement } from "@/types/global.type";
import type { ResizeDirection } from "@/constants/direciton";
import { CSSStyles } from "@/interfaces/elements.interface";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import type React from "react";
⋮----
function getHandleTooltip(
  direction: ResizeDirection,
  styles: CSSStyles | undefined,
): string
⋮----
// Helper for margin/padding tooltip
const getSpacingTooltip = (
    type: "margin" | "padding",
    dir: string,
): string =>
⋮----
interface ResizeTooltipProps {
  direction: ResizeDirection;
  element: EditorElement;
  children: React.ReactNode;
  isResizing?: boolean;
  currentResizeDirection?: ResizeDirection | null;
}
⋮----
export default function ResizeTooltip({
  direction,
  element,
  children,
  isResizing = false,
  currentResizeDirection = null,
}: ResizeTooltipProps)
````

## File: src/components/editor/sidebar/cmsmanager/tabs/ContentFieldsTab.tsx
````typescript
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ContentField, ContentType } from "@/interfaces/cms.interface";
import { Plus, Edit, Trash2, Database, Loader2, Save, X } from "lucide-react";
⋮----
interface ContentFieldsTabProps {
  selectedTypeId: string;
  contentTypes: ContentType[];
  contentFields: ContentField[];
  isLoading: boolean;
  createFieldMutation: any;
  updateFieldMutation: any;
  deleteFieldMutation: any;
  onCreateField: (data: any) => void;
  onDeleteField: (contentTypeId: string, fieldId: string) => void;
}
⋮----
interface EditableField {
  id?: string;
  name?: string;
  type?: string;
  required?: boolean;
  isNew?: boolean;
  isEditing?: boolean;
}
⋮----
const startEditing = (fieldId: string) =>
⋮----
const stopEditing = (fieldId: string) =>
⋮----
const addNewRow = () =>
⋮----
const cancelNewRow = () =>
⋮----
const saveNewRow = async () =>
⋮----
const updateFieldProperty = (
    fieldId: string,
    property: string,
    value: any,
) =>
⋮----
const saveExistingField = async (fieldId: string) =>
⋮----
{/* New Row */}
⋮----
{/* Existing Rows */}
````

## File: src/components/editor/sidebar/cmsmanager/tabs/ContentItemsTab.tsx
````typescript
import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ContentItem,
  ContentType,
  ContentField,
  ContentFieldValue,
} from "@/interfaces/cms.interface";
import {
  Plus,
  Edit,
  Trash2,
  Database,
  Eye,
  EyeOff,
  Loader2,
  Save,
  X,
} from "lucide-react";
⋮----
interface ContentItemsTabProps {
  selectedTypeId: string;
  contentTypes: ContentType[];
  contentFields: ContentField[];
  contentItems: ContentItem[];
  isLoading: boolean;
  createItemMutation: any;
  updateItemMutation: any;
  deleteItemMutation: any;
  onCreateItem: (data: any) => void;
  onDeleteItem: (contentTypeId: string, itemId: string) => void;
}
⋮----
interface EditableItem {
  id?: string;
  title?: string;
  slug?: string;
  published?: boolean;
  contentTypeId?: string;
  isNew?: boolean;
  isEditing?: boolean;
  fieldValues?: { [fieldId: string]: string };
}
⋮----
// Create a map of field values for quick lookup
⋮----
const startEditing = (itemId: string) =>
⋮----
const stopEditing = (itemId: string) =>
⋮----
const addNewRow = () =>
⋮----
const cancelNewRow = () =>
⋮----
const saveNewRow = async () =>
⋮----
const updateFieldValue = (itemId: string, fieldId: string, value: string) =>
⋮----
const updateItemField = (itemId: string, field: string, value: any) =>
⋮----
const saveExistingItem = async (itemId: string) =>
⋮----
{/* New Row */}
⋮----
{/* Existing Rows */}
````

## File: src/components/editor/sidebar/cmsmanager/tabs/ContentTypesTab.tsx
````typescript
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ContentType } from "@/interfaces/cms.interface";
import { Plus, Edit, Trash2, Eye, Loader2, Save, X } from "lucide-react";
⋮----
interface ContentTypesTabProps {
  contentTypes: ContentType[];
  isLoading: boolean;
  createTypeMutation: any;
  updateTypeMutation: any;
  deleteTypeMutation: any;
  onSelectType: (typeId: string) => void;
  onCreateType: (data: any) => void;
  onDeleteType: (typeId: string) => void;
}
⋮----
interface EditableType {
  id?: string;
  name?: string;
  description?: string;
  isNew?: boolean;
  isEditing?: boolean;
}
⋮----
const startEditing = (typeId: string) =>
⋮----
const stopEditing = (typeId: string) =>
⋮----
const addNewRow = () =>
⋮----
const cancelNewRow = () =>
⋮----
const saveNewRow = async () =>
⋮----
const updateTypeField = (typeId: string, field: string, value: string) =>
⋮----
const saveExistingType = async (typeId: string) =>
⋮----
{/* New Row */}
⋮----
{/* Existing Rows */}
````

## File: src/components/editor/sidebar/cmsmanager/CMSManager.tsx
````typescript
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useCMSManager } from "../../../../hooks/useCMSManager";
import { ContentTypesTab } from "./tabs/ContentTypesTab";
import { ContentFieldsTab } from "./tabs/ContentFieldsTab";
import { ContentItemsTab } from "./tabs/ContentItemsTab";
import { Database, Settings, FileText } from "lucide-react";
⋮----
const CMSManager = () =>
````

## File: src/components/editor/sidebar/configurations/AppearanceAccordion.tsx
````typescript
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { elementHelper } from "@/lib/utils/element/elementhelper";
import React, { useEffect, useState } from "react";
import { useElementStore } from "@/globalstore/elementstore";
import { useSelectionStore } from "@/globalstore/selectionstore";
import { cn } from "@/lib/utils";
import { ResponsiveStyles } from "@/interfaces/elements.interface";
⋮----
type AppearanceStyles = Pick<
  React.CSSProperties,
  // Size & Position
  | "height"
  | "width"
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "position"
  | "zIndex"
  // Color & Border
  | "backgroundColor"
  | "color"
  | "borderColor"
  | "borderWidth"
  | "borderRadius"
  | "boxShadow"
  | "outline"
  | "outlineColor"
  | "outlineWidth"
  | "outlineStyle"
  // Opacity
  | "opacity"
  // Spacing
  | "padding"
  | "paddingTop"
  | "paddingBottom"
  | "paddingLeft"
  | "paddingRight"
  | "margin"
  | "marginTop"
  | "marginBottom"
  | "marginLeft"
  | "marginRight"
  // Flexbox
  | "display"
  | "flexDirection"
  | "flexWrap"
  | "justifyContent"
  | "alignItems"
  | "alignContent"
  | "gap"
  | "rowGap"
  | "columnGap"
  | "alignSelf"
  | "order"
  | "flex"
  | "flexGrow"
  | "flexShrink"
  | "flexBasis"
  // Grid
  | "gridTemplateColumns"
  | "gridTemplateRows"
  | "gridColumn"
  | "gridRow"
  | "gridColumnStart"
  | "gridColumnEnd"
  | "gridRowStart"
  | "gridRowEnd"
  | "gridGap"
  | "gridRowGap"
  | "gridColumnGap"
  | "placeItems"
  | "placeContent"
  | "placeSelf"
  | "justifyItems"
>;
⋮----
// Size & Position
⋮----
// Color & Border
⋮----
// Opacity
⋮----
// Spacing
⋮----
// Flexbox
⋮----
// Grid
⋮----
interface AppearanceAccordionProps {
  currentBreakpoint: "default" | "sm" | "md" | "lg" | "xl";
}
⋮----
const updateStyle = <K extends keyof AppearanceStyles>(
    property: K,
    value: AppearanceStyles[K],
) =>
⋮----
{/* Size Section */}
⋮----
{/* Colors Section */}
⋮----
{/* Border Section */}
⋮----
{/* Box Shadow Section */}
⋮----
{/* Opacity Section */}
⋮----
{/* Padding Section */}
⋮----
{/* Margin Section */}
⋮----
{/* Display Section */}
⋮----
{/* Position Control */}
⋮----
{/* Display Control */}
⋮----
{/* Flex Controls */}
⋮----
{/* Grid Controls */}
⋮----
{/* Position & Z-Index Section */}
⋮----
{/* Position Values Section */}
````

## File: src/components/editor/sidebar/configurations/BreakpointSelector.tsx
````typescript
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
⋮----
interface BreakpointSelectorProps {
  currentBreakpoint: "default" | "sm" | "md" | "lg" | "xl";
  onBreakpointChange: (
    breakpoint: "default" | "sm" | "md" | "lg" | "xl",
  ) => void;
}
⋮----
export const BreakpointSelector = ({
  currentBreakpoint,
  onBreakpointChange,
}: BreakpointSelectorProps) =>
````

## File: src/components/editor/sidebar/configurations/CarouselConfiguration.tsx
````typescript
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useElementStore } from "@/globalstore/elementstore";
import { useSelectionStore } from "@/globalstore/selectionstore";
import {
  CarouselElement,
  CarouselSettings,
} from "@/interfaces/elements.interface";
import { Label } from "@radix-ui/react-label";
⋮----
export default function CarouselConfigurationAccordion()
⋮----
// Handler for text inputs and switches
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
⋮----
// Handler for Select components
const handleSelectChange = (name: keyof CarouselSettings, value: string) =>
⋮----
// Handler for Switch components (since they don't have a change event with `target.name`)
const handleSwitchChange = (name: keyof CarouselSettings, value: boolean) =>
⋮----
{/* General Settings */}
⋮----
onCheckedChange=
⋮----
onValueChange=
⋮----
{/* Autoplay Settings */}
````

## File: src/components/editor/sidebar/configurations/CMSConfiguration.tsx
````typescript
import React from "react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useElementStore } from "@/globalstore/elementstore";
import { CMSContentSettings } from "@/interfaces/elements.interface";
import { Database } from "lucide-react";
import { useCMSContentTypes, useCMSContent } from "@/hooks/useCMSContent";
⋮----
interface CMSConfigurationProps {
  elementId: string;
}
⋮----
// Fetch available content types from CMS
⋮----
// Fetch content items for the selected content type (for item slug selection)
⋮----
const updateSettings = (newSettings: Partial<CMSContentSettings>) =>
⋮----
{/* Content Type Selection */}
⋮----
{/* Item Slug (for single item display) */}
⋮----
{/* Display Mode (for list/grid) */}
⋮----
{/* Limit */}
⋮----
{/* Sorting */}
⋮----
updateSettings(
⋮----
{/* Fields to Show (for grid) */}
⋮----
settings.fieldsToShow?.includes(field) ??
⋮----
{/* Filter Options */}
````

## File: src/components/editor/sidebar/configurations/Configurations.tsx
````typescript
import { Accordion } from "@/components/ui/accordion";
import { AppearanceAccordion } from "./AppearanceAccordion";
import { ElementType } from "@/types/global.type";
import React, { useState } from "react";
import { TypographyAccordion } from "./TypographyAccordion";
import { LinkConfigurationAccordion } from "./LinkConfiguration";
import { FormConfigurationAccordion } from "./FormConfiguration";
import InputConfiguration from "./InputConfiguration";
import { useSelectionStore } from "@/globalstore/selectionstore";
import CarouselConfigurationAccordion from "./CarouselConfiguration";
import TailwindAccordion from "./TailwindAccordion";
import DataLoaderConfiguration from "./DataLoaderConfiguration";
import { BreakpointSelector } from "./BreakpointSelector";
import CMSConfiguration from "./CMSConfiguration";
⋮----
export default function Configurations()
⋮----
const renderChildElement = (type: ElementType): React.ReactNode =>
````

## File: src/components/editor/sidebar/configurations/DataLoaderConfiguration.tsx
````typescript
import { useElementStore } from "@/globalstore/elementstore";
import { useSelectionStore } from "@/globalstore/selectionstore";
import { DataLoaderElement, DataLoaderSettings } from "@/interfaces/elements.interface";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
⋮----
export default function DataLoaderConfiguration()
⋮----
const updateSettings = (newSettings: Partial<DataLoaderSettings>) =>
⋮----
onChange={(e) => updateSettings({ apiUrl: e.target.value })}
          placeholder="https://api.example.com/data"
        />
      </div>

      <div>
        <Label htmlFor="http-method">HTTP Method</Label>
        <Select
          value={dataLoader.settings?.method || "GET"}
onValueChange=
⋮----
onValueChange=
⋮----
onChange={(e) => updateSettings({ authToken: e.target.value })}
          placeholder="Bearer token or API key"
        />
      </div>

      <div>
        <Label htmlFor="request-body">Request Body (JSON)</Label>
        <Textarea
          id="request-body"
          value={dataLoader.settings?.body || ""}
          onChange={(e) => updateSettings({ body: e.target.value })}
          placeholder='{"key": "value"}'
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="headers">Headers (JSON)</Label>
        <Textarea
          id="headers"
          value={dataLoader.settings?.headers ? JSON.stringify(dataLoader.settings.headers, null, 2) : ""}
onChange=
````

## File: src/components/editor/sidebar/configurations/FormConfiguration.tsx
````typescript
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { useElementStore } from "@/globalstore/elementstore";
import { useSelectionStore } from "@/globalstore/selectionstore";
import { FormElement, FormSettings } from "@/interfaces/elements.interface";
import React, { ChangeEvent } from "react";
⋮----
const handleChange = (
    e: ChangeEvent<HTMLInputElement>
) =>
⋮----
// Helper for Selects to keep handler unified
const handleSelectChange = (name: keyof FormSettings, value: string) =>
⋮----
{/* General */}
⋮----
{/* Validation */}
⋮----
{/* Advanced */}
````

## File: src/components/editor/sidebar/configurations/InputConfiguration.tsx
````typescript
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { useElementStore } from "@/globalstore/elementstore";
import { useSelectionStore } from "@/globalstore/selectionstore";
⋮----
import { InputElement, InputSettings } from "@/interfaces/elements.interface";
import React, { ChangeEvent } from "react";
import ValidationConfiguration from "./ValidationConfigration";
⋮----
const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
⋮----
const handleSelectChange = (name: keyof InputSettings, value: string) =>
⋮----
{/* General */}
⋮----
{/* Validation */}
⋮----
{/* Advanced */}
````

## File: src/components/editor/sidebar/configurations/LinkConfiguration.tsx
````typescript
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useElementStore } from "@/globalstore/elementstore";
import { useSelectionStore } from "@/globalstore/selectionstore";
import { BaseElement } from "@/interfaces/elements.interface";
import React, { ChangeEvent } from "react";
⋮----
export const LinkConfigurationAccordion = () =>
⋮----
const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
````

## File: src/components/editor/sidebar/configurations/TailwindAccordion.tsx
````typescript
import React, { useEffect, useRef, useState } from "react";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { useElementStore } from "@/globalstore/elementstore";
import type { EditorElement } from "@/types/global.type";
import { Textarea } from "@/components/ui/textarea";
import { useSelectionStore } from "@/globalstore/selectionstore";
⋮----
export default function TailwindAccordion()
⋮----
// Cleanup timer on unmount
⋮----
const commit = (val: string) =>
⋮----
const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
⋮----
// client-side debounce to avoid spamming updateElement while typing
⋮----
const handleBlur = () =>
````

## File: src/components/editor/sidebar/configurations/TypographyAccordion.tsx
````typescript
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useElementStore } from "@/globalstore/elementstore";
import { projectService } from "@/services/project";
import { elementHelper } from "@/lib/utils/element/elementhelper";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useSelectionStore } from "@/globalstore/selectionstore";
import { cn } from "@/lib/utils";
import { ResponsiveStyles } from "@/interfaces/elements.interface";
⋮----
type TypographyStyles = Partial<React.CSSProperties>;
⋮----
type TextAlign = "left" | "right" | "center" | "justify" | "start" | "end";
⋮----
type TextTransform = "none" | "capitalize" | "uppercase" | "lowercase";
⋮----
interface TypographyAccordionProps {
  currentBreakpoint: "default" | "sm" | "md" | "lg" | "xl";
}
⋮----
const updateStyle = <K extends keyof TypographyStyles>(
    property: K,
    value: TypographyStyles[K],
) =>
⋮----
{/* Font Family */}
⋮----
{/* Font Size */}
⋮----
{/* Color Section */}
⋮----
{/* Font Weight */}
⋮----
{/* Line Height */}
⋮----
{/* Letter Spacing */}
⋮----
{/* Text Align */}
⋮----
{/* Text Transform */}
⋮----
{/* Font Style */}
⋮----
{/* Text Decoration */}
````

## File: src/components/editor/sidebar/configurations/ValidationConfigration.tsx
````typescript
import { useElementStore } from "@/globalstore/elementstore";
import { InputElement } from "@/interfaces/elements.interface";
import { RuleType, ValidationRule } from "@/interfaces/validate.interface";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useSelectionStore } from "@/globalstore/selectionstore";
⋮----
// Local state for validation rules
⋮----
const updateValidationRule = <T extends ValidationRule>(
    updateRule: T,
): void =>
⋮----
const removeValidationRule = (ruleType: RuleType) =>
⋮----
const handleAddRule = () =>
⋮----
onChange=
⋮----
updateValidationRule(
⋮----
// Only allow editing the message for custom rules
⋮----

⋮----
onClick=
````

## File: src/components/editor/sidebar/ComponentHolder.tsx
````typescript
import { ElementType } from "@/types/global.type";
import { Component } from "lucide-react";
import React from "react";
⋮----
type HolderProps = {
  icon: React.ReactNode;
  type: ElementType;
};
⋮----
const ComponentHolder = (
⋮----
const onDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    elementType: string,
) =>
⋮----
onDragStart=
⋮----
type CustomComponentHolderProps = {
  name: string;
  index: number;
};
````

## File: src/components/editor/sidebar/EditorSideBar.tsx
````typescript
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Settings } from "lucide-react";
import Link from "next/link";
import { useAiChat } from "@/providers/aiprovider";
import { ProjectPageCommand } from "../ProjectPageCommand";
import { ElementSelector } from "./ElementSelector";
import CMSManager from "./cmsmanager/CMSManager";
⋮----
{/* Image upload content here */}
````

## File: src/components/editor/sidebar/ElementSelector.tsx
````typescript
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import elementHolders from "@/constants/elements";
import ComponentHolder, { CustomComponentHolder } from "./ComponentHolder";
import { customComps } from "@/lib/customcomponents/customComponents";
````

## File: src/components/editor/sidebar/ElementTreeItem.tsx
````typescript
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useElementStore } from "@/globalstore/elementstore";
import { useSelectionStore } from "@/globalstore/selectionstore";
import { cn } from "@/lib/utils";
import { EditorElement } from "@/types/global.type";
import {
  BarChart2,
  ChevronDown,
  Files,
  FormInput,
  Images,
  LayoutGrid,
  Square,
  Table2,
  Type,
  Link as LinkIcon,
  MousePointer,
  Image as ImageIcon,
  Frame,
  List as ListIcon,
} from "lucide-react";
import React from "react";
⋮----
const getElementIcon = (type: string) =>
⋮----
const handleClick = (e: React.MouseEvent) =>
````

## File: src/components/editor/sidebar/LayoutSideBar.tsx
````typescript
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import React from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Configurations from "./configurations/Configurations";
import ElementTreeItem from "./ElementTreeItem";
import { Square } from "lucide-react";
import { useAiChat } from "@/providers/aiprovider";
import { useElementStore } from "@/globalstore/elementstore";
import { useSelectionStore } from "@/globalstore/selectionstore";
import { elementHelper } from "@/lib/utils/element/elementhelper";
// import Chat from "@/components/ChatModel";
⋮----
const visitProjectSubdomain = (projectId: string) =>
⋮----
// const subdomainUrl = getProjectSubdomainUrl(projectId);
// window.open(subdomainUrl, "_blank");
⋮----
toggleSidebar();
````

## File: src/components/editor/skeleton/ElementLoading.tsx
````typescript
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
⋮----
type Props = {
  count?: number;
  variant?: "text" | "button" | "card" | "form" | "chart" | "image" | "mixed";
};
````

## File: src/components/editor/ComponentTooltip.tsx
````typescript
import React, { ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
⋮----
export type ComponentType = 
  | "Text" 
  | "Heading" 
  | "Frame" 
  | "Image" 
  | "Button" 
  | "Link"
  | "Input" 
  | "ListItem"
  | "Select"
  | "Chart"
  | "DataTable"
  | "Form"
  | "Carousel"
  | "Card";
⋮----
interface ComponentTooltipProps {
  children: ReactNode;
  type: ComponentType;
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  disabled?: boolean;
}
⋮----
export function ComponentTooltip({
  children,
  type,
  side = "right",
  sideOffset = 10,
  disabled = false,
}: ComponentTooltipProps)
````

## File: src/components/editor/EditorContextMenu.tsx
````typescript
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuPortal,
} from "@/components/ui/context-menu";
import { Copy, Trash2, Layers, ArrowUp, ArrowDown } from "lucide-react";
import { KeyboardEvent as EditorKeyboardEvent } from "@/lib/utils/element/keyBoardEvents";
import { EditorElement } from "@/types/global.type";
import { useElementStore } from "@/globalstore/elementstore";
import { useSelectionStore } from "@/globalstore/selectionstore";
⋮----
interface EditorContextMenuProps {
  children: React.ReactNode;
  element: EditorElement;
}
⋮----
/**
 * Shared keyboard handler instance.
 */
⋮----
/**
 * EditorContextMenu
 *
 * Renders the ContextMenu for editor elements. When the trigger lives inside an
 * iframe (i.e. it has a different `ownerDocument` than the top-level `document`)
 * we render the context menu content into that iframe's `body` so the menu is
 * displayed within the iframe. For top-level triggers we use the project's
 * `ContextMenuContent` primitive which handles its own portal.
 *
 * Important notes:
 * - We intentionally avoid modifying `components/ui/context-menu.tsx`.
 * - We detect the correct container at the moment the menu opens by reading
 *   `triggerRef.current?.ownerDocument`.
 */
⋮----
const onCopy = () =>
⋮----
const onCut = () =>
⋮----
const onPaste = () =>
⋮----
const onBringToFront = () =>
⋮----
const onSendToBack = () =>
⋮----
const onDelete = () =>
⋮----
onContextMenu=
````

## File: src/components/editor/ElementLoader.tsx
````typescript
import { EditorElement, ElementType } from "@/types/global.type";
import React from "react";
import { getComponentMap } from "@/constants/elements";
import ResizeHandler from "./resizehandler/ResizeHandler";
import EditorContextMenu from "./EditorContextMenu";
import { EditorComponentProps } from "@/interfaces/editor.interface";
import { usePageStore } from "@/globalstore/pagestore";
import { useSelectionStore } from "@/globalstore/selectionstore";
import { useElementStore } from "@/globalstore/elementstore";
import { elementHelper } from "@/lib/utils/element/elementhelper";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { customComps } from "@/lib/customcomponents/customComponents";
interface ElementLoaderProps {
  elements?: EditorElement[]; 
  data?: any;
}
⋮----
const renderElement = (element: EditorElement) =>
⋮----
const handleHover = (e: React.DragEvent, element: EditorElement) =>
⋮----
const handleDrop = (e: React.DragEvent, element: EditorElement) =>
⋮----
onDrop=
````

## File: src/components/editor/ProjectPageCommand.tsx
````typescript
import React, { useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { usePageStore } from "@/globalstore/pagestore";
import { Button } from "../ui/button";
import { v4 as uuidv4 } from "uuid";
import { useParams } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageSchema } from "@/schema/zod";
import { Page } from "@/interfaces/page.interface";
import createPage from "@/app/actions/pageAction";
⋮----
type CreatePageFormValues = z.infer<typeof createPageSchema>;
⋮----
const onSubmit = async (data: CreatePageFormValues) =>
⋮----
setOpen(isOpen);
⋮----
<form onSubmit=
⋮----
// DeletePageDialog component
⋮----
// Main component using the dialogs
⋮----
<span>
````

## File: src/components/editor/ResponsivePreviewer.tsx
````typescript
import type React from "react"
import { useState } from "react"
import { Monitor, Smartphone, Tablet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { viewportSizes } from "@/constants/viewports"
⋮----
type Breakpoint = "mobile" | "tablet" | "desktop"
⋮----
interface ResponsivePreviewProps {
  currentView: Breakpoint
  onViewChange: (view: Breakpoint) => void
  children: React.ReactNode
}
⋮----
{/* Responsive Controls Header */}
⋮----
{/* Breakpoint Selector */}
⋮----
{/* Info Toggle */}
⋮----
{/* Breakpoint Info Panel */}
⋮----
{/* Preview Container */}
⋮----
{/* Viewport Label */}
⋮----
{/* Content */}
````

## File: src/components/landingpage/LandingPageFAQ.tsx
````typescript
import { PlusIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from '@/components/ui/accordion';
⋮----
{/* Decorative gradient */}
````

## File: src/components/landingpage/LandingPageFeature.tsx
````typescript
import {
  Palette,
  Sparkles,
  Search,
  Smartphone,
  Code,
  Rocket,
} from 'lucide-react';
⋮----
export default function LandingPageFeature()
⋮----
// Assign a unique gradient for each feature
````

## File: src/components/landingpage/LandingPageHero.tsx
````typescript
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
⋮----
{/* Background gradient */}
⋮----
{/* Badge */}
⋮----
{/* Heading */}
⋮----
{/* Description */}
⋮----
{/* CTA Buttons */}
⋮----
{/* Feature Image */}
⋮----
https://your-awesome-app.com
⋮----
{/* Floating elements for visual interest */}
````

## File: src/components/landingpage/LandingPagePricing.tsx
````typescript
import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, Zap, Shield, Check, Sparkles, ArrowRight } from 'lucide-react';
import NumberFlow from '@number-flow/react';
import { cn } from '@/lib/utils';
⋮----
{/* Background gradients */}
⋮----
onValueChange=
⋮----
className=
⋮----
{/* Subtle gradient effects */}
````

## File: src/components/projectsettings/ColorInput.tsx
````typescript
import { Input } from "../ui/input";
import { Label } from "../ui/label";
⋮----
interface ColorInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  bgClass?: string;
  id: string;
}
⋮----
onChange(e.target.value)
````

## File: src/components/projectsettings/ProjectPreview.tsx
````typescript
import React, { useRef, useState, useEffect } from "react";
⋮----
interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
}
⋮----
interface DesignSystem {
  colors?: ColorScheme;
  fontFamily?: string;
  letterTracking?: number;
  borderRadius?: number;
  spacing?: number;
  shadowStyle?: string;
}
⋮----
interface ProjectPreviewProps {
  projectId: string;
  className?: string;
  colors?: ColorScheme;
  designSystem?: DesignSystem;
}
⋮----
const generateShadowVars = (style: string) =>
⋮----
const generateDesignSystemCSS = (system: DesignSystem) =>
⋮----
const generatePreviewHTML = (system: DesignSystem) =>
⋮----
const handleIframeLoad = () =>
⋮----
{/* Custom Iframe Wrapper */}
⋮----
{/* Custom Preview Controls Overlay */}
⋮----
{/* Design System Info Badge */}
⋮----
{/* Color Indicators */}
⋮----
{/* Typography Info */}
⋮----
{/* Spacing & Radius Info */}
⋮----
{/* Shadow Style Info */}
⋮----
{/* Bottom Status Bar */}
````

## File: src/components/projectsettings/ProjectSettings.tsx
````typescript
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Slider } from "../ui/slider";
import {
  Code2,
  Save,
  Eye,
  ArrowLeft,
  Palette,
  Type,
  Move,
  Layers,
  Sparkles,
} from "lucide-react";
import { Project } from "@/interfaces/project.interface";
import { projectService } from "@/services/project";
import ProjectPreview from "./ProjectPreview";
import ColorInput from "./ColorInput";
import {
  generateShadowVars,
  generateDesignSystemCSS,
  generateColorsCSS,
} from "../../lib/utils/projectsettings/designSystemUtils";
import { useProjectStore } from "@/globalstore/projectstore";
⋮----
interface ColorScheme {
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  destructive: string;
  destructiveForeground: string;
}
⋮----
// Design System State
⋮----
// Load design system values
⋮----
const handleColorPresetSelect = (colors: ColorScheme) =>
⋮----
const handleSave = () =>
⋮----
{/* Colors Tab */}
⋮----
{/* Custom Color Inputs */}
⋮----
{/* Preset Colors */}
⋮----
{/* Typography Tab */}
⋮----
{/* Font Family */}
⋮----
{/* Letter Spacing */}
⋮----
onValueChange=
⋮----
{/* Spacing Tab */}
⋮----
{/* Effects Tab */}
⋮----
{/* Border Radius */}
⋮----

⋮----
{/* Shadow Style */}
````

## File: src/components/ui/accordion.tsx
````typescript
import { ChevronDownIcon } from "lucide-react"
⋮----
import { cn } from "@/lib/utils"
⋮----
function Accordion({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>)
⋮----
function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>)
⋮----
className=
⋮----
function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>)
````

## File: src/components/ui/alert-dialog.tsx
````typescript
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
⋮----
function AlertDialog({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Root>)
⋮----
function AlertDialogTrigger({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>)
⋮----
function AlertDialogPortal({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Portal>)
````

## File: src/components/ui/avatar.tsx
````typescript
import { cn } from "@/lib/utils"
⋮----
className=
````

## File: src/components/ui/badge.tsx
````typescript
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
⋮----
import { cn } from "@/lib/utils"
⋮----
className=
````

## File: src/components/ui/breadcrumb.tsx
````typescript
import { Slot } from "@radix-ui/react-slot"
import { ChevronRight, MoreHorizontal } from "lucide-react"
⋮----
import { cn } from "@/lib/utils"
⋮----
function Breadcrumb(
⋮----
className=
````

## File: src/components/ui/button.tsx
````typescript
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
⋮----
import { cn } from "@/lib/utils"
````

## File: src/components/ui/card.tsx
````typescript
import { cn } from "@/lib/utils"
````

## File: src/components/ui/carousel.tsx
````typescript
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
⋮----
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
⋮----
type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];
⋮----
type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
};
⋮----
type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
} & CarouselProps;
⋮----
function useCarousel()
````

## File: src/components/ui/collapsible.tsx
````typescript
function Collapsible({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root>)
⋮----
function CollapsibleTrigger({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>)
⋮----
function CollapsibleContent({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>)
````

## File: src/components/ui/command.tsx
````typescript
import { Command as CommandPrimitive } from "cmdk"
import { SearchIcon } from "lucide-react"
⋮----
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
⋮----
function CommandEmpty({
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>)
````

## File: src/components/ui/context-menu.tsx
````typescript
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react"
⋮----
import { cn } from "@/lib/utils"
⋮----
function ContextMenu({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Root>)
⋮----
function ContextMenuTrigger({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Trigger>)
⋮----
function ContextMenuGroup({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Group>)
⋮----
function ContextMenuPortal({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Portal>)
⋮----
function ContextMenuSub({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Sub>)
⋮----
function ContextMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.RadioGroup>)
⋮----
function ContextMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.SubTrigger> & {
  inset?: boolean
})
⋮----
className=
⋮----
function ContextMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.CheckboxItem>)
⋮----
function ContextMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.RadioItem>)
````

## File: src/components/ui/dialog.tsx
````typescript
import { XIcon } from "lucide-react"
⋮----
import { cn } from "@/lib/utils"
⋮----
function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>)
⋮----
function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>)
⋮----
function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>)
⋮----
function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>)
````

## File: src/components/ui/drawer.tsx
````typescript
import { Drawer as DrawerPrimitive } from "vaul"
⋮----
import { cn } from "@/lib/utils"
⋮----
function Drawer({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>)
⋮----
function DrawerTrigger({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Trigger>)
⋮----
function DrawerPortal({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Portal>)
⋮----
function DrawerClose({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Close>)
⋮----
function DrawerContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Content>)
⋮----
className=
````

## File: src/components/ui/dropdown-menu.tsx
````typescript
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react"
⋮----
import { cn } from "@/lib/utils"
⋮----
function DropdownMenu({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root>)
⋮----
function DropdownMenuPortal({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>)
⋮----
function DropdownMenuTrigger({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>)
⋮----
function DropdownMenuGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Group>)
⋮----
function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>)
⋮----
className=
⋮----
function DropdownMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>)
⋮----
function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>)
⋮----
function DropdownMenuSub({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>)
⋮----
function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
  inset?: boolean
})
````

## File: src/components/ui/form.tsx
````typescript
import { Slot } from "@radix-ui/react-slot"
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"
⋮----
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
⋮----
type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName
}
⋮----
const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) =>
⋮----
const useFormField = () =>
⋮----
type FormItemContextValue = {
  id: string
}
⋮----
function FormItem(
⋮----
className=
⋮----
function FormLabel({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>)
⋮----
function FormControl(
⋮----
function FormMessage(
````

## File: src/components/ui/input.tsx
````typescript
import { cn } from "@/lib/utils"
⋮----
function Input(
⋮----
className=
````

## File: src/components/ui/label.tsx
````typescript
import { cn } from "@/lib/utils"
⋮----
className=
````

## File: src/components/ui/popover.tsx
````typescript
import { cn } from "@/lib/utils"
⋮----
function Popover({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>)
⋮----
function PopoverTrigger({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>)
⋮----
function PopoverAnchor({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Anchor>)
````

## File: src/components/ui/select.tsx
````typescript
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"
⋮----
import { cn } from "@/lib/utils"
⋮----
function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>)
⋮----
function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>)
⋮----
function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>)
⋮----
function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default"
})
⋮----
className=
⋮----
function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>)
⋮----
function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>)
⋮----
function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>)
````

## File: src/components/ui/separator.tsx
````typescript
import { cn } from "@/lib/utils"
⋮----
className=
````

## File: src/components/ui/sheet.tsx
````typescript
import { XIcon } from "lucide-react"
⋮----
import { cn } from "@/lib/utils"
⋮----
function Sheet(
⋮----
function SheetTrigger({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Trigger>)
⋮----
function SheetClose({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Close>)
⋮----
function SheetPortal({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Portal>)
⋮----
function SheetContent({
  className,
  children,
  side = "right",
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: "top" | "right" | "bottom" | "left"
})
⋮----
className=
````

## File: src/components/ui/sidebar.tsx
````typescript
import { Slot } from "@radix-ui/react-slot"
import { cva, VariantProps } from "class-variance-authority"
import { PanelLeftIcon } from "lucide-react"
⋮----
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
⋮----
type SidebarContextProps = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}
⋮----
function useSidebar()
⋮----
// This is the internal state of the sidebar.
// We use openProp and setOpenProp for control from outside the component.
⋮----
// This sets the cookie to keep the sidebar state.
⋮----
// Helper to toggle the sidebar.
⋮----
// Adds a keyboard shortcut to toggle the sidebar.
⋮----
const handleKeyDown = (event: KeyboardEvent) =>
⋮----
// We add a state so that we can do data-state="expanded" or "collapsed".
// This makes it easier to style the sidebar with Tailwind classes.
⋮----
className=
⋮----
{/* This is what handles the sidebar gap on desktop */}
⋮----
// Adjust the padding for floating and inset variants.
⋮----
// Increases the hit area of the button on mobile.
⋮----
// Increases the hit area of the button on mobile.
⋮----
// Random width between 50 to 90%.
````

## File: src/components/ui/skeleton.tsx
````typescript
import { cn } from "@/lib/utils"
⋮----
className=
````

## File: src/components/ui/slider.tsx
````typescript
import { cn } from "@/lib/utils"
⋮----
className=
````

## File: src/components/ui/switch.tsx
````typescript
import { cn } from "@/lib/utils"
⋮----
className=
````

## File: src/components/ui/table.tsx
````typescript
import { cn } from "@/lib/utils"
⋮----
function Table(
⋮----
className=
````

## File: src/components/ui/tabs.tsx
````typescript
import { cn } from "@/lib/utils"
⋮----
className=
````

## File: src/components/ui/textarea.tsx
````typescript
import { cn } from "@/lib/utils"
⋮----
className=
````

## File: src/components/ui/tooltip.tsx
````typescript
import { cn } from "@/lib/utils"
⋮----
function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>)
⋮----
function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>)
⋮----
function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>)
⋮----
function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>)
⋮----
className=
````

## File: src/components/TestCarousel.tsx
````typescript
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
````

## File: src/components/ThemeSwticher.tsx
````typescript
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
````

## File: src/constants/direciton.ts
````typescript
/**
 * Defines all possible directions for resizing, margin, padding, and gap handles.
 * Used throughout the editor for type safety and consistency.
 */
⋮----
export type ResizeDirection =
  | "se"
  | "sw"
  | "ne"
  | "nw"
  | "n"
  | "s"
  | "e"
  | "w"
  | "gap"
  | "padding-n"
  | "padding-s"
  | "padding-e"
  | "padding-w"
  | "margin-n"
  | "margin-s"
  | "margin-e"
  | "margin-w";
⋮----
/**
 * Maps each ResizeDirection to its corresponding Tailwind/utility class string.
 */
⋮----
/**
 * Helper to check if a style object has a non-zero margin property.
 */
export function hasMargin(
  styles: React.CSSProperties | undefined,
  prop: keyof React.CSSProperties,
): boolean
⋮----
/**
 * Helper to check if a style object has a non-zero padding property.
 */
export function hasPadding(
  styles: React.CSSProperties | undefined,
  prop: keyof React.CSSProperties,
): boolean
⋮----
/**
 * Helper to check if a style object has a non-zero gap property.
 */
export function hasGap(styles: React.CSSProperties | undefined): boolean
⋮----
/**
 * Returns the list of resize handles to render based on the element's styles.
 */
export function getResizeHandles(
  styles: React.CSSProperties | undefined,
): ResizeDirection[]
````

## File: src/constants/elements.tsx
````typescript
import { EditorComponentProps } from "@/interfaces/editor.interface";
⋮----
import { EditorElement, ElementType } from "@/types/global.type";
import {
  FormInput,
  Image,
  TextSelection,
  Type,
  CardSim,
  MousePointerClick,
  Link,
  SlidersHorizontal,
  List,
  Database,
} from "lucide-react";
import React from "react";
import BaseComponent from "@/components/editor/editorcomponents/BaseComponent";
import ButtonComponent from "@/components/editor/editorcomponents/ButtonComponent";
import CarouselComponent from "@/components/editor/editorcomponents/CarouselComponent";
import FormComponent from "@/components/editor/editorcomponents/FormComponent";
import FrameComponent from "@/components/editor/editorcomponents/FrameComponent";
import ImageComponent from "@/components/editor/editorcomponents/ImageComponent";
import InputComponent from "@/components/editor/editorcomponents/InputComponent";
import ListComponent from "@/components/editor/editorcomponents/ListComponent";
import SectionComponent from "@/components/editor/editorcomponents/SectionComponent";
import SelectComponent from "@/components/editor/editorcomponents/SelectComponent";
import DataLoaderComponent from "@/components/editor/editorcomponents/DataLoaderComponent";
import CMSContentListComponent from "@/components/editor/editorcomponents/CMSContentListComponent";
import CMSContentItemComponent from "@/components/editor/editorcomponents/CMSContentItemComponent";
import CMSContentGridComponent from "@/components/editor/editorcomponents/CMSContentGridComponent";
⋮----
interface ElementHolder {
  type: ElementType;
  icon: React.ReactNode;
}
⋮----
export const getComponentMap = (
  props: EditorComponentProps,
): React.ComponentType<EditorComponentProps> | undefined =>
````

## File: src/constants/endpoints.ts
````typescript
// Backend API endpoints (used with GetUrl)
````

## File: src/constants/viewports.ts
````typescript

````

## File: src/data/page.ts
````typescript
import { Page } from "@/interfaces/page.interface";
import { v4 as uuidv4 } from "uuid";
import prisma from "@/lib/prisma";
⋮----
// This is a placeholder implementation
````

## File: src/data/project.ts
````typescript
import { Project } from "@/interfaces/project.interface";
import prisma from "@/lib/prisma";
⋮----
// Soft delete: set DeletedAt to current date
⋮----
// Get only active (not deleted) projects for a user
⋮----
// Get a specific project by ID with ownership check
⋮----
/**
   * Update a project.
   *
   * Performs an ownership check and ensures the project is not soft-deleted.
   * Accepts a partial `updates` object containing fields to change (e.g. Name, Description, Styles, Published, Subdomain, Header).
   *
   * Returns the updated project object on success, or null if the project was not found / not owned by the user / deleted.
   */
````

## File: src/globalstore/elementstore.tsx
````typescript
import { create } from "zustand";
import { ContainerElement, EditorElement } from "@/types/global.type";
import { elementHelper } from "@/lib/utils/element/elementhelper";
import { elementService } from "@/services/element";
import { debounce } from "lodash";
import { cloneDeep } from "lodash";
import { SelectionStore } from "./selectionstore";
import { Snapshot } from "@/interfaces/snapshot.interface";
⋮----
type ElementStore<TElement extends EditorElement> = {
  elements: TElement[];
  past: TElement[][];
  future: TElement[][];
  setElements: (elements: TElement[]) => ElementStore<TElement>;
  loadElements: (elements: TElement[]) => ElementStore<TElement>;
  updateElement: (
    id: string,
    updatedElement: Partial<TElement>,
  ) => ElementStore<TElement>;
  deleteElement: (id: string) => ElementStore<TElement>;
  addElement: (...newElements: TElement[]) => ElementStore<TElement>;
  updateAllElements: (update: Partial<EditorElement>) => ElementStore<TElement>;
  insertElement: (
    parentElement: TElement,
    elementToBeInserted: TElement,
  ) => ElementStore<TElement>;
  swapElement: (id1: string, id2: string) => ElementStore<TElement>;
  undo: () => ElementStore<TElement>;
  redo: () => ElementStore<TElement>;
  clearHistory: () => ElementStore<TElement>;
};
⋮----
type PersistElement = EditorElement;
⋮----
type UpdatePayload<TElement extends EditorElement> = {
  element: PersistElement;
  prevElements: TElement[];
  settings?: string | null;
};
⋮----
const createElementStore = <TElement extends EditorElement>() =>
⋮----
const saveSnapshotToApi = async (elements: EditorElement[]) =>
⋮----
const takeSnapshot = () =>
⋮----
const insertOne = (
          tree: EditorElement[],
          newEl: TElement,
): EditorElement[] =>
⋮----
const addToParent = (el: EditorElement): EditorElement =>
⋮----
const recursivelyUpdate = (el: EditorElement): EditorElement =>
⋮----
// Nested elements
⋮----
// Update the parent element
⋮----
// Top-level elements
````

## File: src/globalstore/pagestore.tsx
````typescript
import { Page } from "@/interfaces/page.interface";
import { projectService } from "@/services/project";
import { create } from "zustand";
⋮----
/**
 * Type definition for the Zustand PageStore.
 */
type PageStore = {
  // State
  pages: Page[];

  currentPage: Page | null;
  /**
   * Update a page by its ID with new styles/data.
   * @param updatedPage The updated Page object.
   * @param id The ID of the page to update.
   */
  // Actions
  addPage: (newPage: Page) => void;

  updatePage: (updatedPage: Page, id: string) => void;

  deletePage: (id: string) => void;
  /**
   * Reset all pages to an empty array.
   */
  resetPage: () => void;
  /**
   * Load a set of pages into the store.
   * @param pages The array of Page objects to load.
   */
  loadPages: (pages: Page[]) => void;

  setCurrentPage: (page: Page | null) => void;
};
⋮----
// State
⋮----
/**
   * Update a page by its ID with new styles/data.
   * @param updatedPage The updated Page object.
   * @param id The ID of the page to update.
   */
// Actions
⋮----
/**
   * Reset all pages to an empty array.
   */
⋮----
/**
   * Load a set of pages into the store.
   * @param pages The array of Page objects to load.
   */
⋮----
pages: [], // initial state
⋮----
// TODO: Optionally, call an API to persist the update
⋮----
// TODO: Optionally, call an API to reset pages on the backend
⋮----
// TODO: Optionally, call an API to fetch pages if needed
````

## File: src/globalstore/projectstore.tsx
````typescript
import { projectService } from "@/services/project";
import { create } from "zustand";
import type { Project } from "@/interfaces/project.interface";
⋮----
/**
 * ProjectStore (client / optimistic)
 *
 * This store uses the `Project` interface from `src/interfaces/project.interface.ts`
 * which uses camelCase field names and string dates (ISO).
 *
 * It performs optimistic local updates but still calls `projectService.updateProject`
 * so the shape returned by the server should match the `Project` interface.
 *
 * Public API:
 * - loadProject(project)
 * - resetProject()
 * - setProject(project | null)
 * - updateProject(updates, id?) -> Promise<Project | null>
 */
⋮----
type ProjectStoreState = {
  project: Project | null;
  isUpdating: boolean;
  errorMessage: string | null;

  loadProject: (project: Project) => void;
  resetProject: () => void;
  setProject: (project: Project | null) => void;

  updateProject: (
    updates: Partial<Project>,
    id?: string,
  ) => Promise<Project | null>;
};
⋮----
const nowIso = ()
````

## File: src/globalstore/selectionstore.tsx
````typescript
import { create } from "zustand";
import { EditorElement } from "@/types/global.type";
⋮----
type SelectionStore<TElement extends EditorElement> = {
  selectedElement: TElement | undefined;
  draggingElement: TElement | undefined;
  draggedOverElement: TElement | undefined;
  hoveredElement: TElement | undefined;
  setSelectedElement: (element: TElement | undefined) => void;
  setDraggingElement: (element: TElement | undefined) => void;
  setDraggedOverElement: (element: TElement | undefined) => void;
  setHoveredElement: (element: TElement | undefined) => void;
};
⋮----
const createSelectionStore = <TElement extends EditorElement>()
````

## File: src/hooks/use-mobile.ts
````typescript
export function useIsMobile()
⋮----
const onChange = () =>
````

## File: src/hooks/useCMSContent.ts
````typescript
import { useQuery } from "@tanstack/react-query";
import { cmsService } from "@/services/cms";
import { ContentItem, ContentType } from "@/interfaces/cms.interface";
⋮----
export interface UseCMSContentOptions {
  contentTypeId?: string;
  limit?: number;
  sortBy?: "title" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
  enabled?: boolean;
}
⋮----
export interface UseCMSContentResult {
  contentItems: ContentItem[];
  contentTypes: ContentType[];
  isLoading: boolean;
  error: any;
  refetch: () => void;
}
⋮----
export const useCMSContent = (
  options: UseCMSContentOptions = {},
): UseCMSContentResult =>
⋮----
staleTime: 1000 * 60 * 5, // 5 minutes
gcTime: 1000 * 60 * 30, // 30 minutes
⋮----
contentTypes: [], // Could be populated if needed
⋮----
export interface UseCMSContentItemResult {
  contentItem: ContentItem | undefined;
  isLoading: boolean;
  error: any;
  refetch: () => void;
}
⋮----
export const useCMSContentItem = (
  contentTypeId: string,
  slug: string,
): UseCMSContentItemResult =>
⋮----
staleTime: 1000 * 60 * 5, // 5 minutes
gcTime: 1000 * 60 * 30, // 30 minutes
⋮----
/**
 * Helper function to get a specific field value from a content item
 * Handles both direct properties and fieldValues structure
 */
export const getFieldValue = (
  contentItem: ContentItem,
  fieldName: string,
): any =>
⋮----
/**
 * Helper function to get all field values as a simple object
 * Useful for spreading into components or easy access
 */
export const getFieldValues = (
  contentItem: ContentItem,
): Record<string, any> =>
⋮----
// Add direct properties
⋮----
// Add field values
⋮----
/**
 * Hook for fetching content types (useful for dynamic content type selection)
 */
export const useCMSContentTypes = () =>
⋮----
staleTime: 1000 * 60 * 15, // 15 minutes - content types don't change often
gcTime: 1000 * 60 * 60, // 1 hour
````

## File: src/hooks/useCMSManager.ts
````typescript
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cmsService } from "@/services/cms";
import {
  ContentType,
  ContentItem,
  ContentField,
} from "@/interfaces/cms.interface";
import {
  ContentTypeFormSchema,
  ContentFieldFormSchema,
  ContentItemFormSchema,
} from "@/schema/zod";
import { z } from "zod";
⋮----
type ContentTypeFormValues = z.infer<typeof ContentTypeFormSchema>;
type ContentFieldFormValues = z.infer<typeof ContentFieldFormSchema>;
type ContentItemFormValues = z.infer<typeof ContentItemFormSchema>;
⋮----
export const useCMSManager = () =>
⋮----
// Queries
⋮----
// Mutations
⋮----
// Handlers
const handleCreateType = (data: any) =>
⋮----
const handleCreateField = (data: any) =>
⋮----
const handleCreateItem = (data: any) =>
⋮----
const selectType = (typeId: string) =>
⋮----
// State
⋮----
// Data
⋮----
// Mutations
⋮----
// Handlers
````

## File: src/hooks/useEditor.ts
````typescript
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useElementStore } from "@/globalstore/elementstore";
import { useSelectionStore } from "@/globalstore/selectionstore";
import { usePageStore } from "@/globalstore/pagestore";
import { useProjectStore } from "@/globalstore/projectstore";
import { projectService } from "@/services/project";
import { elementService } from "@/services/element";
import { elementHelper } from "@/lib/utils/element/elementhelper";
import { customComps } from "@/lib/customcomponents/customComponents";
import { EditorElement, ElementType } from "@/types/global.type";
import { SectionElement } from "@/interfaces/elements.interface";
import type { Project } from "@/interfaces/project.interface";
⋮----
export type Viewport = "mobile" | "tablet" | "desktop";
⋮----
export const useEditor = (id: string, pageId: string) =>
⋮----
const handleDrop = (e: React.DragEvent<HTMLDivElement>) =>
⋮----
const handlePageNavigation = (e: React.FocusEvent<HTMLInputElement>) =>
⋮----
const handleDragOver = (e: React.DragEvent<HTMLDivElement>) =>
⋮----
const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) =>
⋮----
const addNewSection = () =>
````

## File: src/hooks/useElementHandler.ts
````typescript
import { useElementStore } from "@/globalstore/elementstore";
import { useSelectionStore } from "@/globalstore/selectionstore";
import { cn } from "@/lib/utils";
import { EditorElement, ElementType } from "@/types/global.type";
import { elementHelper } from "@/lib/utils/element/elementhelper";
import { CSSStyles } from "@/interfaces/elements.interface";
⋮----
export function useElementHandler()
⋮----
const handleDoubleClick = (e: React.MouseEvent, element: EditorElement) =>
⋮----
const handleDrop = (
    e: React.DragEvent,
    projectId: string,
    parentElement: EditorElement,
) =>
⋮----
const handleDragStart = (e: React.DragEvent, element: EditorElement) =>
⋮----
const handleDragOver = (e: React.DragEvent, element: EditorElement) =>
⋮----
const handleDragLeave = (e: React.DragEvent, element: EditorElement) =>
⋮----
const handleDragEnd = (e: React.DragEvent, hoveredElement: EditorElement) =>
⋮----
const getTailwindStyles = (element: EditorElement) =>
⋮----
const handleMouseEnter = (e: React.MouseEvent, element: EditorElement) =>
⋮----
const handleMouseLeave = (e: React.MouseEvent, element: EditorElement) =>
⋮----
const handleTextChange = (e: React.FocusEvent, element: EditorElement) =>
⋮----
const getStyles = (element: EditorElement): React.CSSProperties =>
⋮----
const getCommonProps = (element: EditorElement) =>
````

## File: src/hooks/useGridEditor.ts
````typescript
import { useState, useCallback } from 'react';
⋮----
export interface GridEditorOptions<T> {
  onSave?: (id: string, data: Partial<T>) => Promise<void> | void;
  onCreate?: (data: Partial<T>) => Promise<void> | void;
  initialData?: T[];
}
⋮----
export interface GridEditorState<T> {
  editingRows: Set<string>;
  editedValues: Record<string, Partial<T>>;
  newRow: Partial<T> | null;
}
⋮----
export interface GridEditorActions<T> {
  startEditing: (id: string, currentData?: T) => void;
  stopEditing: (id: string) => void;
  updateValue: (id: string, field: keyof T, value: any) => void;
  saveChanges: (id: string) => Promise<void>;
  addNewRow: (initialData?: Partial<T>) => void;
  cancelNewRow: () => void;
  saveNewRow: () => Promise<void>;
  isEditing: (id: string) => boolean;
  getEditedValue: (id: string, field: keyof T, defaultValue?: any) => any;
}
⋮----
export function useGridEditor<T extends { id: string }>({
  onSave,
  onCreate,
}: GridEditorOptions<T> =
⋮----
// State
⋮----
// Actions
````

## File: src/hooks/useResizeHandler.ts
````typescript
import { useRef, useEffect } from "react";
import { get, merge, clamp } from "lodash";
import type { EditorElement } from "@/types/global.type";
import type { ResizeDirection } from "@/constants/direciton";
import { CSSStyles, ResponsiveStyles } from "@/interfaces/elements.interface";
⋮----
/**
 * Improvements made:
 * - Use requestAnimationFrame to batch DOM/React updates.
 * - Use Pointer Events (with fallback touch/mouse handling) for broader device support.
 * - Support Shift-key aspect-ratio locking.
 * - Provide clearer cursor mapping for directions.
 * - Robust cleanup and cancelation of rAF.
 */
⋮----
interface UseResizeHandlerProps {
  element: EditorElement;
  updateElement: (id: string, updates: Partial<EditorElement>) => void;
  targetRef: React.RefObject<HTMLDivElement | null>;
}
⋮----
const directionToCursor = (dir: ResizeDirection) =>
⋮----
// Map our directional tokens to standard cursors
⋮----
// For compound directions like 'n-e' or 'ne', normalize by removing separators
⋮----
export function useResizeHandler({
  element,
  updateElement,
  targetRef,
}: UseResizeHandlerProps)
⋮----
const scheduleFlush = () =>
⋮----
const cancelFlush = () =>
⋮----
function handleSpecialResize(
    direction: ResizeDirection,
    clientX: number,
    clientY: number,
    startPos: { x: number; y: number },
    element: EditorElement,
): ResponsiveStyles | null
⋮----
// Helper for padding/margin resize
const handleSpacingResize = (
      type: "padding" | "margin",
      dir: string,
): boolean =>
⋮----
// Gap resize
⋮----
// Padding resize
⋮----
// Margin resize
⋮----
const onMouseMove = (e: MouseEvent) =>
⋮----
// Special resize (gap, padding, margin)
⋮----
// Normal width/height resize
⋮----
// Calculate new dimensions based on direction
⋮----
// Apply directional changes
⋮----
// Aspect ratio locking when Shift is held
⋮----
// Preserve ratio based on dominant delta
⋮----
// Apply minimum size constraints
⋮----
// Preserve original dimensions for single-axis resizes
⋮----
// Handle absolute positioning
⋮----
// Batch updates
⋮----
const onMouseUp = (e?: MouseEvent) =>
⋮----
// finalize
⋮----
// remove listeners from the owner document (or fallback to global document)
⋮----
// clear styles on the owner document's body if available
⋮----
// ignore cross-origin iframe failures
⋮----
const handleResizeStart = (
    direction: ResizeDirection,
    e: React.MouseEvent,
) =>
⋮----
// Determine owner document/window (works when target lives inside an iframe)
⋮----
// store for cleanup/usability
⋮----
// Scope parent lookup to ownerDoc.
⋮----
const extractPos = (evt: any) =>
⋮----
// React synthetic events may expose nativeEvent
⋮----
// fallback
⋮----
// Add mouse listeners on the owner document so events are received even
// while the mouse moves outside the iframe element but within its document.
⋮----
// fallback to global document
⋮----
// Prevent selection while dragging on the correct document body
⋮----
// ignore cross-origin iframe body styling failures
⋮----
// Set an appropriate cursor on owner document body
⋮----
// Cleanup on unmount
⋮----
// fallback to global
⋮----
// We deliberately do not include element/updateElement/targetRef in deps -
// the returned handlers will work with the refs captured at call time.
// eslint-disable-next-line react-hooks/exhaustive-deps
````

## File: src/interfaces/cms.interface.ts
````typescript
export interface ContentType {
  id: string;
  name: string;
  description?: string;
  fields?: ContentField[];
  items?: ContentItem[];
  createdAt: Date;
  updatedAt: Date;
}
⋮----
export interface ContentField {
  id: string;
  contentTypeId: string;
  name: string;
  type: string;
  required: boolean;
  contentType?: ContentType;
  values?: ContentFieldValue[];
}
⋮----
export interface ContentFieldValue {
  id: string;
  contentItemId: string;
  fieldId: string;
  value?: string;
  contentItem?: ContentItem;
  field?: ContentField;
}
⋮----
export interface ContentItem {
  id: string;
  contentTypeId: string;
  title: string;
  slug: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  contentType?: ContentType;
  fieldValues?: ContentFieldValue[];
}
````

## File: src/interfaces/editor.interface.ts
````typescript
import { EditorElement } from "@/types/global.type";
⋮----
export interface EditorComponentProps {
  element: EditorElement;
  data?: any;
}
````

## File: src/interfaces/elements.interface.ts
````typescript
import { EditorElement, ElementType } from "@/types/global.type";
import { ValidationRule } from "./validate.interface";
import { EmblaOptionsType } from "embla-carousel";
⋮----
type CSSStyles = React.CSSProperties;
⋮----
type ResponsiveStyles = {
  default?: React.CSSProperties;
  sm?: React.CSSProperties;
  md?: React.CSSProperties;
  lg?: React.CSSProperties;
  xl?: React.CSSProperties;
};
⋮----
// Interface from
⋮----
interface Element<Settings = undefined> {
  type: ElementType;
  id: string;
  content: string;
  name?: string;
  styles?: ResponsiveStyles;
  tailwindStyles?: string;
  src?: string;
  href?: string;
  parentId?: string;
  pageId?: string;
  projectId: string;
  settings?: Settings | null;
  order?: number;
}
⋮----
interface BaseElement extends Element {}
⋮----
interface TextElement extends Element<void> {
  type: "Text";
}
⋮----
interface FrameElement extends Element<void> {
  elements: EditorElement[];
}
⋮----
interface SectionElement extends Element<void> {
  elements: EditorElement[];
}
⋮----
interface CarouselSettings extends EmblaOptionsType {
  withNavigation?: boolean;
  autoplay?: boolean;
  autoplaySpeed?: number;
}
⋮----
interface CarouselElement extends Element<CarouselSettings> {
  elements: EditorElement[];
}
⋮----
interface ButtonElement extends Element<void> {
  element?: FrameElement;
}
⋮----
interface InputSettings {
  name?: string;
  type?: "text" | "email" | "password" | "number" | "tel" | "url" | "textarea";
  placeholder?: string;
  defaultValue?: string | number;
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
  pattern?: string;
  validationMessage?: string;
  autoComplete?: string;
  validateRules?: ValidationRule[];
}
interface InputElement extends Element<InputSettings> {}
⋮----
interface ListElement extends Element<void> {
  elements: EditorElement[];
}
⋮----
interface SelectElement extends Element<Partial<HTMLSelectElement>> {
  elements: EditorElement[];
}
⋮----
interface FormSettings {
  action?: string;
  method?: "get" | "post";
  autoComplete?: "on" | "off";
  target?: "_self" | "_blank" | "_parent" | "_top";
  encType?:
    | "application/x-www-form-urlencoded"
    | "multipart/form-data"
    | "text/plain";
  validateOnSubmit?: boolean;
  redirectUrl?: string;
}
⋮----
interface FormElement extends Element<FormSettings> {
  elements: EditorElement[];
}
⋮----
interface DataLoaderSettings {
  apiUrl: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  body?: string;
  authToken?: string;
}
⋮----
interface DataLoaderElement extends Element<DataLoaderSettings> {
  elements: EditorElement[];
}
⋮----
interface CMSContentSettings {
  contentTypeId?: string;
  displayMode?: "list" | "grid" | "single";
  limit?: number;
  sortBy?: "title" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
  fieldsToShow?: string[];
  itemSlug?: string; // For single item display
  filterBy?: Record<string, any>;
}
⋮----
itemSlug?: string; // For single item display
⋮----
interface CMSContentListElement extends Element<CMSContentSettings> {
  elements: EditorElement[]; // Template for each item
}
⋮----
elements: EditorElement[]; // Template for each item
⋮----
interface CMSContentItemElement extends Element<CMSContentSettings> {
  elements: EditorElement[]; // Template for the item
}
⋮----
elements: EditorElement[]; // Template for the item
⋮----
interface CMSContentGridElement extends Element<CMSContentSettings> {
  elements: EditorElement[]; // Template for each grid item
}
⋮----
elements: EditorElement[]; // Template for each grid item
⋮----
//Export settings
````

## File: src/interfaces/page.interface.ts
````typescript
export interface Page {
  Id: string;
  Name: string;
  Type: string;
  Styles: Record<string, unknown> | null;
  ProjectId: string;
  CreatedAt: Date;
  UpdatedAt: Date;
  DeletedAt: Date | null;
}
⋮----
export type CreatePageInput = Omit<
  Page,
  "Id" | "CreatedAt" | "UpdatedAt" | "DeletedAt"
> & {
  Id?: string;
  CreatedAt?: Date;
  UpdatedAt?: Date;
  DeletedAt?: Date | null;
};
⋮----
export type UpdatePageInput = Partial<Omit<Page, "Id">> & {
  Id: string;
};
````

## File: src/interfaces/project.interface.ts
````typescript
interface Header {
  cssStyles?: string;
}
⋮----
export interface Project {
  id: string;
  name: string;
  description?: string | null;
  subdomain?: string | null;
  published: boolean;
  ownerId: string;
  styles?: Record<string, unknown> | null;
  header?: Header | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}
````

## File: src/interfaces/snapshot.interface.ts
````typescript
import { EditorElement } from "@/types/global.type";
⋮----
export interface Snapshot  {
  id: string;
  elements: EditorElement[];
  timestamp: number;
};
````

## File: src/interfaces/validate.interface.ts
````typescript
export type RuleType =
    | "minLength"
    | "maxLength"
    | "pattern"
    | "required"
    | "min"
    | "max"
    | "custom";
⋮----
interface BaseValidationRule<T = any> {
    rule: RuleType;
    message: string;
}
⋮----
interface ValueRule<T> extends BaseValidationRule<T> {
    value: T;
}
⋮----
export interface MinLengthRule extends ValueRule<number> {
    rule: "minLength";
}
⋮----
export interface MaxLengthRule extends ValueRule<number> {
    rule: "maxLength";
}
⋮----
export interface PatternRule extends ValueRule<RegExp | string> {
    rule: "pattern";
}
⋮----
export interface RequiredRule extends BaseValidationRule {
    rule: "required";
}
⋮----
export interface MinRule extends ValueRule<number> {
    rule: "min";
}
⋮----
export interface MaxRule extends ValueRule<number> {
    rule: "max";
}
⋮----
export interface CustomRule<T = any> extends BaseValidationRule<T> {
    rule: "custom";
    validateFn: (value: T) => boolean;
}
⋮----
export type ValidationRule<T = any> =
    | RequiredRule
    | MinLengthRule
    | MaxLengthRule
    | PatternRule
    | MinRule
    | MaxRule
    | CustomRule<T>;
````

## File: src/lib/customcomponents/card/cardComponents.ts
````typescript
import { CustomComponent } from "../customComponents";
import { v4 as uuidv4 } from "uuid";
````

## File: src/lib/customcomponents/footer/footerComponents.ts
````typescript
import { CustomComponent } from "../customComponents";
import { v4 as uuidv4 } from "uuid";
````

## File: src/lib/customcomponents/form/formComponents.ts
````typescript
import { CustomComponent } from "../customComponents";
import { v4 as uuidv4 } from "uuid";
⋮----
// Contact Form
⋮----
autoComplete: "on", // Changed from autocomplete to autoComplete to match FormSettings interface
validateOnSubmit: false, // Changed from noValidate to validateOnSubmit
⋮----
// Simple Newsletter Form
````

## File: src/lib/customcomponents/header/headerComponents.ts
````typescript
import { CustomComponent } from "../customComponents";
import { v4 as uuidv4 } from "uuid";
````

## File: src/lib/customcomponents/landingpage/landingPageComponents.ts
````typescript
import { v4 as uuidv4 } from "uuid";
import { CustomComponent } from "../customComponents";
⋮----
/**
 * Split landing page: each major section exported as its own CustomComponent.
 *
 * - Each exported component uses a `Section` as the root element (as requested).
 * - Helper factories (createFeature, createStat, etc.) are reused so the sections
 *   remain concise and consistent with the original template.
 *
 * NOTE: We cast to `CustomComponent` with `as unknown as CustomComponent` to keep
 * template authoring ergonomic (same pattern as the original file).
 */
⋮----
/* -------------------------------------------------------------------------- */
/* --------------------------------- Helpers --------------------------------- */
/* -------------------------------------------------------------------------- */
⋮----
function mkId(prefix: string)
⋮----
function createFeature(title: string, body: string)
⋮----
function createStat(value: string, label: string)
⋮----
function createTestimonial(
  name: string,
  role: string,
  quote: string,
  avatar?: string,
)
⋮----
function createPricingCard(
  title: string,
  price: string,
  bullets: string[],
  featured = false,
)
⋮----
function createFAQ(question: string, answer: string)
⋮----
/* -------------------------------------------------------------------------- */
/* --------------------------- Section Components --------------------------- */
/* -------------------------------------------------------------------------- */
⋮----
/**
 * Navbar section as its own CustomComponent (root: Section)
 */
⋮----
/**
 * Hero section as its own CustomComponent (root: Section)
 */
⋮----
/**
 * Features section
 */
⋮----
/**
 * Stats section
 */
⋮----
/**
 * Testimonials section
 */
⋮----
/**
 * Pricing section
 */
⋮----
/**
 * FAQ section
 */
⋮----
/**
 * Newsletter section
 */
⋮----
/**
 * Footer section
 */
⋮----
/* -------------------------------------------------------------------------- */
/* -------------------------- Convenience exports --------------------------- */
/* -------------------------------------------------------------------------- */
⋮----
/**
 * All sections in an array so consumers can easily iterate and assemble pages.
 */
````

## File: src/lib/customcomponents/navbar/navbarComponents.ts
````typescript
import { CustomComponent } from "../customComponents";
import { v4 as uuidv4 } from "uuid";
````

## File: src/lib/customcomponents/sidebar/sidebarLeftComponents.ts
````typescript
import { CustomComponent } from "../customComponents";
````

## File: src/lib/customcomponents/sidebar/sidebarRightComponents.ts
````typescript
import { CustomComponent } from "../customComponents";
````

## File: src/lib/customcomponents/advancedComponents.ts
````typescript
import { cardComponent } from "./card/cardComponents";
import { CustomComponent } from "./customComponents";
⋮----
// No changes needed here as this file only exports references to other components.
````

## File: src/lib/customcomponents/customComponents.ts
````typescript
import { EditorElement, ElementTemplate } from "@/types/global.type";
import {
  navbarComponent,
  navbarComponent2,
  navbarComponent3,
  navbarComponent4,
  navbarComponent5,
} from "./navbar/navbarComponents";
import {
  footerComponent,
  footerComponent2,
  footerComponent3,
  footerComponent4,
} from "./footer/footerComponents";
import {
  headerComponent,
  headerComponent2,
  headerComponent3,
} from "./header/headerComponents";
import {
  sidebarLeftComponent,
  sidebarLeftComponent2,
  sidebarLeftComponent3,
  sidebarLeftComponent4,
} from "./sidebar/sidebarLeftComponents";
import {
  sidebarRightComponent,
  sidebarRightComponent2,
  sidebarRightComponent3,
  sidebarRightComponent4,
} from "./sidebar/sidebarRightComponents";
import { formComponent1, formComponent2 } from "./form/formComponents";
import { landingPageSections } from "./landingpage/landingPageComponents";
⋮----
export type CustomComponent = {
  component: ElementTemplate & {
    elements?: ElementTemplate[];
  };
};
````

## File: src/lib/utils/element/create/createElements.ts
````typescript
import {
  ContainerElement,
  ContainerElementTemplate,
  EditorElement,
  ElementTemplate,
  ElementType,
} from "@/types/global.type";
import { v4 as uuidv4 } from "uuid";
import { getElementStrategy } from "./elementStrategyMap";
import { BuilderState } from "./elementCreateStrategy";
import { SelectionStore } from "@/globalstore/selectionstore";
import { ResponsiveStyles } from "@/interfaces/elements.interface";
⋮----
/**
 * Lightweight utilities and improved typings for creating elements.
 *
 * This refactor:
 * - Replaces the class-based builder with small, focused functions.
 * - Improves type-safety and explicit guards for container templates.
 * - Centralizes error handling and logs informative messages.
 *
 * The public API remains compatible:
 * - createElement
 * - createElementFromTemplate
 */
⋮----
/* Helpers */
⋮----
const makeId = ()
⋮----
const isContainerTemplate = (
  t: ElementTemplate,
): t is ContainerElementTemplate
⋮----
// runtime-check for presence of `elements` makes this safe across builds
⋮----
/**
 * Build an element using the strategy map for complex element types (images, sections, etc).
 * Throws on missing strategy or build failure so callers can handle/return undefined if desired.
 */
function buildWithStrategy(options: BuilderState): EditorElement
⋮----
/**
 * Create the baseline properties shared by every element.
 *
 * Note: Empty-string defaults have been replaced with `undefined` to better represent
 * absent values and align with optional typings across the codebase.
 */
function baseElementFactory({
  id,
  type,
  projectId,
  pageId,
  parentId,
  styles,
  tailwindStyles,
  src,
  href,
  content,
}: {
  id: string;
  type: ElementType;
  projectId: string;
  pageId?: string;
  parentId?: string;
  styles?: ResponsiveStyles;
  tailwindStyles?: string;
  src?: string;
  href?: string;
  content?: string;
}): EditorElement
⋮----
elements: [], // may be overridden for container elements
⋮----
/* Public API */
⋮----
/**
 * Creates a new EditorElement using strategy-based builders where available.
 * Keeps behavior compatible with previous implementation: it deselects current selection
 * and sets the created element as the selected element in global ElementStore.
 *
 * @param type Element type to create
 * @param projectId Project id to attach to the element
 * @param parentId Optional parent id
 * @param pageId Optional page id
 * @returns created element T or undefined on error
 */
export function createElement<T extends EditorElement>(
  type: ElementType,
  projectId: string,
  parentId?: string,
  pageId?: string,
): T | undefined
⋮----
/**
 * Create an element tree from a template. Each template node will receive a new id
 * and parentId will be set to preserve tree structure. The function is defensive:
 * - It accepts both container and non-container templates.
 * - It ensures container children are recursively processed.
 *
 * @param element Element template to clone
 * @param projectId project id to attach
 * @param pageId optional page id to attach
 * @returns created root element or undefined on error
 */
export function createElementFromTemplate<T extends EditorElement>(
  element: ElementTemplate,
  projectId: string,
  pageId?: string,
): T | undefined
⋮----
const recursivelyCreate = (
      tmpl: ElementTemplate,
      parentId?: string,
): EditorElement =>
````

## File: src/lib/utils/element/create/elementCreateStrategy.ts
````typescript
import {
  CarouselElement,
  CMSContentGridElement,
  CMSContentItemElement,
  CMSContentListElement,
  CSSStyles,
  DataLoaderElement,
  FormElement,
  InputElement,
} from "@/interfaces/elements.interface";
import { EditorElement, ElementType } from "@/types/global.type";
⋮----
export type BuilderState = {
  id: string;
  type: ElementType;
  projectId: string;
  src?: string;
  parentId?: string;
  pageId?: string;
  styles?: CSSStyles;
  tailwindStyles?: string;
  href?: string;
  content?: string;
};
⋮----
export interface ElementCreateStrategy {
  buildElement: (elementState: BuilderState) => EditorElement;
}
⋮----
function createBaseElement(
  state: BuilderState,
  overrides: Partial<EditorElement> = {},
): EditorElement
⋮----
export class TextElementCreateStrategy implements ElementCreateStrategy
⋮----
buildElement(state: BuilderState): EditorElement
⋮----
export class FrameElementCreateStrategy implements ElementCreateStrategy
⋮----
// Modern, accessible frame defaults:
// - responsive sizing with max-width
// - neutral background that adapts to light/dark if using CSS vars
// - soft rounded corners, subtle shadow and clear focus outline for keyboard users
⋮----
export class ButtonElementCreateStrategy implements ElementCreateStrategy
⋮----
export class InputElementCreateStrategy implements ElementCreateStrategy
⋮----
buildElement(state: BuilderState): InputElement
⋮----
export class ImageElementCreateStrategy implements ElementCreateStrategy
export class ListElementCreateStrategy implements ElementCreateStrategy
⋮----
export class SelectElementCreateStrategy implements ElementCreateStrategy
⋮----
export class FormElementCreateStrategy implements ElementCreateStrategy
⋮----
buildElement(state: BuilderState): FormElement
⋮----
export class SectionElementCreateStrategy implements ElementCreateStrategy
⋮----
export class CarouselElementCreateStrategy implements ElementCreateStrategy
⋮----
buildElement(state: BuilderState): CarouselElement
⋮----
export class DataLoaderElementCreateStrategy implements ElementCreateStrategy
⋮----
buildElement(state: BuilderState): DataLoaderElement
⋮----
export class CMSContentListElementCreateStrategy
implements ElementCreateStrategy
⋮----
buildElement(state: BuilderState): CMSContentListElement
⋮----
export class CMSContentItemElementCreateStrategy
implements ElementCreateStrategy
⋮----
buildElement(state: BuilderState): CMSContentItemElement
⋮----
export class CMSContentGridElementCreateStrategy
implements ElementCreateStrategy
⋮----
buildElement(state: BuilderState): CMSContentGridElement
````

## File: src/lib/utils/element/create/elementStrategyMap.ts
````typescript
import { ElementType } from "@/types/global.type";
import {
  ButtonElementCreateStrategy,
  CarouselElementCreateStrategy,
  CMSContentGridElementCreateStrategy,
  CMSContentItemElementCreateStrategy,
  CMSContentListElementCreateStrategy,
  DataLoaderElementCreateStrategy,
  ElementCreateStrategy,
  FormElementCreateStrategy,
  FrameElementCreateStrategy,
  ImageElementCreateStrategy,
  InputElementCreateStrategy,
  ListElementCreateStrategy,
  SectionElementCreateStrategy,
  SelectElementCreateStrategy,
  TextElementCreateStrategy,
} from "./elementCreateStrategy";
⋮----
export const getElementStrategy = (
  type: ElementType,
): ElementCreateStrategy =>
````

## File: src/lib/utils/element/computeTailwindFromStyles.ts
````typescript
import type { CSSProperties } from "react";
import { get, isUndefined, isNull, isString, isNumber, includes } from "lodash";
import { ResponsiveStyles } from "@/interfaces/elements.interface";
⋮----
function computeTailwindFromStylesSingle(
  styles: Partial<CSSProperties> | undefined,
): string
⋮----
const pushArbitrary = (prefix: string, raw: unknown) =>
⋮----
const getMappedClass = (
    value: unknown,
    map: Record<string, string>,
    prefix: string,
): string | undefined =>
⋮----
// Font weight
⋮----
const isCssVar = (val: string): boolean
⋮----
const basicClean = (val: string): string
⋮----
const isEmptyValue = (val: unknown): boolean
⋮----
function sanitizeForArbitrary(raw: string | number): string
⋮----
const pushIf = (arr: string[], cls?: string | false | null) =>
⋮----
export function computeTailwindFromStyles(
  styles: ResponsiveStyles | undefined,
): string
````

## File: src/lib/utils/element/elementhelper.ts
````typescript
import {
  ContainerElement,
  ContainerElementType,
  EditableElementType,
  EditorElement,
  ElementTemplate,
  ElementType,
} from "@/types/global.type";
import { reject, find } from "lodash";
import { handleSwap } from "./handleSwap";
import computeTailwindFromStyles from "./computeTailwindFromStyles";
import React from "react";
import {
  CONTAINER_ELEMENT_TYPES,
  EDITABLE_ELEMENT_TYPES,
} from "@/constants/elements";
import {
  createElement,
  createElementFromTemplate,
} from "./create/createElements";
import { ResponsiveStyles } from "@/interfaces/elements.interface";
⋮----
// Helper function to safely extract styles from an element
const getSafeStyles = (element: EditorElement): React.CSSProperties =>
⋮----
// Helper function to replace placeholders like {{field}} with data values
const replacePlaceholders = (text: string, data: any): string =>
⋮----
// Support nested property access using dot notation (e.g., "0.content", "item.title")
⋮----
if (value === undefined) return match; // Keep placeholder if field not found
⋮----
// Apply filters
⋮----
// Keep original value if date parsing fails
⋮----
const findById = (
  els: EditorElement[],
  id: string,
): EditorElement | undefined =>
⋮----
const mapUpdateById = (
  els: EditorElement[],
  id: string,
  updater: (el: EditorElement) => EditorElement,
): EditorElement[]
⋮----
const mapDeleteById = (els: EditorElement[], id: string): EditorElement[] =>
⋮----
export const mapInsertAfterId = (
  els: EditorElement[],
  targetId: string,
  toInsert: EditorElement,
): EditorElement[] =>
⋮----
interface ICreateElment {
  create: <T extends EditorElement>(
    type: ElementType,
    projectId: string,
    parentId?: string,
    pageId?: string,
  ) => T | undefined;

  createFromTemplate: <T extends EditorElement>(
    element: ElementTemplate,
    projectId: string,
    pageId?: string,
  ) => T | undefined;
}
⋮----
interface ElementHelper {
  createElement: ICreateElment;

  handleSwap: (
    draggingElement: EditorElement,
    hoveredElement: EditorElement,
    elements: EditorElement[],
    setElements: (elements: EditorElement[]) => void,
  ) => void;

  filterElementByPageId: (
    elements: EditorElement[],
    id?: string,
  ) => EditorElement[];

  findElement: (
    elements: EditorElement[],
    id: string,
  ) => EditorElement | undefined;

  getElementSettings: (element: EditorElement) => string | null;

  isContainerElement: (element: EditorElement) => element is ContainerElement;

  isEditableElement: (element: EditorElement) => boolean;

  computeTailwindFromStyles: (styles: ResponsiveStyles | undefined) => string;

  updateElementStyle: (
    element: EditorElement,
    styles: React.CSSProperties,
    breakpoint: "default" | "sm" | "md" | "lg" | "xl",
    updateElement: (id: string, updates: Partial<EditorElement>) => void,
  ) => void;

  findById: (els: EditorElement[], id: string) => EditorElement | undefined;

  mapUpdateById: (
    els: EditorElement[],
    id: string,
    updater: (el: EditorElement) => EditorElement,
  ) => EditorElement[];

  mapDeleteById: (els: EditorElement[], id: string) => EditorElement[];

  mapInsertAfterId: (
    els: EditorElement[],
    targetId: string,
    toInsert: EditorElement,
  ) => EditorElement[];

  replacePlaceholders: (text: string, data: any) => string;

  getSafeStyles: (element: EditorElement) => React.CSSProperties;
}
⋮----
export const isContainerElement = (
  element: EditorElement,
): element is ContainerElement =>
⋮----
const filterElementByPageId = (
  elements: EditorElement[],
  id?: string,
): EditorElement[] =>
⋮----
const findElement = (
  elements: EditorElement[],
  id: string,
): EditorElement | undefined =>
⋮----
const findRecursive = (els: EditorElement[]): EditorElement | undefined =>
⋮----
const getElementSettings = (element: EditorElement): string | null =>
⋮----
const updateElementStyle = (
  element: EditorElement,
  styles: React.CSSProperties,
  breakpoint: "default" | "sm" | "md" | "lg" | "xl",
  updateElement: (id: string, updates: Partial<EditorElement>) => void,
): void =>
````

## File: src/lib/utils/element/handleSwap.ts
````typescript
import { EditorElement, ContainerElement } from "@/types/global.type";
import { elementHelper } from "./elementhelper";
⋮----
function findPath(
  elements: EditorElement[],
  id: string,
  path: number[] = [],
): number[] | null
⋮----
function getElementAtPath(
  elements: EditorElement[],
  path: number[],
): EditorElement | null
⋮----
function setElementAtPath(
  elements: EditorElement[],
  path: number[],
  newEl: EditorElement,
): EditorElement[]
⋮----
export function handleSwap(
  draggingElement: EditorElement,
  hoveredElement: EditorElement,
  elements: EditorElement[],
  setElements: (elements: EditorElement[]) => void,
)
````

## File: src/lib/utils/element/keyBoardEvents.ts
````typescript
import { ContainerElement, EditorElement } from "@/types/global.type";
import { v4 as uuidv4 } from "uuid";
import { elementHelper } from "./elementhelper";
import { ElementStore } from "@/globalstore/elementstore";
import { SelectionStore } from "@/globalstore/selectionstore";
⋮----
export interface IKeyboardEvent {
  copyElement: () => void;
  cutElement: () => void;
  pasteElement: () => void;
  bringToFront: () => void;
  sendToBack: () => void;
  deleteElement: () => void;
}
⋮----
export class KeyboardEvent implements IKeyboardEvent
⋮----
const updateIdsRecursively = (
        element: ContainerElement,
): ContainerElement =>
````

## File: src/lib/utils/projectsettings/designSystemUtils.ts
````typescript
interface ColorScheme {
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  destructive: string;
  destructiveForeground: string;
}
⋮----
interface SimpleColorScheme {
  primary: string;
  secondary: string;
  accent: string;
}
⋮----
export function generateShadowVars(style: string)
⋮----
export function generateDesignSystemCSS(system: {
  colors?: SimpleColorScheme;
  fontFamily?: string;
  letterTracking?: number;
  borderRadius?: number;
  spacing?: number;
  shadowStyle?: string;
})
⋮----
export function generateColorsCSS(colors: ColorScheme)
````

## File: src/lib/utils/geturl.ts
````typescript
export default function GetUrl(path: string): string
⋮----
export function GetNextJSURL(url: string): string
````

## File: src/lib/utils/prepareElements.ts
````typescript
import { ContainerElement, EditorElement } from "@/types/global.type";
import { v4 as uuidv4 } from "uuid";
import { map, isArray, has } from "lodash";
⋮----
export function prepareElements(
  element: Partial<EditorElement>,
  parentId: string | undefined = undefined,
): EditorElement
````

## File: src/lib/prisma.ts
````typescript
import { PrismaClient } from "@prisma/client";
````

## File: src/lib/utils.ts
````typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
⋮----
export function cn(...inputs: ClassValue[])
````

## File: src/providers/aiprovider.tsx
````typescript
import React from "react";
interface AiContextType {
    chatOpen: boolean;
    openChat: () => void;
    closeChat: () => void;
    toggleChat: () => void;
}
⋮----
export function useAiChat()
⋮----
export default function AIChatProvider({
    children,
}: {
    children: React.ReactNode;
})
⋮----
const openChat = ()
const closeChat = ()
const toggleChat = ()
````

## File: src/providers/editorprovider.tsx
````typescript
import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { EditorSideBar } from "@/components/editor/sidebar/EditorSideBar";
import LayoutSideBar from "@/components/editor/sidebar/LayoutSideBar";
import AIChatProvider from "./aiprovider";
import AIChatPanel from "@/components/editor/ai/AiChatPanel";
import { useAiChat } from "./aiprovider";
⋮----
interface EditorProviderProps {
  children: React.ReactNode;
}
⋮----
function EditorLayout(
⋮----
export default function EditorProvider(
````

## File: src/providers/queryprovider.tsx
````typescript
import { makeQueryClient } from "@/client/queryclient";
import { QueryClientProvider } from "@tanstack/react-query";
⋮----
export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
})
````

## File: src/providers/rootprovider.tsx
````typescript
import { ClerkProvider } from "@clerk/nextjs";
import QueryProvider from "./queryprovider";
import { ThemeProvider } from "./themeprovider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { shadcn } from "@clerk/themes";
⋮----
export default function RootProviders({
    children,
}: {
    children: React.ReactNode;
})
````

## File: src/providers/themeprovider.tsx
````typescript
import { ThemeProvider as NextThemesProvider } from "next-themes"
⋮----
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>)
````

## File: src/schema/zod/cms.ts
````typescript
import z from "zod";
````

## File: src/schema/zod/element.ts
````typescript
import z from "zod";
⋮----
Styles: z.record(z.unknown()).optional().nullable(), // Json type
````

## File: src/schema/zod/image.ts
````typescript
import z from "zod";
````

## File: src/schema/zod/index.ts
````typescript

````

## File: src/schema/zod/page.ts
````typescript
import z from "zod";
````

## File: src/schema/zod/project.ts
````typescript
import z from "zod";
⋮----
Styles: z.record(z.unknown()).optional(), // Json type
````

## File: src/schema/zod/setting.ts
````typescript
import z from "zod";
⋮----
Settings: z.record(z.any()), // Json type in Prisma
````

## File: src/schema/zod/user.ts
````typescript
import z from "zod";
````

## File: src/services/apiclient.ts
````typescript
import getToken from "./token";
⋮----
class ApiClient
⋮----
private constructor()
⋮----
public static getInstance(): ApiClient
⋮----
async get<T>(url: string, options: RequestInit =
⋮----
async post<T = unknown>(
    url: string,
    data: unknown,
    options: RequestInit = {},
): Promise<T>
⋮----
async put<T>(url: string, data: T, options: RequestInit =
⋮----
async patch<T>(
    url: string,
    data: Partial<T>,
    options: RequestInit = {},
): Promise<T>
⋮----
async delete(url: string, options: RequestInit =
⋮----
async getPublic<T>(url: string, options: RequestInit =
````

## File: src/services/cms.ts
````typescript
import GetUrl from "@/lib/utils/geturl";
import apiClient from "./apiclient";
import { API_ENDPOINTS } from "@/constants/endpoints";
import {
  ContentType,
  ContentField,
  ContentFieldValue,
  ContentItem,
} from "../interfaces/cms.interface";
⋮----
interface ICmsService<TContext = any> {
  getContentTypes(): Promise<ContentType[]>;
  createContentType(data: Partial<ContentType>): Promise<ContentType>;
  getContentTypeById(id: string): Promise<ContentType>;
  updateContentType(
    id: string,
    data: Partial<ContentType>,
  ): Promise<ContentType>;
  deleteContentType(id: string): Promise<boolean>;
  getContentFieldsByContentType(contentTypeId: string): Promise<ContentField[]>;
  createContentField(
    contentTypeId: string,
    data: Partial<ContentField>,
  ): Promise<ContentField>;
  getContentFieldById(
    contentTypeId: string,
    fieldId: string,
  ): Promise<ContentField>;
  updateContentField(
    contentTypeId: string,
    fieldId: string,
    data: Partial<ContentField>,
  ): Promise<ContentField>;
  deleteContentField(contentTypeId: string, fieldId: string): Promise<boolean>;
  getContentItemsByContentType(contentTypeId: string): Promise<ContentItem[]>;
  createContentItem(
    contentTypeId: string,
    data: Partial<ContentItem>,
  ): Promise<ContentItem>;
  getContentItemById(
    contentTypeId: string,
    itemId: string,
  ): Promise<ContentItem>;
  updateContentItem(
    contentTypeId: string,
    itemId: string,
    data: Partial<ContentItem>,
  ): Promise<ContentItem>;
  deleteContentItem(contentTypeId: string, itemId: string): Promise<boolean>;
  getPublicContent(params?: {
    contentTypeId?: string;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<ContentItem[]>;
  getPublicContentItem(
    contentTypeId: string,
    slug: string,
  ): Promise<ContentItem>;
}
⋮----
getContentTypes(): Promise<ContentType[]>;
createContentType(data: Partial<ContentType>): Promise<ContentType>;
getContentTypeById(id: string): Promise<ContentType>;
updateContentType(
    id: string,
    data: Partial<ContentType>,
  ): Promise<ContentType>;
deleteContentType(id: string): Promise<boolean>;
getContentFieldsByContentType(contentTypeId: string): Promise<ContentField[]>;
createContentField(
    contentTypeId: string,
    data: Partial<ContentField>,
  ): Promise<ContentField>;
getContentFieldById(
    contentTypeId: string,
    fieldId: string,
  ): Promise<ContentField>;
updateContentField(
    contentTypeId: string,
    fieldId: string,
    data: Partial<ContentField>,
  ): Promise<ContentField>;
deleteContentField(contentTypeId: string, fieldId: string): Promise<boolean>;
getContentItemsByContentType(contentTypeId: string): Promise<ContentItem[]>;
createContentItem(
    contentTypeId: string,
    data: Partial<ContentItem>,
  ): Promise<ContentItem>;
getContentItemById(
    contentTypeId: string,
    itemId: string,
  ): Promise<ContentItem>;
updateContentItem(
    contentTypeId: string,
    itemId: string,
    data: Partial<ContentItem>,
  ): Promise<ContentItem>;
deleteContentItem(contentTypeId: string, itemId: string): Promise<boolean>;
getPublicContent(params?: {
    contentTypeId?: string;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<ContentItem[]>;
getPublicContentItem(
    contentTypeId: string,
    slug: string,
  ): Promise<ContentItem>;
⋮----
// Content Fields
⋮----
// Content Items
⋮----
// Public Content
````

## File: src/services/element.ts
````typescript
import { EditorElement } from "@/types/global.type";
import GetUrl from "@/lib/utils/geturl";
import apiClient from "./apiclient";
import { API_ENDPOINTS } from "@/constants/endpoints";
import { Snapshot } from "@/interfaces/snapshot.interface";
⋮----
interface IElementService {
  getElements: (projectId: string) => Promise<EditorElement[]>;
  getElementsPublic: (projectId: string) => Promise<EditorElement[]>;
  saveSnapshot: (projectId: string, snapshot: Snapshot) => Promise<void>;
}
````

## File: src/services/project.ts
````typescript
import GetUrl from "@/lib/utils/geturl";
import { Page } from "@/interfaces/page.interface";
import { Project } from "@/interfaces/project.interface";
import apiClient from "./apiclient";
import { API_ENDPOINTS } from "@/constants/endpoints";
⋮----
interface IProjectService {
  getProjects: () => Promise<Project[]>;
  getUserProjects: () => Promise<Project[]>;
  getProjectById: (id: string) => Promise<Project>;
  createProject: (project: Project) => Promise<Project>;
  updateProject: (project: Project) => Promise<Project>;
  updateProjectPartial: (
    projectId: string,
    project: Partial<Project>
  ) => Promise<Project>;
  deleteProject: (id: string) => Promise<boolean>;
  getProjectPages: (id: string) => Promise<Page[]>;
  deleteProjectPage: (projectId: string, pageId: string) => Promise<boolean>;
  getFonts: () => Promise<string[]>;
}
````

## File: src/services/token.ts
````typescript
import { GetNextJSURL } from "@/lib/utils/geturl";
import { NEXT_API_ENDPOINTS } from "@/constants/endpoints";
⋮----
export default async function getToken(): Promise<string>
````

## File: src/types/editor.tsx
````typescript
import BaseComponent from "@/components/editor/editorcomponents/BaseComponent";
import ButtonComponent from "@/components/editor/editorcomponents/ButtonComponent";
import FrameComponent from "@/components/editor/editorcomponents/FrameComponent";
import CarouselComponent from "@/components/editor/editorcomponents/CarouselComponent";
import FormComponent from "@/components/editor/editorcomponents/FormComponent";
import InputComponent from "@/components/editor/editorcomponents/InputComponent";
import ListComponent from "@/components/editor/editorcomponents/ListComponent";
import SelectComponent from "@/components/editor/editorcomponents/SelectComponent";
import SectionComponent from "@/components/editor/editorcomponents/SectionComponent";
import ImageComponent from "@/components/editor/editorcomponents/ImageComponent";
````

## File: src/types/global.type.ts
````typescript
import {
  CONTAINER_ELEMENT_TYPES,
  EDITABLE_ELEMENT_TYPES,
} from "@/constants/elements";
import {
  BaseElement,
  ButtonElement,
  FormElement,
  FrameElement,
  InputElement,
  ListElement,
  SectionElement,
  SelectElement,
  TextElement,
  CarouselElement,
  DataLoaderElement,
  CMSContentListElement,
  CMSContentItemElement,
  CMSContentGridElement,
} from "@/interfaces/elements.interface";
⋮----
type ContainerElement =
  | FrameElement
  | SectionElement
  | FormElement
  | ListElement
  | CarouselElement
  | DataLoaderElement;
⋮----
type EditorElement =
  | BaseElement
  | FrameElement
  | ButtonElement
  | ListElement
  | InputElement
  | SelectElement
  | FormElement
  | SectionElement
  | TextElement
  | CarouselElement
  | DataLoaderElement
  | CMSContentListElement
  | CMSContentItemElement
  | CMSContentGridElement;
⋮----
type ElementType =
  | "Frame"
  | "Button"
  | "List"
  | "Input"
  | "Select"
  | "Form"
  | "Section"
  | "Text"
  | "Carousel"
  | "Base"
  | "Image"
  | "Link"
  | "DataLoader"
  | "CMSContentList"
  | "CMSContentItem"
  | "CMSContentGrid";
⋮----
type ExcludeType = "id" | "pageId" | "projectId" | "parentId";
⋮----
type ContainerElementTemplate = Partial<Omit<EditorElement, ExcludeType>> & {
  type: ContainerElementType;
  elements?: ElementTemplate[];
};
⋮----
type LeafElementTemplate = Partial<Omit<EditorElement, ExcludeType>> & {
  type: Exclude<ElementType, ContainerElementType>;
};
⋮----
type ElementTemplate = ContainerElementTemplate | LeafElementTemplate;
type ContainerElementType = (typeof CONTAINER_ELEMENT_TYPES)[number];
⋮----
type EditableElementType = (typeof EDITABLE_ELEMENT_TYPES)[number];
````

## File: src/middleware.ts
````typescript
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
⋮----
// Skip Next.js internals and all static files, unless found in search params
⋮----
// Always run for API routes
````

## File: .gitignore
````
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.*
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/versions

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# env files (can opt-in for committing if needed)
.env*

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

/src/generated/prisma
````

## File: components.json
````json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
````

## File: next.config.ts
````typescript
import type { NextConfig } from "next";
⋮----
/* config options here */
````

## File: package.json
````json
{
  "name": "webbuilder",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "bun next dev --turbopack",
    "build": "bun next build --turbopack",
    "start": "bun next start",
    "lint": "bun next lint",
    "postinstall": "prisma generate"
  },
  "dependencies": {
    "@ai-sdk/react": "^2.0.44",
    "@clerk/nextjs": "^6.32.0",
    "@clerk/themes": "^2.4.19",
    "@hookform/resolvers": "^5.2.1",
    "@number-flow/react": "^0.5.10",
    "@prisma/client": "^6.16.1",
    "@radix-ui/react-accordion": "^1.2.12",
    "@radix-ui/react-alert-dialog": "^1.1.15",
    "@radix-ui/react-avatar": "^1.1.10",
    "@radix-ui/react-collapsible": "^1.1.12",
    "@radix-ui/react-context-menu": "^2.2.16",
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-dropdown-menu": "^2.1.16",
    "@radix-ui/react-label": "^2.1.7",
    "@radix-ui/react-popover": "^1.1.15",
    "@radix-ui/react-select": "^2.2.6",
    "@radix-ui/react-separator": "^1.1.7",
    "@radix-ui/react-slider": "^1.3.6",
    "@radix-ui/react-slot": "^1.2.3",
    "@radix-ui/react-switch": "^1.2.6",
    "@radix-ui/react-tabs": "^1.1.13",
    "@radix-ui/react-tooltip": "^1.2.8",
    "@tanstack/react-query": "^5.87.4",
    "@types/lodash": "^4.17.20",
    "ai": "^5.0.44",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.1.1",
    "dompurify": "^3.2.6",
    "embla-carousel": "^8.6.0",
    "embla-carousel-react": "^8.6.0",
    "framer-motion": "^12.23.12",
    "lodash": "^4.17.21",
    "lucide-react": "^0.514.0",
    "next": "^15.5.3",
    "next-themes": "^0.4.6",
    "prisma": "^6.16.1",
    "react": "^19.1.1",
    "react-dom": "^19.1.1",
    "react-easy-crop": "^5.5.0",
    "react-hook-form": "^7.62.0",
    "svix": "^1.76.1",
    "tailwind-merge": "^3.3.1",
    "uuid": "^11.1.0",
    "vaul": "^1.1.2",
    "zod": "^3.25.76",
    "zustand": "^5.0.8"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.1.13",
    "@types/node": "^20.19.14",
    "@types/react": "^19.1.13",
    "@types/react-dom": "^19.1.9",
    "tailwindcss": "^4.1.13",
    "tw-animate-css": "^1.3.8",
    "typescript": "^5.9.2"
  }
}
````

## File: postcss.config.mjs
````

````

## File: README.md
````markdown
# WebBuilder - Next.js Visual Web Builder

A modern, full-stack web builder application built with Next.js 15, TypeScript, and Tailwind CSS. This project allows users to create, edit, and manage web projects through a visual editor interface.

## 🚀 Tech Stack

- **Framework**: Next.js 15.3.3 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 with PostCSS
- **Authentication**: Clerk (6.20.2)
- **State Management**: TanStack React Query (5.80.2)
- **UI Components**: Shadcn/ui components
- **Icons**: Lucide React
- **Runtime**: Bun (package manager)
- **Fonts**: Geist Sans & Geist Mono

## 📁 Project Structure

```
webbuilder/
├── public/                      # Static assets (icons, images)
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── (auth)/             # Authentication routes
│   │   │   ├── sign-in/        # Login page with Clerk
│   │   │   └── sign-up/        # Registration page with Clerk
│   │   ├── (routes)/           # Main application routes
│   │   │   ├── (protected)/    # Protected routes (requires auth)
│   │   │   │   ├── dashboard/  # User dashboard & projects
│   │   │   │   ├── editor/     # Visual editor interface
│   │   │   │   └── pricing/    # Pricing page
│   │   │   └── (public)/       # Public routes
│   │   │       ├── (main)/     # Home page
│   │   │       └── preview/    # Project preview pages
│   │   ├── api/                # API routes
│   │   │   ├── elements/       # Element management endpoints
│   │   │   └── gettoken/       # Authentication token endpoint-
│   │   ├── globals.css         # Global styles & Tailwind config
│   │   └── layout.tsx          # Root layout with providers
│   ├── client/                 # React Query client configuration
│   ├── components/             # Reusable UI components
│   ├── globalstore/            # Global state management
│   ├── hooks/                  # Custom React hooks
│   ├── interfaces/             # TypeScript interfaces
│   ├── lib/                    # Utility libraries
│   ├── prisma/                 # Database schema & migrations
│   ├── providers/              # React context providers
│   ├── services/               # API service layers
│   ├── types/                  # TypeScript type definitions
│   ├── utils/                  # Utility functions
│   └── middleware.ts           # Clerk authentication middleware
├── components.json             # Shadcn/ui configuration
├── next.config.ts              # Next.js configuration
├── package.json                # Dependencies & scripts
├── postcss.config.mjs          # PostCSS configuration
└── tsconfig.json               # TypeScript configuration
```

## 🏗️ Architecture Overview

### 🛡️ Authentication & Authorization

- **Clerk Integration**: Complete authentication system with sign-in/sign-up
- **Route Protection**: Middleware-based protection for sensitive routes
- **JWT Tokens**: Custom token service for API authentication
- **Session Management**: Cached token system for performance

### 🎨 Editor System

The visual editor supports multiple element types:

- **Base Elements**: Basic containers and frames
- **Form Elements**: Inputs, selects, buttons, forms
- **Data Elements**: Charts, data tables, lists
- **Layout Elements**: Frames with nested element support

### 📊 Element Types

```typescript
- BaseElement: Basic container elements
- FrameElement: Container with nested elements
- ButtonElement: Interactive buttons with actions
- InputElement: Form input fields
- SelectElement: Dropdown selects with options
- ListElement: Dynamic list containers
- ChartElement: Data visualizations (bar, line, pie, etc.)
- DataTableElement: Tabular data with sorting/filtering
- FormElement: Form containers with validation
- DataLoaderElement: API data binding and fetching
```

### 🔗 Databinding

The DataLoaderElement enables dynamic data binding by fetching data from APIs and binding it to child elements:

#### Basic Usage

1. **Add a DataLoaderElement** to your canvas
2. **Configure API settings** in the sidebar:
   - API URL (e.g., `https://jsonplaceholder.typicode.com/posts`)
   - HTTP Method (GET, POST, PUT, DELETE)
   - Authorization token (optional)
   - Request headers and body (optional)
3. **Add child elements** like Text, List, or Frame elements
4. **Bind data** by placing elements that can consume data (Text elements display data values, List elements iterate over arrays)

#### Data Binding Examples

**Simple Text Binding:**
- Add a Text element inside DataLoader
- The Text element will display the fetched data as a string

**List Binding:**
- Add a List element inside DataLoader
- If API returns an array, each item becomes a list item
- Add Text elements inside the List to display item properties

**Complex Binding:**
```json
// API Response: { "title": "Hello World", "items": ["item1", "item2"] }
{
  "DataLoader": {
    "settings": { "apiUrl": "https://api.example.com/data" },
    "elements": [
      { "type": "Text", "content": "" }, // Displays: Hello World
      {
        "type": "List",
        "elements": [
          { "type": "Text", "content": "" } // Displays: item1, item2
        ]
      }
    ]
  }
}
```

### 🔄 Data Flow

1. **Client-Side**: React Query manages server state and caching
2. **API Layer**: Custom services handle data fetching and mutations
3. **Backend Integration**: Go server API for data persistence
4. **Authentication**: Clerk tokens for secure API communication

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Go server running on port 8080 (backend)

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd webbuilder
```

2. **Install dependencies**

```bash
bun install
# or
npm install
```

3. **Environment Setup**
   Create a `.env.local` file with:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Backend API
GO_SERVER_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_GO_SERVER_URL=http://localhost:8080/api/v1
```

4. **Run the development server**

```bash
bun dev
# or
npm run dev
```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📚 Key Features

### 🏠 Dashboard

- Project management interface
- User project listing
- Quick access to editor

### ✏️ Visual Editor

- Drag-and-drop element creation
- Real-time element positioning
- Style customization (CSS + Tailwind)
- Nested element support

### 🔍 Preview System

- Public project previews
- Responsive design testing
- Share functionality

### 🔐 Authentication

- Secure user registration/login
- Protected routes
- Session management
- Token-based API access

## 🛠️ Development

### Available Scripts

```bash
bun dev          # Start development server with Turbopack
bun build        # Build for production
bun start        # Start production server
bun lint         # Run ESLint
```

### Code Organization

- **Route Groups**: Organized by (auth), (protected), (public)
- **Service Layer**: Abstracted API calls with TypeScript interfaces
- **Component Structure**: Modular, reusable components
- **Type Safety**: Comprehensive TypeScript coverage

## 🎯 Future Enhancements

- Database integration with Prisma
- Real-time collaboration
- Template marketplace
- Advanced styling options
- Mobile editor support

## 📄 License

This project is private and not licensed for public use.

## 🤝 Contributing

This is a private project. Contact the maintainer for contribution guidelines.
````

## File: tailwind.config.ts
````typescript
import type { Config } from "tailwindcss";
⋮----
// Safelist reactive / dynamic classes that may be composed at runtime
// This keeps responsive prefixes (sm:, md:, lg:, etc.) and common pseudo variants
// from being purged when class strings are constructed dynamically.
⋮----
// keep classes like: sm:w-full, md:text-lg, lg:py-8, etc.
⋮----
// keep common state variants composed dynamically: hover:bg-red-500, focus:ring, active:scale-95
````

## File: tsconfig.json
````json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
````
