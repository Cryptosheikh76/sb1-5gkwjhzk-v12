```typescript
import { useAuth } from '../../auth/components/AuthProvider';
import { useAnalytics } from '../hooks/useAnalytics';
import { Card } from '../../../components/ui/Card';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { formatNumber } from '../../../utils/format';

export function ProfileDashboard() {
  const { user } = useAuth();
  const { stats, loading } = useAnalytics(user?.id);

  if (!user) return null;
  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-400">Total Views</h3>
          <p className="text-2xl font-bold mt-1">{formatNumber(stats.totalViews)}</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-400">Total Earnings</h3>
          <p className="text-2xl font-bold mt-1">{stats.totalEarnings} AGC</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-400">Engagement Rate</h3>
          <p className="text-2xl font-bold mt-1">{stats.engagementRate}%</p>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Content Performance</h2>
        <div className="space-y-4">
          {stats.content.map(item => (
            <div key={item.id} className="flex justify-between items-center p-4 bg-zinc-800 rounded-lg">
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-gray-400">
                  {item.views} views • {item.likes} likes
                </p>
              </div>
              <p className="font-medium">{item.earnings} AGC</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
```