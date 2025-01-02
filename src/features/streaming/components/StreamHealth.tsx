import { useStreamStatus } from '../hooks/useStreamStatus';
import { Badge } from '../../../components/ui/Badge';
import { formatDuration } from '../../../utils/date';

interface StreamHealthProps {
  streamId: string;
}

export function StreamHealth({ streamId }: StreamHealthProps) {
  const status = useStreamStatus(streamId);

  return (
    <div className="flex items-center space-x-4">
      <Badge
        variant={
          status.health === 'good' ? 'success' :
          status.health === 'poor' ? 'warning' : 'error'
        }
      >
        {status.health === 'good' ? 'Excellent' :
         status.health === 'poor' ? 'Poor Connection' : 'Offline'}
      </Badge>

      <div className="text-sm">
        <span className="text-gray-400">Viewers: </span>
        <span>{status.viewerCount}</span>
      </div>

      <div className="text-sm">
        <span className="text-gray-400">Duration: </span>
        <span>{formatDuration(status.duration)}</span>
      </div>
    </div>
  );
}