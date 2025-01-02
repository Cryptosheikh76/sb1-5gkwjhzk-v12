import { useSettings } from '../../../hooks/useSettings';
import { Switch } from '../Switch';

export function GeneralSettings() {
  const { settings, updateSettings } = useSettings();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">Dark Mode</p>
          <p className="text-sm text-gray-400">Enable dark theme</p>
        </div>
        <Switch
          checked={settings.darkMode}
          onCheckedChange={(checked) => updateSettings({ darkMode: checked })}
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">Reduced Motion</p>
          <p className="text-sm text-gray-400">Minimize animations</p>
        </div>
        <Switch
          checked={settings.reducedMotion}
          onCheckedChange={(checked) => updateSettings({ reducedMotion: checked })}
        />
      </div>
    </div>
  );
}