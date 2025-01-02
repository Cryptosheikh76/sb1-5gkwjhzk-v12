```typescript
import { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { ContentWeights } from './ContentWeights';
import { EngagementMetrics } from './EngagementMetrics';
import { QualityThresholds } from './QualityThresholds';
import { AlgorithmStats } from './AlgorithmStats';
import { Button } from '../../../components/ui/Button';
import { useAlgorithmSettings } from '../hooks/useAlgorithmSettings';

export function AlgorithmDashboard() {
  const [selectedTab, setSelectedTab] = useState('weights');
  const { settings, updateSettings, loading, error } = useAlgorithmSettings();

  const tabs = [
    { id: 'weights', label: 'Content Weights' },
    { id: 'engagement', label: 'Engagement Metrics' },
    { id: 'quality', label: 'Quality Control' },
    { id: 'stats', label: 'Performance' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Algorithm Control</h1>
        <Button
          variant="primary"
          onClick={() => updateSettings(settings)}
          loading={loading}
        >
          Save Changes
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex gap-2">
          {tabs.map(tab => (
            <Button
              key={tab.id}
              variant={selectedTab === tab.id ? 'primary' : 'secondary'}
              onClick={() => setSelectedTab(tab.id)}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </Card>

      <div className="space-y-6">
        {selectedTab === 'weights' && (
          <ContentWeights
            weights={settings.weights}
            onChange={(weights) => updateSettings({ ...settings, weights })}
          />
        )}
        {selectedTab === 'engagement' && (
          <EngagementMetrics
            metrics={settings.engagement}
            onChange={(engagement) => updateSettings({ ...settings, engagement })}
          />
        )}
        {selectedTab === 'quality' && (
          <QualityThresholds
            thresholds={settings.quality}
            onChange={(quality) => updateSettings({ ...settings, quality })}
          />
        )}
        {selectedTab === 'stats' && (
          <AlgorithmStats />
        )}
      </div>
    </div>
  );
}
```