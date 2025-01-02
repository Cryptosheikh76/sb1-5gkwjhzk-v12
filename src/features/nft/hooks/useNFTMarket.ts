```typescript
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useWallet } from '../../../hooks/useWallet';
import { NFTListing } from '../types';
import { createNFTOffer } from '../../../lib/xrpl/nft/client';

export function useNFTMarket() {
  const { client } = useWallet();
  const [listings, setListings] = useState<NFTListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      const { data, error: dbError } = await supabase
        .from('nft_listings')
        .select(`
          *,
          item:nft_items(
            *,
            collection:nft_collections(*)
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (dbError) throw dbError;
      setListings(data as NFTListing[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  const purchaseNFT = async (listingId: string) => {
    if (!client) throw new Error('Wallet not connected');

    try {
      setLoading(true);
      const listing = listings.find(l => l.id === listingId);
      if (!listing) throw new Error('Listing not found');

      // Create offer on XRPL
      const txHash = await createNFTOffer(
        client,
        listing.item.token_id,
        listing.price
      );

      // Update listing status
      await supabase
        .from('nft_listings')
        .update({ 
          status: 'sold',
          transaction_hash: txHash
        })
        .eq('id', listingId);

      // If merchandise, create shipping order
      if (listing.item.type === 'merch') {
        await supabase.from('shipping_orders').insert({
          listing_id: listingId,
          buyer_id: client.wallet!.address,
          status: 'pending'
        });
      }

      await loadListings();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to purchase NFT');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    listings,
    loading,
    error,
    purchaseNFT
  };
}
```