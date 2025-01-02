```typescript
import { Card } from '../../../components/ui/Card';
import { formatNumber } from '../../../utils/format';
import type { RevenueStats } from '../types';

interface EarningsOverviewProps {
  stats: RevenueStats;
}

export function EarningsOverview({ stats }: EarningsOverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-6">
        <h3 className="text-sm font-medium text-gray-400">Total Earnings</h3>
        <p className="text-2xl font-bold mt-1">{formatNumber(stats.totalEarnings)} AGC</p>
        <p className="text-sm text-gray-400 mt-2">
          After platform fees and royalties
        </p>
      </Card>

      <Card className="p-6">
        <h3 className="text-sm font-medium text-gray-400">This Month</h3>
        <p className="text-2xl font-bold mt-1">{formatNumber(stats.monthlyEarnings)} AGC</p>
        <p className="text-sm text-green-400 mt-2">
          +{stats.monthlyGrowth}% from last month
        </p>
      </Card>

      <Card className="p-6">
        <h3 className="text-sm font-medium text-gray-400">Pending</h3>
        <p className="text-2xl font-bold mt-1">{formatNumber(stats.pendingEarnings)} AGC</p>
        <p className="text-sm text-gray-400 mt-2">
          Expected in next payout
        </p>
      </Card>
    </div>
  );
}
```