import { useEffect, useState } from 'react';

export interface AnalyticsStats {
  totalViews: number;
  totalDownloads: number;
  totalLikes: number;
  conversionRate: number;
}

export interface ChartDataPoint {
  date: string;
  views: number;
  downloads: number;
  likes: number;
}

export interface RecentItem {
  id: string;
  template: string;
  category: string;
  views: number;
  downloads: number;
  likes: number;
  time: string;
  avatar: string;
  trend: string;
}

export interface TopTemplate {
  id: string;
  template: string;
  views: number;
  downloads: number;
}

export interface AnalyticsData {
  stats: AnalyticsStats;
  chartData: ChartDataPoint[];
  recentItems: RecentItem[];
  topTemplates: TopTemplate[];
  marketplaceItems: Array<{
    id: string;
    title: string;
    description: string;
    downloads: number;
    likes: number;
    views: number;
    createdAt: string;
  }>;
}

interface UseAnalyticsReturn {
  data: AnalyticsData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useAnalytics(): UseAnalyticsReturn {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/analytics', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch analytics');
      }

      const result: AnalyticsData = await response.json();
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Analytics fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const refetch = async () => {
    await fetchAnalytics();
  };

  return { data, loading, error, refetch };
}
