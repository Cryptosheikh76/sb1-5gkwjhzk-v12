```typescript
import { useState } from 'react';
import { VideoUploadFlow } from '../features/video/components/VideoUploadFlow';
import { StreamSetup } from '../features/streaming/components/StreamSetup';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function Upload() {
  const [type, setType] = useState<'video' | 'stream'>('video');

  return (
    <div className="pt-4 pb-20">
      <Card className="mb-6">
        <div className="p-4 flex gap-4">
          <Button
            variant={type === 'video' ? 'primary' : 'secondary'}
            onClick={() => setType('video')}
          >
            Upload Video
          </Button>
          <Button
            variant={type === 'stream' ? 'primary' : 'secondary'}
            onClick={() => setType('stream')}
          >
            Go Live
          </Button>
        </div>
      </Card>

      {type === 'video' ? <VideoUploadFlow /> : <StreamSetup />}
    </div>
  );
}
```