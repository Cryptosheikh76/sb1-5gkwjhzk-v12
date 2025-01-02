```typescript
import { useModerationQueue } from '../hooks/useModerationQueue';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { Alert } from '../../../components/ui/Alert';

export function ModerationQueue() {
  const { items, loading, error, takeAction } = useModerationQueue();

  if (loading) return <LoadingSpinner />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <div className="space-y-4">
      {items.map(item => (
        <Card key={item.id} className="p-4">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-medium">{item.content.title}</h3>
              <p className="text-sm text-gray-400">
                Reported by {item.reporter.username}
              </p>
            </div>
            <Badge 
              variant={item.severity === 'high' ? 'error' : 'warning'}
            >
              {item.severity}
            </Badge>
          </div>

          <div className="bg-zinc-800 rounded p-4 mb-4">
            <h4 className="text-sm font-medium mb-2">Reason:</h4>
            <p className="text-sm">{item.reason}</p>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => takeAction(item.id, 'approve')}
            >
              Approve
            </Button>
            <Button
              variant="secondary"
              onClick={() => takeAction(item.id, 'warn')}
            >
              Warn User
            </Button>
            <Button
              variant="danger"
              onClick={() => takeAction(item.id, 'block')}
            >
              Block Content
            </Button>
          </div>
        </Card>
      ))}

      {items.length === 0 && (
        <Alert 
          type="info" 
          message="No items currently need moderation" 
        />
      )}
    </div>
  );
}
```