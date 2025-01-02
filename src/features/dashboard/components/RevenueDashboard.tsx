import { Card } from '../../../components/ui/Card';
import { useRevenue } from '../hooks/useRevenue';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { formatCurrency } from '../../../utils/format';

export function RevenueDashboard() {
  const { revenue, loading } = useRevenue();

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-surface to-surface-light">
          <h3 className="text-sm font-medium text-gray-400">Total Revenue</h3>
          <p className="text-2xl font-bold text-glow-yellow mt-2">
            {formatCurrency(revenue.total)}
          </p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-surface to-surface-light">
          <h3 className="text-sm font-medium text-gray-400">This Month</h3>
          <p className="text-2xl font-bold text-glow-blue mt-2">
            {formatCurrency(revenue.thisMonth)}
          </p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-surface to-surface-light">
          <h3 className="text-sm font-medium text-gray-400">Pending</h3>
          <p className="text-2xl font-bold text-glow-pink mt-2">
            {formatCurrency(revenue.pending)}
          </p>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Revenue Sources</h2>
        <div className="space-y-4">
          {revenue.sources.map(source => (
            <div key={source.type} className="flex justify-between items-center">
              <div>
                <p className="font-medium">{source.type}</p>
                <p className="text-sm text-gray-400">{source.count} transactions</p>
              </div>
              <p className="font-bold">{formatCurrency(source.amount)}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}