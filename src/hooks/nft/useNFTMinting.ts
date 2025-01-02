```typescript
import { useState } from 'react';
import { useWallet } from '../useWallet';
import { mintNFT } from '../../lib/xrpl/nft/client';
import { NFTMetadata, NFTCollection } from '../../lib/xrpl/nft/types';
import { supabase } from '../../lib/supabase';

export function useNFTMinting() {
  const { client } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mint = async (collection: NFTCollection, metadata: NFTMetadata) => {
    if (!client) {
      throw new Error('Wallet not connected');
    }

    try {
      setLoading(true);
      setError(null);

      // Mint NFT on XRPL
      const txHash = await mintNFT(client, collection, metadata);

      // Record in database
      await supabase.from('nft_items').insert({
        collection_id: collection.id,
        metadata: metadata,
        transaction_hash: txHash,
        owner_address: client.wallet!.address
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