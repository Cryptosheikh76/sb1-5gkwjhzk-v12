```typescript
import { useState } from 'react';
import { useStitch } from '../hooks/useStitch';
import { VideoPlayer } from '../../../components/video/VideoPlayer';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Alert } from '../../../components/ui/Alert';

interface StitchCreatorProps {
  originalVideoId: string;
  originalVideoUrl: string;
  onComplete?: () => void;
}

export function StitchCreator({ originalVideoId, originalVideoUrl, onComplete }: StitchCreatorProps) {
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const { startRecording, stopRecording, uploadStitch, loading, error } = useStitch(originalVideoId);

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
      await uploadStitch(recordedVideo, caption);
      onComplete?.();
    } catch (error) {
      console.error('Failed to publish stitch:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="aspect-[9/16] bg-black rounded-lg overflow-hidden">
        {recordedVideo ? (
          <VideoPlayer src={recordedVideo} />
        ) : (
          <VideoPlayer src={originalVideoUrl} />
        )}
      </div>

      {recordedVideo && (
        <Input
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Add a caption..."
          maxLength={150}
        />
      )}

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
              Publish Stitch
            </Button>
          </>
        )}
      </div>

      {error && <Alert type="error" message={error} />}
    </div>
  );
}
```