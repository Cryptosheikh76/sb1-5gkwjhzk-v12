```typescript
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../auth/components/AuthProvider';
import type { AnalyticsData } from '../types';

export function useAnalytics() {
  const { user } = useAuth();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const loadAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);

        const [performanceResponse, engagementResponse, audienceResponse] = await Promise.all([
          supabase.rpc('get_performance_metrics', { creator_id: user.id }),
          supabase.rpc('get_engagement_metrics', { creator_id: user.id }),
          supabase.rpc('get_audience_insights', { creator_id: user.id })
        ]);

        if (performanceResponse.error) throw performanceResponse.error;
        if (engagementResponse.error) throw engagementResponse.error;
        if (audienceResponse.error) throw audienceResponse.error;

        setData({
          performance: performanceResponse.data,
          engagement: engagementResponse.data,
          audience: audienceResponse.data
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
    // Refresh every 5 minutes
    const interval = setInterval(loadAnalytics, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [user]);

  return { data, loading, error };
}
```