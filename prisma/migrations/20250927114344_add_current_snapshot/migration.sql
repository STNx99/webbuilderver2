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
