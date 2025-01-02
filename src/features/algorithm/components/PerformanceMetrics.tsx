```typescript
import { useEffect, useState } from 'react';
import { useAlgorithmControl } from '../hooks/useAlgorithmControl';
import { Card } from '../../../components/ui/Card';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { Alert } from '../../../components/ui/Alert';
import type { AlgorithmStats } from '../types';

export function PerformanceMetrics() {
  const { getAlgorithmPerformance, loading, error } = useAlgorithmControl();
  const [stats, setStats] = useState<AlgorithmStats | null>(null);

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const loadStats = async () => {
    try {
      const data = await getAlgorithmPerformance();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  if (loading && !stats) return <LoadingSpinner />;
  if (error) return <Alert type="error" message={error} />;
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">User Engagement</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-400">Average Watch Time</p>
            <p className="text-2xl font-bold">{stats.userEngagement.avgWatchTime}s</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Completion Rate</p>
            <p className="text-2xl font-bold">
              {(stats.userEngagement.completionRate * 100).toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Return Rate</p>
            <p className="text-2xl font-bold">
              {(stats.userEngagement.returnRate * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Content Performance</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-400">Virality Rate</p>
            <p className="text-2xl font-bold">
              {(stats.contentPerformance.viralityRate * 100).toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Creator Retention</p>
            <p className="text-2xl font-bold">
              {(stats.contentPerformance.creatorRetention * 100).toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Monetization Rate</p>
            <p className="text-2xl font-bold">
              {(stats.contentPerformance.monetizationRate * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">System Health</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-400">Content Diversity</p>
            <p className="text-2xl font-bold">
              {(stats.systemHealth.diversityScore * 100).toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Fairness Score</p>
            <p className="text-2xl font-bold">
              {(stats.systemHealth.fairnessScore * 100).toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Average Latency</p>
            <p className="text-2xl font-bold">{stats.systemHealth.latency}ms</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
```