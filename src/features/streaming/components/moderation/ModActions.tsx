import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';

interface ModActionsProps {
  username: string;
  onTimeout: (duration: number) => void;
  onBan: () => void;
  onUnban: () => void;
}

export function ModActions({ username, onTimeout, onBan, onUnban }: ModActionsProps) {
  const timeoutDurations = [
    { label: '10m', value: 600 },
    { label: '1h', value: 3600 },
    { label: '24h', value: 86400 },
    { label: '1w', value: 604800 }
  ];

  return (
    <div className="p-4 bg-zinc-900 rounded-lg space-y-4">
      <div className="flex items-center justify-between">
        <span className="font-medium">{username}</span>
        <Button variant="danger" onClick={onBan}>Ban</Button>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Timeout Duration</p>
        <div className="flex gap-2">
          {timeoutDurations.map(({ label, value }) => (
            <Button
              key={label}
              size="sm"
              variant="secondary"
              onClick={() => onTimeout(value)}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      <Button variant="secondary" onClick={onUnban} fullWidth>
        Remove Ban
      </Button>
    </div>
  );
}