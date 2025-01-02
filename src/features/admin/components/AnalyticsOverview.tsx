import { useAdminAnalytics } from '../hooks/useAdminAnalytics';
import { Card } from '../../../components/ui/Card';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { formatNumber } from '../../../utils/format';

export function AnalyticsOverview() {
  const { stats, loading } = useAdminAnalytics();

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-surface to-surface-light">
          <h3 className="text-sm font-medium text-gray-400">Active Users</h3>
          <p className="text-2xl font-bold text-glow-blue mt-2">
            {formatNumber(stats.activeUsers)}
          </p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-surface to-surface-light">
          <h3 className="text-sm font-medium text-gray-400">Live Streams</h3>
          <p className="text-2xl font-bold text-glow-pink mt-2">
            {formatNumber(stats.liveStreams)}
          </p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-surface to-surface-light">
          <h3 className="text-sm font-medium text-gray-400">Content Reports</h3>
          <p className="text-2xl font-bold text-glow-yellow mt-2">
            {formatNumber(stats.contentReports)}
          </p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-surface to-surface-light">
          <h3 className="text-sm font-medium text-gray-400">System Health</h3>
          <p className="text-2xl font-bold text-glow-green mt-2">
            {stats.systemHealth}%
          </p>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {stats.recentActivity.map(activity => (
            <div key={activity.id} className="flex justify-between items-center p-4 bg-surface-light rounded-lg">
              <div>
                <p className="font-medium">{activity.type}</p>
                <p className="text-sm text-gray-400">{activity.description}</p>
              </div>
              <span className="text-sm text-gray-400">{activity.timestamp}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}