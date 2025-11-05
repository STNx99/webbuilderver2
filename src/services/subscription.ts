import apiClient from "./apiclient";
import { API_ENDPOINTS } from "@/constants/endpoints";
import type {
  SubscriptionStatus,
  CreatePaymentRequest,
  CreatePaymentResponse,
  CancelSubscriptionRequest,
  CancelSubscriptionResponse,
} from "@/interfaces/subscription.interface";

interface ISubscriptionService {
  getSubscriptionStatus: () => Promise<SubscriptionStatus>;
  createPayment: (data: CreatePaymentRequest) => Promise<CreatePaymentResponse>;
  cancelSubscription: (data: CancelSubscriptionRequest) => Promise<CancelSubscriptionResponse>;
}

export const subscriptionService: ISubscriptionService = {
  getSubscriptionStatus: async (): Promise<SubscriptionStatus> => {
    return apiClient.get<SubscriptionStatus>(API_ENDPOINTS.SUBSCRIPTION.STATUS);
  },

  createPayment: async (data: CreatePaymentRequest): Promise<CreatePaymentResponse> => {
    return apiClient.post<CreatePaymentResponse>(
      API_ENDPOINTS.VNPAY.CREATE_PAYMENT,
      data
    );
  },

  cancelSubscription: async (data: CancelSubscriptionRequest): Promise<CancelSubscriptionResponse> => {
    return apiClient.post<CancelSubscriptionResponse>(
      API_ENDPOINTS.SUBSCRIPTION.CANCEL,
      data
    );
  },
};