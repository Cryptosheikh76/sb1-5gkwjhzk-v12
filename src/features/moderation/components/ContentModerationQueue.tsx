import { useState, useEffect } from 'react';
import { useContentModeration } from '../hooks/useContentModeration';
import { FlaggedContent, ModerationAction } from '../types';
import { Button } from '../../../components/ui/Button';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { Alert } from '../../../components/ui/Alert';

export function ContentModerationQueue() {
  const [items, setItems] = useState<FlaggedContent[]>([]);
  const { loadFlaggedContent, moderateContent, loading, error } = useContentModeration();

  useEffect(() => {
    loadFlaggedContent().then(setItems);
  }, []);

  const handleModeration = async (contentId: string, action: ModerationAction, reason: string) => {
    try {
      await moderateContent(contentId, action, reason);
      setItems(prev => prev.filter(item => item.id !== contentId));
    } catch (error) {
      console.error('Moderation failed:', error);
    }
  };

  if (loading && !items.length) {
    return <LoadingSpinner size="lg" />;
  }

  if (error) {
    return <Alert type="error" message={error} />;
  }

  if (!items.length) {
    return (
      <Alert 
        type="info" 
        message="No content currently needs moderation. Great job!" 
      />
    );
  }

  return (
    <div className="space-y-6">
      {items.map((item) => (
        <div 
          key={item.id}
          className="bg-zinc-800 rounded-lg p-6 space-y-4"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-sm text-gray-400">
                By {item.creator?.username} • Flagged {item.flagsCount} times
              </p>
              {item.description && (
                <p className="mt-2 text-sm">{item.description}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => handleModeration(item.id, 'approve', 'Content reviewed and approved')}
                variant="secondary"
                size="sm"
              >
                Approve
              </Button>
              <Button
                onClick={() => handleModeration(item.id, 'warn', 'Content violates guidelines')}
                variant="secondary"
                size="sm"
              >
                Warn
              </Button>
              <Button
                onClick={() => handleModeration(item.id, 'block', 'Severe violation')}
                variant="danger"
                size="sm"
              >
                Block
              </Button>
            </div>
          </div>

          <div className="bg-zinc-900 rounded p-4">
            <h4 className="text-sm font-medium mb-2">Flag Reasons:</h4>
            <ul className="list-disc list-inside text-sm text-gray-400">
              {item.reasons.map((reason, index) => (
                <li key={index}>{reason}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}