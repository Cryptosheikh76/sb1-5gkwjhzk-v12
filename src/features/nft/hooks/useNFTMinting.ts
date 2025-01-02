```typescript
import { useState } from 'react';
import { useWallet } from '../../../hooks/useWallet';
import { mintNFT } from '../../../lib/xrpl/nft/client';
import { NFTMetadata } from '../types';
import { supabase } from '../../../lib/supabase';

interface MintOptions {
  title: string;
  description: string;
  price: string;
  royaltyFee: number;
  files: File[];
  metadata: NFTMetadata;
  type: 'music' | 'merch' | 'ticket';
}

export function useNFTMinting() {
  const { client } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mint = async (options: MintOptions) => {
    if (!client) {
      throw new Error('Wallet not connected');
    }

    try {
      setLoading(true);
      setError(null);

      // Upload files to storage
      const fileUrls = await Promise.all(
        options.files.map(async (file) => {
          const path = `nft-assets/${Date.now()}-${file.name}`;
          const { data, error: uploadError } = await supabase.storage
            .from('nft-assets')
            .upload(path, file);

          if (uploadError) throw uploadError;
          return data.path;
        })
      );

      // Update metadata with file URLs
      const metadata = {
        ...options.metadata,
        image: fileUrls[0],
        files: fileUrls
      };

      // Create collection in database
      const { data: collection } = await supabase
        .from('nft_collections')
        .insert({
          name: options.title,
          description: options.description,
          creator_id: client.wallet!.address,
          royalty_fee: options.royaltyFee
        })
        .select()
        .single();

      // Mint NFT on XRPL
      const txHash = await mintNFT(client, collection, metadata);

      // Create NFT item record
      await supabase.from('nft_items').insert({
        collection_id: collection.id,
        token_id: txHash,
        metadata: metadata,
        type: options.type
      });

      // Create initial listing
      await supabase.from('nft_listings').insert({
        item_id: collection.id,
        price: options.price,
        status: 'active',
        shipping: options.type === 'merch' ? {
          regions: 'Worldwide',
          estimated_days: 7
        } : null
      });

      return txHash;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mint NFT');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    mint,
    loading,
    error
  };
}
```