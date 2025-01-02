import { Tab } from '@headlessui/react';
import { cn } from '../../utils/styles';

interface TabsProps {
  tabs: {
    label: string;
    content: React.ReactNode;
  }[];
  className?: string;
}

export function Tabs({ tabs, className }: TabsProps) {
  return (
    <Tab.Group>
      <Tab.List className={cn('flex space-x-1 rounded-xl bg-zinc-800 p-1', className)}>
        {tabs.map((tab) => (
          <Tab
            key={tab.label}
            className={({ selected }) =>
              cn(
                'w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-colors',
                selected 
                  ? 'bg-white text-zinc-900'
                  : 'text-gray-400 hover:text-white hover:bg-zinc-700'
              )
            }
          >
            {tab.label}
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels className="mt-4">
        {tabs.map((tab, idx) => (
          <Tab.Panel key={idx}>
            {tab.content}
          </Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
}