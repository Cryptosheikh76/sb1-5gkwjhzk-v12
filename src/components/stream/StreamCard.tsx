import { Stream } from '../../types';
import { Card, Avatar, Badge } from '../ui';
import { formatRelativeTime } from '../../utils/date';

interface StreamCardProps {
  stream: Stream;
}

export function StreamCard({ stream }: StreamCardProps) {
  return (
    <Card className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <Avatar 
          size="md" 
          src={stream.creator?.avatar_url} 
          fallback={stream.creator?.username} 
        />
        <div>
          <h3 className="font-medium">{stream.title}</h3>
          <p className="text-sm text-gray-400">
            {stream.creator?.username} • {stream.started_at ? formatRelativeTime(stream.started_at) : 'Not started'}
          </p>
        </div>
      </div>
      <Badge variant="success">LIVE</Badge>
    </Card>
  );
}