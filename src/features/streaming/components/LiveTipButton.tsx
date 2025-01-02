```typescript
import { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { LiveTipModal } from './LiveTipModal';
import { TipAnimation } from './TipAnimation';
import { useStreamTips } from '../hooks/useStreamTips';

interface LiveTipButtonProps {
  streamId: string;
  creatorAddress: string;
  creatorName: string;
}

export function LiveTipButton({ 
  streamId, 
  creatorAddress,
  creatorName 
}: LiveTipButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const { latestTip } = useStreamTips(streamId);

  return (
    <>
      <Button
        onClick={() => setShowModal(true)}
        variant="primary"
        className="shadow-neon"
      >
        Send Tip
      </Button>

      <LiveTipModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        streamId={streamId}
        creatorAddress={creatorAddress}
        creatorName={creatorName}
      />

      {latestTip && <TipAnimation tip={latestTip} />}
    </>
  );
}
```