-- CreateTable
CREATE TABLE "Subscription" (
    "Id" TEXT NOT NULL,
    "UserId" TEXT NOT NULL,
    "PlanId" TEXT NOT NULL,
    "BillingPeriod" TEXT NOT NULL,
    "Status" TEXT NOT NULL DEFAULT 'active',
    "StartDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "EndDate" TIMESTAMP(3),
    "Amount" DOUBLE PRECISION NOT NULL,
    "Currency" TEXT NOT NULL DEFAULT 'USD',
    "CreatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("Id")
);

-- CreateIndex
CREATE INDEX "Subscription_UserId_idx" ON "Subscription"("UserId");

-- CreateIndex
CREATE INDEX "Subscription_Status_idx" ON "Subscription"("Status");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("Id") ON DELETE CASCADE ON UPDATE CASCADE;
