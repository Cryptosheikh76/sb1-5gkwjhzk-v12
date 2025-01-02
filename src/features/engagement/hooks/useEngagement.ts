```typescript
import { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../auth/components/AuthProvider';

interface EngagementMetrics {
  likes: number;
  comments: number;
  shares: number;
}

export function useEngagement(contentId: string) {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<EngagementMetrics>({
    likes: 0,
    comments: 0,
    shares: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const like = async () => {
    if (!user) throw new Error('Must be logged in');
    
    try {
      setLoading(true);
      const { error: dbError } = await supabase
        .from('content_likes')
        .insert({ content_id: contentId, user_id: user.id });

      if (dbError) throw dbError;
      
      setMetrics(prev => ({ ...prev, likes: prev.likes + 1 }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to like content');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const share = async () => {
    if (!user) throw new Error('Must be logged in');

    try {
      setLoading(true);
      const { error: dbError } = await supabase
        .from('content_shares')
        .insert({ content_id: contentId, user_id: user.id });

      if (dbError) throw dbError;

      setMetrics(prev => ({ ...prev, shares: prev.shares + 1 }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to share content');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    metrics,
    loading,
    error,
    like,
    share
  };
}
```