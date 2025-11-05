import { useQuery } from '@tanstack/react-query';
import { getPlanLimits } from '@/constants/pricing';
import { subscriptionService } from '@/services/subscription';

interface UserPlan {
  plan: 'hobby' | 'pro' | 'enterprise';
  hasActiveSubscription: boolean;
  subscriptionEndDate?: string;
  daysUntilExpiry?: number;
  canPublishToMarketplace: boolean;
}

export function useUserPlan() {
  return useQuery<UserPlan>({
    queryKey: ['user-plan'],
    queryFn: async () => {
      try {
        const data = await subscriptionService.getSubscriptionStatus();

        if (!data.hasActiveSubscription || !data.subscription) {
          const limits = getPlanLimits('hobby');
          return {
            plan: 'hobby',
            hasActiveSubscription: false,
            ...limits,
          };
        }

        const planId = data.subscription.planId as 'hobby' | 'pro' | 'enterprise';
        const limits = getPlanLimits(planId);
        return {
          plan: planId,
          hasActiveSubscription: true,
          subscriptionEndDate: data.subscription.endDate,
          daysUntilExpiry: data.subscription.daysUntilExpiry,
          ...limits,
        };
      } catch (error) {
        // Fallback to hobby plan if API fails
        const limits = getPlanLimits('hobby');
        return {
          plan: 'hobby',
          hasActiveSubscription: false,
          ...limits,
        };
      }
    },
  });
}