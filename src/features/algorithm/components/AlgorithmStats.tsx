```typescript
import { useAlgorithmStats } from '../hooks/useAlgorithmStats';
import { Card } from '../../../components/ui/Card';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';

export function AlgorithmStats() {
  const { stats, loading } = useAlgorithmStats();

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">User Engagement</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-400">Avg Watch Time</p>
            <p className="text-2xl font-bold">{stats.userEngagement.avgWatchTime}s</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Completion Rate</p>
            <p className="text-2xl font-bold">{(stats.userEngagement.completionRate * 100).toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Return Rate</p>
            <p className="text-2xl font-bold">{(stats.userEngagement.returnRate * 100).toFixed(1)}%</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Content Performance</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-400">Virality Rate</p>
            <p className="text-2xl font-bold">{(stats.contentPerformance.viralityRate * 100).toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Creator Retention</p>
            <p className="text-2xl font-bold">{(stats.contentPerformance.creatorRetention * 100).toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Monetization Rate</p>
            <p className="text-2xl font-bold">{(stats.contentPerformance.monetizationRate * 100).toFixed(1)}%</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">System Health</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-400">Diversity Score</p>
            <p className="text-2xl font-bold">{(stats.systemHealth.diversityScore * 100).toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Fairness Score</p>
            <p className="text-2xl font-bold">{(stats.systemHealth.fairnessScore * 100).toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Avg Latency</p>
            <p className="text-2xl font-bold">{stats.systemHealth.latency}ms</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
```