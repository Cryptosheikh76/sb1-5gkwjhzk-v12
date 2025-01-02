import { useState } from 'react';
import { useSoundUpload } from '../hooks/useSoundUpload';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Alert } from '../../../components/ui/Alert';

interface SoundUploaderProps {
  onSuccess?: () => void;
}

export function SoundUploader({ onSuccess }: SoundUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [tags, setTags] = useState('');
  const { uploadSound, loading, error } = useSoundUpload();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) return;

    try {
      await uploadSound({
        file,
        title,
        artist,
        tags: tags.split(',').map(tag => tag.trim())
      });
      onSuccess?.();
    } catch (error) {
      // Error handled by hook
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="file"
        accept="audio/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        required
      />

      <Input
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <Input
        label="Artist"
        value={artist}
        onChange={(e) => setArtist(e.target.value)}
      />

      <Input
        label="Tags (comma separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="music, beat, electronic"
      />

      {error && <Alert type="error" message={error} />}

      <Button
        type="submit"
        disabled={loading || !file || !title}
        loading={loading}
        fullWidth
      >
        Upload Sound
      </Button>
    </form>
  );
}