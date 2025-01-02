import { useState } from 'react';
import { useStreamControls } from '../../hooks/stream/useStreamControls';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { ErrorMessage } from '../common/ErrorMessage';

interface StreamControlsProps {
  onStreamStart?: () => void;
  onStreamEnd?: () => void;
}

export function StreamControls({ onStreamStart, onStreamEnd }: StreamControlsProps) {
  const [title, setTitle] = useState('');
  const { isLive, loading, error, startLiveStream, endLiveStream } = useStreamControls();

  const handleStartStream = async () => {
    try {
      await startLiveStream(title);
      onStreamStart?.();
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleEndStream = async () => {
    try {
      await endLiveStream();
      onStreamEnd?.();
    } catch (error) {
      // Error is handled by the hook
    }
  };

  return (
    <Card className="space-y-4">
      <Input
        label="Stream Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter your stream title"
        disabled={loading || isLive}
      />

      {error && <ErrorMessage message={error} />}

      <div className="flex justify-end space-x-2">
        {!isLive ? (
          <Button
            onClick={handleStartStream}
            disabled={loading || !title}
            loading={loading}
          >
            Start Stream
          </Button>
        ) : (
          <Button
            onClick={handleEndStream}
            disabled={loading}
            loading={loading}
            variant="danger"
          >
            End Stream
          </Button>
        )}
      </div>
    </Card>
  );
}