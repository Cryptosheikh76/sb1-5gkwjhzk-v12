```typescript
import { useRevenueStats } from '../hooks/useRevenueStats';
import { EarningsOverview } from './EarningsOverview';
import { RevenueBreakdown } from './RevenueBreakdown';
import { PaymentHistory } from './PaymentHistory';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { Alert } from '../../../components/ui/Alert';

export function EarningsDashboard() {
  const { stats, loading, error } = useRevenueStats();

  if (loading) return <LoadingSpinner />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Earnings Dashboard</h1>
      <EarningsOverview stats={stats} />
      <RevenueBreakdown stats={stats} />
      <PaymentHistory />
    </div>
  );
}
```