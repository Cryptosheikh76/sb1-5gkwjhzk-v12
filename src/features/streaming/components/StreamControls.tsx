import { useState } from 'react';
import { useStreamSetup } from '../hooks/useStreamSetup';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { StreamConfig } from '../types';

export function StreamControls() {
  const [title, setTitle] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const { stream, error, startStream, stopStream } = useStreamSetup();

  const handleStartStream = async () => {
    const config: StreamConfig = {
      id: crypto.randomUUID(),
      title,
      creatorId: '', // Set from auth context
      isPrivate
    };
    
    await startStream(config);
  };

  return (
    <div className="space-y-4">
      <Input
        label="Stream Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={!!stream}
      />
      
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={isPrivate}
          onChange={(e) => setIsPrivate(e.target.checked)}
          disabled={!!stream}
        />
        <span>Private Stream (Token Required)</span>
      </label>
      
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
      
      <Button
        onClick={stream ? stopStream : handleStartStream}
        variant={stream ? 'danger' : 'primary'}
      >
        {stream ? 'End Stream' : 'Start Stream'}
      </Button>
    </div>
  );
}