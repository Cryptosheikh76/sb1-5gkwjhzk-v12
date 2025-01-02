import TipButton from '../blockchain/TipButton';
import { useStreamStats } from '../../hooks/stream/useStreamStats';

interface StreamTipButtonProps {
  streamId: string;
  creatorAddress: string;
}

export default function StreamTipButton({ streamId, creatorAddress }: StreamTipButtonProps) {
  const { updateStats } = useStreamStats(streamId);

  return (
    <TipButton 
      creatorAddress={creatorAddress} 
      onSuccess={updateStats}
    />
  );
}