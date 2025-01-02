import { useState } from 'react';
import { useNFTLaunchpad } from '../../hooks/nft/useNFTLaunchpad';
import { PhotoIcon, MusicalNoteIcon } from '@heroicons/react/24/outline';

export default function LaunchpadCreator() {
  const { createCollection, loading } = useNFTLaunchpad();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [files, setFiles] = useState<File[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!files.length) return;
    
    await createCollection({
      title,
      description,
      price,
      files
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create NFT Collection</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Collection Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 bg-zinc-800 rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 bg-zinc-800 rounded-lg"
            rows={4}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Price (ETH)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            step="0.001"
            min="0"
            className="w-full p-2 bg-zinc-800 rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Upload Assets</label>
          <div className="border-2 border-dashed border-zinc-700 rounded-lg p-6 text-center">
            <input
              type="file"
              onChange={(e) => setFiles(Array.from(e.target.files || []))}
              multiple
              accept="audio/*, image/*"
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="flex flex-col items-center">
                <div className="flex space-x-2 mb-2">
                  <PhotoIcon className="w-6 h-6" />
                  <MusicalNoteIcon className="w-6 h-6" />
                </div>
                <p className="text-sm">
                  Drop your files here or click to upload
                </p>
              </div>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium"
        >
          {loading ? 'Creating Collection...' : 'Create NFT Collection'}
        </button>
      </form>
    </div>
  );
}