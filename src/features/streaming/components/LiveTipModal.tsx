```typescript
import { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { useLiveTipping } from '../hooks/useLiveTipping';
import { formatNumber } from '../../../utils/format';

const TIPPING_OPTIONS = [
  { amount: '1', label: '1 AGC' },
  { amount: '5', label: '5 AGC' },
  { amount: '10', label: '10 AGC' },
  { amount: '50', label: '50 AGC' },
  { amount: '100', label: '100 AGC' }
];

interface LiveTipModalProps {
  isOpen: boolean;
  onClose: () => void;
  streamId: string;
  creatorAddress: string;
  creatorName: string;
}

export function LiveTipModal({
  isOpen,
  onClose,
  streamId,
  creatorAddress,
  creatorName
}: LiveTipModalProps) {
  const [selectedAmount, setSelectedAmount] = useState(TIPPING_OPTIONS[0].amount);
  const { sendTip, processing, error } = useLiveTipping(streamId);

  const handleTip = async () => {
    try {
      await sendTip(creatorAddress, selectedAmount);
      onClose();
    } catch (error) {
      console.error('Failed to send tip:', error);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title={`Send a tip to ${creatorName}`}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-3">
          {TIPPING_OPTIONS.map(option => (
            <Button
              key={option.amount}
              variant={selectedAmount === option.amount ? 'primary' : 'secondary'}
              onClick={() => setSelectedAmount(option.amount)}
              className="h-16"
            >
              {option.label}
            </Button>
          ))}
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        <Button
          onClick={handleTip}
          disabled={processing || !selectedAmount}
          loading={processing}
          fullWidth
        >
          {processing ? 'Processing...' : `Send ${formatNumber(selectedAmount)} AGC`}
        </Button>
      </div>
    </Modal>
  );
}
```