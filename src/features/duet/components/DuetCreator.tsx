```typescript
import { useState } from 'react';
import { useDuet } from '../hooks/useDuet';
import { VideoPlayer } from '../../../components/video/VideoPlayer';
import { Button } from '../../../components/ui/Button';
import { Alert } from '../../../components/ui/Alert';
import { DuetLayout } from './DuetLayout';

interface DuetCreatorProps {
  originalVideoId: string;
  originalVideoUrl: string;
  onComplete?: () => void;
}

export function DuetCreator({ originalVideoId, originalVideoUrl, onComplete }: DuetCreatorProps) {
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [layout, setLayout] = useState<'side-by-side' | 'picture-in-picture'>('side-by-side');
  const { startRecording, stopRecording, uploadDuet, loading, error } = useDuet(originalVideoId);

  const handleStartRecording = async () => {
    const stream = await startRecording();
    // Handle recording stream
  };

  const handleStopRecording = async () => {
    const videoBlob = await stopRecording();
    setRecordedVideo(URL.createObjectURL(videoBlob));
  };

  const handlePublish = async () => {
    if (!recordedVideo) return;
    
    try {
      await uploadDuet(recordedVideo, layout);
      onComplete?.();
    } catch (error) {
      console.error('Failed to publish duet:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="aspect-[9/16] bg-black rounded-lg overflow-hidden">
        {recordedVideo ? (
          <DuetLayout
            originalVideo={originalVideoUrl}
            duetVideo={recordedVideo}
            layout={layout}
            onLayoutChange={setLayout}
          />
        ) : (
          <VideoPlayer src={originalVideoUrl} />
        )}
      </div>

      <div className="flex justify-center gap-4">
        {!recordedVideo ? (
          <>
            <Button onClick={handleStartRecording} loading={loading}>
              Start Recording
            </Button>
            <Button onClick={handleStopRecording} variant="secondary">
              Stop Recording
            </Button>
          </>
        ) : (
          <>
            <Button onClick={() => setRecordedVideo(null)} variant="secondary">
              Retake
            </Button>
            <Button onClick={handlePublish} loading={loading}>
              Publish Duet
            </Button>
          </>
        )}
      </div>

      {error && <Alert type="error" message={error} />}
    </div>
  );
}
```