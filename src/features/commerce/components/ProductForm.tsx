import { useState } from 'react';
import { useStore } from '../hooks/useStore';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { supportedChains } from '../../../lib/blockchain/chains';

export function ProductForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState(supportedChains[0].nativeCurrency.symbol);
  const [images, setImages] = useState<File[]>([]);
  const [type, setType] = useState<'digital' | 'physical'>('digital');
  const [stock, setStock] = useState(1);
  
  const { createProduct, loading, error } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Upload images first
    const imageUrls = await Promise.all(
      images.map(async (image) => {
        const formData = new FormData();
        formData.append('file', image);
        // Implement your image upload logic here
        return 'image_url';
      })
    );

    await createProduct({
      title,
      description,
      price,
      currency,
      images: imageUrls,
      type,
      stock,
      status: 'active',
      category: 'general'
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Product Title"
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
        required
      />
      
      <div className="flex gap-4">
        <Input
          label="Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          min="0"
          step="0.000001"
          required
        />
        
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">Currency</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full bg-zinc-800 rounded px-3 py-2"
          >
            {supportedChains.map(chain => (
              <option key={chain.id} value={chain.nativeCurrency.symbol}>
                {chain.nativeCurrency.symbol}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Product Images</label>
        <input
          type="file"
          onChange={(e) => setImages(Array.from(e.target.files || []))}
          multiple
          accept="image/*"
          className="w-full"
        />
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as 'digital' | 'physical')}
            className="w-full bg-zinc-800 rounded px-3 py-2"
          >
            <option value="digital">Digital</option>
            <option value="physical">Physical</option>
          </select>
        </div>

        <Input
          label="Stock"
          type="number"
          value={stock}
          onChange={(e) => setStock(parseInt(e.target.value))}
          min="0"
          required
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
        Create Product
      </Button>
    </form>
  );
}