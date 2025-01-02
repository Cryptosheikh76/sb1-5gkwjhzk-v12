import { Stream } from '../types/stream';
import { Card } from '../../../components/ui/Card';
import { Avatar } from '../../../components/ui/Avatar';
import { StreamStats } from './StreamStats';
import { StreamActions } from './StreamActions';

interface StreamInfoProps {
  stream: Stream;
}

export function StreamInfo({ stream }: StreamInfoProps) {
  return (
    <Card className="p-4">
      <div className="flex items-start gap-4">
        <Avatar
          src={stream.creator?.avatar_url}
          fallback={stream.creator?.username}
          size="lg"
        />
        <div className="flex-1">
          <h1 className="text-xl font-bold">{stream.title}</h1>
          <p className="text-gray-400">{stream.creator?.username}</p>
          <StreamStats streamId={stream.id} />
        </div>
        <StreamActions stream={stream} />
      </div>
    </Card>
  );
}