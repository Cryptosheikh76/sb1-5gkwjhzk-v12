import { Dialog } from '@headlessui/react';
import { Tabs } from './Tabs';
import { GeneralSettings } from './settings/GeneralSettings';
import { StreamSettings } from './settings/StreamSettings';
import { NotificationSettings } from './settings/NotificationSettings';

interface SettingsMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsMenu({ isOpen, onClose }: SettingsMenuProps) {
  const tabs = [
    {
      label: 'General',
      content: <GeneralSettings />
    },
    {
      label: 'Stream',
      content: <StreamSettings />
    },
    {
      label: 'Notifications',
      content: <NotificationSettings />
    }
  ];

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/80" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-zinc-900 rounded-lg w-full max-w-md">
          <div className="p-6">
            <Dialog.Title className="text-xl font-bold mb-6">Settings</Dialog.Title>
            <Tabs tabs={tabs} />
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}