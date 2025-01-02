```typescript
import { useRevenueStats } from '../../hooks/useRevenueStats';
import { useAuth } from '../../features/auth/components/AuthProvider';
import { Card } from '../ui/Card';
import { LoadingSpinner } from '../common/LoadingSpinner';

export function RevenueDashboard() {
  const { user } = useAuth();
  const { stats, loading } = useRevenueStats(user?.id || '');

  if (!user) return null;
  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-400">Total Earnings</h3>
          <p className="text-2xl font-bold mt-1">{stats.totalEarnings} AGC</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-400">Platform Fees</h3>
          <p className="text-2xl font-bold mt-1">{stats.platformFees} AGC</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-400">Engagement Rewards</h3>
          <p className="text-2xl font-bold mt-1">{stats.rewardsByType.engagement} AGC</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6">
          <h3 className="font-medium mb-4">Revenue by Type</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>NFT Sales</span>
              <span>{stats.revenueByType.nft_sales} AGC</span>
            </div>
            <div className="flex justify-between">
              <span>Tips</span>
              <span>{stats.revenueByType.tips} AGC</span>
            </div>
            <div className="flex justify-between">
              <span>Subscriptions</span>
              <span>{stats.revenueByType.subscriptions} AGC</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-medium mb-4">Rewards</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Engagement</span>
              <span>{stats.rewardsByType.engagement} AGC</span>
            </div>
            <div className="flex justify-between">
              <span>Referrals</span>
              <span>{stats.rewardsByType.referrals} AGC</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
```