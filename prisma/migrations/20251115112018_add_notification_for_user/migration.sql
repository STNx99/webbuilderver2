/*
  Warnings:

  - You are about to drop the column `EventWorkflows` on the `Element` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Element" DROP COLUMN "EventWorkflows";

-- AlterTable
ALTER TABLE "EventWorkflow" ADD COLUMN     "CanvasData" JSONB,
ALTER COLUMN "UpdatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Invitation" ADD COLUMN     "Status" TEXT NOT NULL DEFAULT 'pending';

-- CreateTable
CREATE TABLE "Comment" (
    "Id" TEXT NOT NULL,
    "Content" TEXT NOT NULL,
    "AuthorId" TEXT NOT NULL,
    "ItemId" TEXT NOT NULL,
    "ParentId" TEXT,
    "Status" TEXT NOT NULL DEFAULT 'published',
    "Edited" BOOLEAN NOT NULL DEFAULT false,
    "CreatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(6) NOT NULL,
    "DeletedAt" TIMESTAMP(6),

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "CommentReaction" (
    "Id" TEXT NOT NULL,
    "CommentId" TEXT NOT NULL,
    "UserId" TEXT NOT NULL,
    "Type" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommentReaction_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "ElementComment" (
    "Id" TEXT NOT NULL,
    "Content" TEXT NOT NULL,
    "AuthorId" TEXT NOT NULL,
    "ElementId" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(6) NOT NULL,
    "DeletedAt" TIMESTAMP(6),
    "Resolved" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ElementComment_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "ElementEventWorkflow" (
    "Id" TEXT NOT NULL,
    "ElementId" TEXT NOT NULL,
    "WorkflowId" TEXT NOT NULL,
    "EventName" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ElementEventWorkflow_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "Id" TEXT NOT NULL,
    "UserId" TEXT NOT NULL,
    "Type" TEXT NOT NULL,
    "Title" TEXT NOT NULL,
    "Description" TEXT NOT NULL,
    "Read" BOOLEAN NOT NULL DEFAULT false,
    "CreatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("Id")
);

-- CreateIndex
CREATE INDEX "Comment_AuthorId_idx" ON "Comment"("AuthorId");

-- CreateIndex
CREATE INDEX "Comment_ItemId_idx" ON "Comment"("ItemId");

-- CreateIndex
CREATE INDEX "CommentReaction_CommentId_idx" ON "CommentReaction"("CommentId");

-- CreateIndex
CREATE INDEX "CommentReaction_UserId_idx" ON "CommentReaction"("UserId");

-- CreateIndex
CREATE INDEX "ElementComment_AuthorId_idx" ON "ElementComment"("AuthorId");

-- CreateIndex
CREATE INDEX "ElementComment_ElementId_idx" ON "ElementComment"("ElementId");

-- CreateIndex
CREATE INDEX "ElementEventWorkflow_ElementId_idx" ON "ElementEventWorkflow"("ElementId");

-- CreateIndex
CREATE INDEX "ElementEventWorkflow_WorkflowId_idx" ON "ElementEventWorkflow"("WorkflowId");

-- CreateIndex
CREATE INDEX "ElementEventWorkflow_EventName_idx" ON "ElementEventWorkflow"("EventName");

-- CreateIndex
CREATE UNIQUE INDEX "ElementEventWorkflow_ElementId_WorkflowId_EventName_key" ON "ElementEventWorkflow"("ElementId", "WorkflowId", "EventName");

-- CreateIndex
CREATE INDEX "Notification_UserId_idx" ON "Notification"("UserId");

-- CreateIndex
CREATE INDEX "Notification_Read_idx" ON "Notification"("Read");

-- CreateIndex
CREATE INDEX "Notification_CreatedAt_idx" ON "Notification"("CreatedAt");

-- CreateIndex
CREATE INDEX "Invitation_Status_idx" ON "Invitation"("Status");

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_AuthorId_fkey" FOREIGN KEY ("AuthorId") REFERENCES "User"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_ItemId_fkey" FOREIGN KEY ("ItemId") REFERENCES "MarketplaceItem"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_ParentId_fkey" FOREIGN KEY ("ParentId") REFERENCES "Comment"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentReaction" ADD CONSTRAINT "CommentReaction_CommentId_fkey" FOREIGN KEY ("CommentId") REFERENCES "Comment"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentReaction" ADD CONSTRAINT "CommentReaction_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ElementComment" ADD CONSTRAINT "ElementComment_AuthorId_fkey" FOREIGN KEY ("AuthorId") REFERENCES "User"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ElementComment" ADD CONSTRAINT "ElementComment_ElementId_fkey" FOREIGN KEY ("ElementId") REFERENCES "Element"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ElementEventWorkflow" ADD CONSTRAINT "ElementEventWorkflow_ElementId_fkey" FOREIGN KEY ("ElementId") REFERENCES "Element"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ElementEventWorkflow" ADD CONSTRAINT "ElementEventWorkflow_WorkflowId_fkey" FOREIGN KEY ("WorkflowId") REFERENCES "EventWorkflow"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("Id") ON DELETE CASCADE ON UPDATE CASCADE;
