import { Badge } from '../../../../components/ui/Badge';
import { useStreamStatus } from '../../hooks/useStreamStatus';
import { formatViewerCount } from '../../utils/analytics';

interface ChatHeaderProps {
  streamId: string;
}

export function ChatHeader({ streamId }: ChatHeaderProps) {
  const status = useStreamStatus(streamId);

  return (
    <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <h3 className="font-medium">Live Chat</h3>
        <Badge variant="success">
          {formatViewerCount(status.viewerCount)} viewers
        </Badge>
      </div>
      {status.isLive && (
        <Badge variant="success">LIVE</Badge>
      )}
    </div>
  );
}