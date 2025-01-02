import { ChatHeader } from './ChatHeader';
import { ChatHistory } from './ChatHistory';
import { ChatInput } from './ChatInput';
import { Card } from '../../../../components/ui/Card';
import { useStreamStatus } from '../../hooks/useStreamStatus';

interface ChatContainerProps {
  streamId: string;
  className?: string;
}

export function ChatContainer({ streamId, className }: ChatContainerProps) {
  const status = useStreamStatus(streamId);

  return (
    <Card className={`flex flex-col h-full ${className}`}>
      <ChatHeader streamId={streamId} />
      <div className="flex-1 overflow-hidden">
        <ChatHistory streamId={streamId} />
      </div>
      <ChatInput 
        onSendMessage={(message) => {
          // Handle message sending
        }} 
        disabled={!status.isLive}
      />
    </Card>
  );
}