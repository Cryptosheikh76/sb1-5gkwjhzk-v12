```typescript
import { useState } from 'react';
import { useAlgorithmControl } from '../hooks/useAlgorithmControl';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Alert } from '../../../components/ui/Alert';
import { Slider } from '../../../components/ui/Slider';
import { Input } from '../../../components/ui/Input';
import { AlgorithmSettings } from '../types';

export function AlgorithmControl() {
  const { updateAlgorithmSettings, loading, error } = useAlgorithmControl();
  const [settings, setSettings] = useState<AlgorithmSettings>({
    weights: {
      engagement: 0.4,
      recency: 0.2,
      relevance: 0.2,
      quality: 0.2
    },
    engagement: {
      likeWeight: 1,
      commentWeight: 2,
      shareWeight: 3,
      minWatchTime: 10
    },
    quality: {
      minEngagementRate: 0.01,
      spamThreshold: 0.8,
      contentDiversity: 0.3
    }
  });

  const handleWeightChange = (key: keyof typeof settings.weights, value: number) => {
    // Normalize weights to ensure they sum to 1
    const currentSum = Object.values(settings.weights).reduce((a, b) => a + b, 0);
    const factor = (1 - value) / (currentSum - settings.weights[key]);
    
    const newWeights = Object.entries(settings.weights).reduce((acc, [k, w]) => ({
      ...acc,
      [k]: k === key ? value : w * factor
    }), {} as typeof settings.weights);

    setSettings(prev => ({
      ...prev,
      weights: newWeights
    }));
  };

  const handleSave = async () => {
    try {
      await updateAlgorithmSettings(settings);
    } catch (error) {
      console.error('Failed to update settings:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Content Weights</h2>
        <div className="space-y-4">
          {Object.entries(settings.weights).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium mb-2">
                {key.charAt(0).toUpperCase() + key.slice(1)} ({(value * 100).toFixed(0)}%)
              </label>
              <Slider
                value={[value]}
                min={0}
                max={1}
                step={0.1}
                onValueChange={([v]) => handleWeightChange(key as keyof typeof settings.weights, v)}
              />
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Engagement Settings</h2>
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="number"
            label="Like Weight"
            value={settings.engagement.likeWeight}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              engagement: {
                ...prev.engagement,
                likeWeight: Number(e.target.value)
              }
            }))}
            min={0}
            step={0.1}
          />
          <Input
            type="number"
            label="Comment Weight"
            value={settings.engagement.commentWeight}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              engagement: {
                ...prev.engagement,
                commentWeight: Number(e.target.value)
              }
            }))}
            min={0}
            step={0.1}
          />
          <Input
            type="number"
            label="Share Weight"
            value={settings.engagement.shareWeight}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              engagement: {
                ...prev.engagement,
                shareWeight: Number(e.target.value)
              }
            }))}
            min={0}
            step={0.1}
          />
          <Input
            type="number"
            label="Min Watch Time (seconds)"
            value={settings.engagement.minWatchTime}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              engagement: {
                ...prev.engagement,
                minWatchTime: Number(e.target.value)
              }
            }))}
            min={0}
          />
        </div>
      </Card>

      {error && <Alert type="error" message={error} />}

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          loading={loading}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}
```