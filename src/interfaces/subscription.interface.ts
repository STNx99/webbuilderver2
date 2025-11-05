export interface SubscriptionStatus {
  hasActiveSubscription: boolean;
  plan?: string;
  subscription?: {
    id: string;
    planId: string;
    billingPeriod: string;
    startDate: string;
    endDate: string;
    status: string;
    daysUntilExpiry: number;
    canRenew: boolean;
  };
}

export interface CreatePaymentRequest {
  planId: string;
  billingPeriod: string;
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