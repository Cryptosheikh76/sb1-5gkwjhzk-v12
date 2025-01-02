```typescript
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Slider } from '../../../components/ui/Slider';

interface QualityThresholdsProps {
  thresholds: {
    minEngagementRate: number;
    spamThreshold: number;
    contentDiversity: number;
  };
  onChange: (thresholds: QualityThresholdsProps['thresholds']) => void;
}

export function QualityThresholds({ thresholds, onChange }: QualityThresholdsProps) {
  return (
    <Card className="p-6 space-y-6">
      <h2 className="text-lg font-semibold">Quality Thresholds</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Minimum Engagement Rate ({(thresholds.minEngagementRate * 100).toFixed(1)}%)
          </label>
          <Slider
            value={[thresholds.minEngagementRate]}
            min={0}
            max={0.1}
            step={0.001}
            onValueChange={([value]) => onChange({
              ...thresholds,
              minEngagementRate: value
            })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Spam Detection Threshold ({(thresholds.spamThreshold * 100).toFixed(0)}%)
          </label>
          <Slider
            value={[thresholds.spamThreshold]}
            min={0}
            max={1}
            step={0.1}
            onValueChange={([value]) => onChange({
              ...thresholds,
              spamThreshold: value
            })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Content Diversity ({(thresholds.contentDiversity * 100).toFixed(0)}%)
          </label>
          <Slider
            value={[thresholds.contentDiversity]}
            min={0}
            max={1}
            step={0.1}
            onValueChange={([value]) => onChange({
              ...thresholds,
              contentDiversity: value
            })}
          />
        </div>
      </div>
    </Card>
  );
}
```