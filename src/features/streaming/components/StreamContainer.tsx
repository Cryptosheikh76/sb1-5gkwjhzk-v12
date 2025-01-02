import { StreamPlayer } from './StreamPlayer';
import { StreamInfo } from './StreamInfo';
import { ChatContainer } from './chat/ChatContainer';
import { useStreamData } from '../hooks/useStreamData';

interface StreamContainerProps {
  streamId: string;
}

export function StreamContainer({ streamId }: StreamContainerProps) {
  const { stream, loading } = useStreamData(streamId);

  if (loading || !stream) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      <div className="lg:col-span-3 space-y-4">
        <StreamPlayer stream={stream} />
        <StreamInfo stream={stream} />
      </div>
      <div className="lg:col-span-1">
        <ChatContainer streamId={streamId} />
      </div>
    </div>
  );
}