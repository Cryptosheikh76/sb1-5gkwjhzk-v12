import { useState } from 'react';
import { Card } from '../../../../components/ui/Card';
import { Switch } from '../../../../components/ui/Switch';

interface AutoModSettings {
  profanity: boolean;
  discrimination: boolean;
  spam: boolean;
  links: boolean;
  caps: boolean;
  emoteSpam: boolean;
}

export function AutoMod() {
  const [settings, setSettings] = useState<AutoModSettings>({
    profanity: true,
    discrimination: true,
    spam: true,
    links: false,
    caps: false,
    emoteSpam: false
  });

  const toggleSetting = (key: keyof AutoModSettings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <Card className="p-4 space-y-4">
      <h3 className="font-medium">AutoMod Settings</h3>

      <div className="space-y-4">
        {Object.entries(settings).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between">
            <div>
              <p className="font-medium capitalize">{key}</p>
              <p className="text-sm text-gray-400">
                Block {key.toLowerCase()} in chat
              </p>
            </div>
            <Switch
              checked={value}
              onCheckedChange={() => toggleSetting(key as keyof AutoModSettings)}
            />
          </div>
        ))}
      </div>
    </Card>
  );
}