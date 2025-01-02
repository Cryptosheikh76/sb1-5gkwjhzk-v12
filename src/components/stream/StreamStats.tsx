import { useStreamStats } from '../../hooks/stream/useStreamStats';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface StreamStatsProps {
  streamId: string;
}

export function StreamStats({ streamId }: StreamStatsProps) {
  const { stats, loading } = useStreamStats(streamId);

  if (loading) return <LoadingSpinner size="sm" />;

  return (
    <Card className="flex gap-4">
      <Badge variant="default">
        {stats.viewers} viewers
      </Badge>
      <Badge variant="success">
        {stats.tipCount} tips
      </Badge>
      <Badge variant="success">
        {stats.totalTips} ETH received
      </Badge>
    </Card>
  );
}