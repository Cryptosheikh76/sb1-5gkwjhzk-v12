import { useStreamStats } from '../hooks/useStreamStats';
import { Badge } from '../../../components/ui/Badge';
import { formatViewerCount } from '../utils/analytics';
import { formatDuration } from '../../../utils/date';

interface StreamStatsProps {
  streamId: string;
  className?: string;
}

export function StreamStats({ streamId, className }: StreamStatsProps) {
  const { stats, loading } = useStreamStats(streamId);

  if (loading) return null;

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <Badge variant="default">
        {formatViewerCount(stats.viewerCount)} viewers
      </Badge>
      
      <Badge variant="default">
        {formatDuration(stats.duration)}
      </Badge>

      <Badge variant={stats.health === 'good' ? 'success' : 'warning'}>
        {stats.health === 'good' ? 'Excellent' : 'Poor Connection'}
      </Badge>
    </div>
  );
}