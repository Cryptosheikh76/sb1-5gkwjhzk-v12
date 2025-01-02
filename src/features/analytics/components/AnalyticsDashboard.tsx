```typescript
import { useAnalytics } from '../hooks/useAnalytics';
import { PerformanceMetrics } from './PerformanceMetrics';
import { EngagementChart } from './EngagementChart';
import { AudienceInsights } from './AudienceInsights';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { Alert } from '../../../components/ui/Alert';

export function AnalyticsDashboard() {
  const { data, loading, error } = useAnalytics();

  if (loading) return <LoadingSpinner />;
  if (error) return <Alert type="error" message={error} />;
  if (!data) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Analytics</h1>
      <PerformanceMetrics metrics={data.performance} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EngagementChart data={data.engagement} />
        <AudienceInsights data={data.audience} />
      </div>
    </div>
  );
}
```