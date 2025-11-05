import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface SubscriptionStatus {
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

export function useSubscriptionStatus() {
  return useQuery<SubscriptionStatus>({
    queryKey: ['subscription-status'],
    queryFn: async () => {
      const response = await fetch('/api/subscription/status');
      if (!response.ok) {
        throw new Error('Failed to fetch subscription status');
      }
      return response.json();
    },
  });
}

export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      planId: string;
      billingPeriod: string;
      amount: number;
      email?: string;
    }) => {
      const response = await fetch('/api/vnpay/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create payment');
      }

      return result;
    },
    onSuccess: (data) => {
      // Redirect to VNPay
      window.location.href = data.paymentUrl;
    },
    onError: (error: Error) => {
      if (error.message.includes('đã có gói đăng ký')) {
        toast.error('Bạn đã có gói đăng ký này', {
          description: 'Vui lòng chọn gói khác hoặc đợi gói hiện tại hết hạn.',
        });
      } else {
        toast.error('Không thể tạo thanh toán', {
          description: error.message,
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription-status'] });
    },
  });
}

export function useCancelSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (subscriptionId: string) => {
      const response = await fetch('/api/subscription/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to cancel subscription');
      }

      return result;
    },
    onSuccess: () => {
      toast.success('Hủy subscription thành công', {
        description: 'Bạn đã hủy gói đăng ký. Bạn có thể đăng ký gói mới bất cứ lúc nào.',
      });
    },
    onError: (error: Error) => {
      toast.error('Không thể hủy subscription', {
        description: error.message,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription-status'] });
      queryClient.invalidateQueries({ queryKey: ['user-plan'] });
    },
  });
}
