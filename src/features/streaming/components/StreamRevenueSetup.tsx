import { useState } from 'react';
import { useStreamRevenue } from '../hooks/useStreamRevenue';
import { StreamRevenueType } from '../types/revenue';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card } from '../../../components/ui/Card';

interface StreamRevenueSetupProps {
  streamId: string;
  onComplete?: () => void;
}

export function StreamRevenueSetup({ streamId, onComplete }: StreamRevenueSetupProps) {
  const [revenueType, setRevenueType] = useState<StreamRevenueType>('public');
  const [participants, setParticipants] = useState<string[]>([]);
  const { setupRevenueSharing, loading, error } = useStreamRevenue(streamId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await setupRevenueSharing(revenueType, participants);
      onComplete?.();
    } catch (error) {
      // Error handled by hook
    }
  };

  return (
    <Card className="p-4 space-y-4">
      <h3 className="font-medium">Stream Revenue Setup</h3>

      <div>
        <label className="block text-sm font-medium mb-2">Stream Type</label>
        <div className="flex gap-4">
          <Button
            type="button"
            variant={revenueType === 'public' ? 'primary' : 'secondary'}
            onClick={() => setRevenueType('public')}
          >
            Public (75/25)
          </Button>
          <Button
            type="button"
            variant={revenueType === 'private' ? 'primary' : 'secondary'}
            onClick={() => setRevenueType('private')}
          >
            Private (50/50)
          </Button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Participant Addresses</label>
        <Input
          type="text"
          placeholder="Comma-separated Ethereum addresses"
          onChange={(e) => setParticipants(
            e.target.value.split(',').map(addr => addr.trim())
          )}
        />
      </div>

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      <Button
        onClick={handleSubmit}
        disabled={loading || !participants.length}
        loading={loading}
        fullWidth
      >
        Setup Revenue Sharing
      </Button>
    </Card>
  );
}