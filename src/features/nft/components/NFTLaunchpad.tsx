```typescript
import { useState } from 'react';
import { useNFTMinting } from '../hooks/useNFTMinting';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Alert } from '../../../components/ui/Alert';
import { NFTMetadata } from '../types';

export function NFTLaunchpad() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [royaltyFee, setRoyaltyFee] = useState(5); // 5% default
  const [files, setFiles] = useState<File[]>([]);
  const [type, setType] = useState<'music' | 'merch' | 'ticket'>('music');
  const { mint, loading, error } = useNFTMinting();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!files.length) return;

    const metadata: NFTMetadata = {
      name: title,
      description,
      image: '', // Will be set after file upload
      attributes: [
        { trait_type: 'Type', value: type },
        { trait_type: 'Price', value: price }
      ]
    };

    try {
      await mint({
        title,
        description,
        price,
        royaltyFee,
        files,
        metadata,
        type
      });
    } catch (error) {
      console.error('Failed to create NFT:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <Button
          type="button"
          variant={type === 'music' ? 'primary' : 'secondary'}
          onClick={() => setType('music')}
        >
          Music NFT
        </Button>
        <Button
          type="button"
          variant={type === 'merch' ? 'primary' : 'secondary'}
          onClick={() => setType('merch')}
        >
          Merchandise
        </Button>
        <Button
          type="button"
          variant={type === 'ticket' ? 'primary' : 'secondary'}
          onClick={() => setType('ticket')}
        >
          Event Ticket
        </Button>
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

      <Input
        label="Price (AGC)"
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        min="0"
        step="0.01"
        required
      />

      <Input
        label="Royalty Fee (%)"
        type="number"
        value={royaltyFee}
        onChange={(e) => setRoyaltyFee(parseInt(e.target.value))}
        min="0"
        max="15"
      />

      <div>
        <label className="block text-sm font-medium mb-2">Upload Files</label>
        <input
          type="file"
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files || []))}
          accept={type === 'music' ? 'audio/*' : 'image/*'}
          className="w-full"
        />
      </div>

      {type === 'merch' && (
        <div className="p-4 bg-zinc-800 rounded-lg">
          <h3 className="font-medium mb-2">Shipping Details</h3>
          <Input
            label="Estimated Delivery Time"
            placeholder="e.g., 5-7 business days"
          />
          <Input
            label="Shipping Regions"
            placeholder="e.g., Worldwide, US Only"
          />
        </div>
      )}

      {error && <Alert type="error" message={error} />}

      <Button
        type="submit"
        disabled={loading || !files.length || !title || !price}
        loading={loading}
        fullWidth
      >
        Create NFT
      </Button>
    </form>
  );
}
```