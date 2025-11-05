export type PlanId = 'hobby' | 'pro' | 'enterprise';
export type BillingPeriod = 'monthly' | 'yearly';
export type SubscriptionStatusType = 'active' | 'pending' | 'cancelled' | 'expired';

export interface SubscriptionStatus {
  hasActiveSubscription: boolean;
  plan?: PlanId;
  subscription?: {
    id: string;
    planId: PlanId;
    billingPeriod: BillingPeriod;
    startDate: string;
    endDate: string;
    status: SubscriptionStatusType;
    daysUntilExpiry: number;
    canRenew: boolean;
  };
}

export interface CreatePaymentRequest {
  planId: PlanId;
  billingPeriod: BillingPeriod;
  amount: number;
  email?: string;
}

export interface CreatePaymentResponse {
  paymentUrl: string;
  orderId: string;
  amount: number;
}

export interface CancelSubscriptionRequest {
  subscriptionId: string;
}

export interface CancelSubscriptionResponse {
  success: boolean;
  message: string;
}