```typescript
import { useState } from 'react';
import { useComments } from '../hooks/useComments';
import { useAuth } from '../../auth/components/AuthProvider';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Avatar } from '../../../components/ui/Avatar';
import { formatRelativeTime } from '../../../utils/date';

interface CommentSectionProps {
  contentId: string;
}

export function CommentSection({ contentId }: CommentSectionProps) {
  const { user } = useAuth();
  const { comments, loading, addComment } = useComments(contentId);
  const [newComment, setNewComment] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await addComment(newComment);
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  return (
    <div className="space-y-4">
      {user && (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1"
          />
          <Button type="submit" disabled={!newComment.trim() || loading}>
            Post
          </Button>
        </form>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <Avatar
              src={comment.user.avatar_url}
              fallback={comment.user.username}
              size="sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{comment.user.username}</span>
                <span className="text-sm text-gray-400">
                  {formatRelativeTime(comment.created_at)}
                </span>
              </div>
              <p className="text-sm mt-1">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```