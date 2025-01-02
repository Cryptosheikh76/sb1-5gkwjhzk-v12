```typescript
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { monitoring } from '../../../lib/monitoring';
import type { AlgorithmStats } from '../types';

export function useAlgorithmStats() {
  const [stats, setStats] = useState<AlgorithmStats>({
    userEngagement: {
      avgWatchTime: 0,
      completionRate: 0,
      returnRate: 0
    },
    contentPerformance: {
      viralityRate: 0,
      creatorRetention: 0,
      monetizationRate: 0
    },
    systemHealth: {
      diversityScore: 0,
      fairnessScore: 0,
      latency: 0
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const loadStats = async () => {
    try {
      const [userStats, contentStats, systemStats] = await Promise.all([
        supabase.rpc('get_user_engagement_stats'),
        supabase.rpc('get_content_performance_stats'),
        supabase.rpc('get_system_health_stats')
      ]);

      setStats({
        userEngagement: userStats.data,
        contentPerformance: contentStats.data,
        systemHealth: systemStats.data
      });

      // Log metrics
      monitoring.logMetric('algorithm_latency', systemStats.data.latency);
      monitoring.logMetric('content_diversity', systemStats.data.diversityScore);
    } catch (error) {
      monitoring.captureError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  return { stats, loading };
}
```