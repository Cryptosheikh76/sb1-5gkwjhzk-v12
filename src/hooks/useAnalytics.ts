import { useState, useEffect } from 'react';
import { analyticsService } from '../services/analytics/analyticsService';
import { useAuth } from './useAuth';

interface AnalyticsStats {
  total_views: number;
  unique_viewers: number;
  watch_time: number;
  engagement_rate: number;
  bot_interactions: number;
}

export function useAnalytics() {
  const { user } = useAuth();
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const data = await analyticsService.getUserStats(user.id);
        setStats(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  return { stats, loading, error };
}