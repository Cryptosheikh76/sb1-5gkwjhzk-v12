```typescript
import { useState } from 'react';
import { useWallet } from '../useWallet';
import { createSellOffer, acceptBuyOffer } from '../../lib/xrpl/nft/contract';
import { distributeSaleRevenue } from '../../lib/xrpl/token/distribution';
import { supabase } from '../../lib/supabase';

export function useNFTSales() {
  const { client } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listForSale = async (
    tokenId: string,
    price: string,
    expiration?: number
  ) => {
    if (!client) throw new Error('Wallet not connected');

    try {
      setLoading(true);
      setError(null);

      // Create sell offer on XRPL
      const offerHash = await createSellOffer(
        client,
        tokenId,
        price,
        expiration
      );

      // Record listing in database
      await supabase.from('nft_listings').insert({
        token_id: tokenId,
        price,
        seller_address: client.wallet!.address,
        offer_hash: offerHash,
        status: 'active'
      });

      return offerHash;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to list NFT');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const purchase = async (
    offerId: string,
    price: string,
    creatorAddress: string
  ) => {
    if (!client) throw new Error('Wallet not connected');

    try {
      setLoading(true);
      setError(null);

      // Accept offer on XRPL
      const txHash = await acceptBuyOffer(client, offerId);

      // Distribute revenue
      const { platformFee, creatorAmount } = await distributeSaleRevenue(client, {
        amount: price,
        creatorAddress,
        saleType: 'NFT_SALE'
      });

      // Update listing status
      await supabase
        .from('nft_listings')
        .update({ 
          status: 'sold',
          transaction_hash: txHash,
          platform_fee: platformFee,
          creator_amount: creatorAmount
        })
        .eq('offer_hash', offerId);

      return txHash;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to purchase NFT');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    listForSale,
    purchase,
    loading,
    error
  };
}
```