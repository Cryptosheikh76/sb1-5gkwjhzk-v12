import { useState } from 'react';
import { useNFTCreator } from '../hooks/useNFTCreator';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { supportedChains } from '../../../lib/blockchain/chains';

export function NFTCollectionForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [maxSupply, setMaxSupply] = useState(1000);
  const [files, setFiles] = useState<File[]>([]);
  const { createCollection, loading, error } = useNFTCreator();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createCollection(title, description, price, maxSupply, files);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Collection Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <Input
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        as="textarea"
        rows={4}
      />

      <Input
        label="Price"
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
        min="0"
        step="0.000001"
      />

      <Input
        label="Maximum Supply"
        type="number"
        value={maxSupply}
        onChange={(e) => setMaxSupply(parseInt(e.target.value))}
        required
        min="1"
      />

      <div>
        <label className="block text-sm font-medium mb-2">
          Upload Assets (Images, Audio, Video)
        </label>
        <input
          type="file"
          onChange={(e) => setFiles(Array.from(e.target.files || []))}
          multiple
          accept="image/*,audio/*,video/*"
          className="w-full"
        />
      </div>

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      <Button
        type="submit"
        disabled={loading}
        loading={loading}
      >
        Create Collection
      </Button>
    </form>
  );
}