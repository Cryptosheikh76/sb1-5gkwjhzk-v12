```typescript
import { Client } from 'xrpl';
import { sendTokens } from '../token';
import { distributeSaleRevenue } from '../token/distribution';
import { supabase } from '../../supabase';

export async function distributeRoyalties(
  client: Client,
  data: {
    tokenId: string;
    saleAmount: string;
    sellerAddress: string;
    buyerAddress: string;
  }
): Promise<{
  platformFee: string;
  creatorAmount: string;
  sellerAmount: string;
}> {
  // Get collection info for royalty rate
  const { data: token } = await supabase
    .from('nft_items')
    .select(`
      collection:nft_collections(
        creator_id,
        royalty_fee
      )
    `)
    .eq('token_id', data.tokenId)
    .single();

  if (!token?.collection) {
    throw new Error('NFT collection not found');
  }

  const { creator_id, royalty_fee } = token.collection;

  // Calculate amounts
  const saleValue = parseFloat(data.saleAmount);
  const royaltyAmount = (saleValue * royalty_fee / 100).toFixed(6);
  
  // Distribute revenue shares
  const { platformFee, creatorAmount } = await distributeSaleRevenue(client, {
    amount: data.saleAmount,
    creatorAddress: creator_id,
    saleType: 'NFT_SALE'
  });

  // Calculate seller amount after fees and royalties
  const sellerAmount = (
    saleValue - 
    parseFloat(platformFee) - 
    parseFloat(royaltyAmount)
  ).toFixed(6);

  // Send seller amount
  await sendTokens(client, data.sellerAddress, sellerAmount);

  // Record royalty distribution
  await supabase.from('nft_royalties').insert({
    token_id: data.tokenId,
    sale_amount: data.saleAmount,
    royalty_amount: royaltyAmount,
    platform_fee: platformFee,
    seller_amount: sellerAmount,
    buyer_address: data.buyerAddress,
    seller_address: data.sellerAddress,
    creator_address: creator_id
  });

  return {
    platformFee,
    creatorAmount: royaltyAmount,
    sellerAmount
  };
}
```