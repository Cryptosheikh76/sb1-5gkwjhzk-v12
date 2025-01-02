```typescript
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../auth/components/AuthProvider';
import type { RevenueStats } from '../types';

export function useRevenueStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<RevenueStats>({
    totalEarnings: '0',
    monthlyEarnings: '0',
    monthlyGrowth: 0,
    pendingEarnings: '0',
    revenueByType: {
      nft_sales: '0',
      tips: '0',
      streams: '0',
      engagement: '0'
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const loadStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const [revenueResponse, pendingResponse] = await Promise.all([
          supabase.rpc('get_creator_revenue_stats', { creator_id: user.id }),
          supabase.rpc('get_pending_earnings', { creator_id: user.id })
        ]);

        if (revenueResponse.error) throw revenueResponse.error;
        if (pendingResponse.error) throw pendingResponse.error;

        setStats({
          ...revenueResponse.data,
          pendingEarnings: pendingResponse.data.amount
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load revenue stats');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [user]);

  return { stats, loading, error };
}
```