import prisma from "@/lib/prisma";
import type {
  SubscriptionStatus,
  PlanId,
  BillingPeriod,
  SubscriptionStatusType,
} from "@/interfaces/subscription.interface";

interface CreateSubscriptionData {
  userId: string;
  planId: PlanId;
  billingPeriod: BillingPeriod;
  amount: number;
  email?: string;
  bankCode?: string;
  cardType?: string;
  payDate?: Date;
  transactionNo?: string;
  startDate?: Date;
  endDate?: Date;
}

interface UpdateSubscriptionData {
  status?: SubscriptionStatusType;
  startDate?: Date;
  endDate?: Date;
  bankCode?: string;
  cardType?: string;
  payDate?: Date;
  transactionNo?: string;
}

export const subscriptionDAL = {
  /**
   * Get subscription status for a user
   */
  getSubscriptionStatus: async (userId: string): Promise<SubscriptionStatus> => {
    const activeSubscription = await prisma?.subscription.findFirst({
      where: {
        UserId: userId,
        Status: "active",
        EndDate: {
          gte: new Date(),
        },
      },
      orderBy: {
        CreatedAt: "desc",
      },
    });

    if (!activeSubscription) {
      return {
        hasActiveSubscription: false,
      };
    }

    const now = new Date();
    const endDate = activeSubscription.EndDate!;
    const daysUntilExpiry = Math.ceil(
      (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
      hasActiveSubscription: true,
      plan: activeSubscription.PlanId as PlanId,
      subscription: {
        id: activeSubscription.Id,
        planId: activeSubscription.PlanId as PlanId,
        billingPeriod: activeSubscription.BillingPeriod as BillingPeriod,
        startDate: activeSubscription.StartDate.toISOString(),
        endDate: endDate.toISOString(),
        status: activeSubscription.Status as SubscriptionStatusType,
        daysUntilExpiry,
        canRenew: true, // Can always renew
      },
    };
  },

  /**
   * Create a new subscription
   */
  createSubscription: async (data: CreateSubscriptionData) => {
    const startDate = data.startDate || new Date();
    const endDate = data.endDate || new Date();

    // Calculate end date based on billing period
    if (data.billingPeriod === "monthly") {
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (data.billingPeriod === "yearly") {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    return await prisma?.subscription.create({
      data: {
        UserId: data.userId,
        PlanId: data.planId,
        BillingPeriod: data.billingPeriod,
        Status: "active",
        StartDate: startDate,
        EndDate: endDate,
        Amount: data.amount,
        Email: data.email,
        BankCode: data.bankCode,
        CardType: data.cardType,
        PayDate: data.payDate,
        TransactionNo: data.transactionNo,
      },
    });
  },

  /**
   * Cancel a subscription
   */
  cancelSubscription: async (subscriptionId: string) => {
    return await prisma?.subscription.update({
      where: { Id: subscriptionId },
      data: {
        Status: "cancelled",
        UpdatedAt: new Date(),
      },
    });
  },

  /**
   * Update subscription details
   */
  updateSubscription: async (subscriptionId: string, updates: UpdateSubscriptionData) => {
    return await prisma?.subscription.update({
      where: { Id: subscriptionId },
      data: {
        ...updates,
        UpdatedAt: new Date(),
      },
    });
  },

  /**
   * Get all subscriptions for a user
   */
  getSubscriptionsByUser: async (userId: string) => {
    return await prisma?.subscription.findMany({
      where: { UserId: userId },
      orderBy: { CreatedAt: "desc" },
    });
  },

  /**
   * Get subscription by ID
   */
  getSubscriptionById: async (subscriptionId: string) => {
    return await prisma?.subscription.findUnique({
      where: { Id: subscriptionId },
    });
  },

  /**
   * Expire subscriptions that have passed their end date
   */
  expireSubscriptions: async () => {
    const now = new Date();
    return await prisma?.subscription.updateMany({
      where: {
        Status: "active",
        EndDate: {
          lt: now,
        },
      },
      data: {
        Status: "expired",
        UpdatedAt: now,
      },
    });
  },
};
