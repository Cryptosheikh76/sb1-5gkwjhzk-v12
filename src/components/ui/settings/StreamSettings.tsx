import { useSettings } from '../../../hooks/useSettings';
import { Switch } from '../Switch';
import { Input } from '../Input';

export function StreamSettings() {
  const { settings, updateSettings } = useSettings();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">Low Latency</p>
          <p className="text-sm text-gray-400">Reduce stream delay</p>
        </div>
        <Switch
          checked={settings.lowLatency}
          onCheckedChange={(checked) => updateSettings({ lowLatency: checked })}
        />
      </div>

      <Input
        type="number"
        label="Buffer Size (seconds)"
        value={settings.bufferSize}
        onChange={(e) => updateSettings({ bufferSize: parseInt(e.target.value) })}
        min={1}
        max={10}
      />
    </div>
  );
}