import { useQuery } from '@tanstack/react-query';
import { getPlanLimits } from '@/constants/pricing';

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
      const response = await fetch('/api/subscription/status');
      if (!response.ok) {
        const limits = getPlanLimits('hobby');
        return { 
          plan: 'hobby', 
          hasActiveSubscription: false,
          ...limits,
        };
      }
      
      const data = await response.json();
      
      if (!data.hasActiveSubscription) {
        const limits = getPlanLimits('hobby');
        return { 
          plan: 'hobby', 
          hasActiveSubscription: false,
          ...limits,
        };
      }
      
      const limits = getPlanLimits(data.subscription.planId);
      return {
        plan: data.subscription.planId,
        hasActiveSubscription: true,
        subscriptionEndDate: data.subscription.endDate,
        daysUntilExpiry: data.subscription.daysUntilExpiry,
        ...limits,
      };
    },
  });
}
