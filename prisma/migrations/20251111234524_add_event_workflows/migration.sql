-- CreateTable EventWorkflow
CREATE TABLE "EventWorkflow" (
    "Id" TEXT NOT NULL,
    "ProjectId" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "Description" TEXT,
    "Handlers" JSONB NOT NULL,
    "Enabled" BOOLEAN NOT NULL DEFAULT true,
    "CreatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventWorkflow_pkey" PRIMARY KEY ("Id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EventWorkflow_ProjectId_Name_key" ON "EventWorkflow"("ProjectId", "Name");

-- CreateIndex
CREATE INDEX "EventWorkflow_ProjectId_idx" ON "EventWorkflow"("ProjectId");

-- AddForeignKey
ALTER TABLE "EventWorkflow" ADD CONSTRAINT "EventWorkflow_ProjectId_fkey" FOREIGN KEY ("ProjectId") REFERENCES "Project"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Add EventWorkflows column to Element
ALTER TABLE "Element" ADD COLUMN "EventWorkflows" JSONB DEFAULT '{}';
