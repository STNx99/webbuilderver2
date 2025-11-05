import { useQuery } from '@tanstack/react-query';
import { getPlanLimits } from '@/constants/pricing';
import { subscriptionService } from '@/services/subscription';
import type { PlanId } from '@/interfaces/subscription.interface';

interface UserPlan {
  plan: PlanId;
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

        const planId = data.subscription.planId as PlanId;
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