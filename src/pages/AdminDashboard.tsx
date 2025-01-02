import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Alert } from '../components/ui/Alert';
import { Card } from '../components/ui/Card';
import { ContentModeration } from '../features/moderation/components/ContentModeration';
import { CreatorManagement } from '../features/admin/components/CreatorManagement';
import { AnalyticsOverview } from '../features/admin/components/AnalyticsOverview';
import { SystemHealth } from '../features/admin/components/SystemHealth';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState('overview');

  if (!user?.is_staff) {
    return (
      <div className="p-8">
        <Alert type="error" message="Access denied. Staff only area." />
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'moderation', label: 'Content Moderation' },
    { id: 'creators', label: 'Creator Management' },
    { id: 'system', label: 'System Health' }
  ];

  return (
    <div className="pt-4 pb-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-glow">Admin Dashboard</h1>
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
        {selectedTab === 'overview' && <AnalyticsOverview />}
        {selectedTab === 'moderation' && <ContentModeration />}
        {selectedTab === 'creators' && <CreatorManagement />}
        {selectedTab === 'system' && <SystemHealth />}
      </div>
    </div>
  );
}