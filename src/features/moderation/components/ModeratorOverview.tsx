import { useModeratorStats } from '../hooks/useModeratorStats';
import { Card } from '../../../components/ui/Card';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { formatNumber } from '../../../utils/format';

export function ModeratorOverview() {
  const { stats, loading } = useModeratorStats();

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-surface to-surface-light">
          <h3 className="text-sm font-medium text-gray-400">Pending Reviews</h3>
          <p className="text-2xl font-bold text-glow-yellow mt-2">
            {formatNumber(stats.pendingReviews)}
          </p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-surface to-surface-light">
          <h3 className="text-sm font-medium text-gray-400">Today's Actions</h3>
          <p className="text-2xl font-bold text-glow-blue mt-2">
            {formatNumber(stats.todayActions)}
          </p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-surface to-surface-light">
          <h3 className="text-sm font-medium text-gray-400">Response Time</h3>
          <p className="text-2xl font-bold text-glow-green mt-2">
            {stats.avgResponseTime}m
          </p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-surface to-surface-light">
          <h3 className="text-sm font-medium text-gray-400">Accuracy Rate</h3>
          <p className="text-2xl font-bold text-glow-pink mt-2">
            {stats.accuracyRate}%
          </p>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Actions</h2>
        <div className="space-y-4">
          {stats.recentActions.map(action => (
            <div key={action.id} className="flex justify-between items-center p-4 bg-surface-light rounded-lg">
              <div>
                <p className="font-medium">{action.type}</p>
                <p className="text-sm text-gray-400">{action.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-sm ${
                  action.severity === 'high' ? 'bg-red-500/20 text-red-400' :
                  action.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-green-500/20 text-green-400'
                }`}>
                  {action.severity}
                </span>
                <span className="text-sm text-gray-400">{action.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}