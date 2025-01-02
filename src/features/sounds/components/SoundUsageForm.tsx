import { useState } from 'react';
import { useSoundRevenue } from '../hooks/useSoundRevenue';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Alert } from '../../../components/ui/Alert';

interface SoundUsageFormProps {
  soundId: string;
  contentId: string;
  contentType: 'video' | 'livestream';
  onComplete?: () => void;
}

export function SoundUsageForm({ 
  soundId, 
  contentId, 
  contentType,
  onComplete 
}: SoundUsageFormProps) {
  const [startTime, setStartTime] = useState(0);
  const { setupRevenueShare, loading, error } = useSoundRevenue(soundId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await setupRevenueShare(contentId, contentType);
      onComplete?.();
    } catch (error) {
      // Error handled by hook
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Start Time (seconds)</label>
        <Input
          type="number"
          min={0}
          value={startTime}
          onChange={(e) => setStartTime(parseInt(e.target.value))}
        />
      </div>

      <div className="text-sm text-gray-400">
        * Sound creator will receive 25% of content revenue
      </div>

      {error && <Alert type="error" message={error} />}

      <Button
        type="submit"
        disabled={loading}
        loading={loading}
        fullWidth
      >
        Add Sound to {contentType === 'video' ? 'Video' : 'Stream'}
      </Button>
    </form>
  );
}