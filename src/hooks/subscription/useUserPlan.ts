import { useQuery } from '@tanstack/react-query';

interface UserPlan {
  plan: 'hobby' | 'pro' | 'enterprise';
  hasActiveSubscription: boolean;
  subscriptionEndDate?: string;
  daysUntilExpiry?: number;
}

export function useUserPlan() {
  return useQuery<UserPlan>({
    queryKey: ['user-plan'],
    queryFn: async () => {
      const response = await fetch('/api/subscription/status');
      if (!response.ok) {
        return { plan: 'hobby', hasActiveSubscription: false };
      }
      
      const data = await response.json();
      
      if (!data.hasActiveSubscription) {
        return { plan: 'hobby', hasActiveSubscription: false };
      }
      
      return {
        plan: data.subscription.planId,
        hasActiveSubscription: true,
        subscriptionEndDate: data.subscription.endDate,
        daysUntilExpiry: data.subscription.daysUntilExpiry,
      };
    },
  });
}
