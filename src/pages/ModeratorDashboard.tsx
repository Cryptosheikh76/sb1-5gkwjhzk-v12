import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Alert } from '../components/ui/Alert';
import { Card } from '../components/ui/Card';
import { ModeratorOverview } from '../features/moderation/components/ModeratorOverview';
import { ContentQueue } from '../features/moderation/components/ContentQueue';
import { ReportedUsers } from '../features/moderation/components/ReportedUsers';
import { ModeratorStats } from '../features/moderation/components/ModeratorStats';

export default function ModeratorDashboard() {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState('overview');

  if (!user?.is_moderator) {
    return (
      <div className="p-8">
        <Alert type="error" message="Access denied. Moderators only area." />
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'queue', label: 'Content Queue' },
    { id: 'reports', label: 'User Reports' },
    { id: 'stats', label: 'Moderation Stats' }
  ];

  return (
    <div className="pt-4 pb-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-glow">Moderator Dashboard</h1>
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
        {selectedTab === 'overview' && <ModeratorOverview />}
        {selectedTab === 'queue' && <ContentQueue />}
        {selectedTab === 'reports' && <ReportedUsers />}
        {selectedTab === 'stats' && <ModeratorStats />}
      </div>
    </div>
  );
}