```typescript
import { useState } from 'react';
import { useWallet } from '../useWallet';
import { distributeRoyalties } from '../../lib/xrpl/nft/royalties';
import { supabase } from '../../lib/supabase';

export function useNFTRoyalties() {
  const { client } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processRoyalties = async (
    tokenId: string,
    saleAmount: string,
    sellerAddress: string,
    buyerAddress: string
  ) => {
    if (!client) throw new Error('Wallet not connected');

    try {
      setLoading(true);
      setError(null);

      const result = await distributeRoyalties(client, {
        tokenId,
        saleAmount,
        sellerAddress,
        buyerAddress
      });

      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process royalties');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getRoyaltyHistory = async (tokenId: string) => {
    const { data, error: dbError } = await supabase
      .from('nft_royalties')
      .select('*')
      .eq('token_id', tokenId)
      .order('created_at', { ascending: false });

    if (dbError) throw dbError;
    return data;
  };

  return {
    processRoyalties,
    getRoyaltyHistory,
    loading,
    error
  };
}
```