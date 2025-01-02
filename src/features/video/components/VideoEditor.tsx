import { useState, useRef } from 'react';
import { useVideoEditor } from '../hooks/useVideoEditor';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Alert } from '../../../components/ui/Alert';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { validateVideoFile } from '../../../utils/video';

export function VideoEditor() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const { processVideo, loading, error } = useVideoEditor();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const error = validateVideoFile(file);
    if (error) {
      alert(error);
      return;
    }

    setFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) return;

    try {
      await processVideo({
        file,
        title,
        startTime: videoRef.current?.currentTime || 0
      });
    } catch (error) {
      // Error handled by hook
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-zinc-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Edit Video</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="w-full"
          />

          {file && (
            <>
              <video
                ref={videoRef}
                src={URL.createObjectURL(file)}
                className="w-full rounded-lg"
                controls
              />

              <Input
                label="Video Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              {error && <Alert type="error" message={error} />}

              <Button
                type="submit"
                disabled={loading || !title}
                loading={loading}
                fullWidth
              >
                {loading ? 'Processing...' : 'Upload Video'}
              </Button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}