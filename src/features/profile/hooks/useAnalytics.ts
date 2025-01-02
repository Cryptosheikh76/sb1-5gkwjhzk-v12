```typescript
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

interface ContentStats {
  id: string;
  title: string;
  views: number;
  likes: number;
  earnings: string;
}

interface Analytics {
  totalViews: number;
  totalEarnings: string;
  engagementRate: number;
  content: ContentStats[];
}

export function useAnalytics(userId?: string) {
  const [stats, setStats] = useState<Analytics>({
    totalViews: 0,
    totalEarnings: '0',
    engagementRate: 0,
    content: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const loadAnalytics = async () => {
      try {
        const [metricsResponse, contentResponse] = await Promise.all([
          supabase
            .from('analytics')
            .select('*')
            .eq('user_id', userId)
            .single(),
          supabase
            .from('content_metrics_v2')
            .select('*')
            .eq('creator_id', userId)
        ]);

        if (metricsResponse.data && contentResponse.data) {
          setStats({
            totalViews: metricsResponse.data.total_views,
            totalEarnings: metricsResponse.data.total_earnings,
            engagementRate: metricsResponse.data.engagement_rate,
            content: contentResponse.data
          });
        }
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [userId]);

  return { stats, loading };
}
```