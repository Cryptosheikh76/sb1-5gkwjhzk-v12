import { useSettings } from '../../../hooks/useSettings';
import { Switch } from '../Switch';

export function NotificationSettings() {
  const { settings, updateSettings } = useSettings();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">Stream Notifications</p>
          <p className="text-sm text-gray-400">When streamers go live</p>
        </div>
        <Switch
          checked={settings.streamNotifications}
          onCheckedChange={(checked) => updateSettings({ streamNotifications: checked })}
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">Chat Mentions</p>
          <p className="text-sm text-gray-400">When someone mentions you</p>
        </div>
        <Switch
          checked={settings.chatMentions}
          onCheckedChange={(checked) => updateSettings({ chatMentions: checked })}
        />
      </div>
    </div>
  );
}