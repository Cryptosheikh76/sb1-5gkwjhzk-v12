```typescript
import { Card } from '../../../components/ui/Card';
import { Slider } from '../../../components/ui/Slider';

interface ContentWeightsProps {
  weights: {
    engagement: number;
    recency: number;
    relevance: number;
    quality: number;
  };
  onChange: (weights: ContentWeightsProps['weights']) => void;
}

export function ContentWeights({ weights, onChange }: ContentWeightsProps) {
  const handleChange = (key: keyof typeof weights, value: number) => {
    // Normalize other weights to ensure sum is 1
    const total = Object.values(weights).reduce((sum, w) => sum + w, 0) - weights[key] + value;
    const factor = 1 / total;
    
    const newWeights = Object.entries(weights).reduce((acc, [k, w]) => ({
      ...acc,
      [k]: k === key ? value : w * factor
    }), {} as typeof weights);

    onChange(newWeights);
  };

  return (
    <Card className="p-6 space-y-6">
      <h2 className="text-lg font-semibold">Content Weights</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Engagement Weight ({(weights.engagement * 100).toFixed(0)}%)
          </label>
          <Slider
            value={[weights.engagement]}
            min={0}
            max={1}
            step={0.1}
            onValueChange={([value]) => handleChange('engagement', value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Recency Weight ({(weights.recency * 100).toFixed(0)}%)
          </label>
          <Slider
            value={[weights.recency]}
            min={0}
            max={1}
            step={0.1}
            onValueChange={([value]) => handleChange('recency', value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Relevance Weight ({(weights.relevance * 100).toFixed(0)}%)
          </label>
          <Slider
            value={[weights.relevance]}
            min={0}
            max={1}
            step={0.1}
            onValueChange={([value]) => handleChange('relevance', value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Quality Weight ({(weights.quality * 100).toFixed(0)}%)
          </label>
          <Slider
            value={[weights.quality]}
            min={0}
            max={1}
            step={0.1}
            onValueChange={([value]) => handleChange('quality', value)}
          />
        </div>
      </div>
    </Card>
  );
}
```