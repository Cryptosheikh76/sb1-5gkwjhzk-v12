import { useAuth } from '../../hooks/useAuth';
import CreatorManagement from './CreatorManagement';
import ContentModeration from './ContentModeration';
import { Tab } from '@headlessui/react';

export default function StaffDashboard() {
  const { user } = useAuth();
  const tabs = ['Creator Management', 'Content Moderation'];

  if (!user?.is_staff) {
    return <div className="p-8 text-center">Access denied. Staff only area.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Staff Dashboard</h1>
      
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-zinc-800 p-1">
          {tabs.map((tab) => (
            <Tab
              key={tab}
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                ${selected 
                  ? 'bg-white text-zinc-900'
                  : 'text-gray-400 hover:text-white hover:bg-zinc-700'}`
              }
            >
              {tab}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-4">
          <Tab.Panel>
            <CreatorManagement />
          </Tab.Panel>
          <Tab.Panel>
            <ContentModeration />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}