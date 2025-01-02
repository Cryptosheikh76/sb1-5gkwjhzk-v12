```typescript
import { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { monitoring } from '../../../lib/monitoring';
import type { AlgorithmSettings } from '../types';

export function useAlgorithmControl() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateAlgorithmSettings = async (settings: AlgorithmSettings) => {
    try {
      setLoading(true);
      setError(null);

      const { error: dbError } = await supabase
        .from('algorithm_settings')
        .upsert({
          weights: settings.weights,
          engagement_metrics: settings.engagement,
          quality_thresholds: settings.quality,
          updated_at: new Date().toISOString()
        });

      if (dbError) throw dbError;

      monitoring.logEvent('algorithm_settings_updated', {
        weights: settings.weights,
        engagement: settings.engagement,
        quality: settings.quality
      });

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update algorithm settings';
      setError(message);
      monitoring.captureError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getAlgorithmPerformance = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: dbError } = await supabase
        .from('algorithm_metrics')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(1)
        .single();

      if (dbError) throw dbError;
      return data;

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to get algorithm performance';
      setError(message);
      monitoring.captureError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateAlgorithmSettings,
    getAlgorithmPerformance,
    loading,
    error
  };
}
```