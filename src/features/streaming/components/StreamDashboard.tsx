import { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { StreamSetup } from './StreamSetup';
import { StreamHealth } from './StreamHealth';
import { ChatRules } from './chat/ChatRules';
import { ChatCommands } from './chat/ChatCommands';
import { AutoMod } from './moderation/AutoMod';
import { StreamAnalytics } from './analytics/StreamAnalytics';

export function StreamDashboard() {
  const [activeTab, setActiveTab] = useState('setup');

  const tabs = [
    { id: 'setup', label: 'Stream Setup' },
    { id: 'health', label: 'Stream Health' },
    { id: 'chat', label: 'Chat Settings' },
    { id: 'moderation', label: 'Moderation' },
    { id: 'analytics', label: 'Analytics' }
  ];

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <div className="flex gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary text-black font-bold'
                  : 'hover:bg-zinc-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </Card>

      <div className="space-y-6">
        {activeTab === 'setup' && <StreamSetup />}
        {activeTab === 'health' && <StreamHealth streamId="current-stream" />}
        {activeTab === 'chat' && (
          <div className="space-y-6">
            <ChatRules />
            <ChatCommands />
          </div>
        )}
        {activeTab === 'moderation' && <AutoMod />}
        {activeTab === 'analytics' && <StreamAnalytics />}
      </div>
    </div>
  );
}