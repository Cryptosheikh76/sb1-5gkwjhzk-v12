```typescript
import { useConversations } from '../hooks/useConversations';
import { Avatar } from '../../../components/ui/Avatar';
import { formatRelativeTime } from '../../../utils/date';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';

interface ConversationListProps {
  onSelect: (conversationId: string) => void;
}

export function ConversationList({ onSelect }: ConversationListProps) {
  const { conversations, loading } = useConversations();

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-2">
      {conversations.map(conversation => (
        <button
          key={conversation.id}
          onClick={() => onSelect(conversation.id)}
          className="w-full p-4 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <Avatar 
              size="sm"
              src={conversation.participants[0].avatar_url}
              fallback={conversation.participants[0].username}
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">
                {conversation.participants[0].username}
              </p>
              {conversation.lastMessage && (
                <p className="text-sm text-gray-400 truncate">
                  {conversation.lastMessage.content}
                </p>
              )}
            </div>
            {conversation.unreadCount > 0 && (
              <span className="px-2 py-1 bg-primary text-black text-xs font-bold rounded-full">
                {conversation.unreadCount}
              </span>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
```