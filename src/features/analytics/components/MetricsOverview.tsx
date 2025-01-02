import { UserMetrics } from '../types/metrics';
import { Card } from '../../../components/ui/Card';

interface MetricsOverviewProps {
  metrics: UserMetrics;
}

export function MetricsOverview({ metrics }: MetricsOverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-400">Total Views</h3>
          <p className="text-2xl font-bold">{metrics.totalViews.toLocaleString()}</p>
        </div>
      </Card>
      
      <Card>
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-400">Watch Time</h3>
          <p className="text-2xl font-bold">
            {Math.round(metrics.watchTime / 60)} mins
          </p>
        </div>
      </Card>
      
      <Card>
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-400">Engagement Rate</h3>
          <p className="text-2xl font-bold">
            {(metrics.engagementRate * 100).toFixed(1)}%
          </p>
        </div>
      </Card>
    </div>
  );
}