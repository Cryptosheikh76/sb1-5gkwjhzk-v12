import { useMetrics } from '../hooks/useMetrics';
import { Card } from '../../../components/ui/Card';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { Alert } from '../../../components/ui/Alert';

interface MetricsDisplayProps {
  userId: string;
}

export function MetricsDisplay({ userId }: MetricsDisplayProps) {
  const { userMetrics, contentMetrics, loading, error } = useMetrics(userId);

  if (loading) return <LoadingSpinner size="lg" />;
  if (error) return <Alert type="error" message={error} />;
  if (!userMetrics) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-400">Total Views</h3>
            <p className="text-2xl font-bold">{userMetrics.totalViews}</p>
          </div>
        </Card>
        
        <Card>
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-400">Watch Time</h3>
            <p className="text-2xl font-bold">
              {Math.round(userMetrics.watchTime / 60)} mins
            </p>
          </div>
        </Card>
        
        <Card>
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-400">Engagement Rate</h3>
            <p className="text-2xl font-bold">
              {(userMetrics.engagementRate * 100).toFixed(1)}%
            </p>
          </div>
        </Card>
      </div>

      <div className="bg-zinc-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Content Performance</h2>
        <div className="space-y-4">
          {contentMetrics.map((metric) => (
            <div 
              key={metric.contentId}
              className="flex items-center justify-between p-4 bg-zinc-700 rounded-lg"
            >
              <div>
                <p className="font-medium">{metric.title}</p>
                <p className="text-sm text-gray-400">
                  {metric.views} views • {Math.round(metric.averageWatchTime)}s avg. watch time
                </p>
              </div>
              <div className="text-sm">
                <p>{metric.engagement.likes} likes</p>
                <p>{metric.engagement.comments} comments</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}