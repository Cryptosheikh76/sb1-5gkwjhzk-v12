```typescript
import { useState } from 'react';
import { useContentCuration } from '../hooks/useContentCuration';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { Alert } from '../../../components/ui/Alert';

export function ContentCuration() {
  const [selectedCategory, setSelectedCategory] = useState<string>('trending');
  const { content, curateContent, loading, error } = useContentCuration();

  const categories = [
    { id: 'trending', label: 'Trending' },
    { id: 'new', label: 'New' },
    { id: 'reported', label: 'Reported' }
  ];

  if (loading) return <LoadingSpinner />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {categories.map(category => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? 'primary' : 'secondary'}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.label}
          </Button>
        ))}
      </div>

      <div className="space-y-4">
        {content.map(item => (
          <Card key={item.id} className="p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-sm text-gray-400">
                  By {item.creator.username} • {item.views} views
                </p>
              </div>
              <Badge variant={item.status === 'featured' ? 'success' : 'default'}>
                {item.status}
              </Badge>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={() => curateContent(item.id, 'feature')}
              >
                Feature
              </Button>
              <Button
                variant="secondary"
                onClick={() => curateContent(item.id, 'promote')}
              >
                Promote
              </Button>
              <Button
                variant="danger"
                onClick={() => curateContent(item.id, 'remove')}
              >
                Remove
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
```