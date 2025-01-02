import { ChatBadges, type ChatBadge } from './ChatBadges';
import { formatRelativeTime } from '../../../../utils/date';

interface ChatMessageProps {
  username: string;
  content: string;
  timestamp: string;
  badges?: ChatBadge[];
  isDeleted?: boolean;
  isHighlighted?: boolean;
}

export function ChatMessage({ 
  username, 
  content, 
  timestamp,
  badges,
  isDeleted,
  isHighlighted
}: ChatMessageProps) {
  if (isDeleted) {
    return (
      <div className="py-1 px-2 text-gray-400 italic text-sm">
        Message deleted
      </div>
    );
  }

  return (
    <div className={`py-1 px-2 rounded ${
      isHighlighted ? 'bg-primary/10' : ''
    }`}>
      <div className="flex items-center gap-2">
        {badges && <ChatBadges badges={badges} />}
        <span className="font-medium">{username}</span>
        <span className="text-xs text-gray-400">
          {formatRelativeTime(timestamp)}
        </span>
      </div>
      <p className="text-sm mt-1">{content}</p>
    </div>
  );
}