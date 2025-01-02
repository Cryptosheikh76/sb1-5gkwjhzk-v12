```typescript
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { monitoring } from '../../../lib/monitoring';
import type { AlgorithmSettings } from '../types';

const DEFAULT_SETTINGS: AlgorithmSettings = {
  weights: {
    engagement: 0.4,
    recency: 0.2,
    relevance: 0.2,
    quality: 0.2
  },
  engagement: {
    likeWeight: 1,
    commentWeight: 2,
    shareWeight: 3,
    minWatchTime: 10
  },
  quality: {
    minEngagementRate: 0.01,
    spamThreshold: 0.8,
    contentDiversity: 0.3
  }
};

export function useAlgorithmSettings() {
  const [settings, setSettings] = useState<AlgorithmSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error: dbError } = await supabase
        .from('algorithm_settings')
        .select('*')
        .single();

      if (dbError) throw dbError;
      if (data) setSettings(data.settings);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load settings');
      monitoring.captureError(err as Error);
    }
  };

  const updateSettings = async (newSettings: AlgorithmSettings) => {
    try {
      setLoading(true);
      setError(null);

      const { error: dbError } = await supabase
        .from('algorithm_settings')
        .upsert({
          settings: newSettings,
          updated_at: new Date().toISOString()
        });

      if (dbError) throw dbError;
      setSettings(newSettings);

      monitoring.logEvent('algorithm_settings_updated', {
        weights: newSettings.weights,
        thresholds: newSettings.quality
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update settings');
      monitoring.captureError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return {
    settings,
    updateSettings,
    loading,
    error
  };
}
```