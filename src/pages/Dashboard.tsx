import { useState } from 'react';
import { AnalyticsDashboard } from '../features/analytics/components/AnalyticsDashboard';
import { StreamGrid } from '../features/streaming/components/StreamGrid';
import { SoundLibrary } from '../features/sounds/components/SoundLibrary';
import { Card } from '../components/ui/Card';
import { Tabs } from '../components/ui/Tabs';

export default function Dashboard() {
  const [selectedTab, setSelectedTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'streams', label: 'Live Streams' },
    { id: 'sounds', label: 'Sound Library' },
    { id: 'revenue', label: 'Revenue' }
  ];

  return (
    <div className="pt-4 pb-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-glow">Master Dashboard</h1>
      </div>

      <Card className="mb-6">
        <div className="p-4 flex space-x-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                selectedTab === tab.id
                  ? 'bg-primary text-black font-bold shadow-neon'
                  : 'hover:bg-surface-light'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </Card>

      <div className="space-y-6">
        {selectedTab === 'overview' && <AnalyticsDashboard />}
        {selectedTab === 'streams' && <StreamGrid />}
        {selectedTab === 'sounds' && <SoundLibrary />}
        {selectedTab === 'revenue' && <RevenueDashboard />}
      </div>
    </div>
  );
}