import { useState } from 'react';
import { useVideoUpload } from '../../video/hooks/useVideoUpload';
import { Button } from '../../../components/ui/Button';
import { Alert } from '../../../components/ui/Alert';
import { validateVideoFile } from '../../video/utils/validation';

interface VideoResponseProps {
  contentId: string;
  onSuccess?: () => void;
}

export function VideoResponse({ contentId, onSuccess }: VideoResponseProps) {
  const [file, setFile] = useState<File | null>(null);
  const { uploadVideo, progress, uploading, error } = useVideoUpload();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const validationError = validateVideoFile(file);
    if (validationError) {
      alert(validationError);
      return;
    }

    try {
      await uploadVideo({
        file,
        title: `Response to ${contentId}`,
        isPublic: true,
        responseToId: contentId
      });
      onSuccess?.();
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="border-2 border-dashed border-zinc-700 rounded-lg p-6 text-center">
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setFile(e.target.files?.[0])}
          className="hidden"
          id="video-response"
        />
        <label 
          htmlFor="video-response"
          className="cursor-pointer text-blue-500 hover:text-blue-400"
        >
          Record or upload your video response
        </label>
        {file && (
          <p className="mt-2 text-sm text-gray-400">
            Selected: {file.name}
          </p>
        )}
      </div>

      {error && <Alert type="error" message={error} />}

      <Button
        type="submit"
        disabled={uploading || !file}
        loading={uploading}
        fullWidth
      >
        {uploading ? `Uploading ${progress}%` : 'Post Response'}
      </Button>
    </form>
  );
}