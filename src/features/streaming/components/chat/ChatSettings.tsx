import { useState } from 'react';
import { Card } from '../../../../components/ui/Card';
import { Switch } from '../../../../components/ui/Switch';
import { Input } from '../../../../components/ui/Input';

interface ChatSettings {
  slowMode: boolean;
  slowModeDelay: number;
  followersOnly: boolean;
  subscribersOnly: boolean;
  emoteOnly: boolean;
}

export function ChatSettings() {
  const [settings, setSettings] = useState<ChatSettings>({
    slowMode: false,
    slowModeDelay: 30,
    followersOnly: false,
    subscribersOnly: false,
    emoteOnly: false
  });

  const toggleSetting = (key: keyof ChatSettings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <Card className="p-4 space-y-4">
      <h3 className="font-medium">Chat Settings</h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Slow Mode</p>
            <p className="text-sm text-gray-400">
              Limit how often users can send messages
            </p>
          </div>
          <Switch
            checked={settings.slowMode}
            onCheckedChange={() => toggleSetting('slowMode')}
          />
        </div>

        {settings.slowMode && (
          <Input
            type="number"
            label="Delay (seconds)"
            value={settings.slowModeDelay}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              slowModeDelay: parseInt(e.target.value)
            }))}
            min={1}
            max={120}
          />
        )}

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Followers-Only</p>
            <p className="text-sm text-gray-400">
              Only followers can chat
            </p>
          </div>
          <Switch
            checked={settings.followersOnly}
            onCheckedChange={() => toggleSetting('followersOnly')}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Subscribers-Only</p>
            <p className="text-sm text-gray-400">
              Only subscribers can chat
            </p>
          </div>
          <Switch
            checked={settings.subscribersOnly}
            onCheckedChange={() => toggleSetting('subscribersOnly')}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Emote-Only</p>
            <p className="text-sm text-gray-400">
              Only emotes allowed in chat
            </p>
          </div>
          <Switch
            checked={settings.emoteOnly}
            onCheckedChange={() => toggleSetting('emoteOnly')}
          />
        </div>
      </div>
    </Card>
  );
}