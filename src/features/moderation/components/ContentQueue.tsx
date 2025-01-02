import { useContentQueue } from '../hooks/useContentQueue';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { Alert } from '../../../components/ui/Alert';

export function ContentQueue() {
  const { items, loading, error, handleAction } = useContentQueue();

  if (loading) return <LoadingSpinner />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <div className="space-y-6">
      {items.map(item => (
        <Card key={item.id} className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{item.title}</h3>
              <p className="text-sm text-gray-400">
                Reported by {item.reportCount} users
              </p>
            </div>
            <span className={`px-2 py-1 rounded text-sm ${
              item.priority === 'high' ? 'bg-red-500/20 text-red-400' :
              item.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-green-500/20 text-green-400'
            }`}>
              {item.priority} priority
            </span>
          </div>

          <div className="bg-surface-light rounded-lg p-4">
            <h4 className="text-sm font-medium mb-2">Report Reasons:</h4>
            <ul className="list-disc list-inside text-sm text-gray-400">
              {item.reasons.map((reason, index) => (
                <li key={index}>{reason}</li>
              ))}
            </ul>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => handleAction(item.id, 'approve')}
            >
              Approve
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleAction(item.id, 'warn')}
            >
              Warn User
            </Button>
            <Button
              variant="danger"
              onClick={() => handleAction(item.id, 'remove')}
            >
              Remove Content
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}