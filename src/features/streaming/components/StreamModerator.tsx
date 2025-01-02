import { useState } from 'react';
import { useStreamModeration } from '../hooks/useStreamModeration';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { Alert } from '../../../components/ui/Alert';

interface StreamModeratorProps {
  streamId: string;
}

export function StreamModerator({ streamId }: StreamModeratorProps) {
  const { 
    moderationQueue, 
    bannedUsers,
    loading, 
    error,
    handleBanUser,
    handleTimeoutUser,
    handleDeleteMessage,
    handleUnbanUser
  } = useStreamModeration(streamId);

  const [selectedTab, setSelectedTab] = useState<'queue' | 'banned'>('queue');

  if (loading) return <LoadingSpinner />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <Card className="overflow-hidden">
      <div className="p-4 border-b border-zinc-800 flex gap-4">
        <Button
          variant={selectedTab === 'queue' ? 'primary' : 'secondary'}
          onClick={() => setSelectedTab('queue')}
        >
          Moderation Queue
        </Button>
        <Button
          variant={selectedTab === 'banned' ? 'primary' : 'secondary'}
          onClick={() => setSelectedTab('banned')}
        >
          Banned Users
        </Button>
      </div>

      <div className="p-4 space-y-4">
        {selectedTab === 'queue' ? (
          moderationQueue.map(item => (
            <div key={item.id} className="bg-surface-light rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium">{item.username}</p>
                  <p className="text-sm text-gray-400">{item.message}</p>
                </div>
                <Badge variant={item.severity === 'high' ? 'error' : 'warning'}>
                  {item.severity}
                </Badge>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleDeleteMessage(item.id)}
                >
                  Delete Message
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleTimeoutUser(item.userId, 300)}
                >
                  5m Timeout
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleBanUser(item.userId)}
                >
                  Ban User
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="space-y-4">
            {bannedUsers.map(user => (
              <div key={user.id} className="bg-surface-light rounded-lg p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium">{user.username}</p>
                  <p className="text-sm text-gray-400">Banned {user.bannedAt}</p>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleUnbanUser(user.id)}
                >
                  Unban
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}