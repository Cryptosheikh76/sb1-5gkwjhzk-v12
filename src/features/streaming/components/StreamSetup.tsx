import { useState } from 'react';
import { useStreamSetup } from '../hooks/useStreamSetup';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card } from '../../../components/ui/Card';
import { Alert } from '../../../components/ui/Alert';

export function StreamSetup() {
  const [title, setTitle] = useState('');
  const { streamSettings, generateStreamKey, loading, error } = useStreamSetup();

  return (
    <Card className="p-6 space-y-6">
      <h2 className="text-xl font-bold">Stream Setup</h2>

      <div className="space-y-4">
        <Input
          label="Stream Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter your stream title"
        />

        {streamSettings && (
          <div className="space-y-2">
            <h3 className="font-medium">Stream Settings</h3>
            <div className="bg-zinc-900 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Server URL:</span>
                <code className="font-mono">{streamSettings.serverUrl}</code>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Stream Key:</span>
                <code className="font-mono">{streamSettings.streamKey}</code>
              </div>
            </div>
            
            <Alert type="info" message="Use these settings in OBS Studio: Settings > Stream" />
          </div>
        )}

        {error && <Alert type="error" message={error} />}

        <Button
          onClick={generateStreamKey}
          loading={loading}
          disabled={!title}
          fullWidth
        >
          Generate Stream Key
        </Button>
      </div>

      <div className="space-y-2">
        <h3 className="font-medium">Recommended OBS Settings</h3>
        <ul className="text-sm text-gray-400 space-y-1">
          <li>• Video Bitrate: 4000-6000 Kbps</li>
          <li>• Resolution: 1920x1080 or 1280x720</li>
          <li>• Keyframe Interval: 2 seconds</li>
          <li>• Profile: Main</li>
          <li>• Audio Bitrate: 160 Kbps</li>
        </ul>
      </div>
    </Card>
  );
}