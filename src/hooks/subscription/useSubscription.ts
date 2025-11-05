import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { subscriptionService } from '@/services/subscription';
import type { SubscriptionStatus, CreatePaymentRequest } from '@/interfaces/subscription.interface';

export function useSubscriptionStatus() {
  return useQuery<SubscriptionStatus>({
    queryKey: ['subscription-status'],
    queryFn: async () => {
      return subscriptionService.getSubscriptionStatus();
    },
  });
}

export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePaymentRequest) => {
      return subscriptionService.createPayment(data);
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
      return subscriptionService.cancelSubscription({ subscriptionId });
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
