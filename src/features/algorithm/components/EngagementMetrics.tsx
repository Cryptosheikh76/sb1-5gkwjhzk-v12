```typescript
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';

interface EngagementMetricsProps {
  metrics: {
    likeWeight: number;
    commentWeight: number;
    shareWeight: number;
    minWatchTime: number;
  };
  onChange: (metrics: EngagementMetricsProps['metrics']) => void;
}

export function EngagementMetrics({ metrics, onChange }: EngagementMetricsProps) {
  return (
    <Card className="p-6 space-y-6">
      <h2 className="text-lg font-semibold">Engagement Metrics</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <Input
          type="number"
          label="Like Weight"
          value={metrics.likeWeight}
          onChange={(e) => onChange({
            ...metrics,
            likeWeight: Number(e.target.value)
          })}
          min={0}
          step={0.1}
        />

        <Input
          type="number"
          label="Comment Weight"
          value={metrics.commentWeight}
          onChange={(e) => onChange({
            ...metrics,
            commentWeight: Number(e.target.value)
          })}
          min={0}
          step={0.1}
        />

        <Input
          type="number"
          label="Share Weight"
          value={metrics.shareWeight}
          onChange={(e) => onChange({
            ...metrics,
            shareWeight: Number(e.target.value)
          })}
          min={0}
          step={0.1}
        />

        <Input
          type="number"
          label="Min Watch Time (seconds)"
          value={metrics.minWatchTime}
          onChange={(e) => onChange({
            ...metrics,
            minWatchTime: Number(e.target.value)
          })}
          min={0}
        />
      </div>
    </Card>
  );
}
```