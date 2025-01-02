```typescript
import { useState } from 'react';
import { useVideoUpload } from '../hooks/useVideoUpload';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Alert } from '../../../components/ui/Alert';
import { validateVideoFile } from '../utils/validation';

export function VideoUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const { uploadVideo, progress, uploading, error } = useVideoUpload();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) return;

    const validationError = validateVideoFile(file);
    if (validationError) {
      alert(validationError);
      return;
    }

    try {
      await uploadVideo({
        file,
        title,
        description,
        isPublic
      });
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="border-2 border-dashed border-zinc-700 rounded-lg p-8 text-center">
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setFile(e.target.files?.[0])}
          className="hidden"
          id="video-upload"
        />
        <label 
          htmlFor="video-upload"
          className="cursor-pointer text-blue-500 hover:text-blue-400"
        >
          Click to upload or drag and drop
        </label>
        {file && (
          <p className="mt-2 text-sm text-gray-400">
            Selected: {file.name}
          </p>
        )}
      </div>

      <Input
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <Input
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        as="textarea"
        rows={4}
      />

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="is-public"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
        />
        <label htmlFor="is-public">Make video public</label>
      </div>

      {error && <Alert type="error" message={error} />}

      <Button
        type="submit"
        disabled={uploading || !file || !title}
        loading={uploading}
        fullWidth
      >
        {uploading ? `Uploading ${progress}%` : 'Upload Video'}
      </Button>
    </form>
  );
}
```