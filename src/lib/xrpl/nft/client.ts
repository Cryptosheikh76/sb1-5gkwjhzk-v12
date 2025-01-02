```typescript
import { Client } from 'xrpl';
import { NFTMetadata, NFTCollection } from './types';
import { XRPL_NETWORKS } from '../constants';

export async function mintNFT(
  client: Client,
  collection: NFTCollection,
  metadata: NFTMetadata
) {
  const tx = {
    TransactionType: 'NFTokenMint',
    Account: client.wallet!.address,
    NFTokenTaxon: 0,
    URI: Buffer.from(JSON.stringify(metadata)).toString('hex'),
    Flags: collection.royaltyFee > 0 ? 1 : 0,
    TransferFee: collection.royaltyFee * 1000 // Convert percentage to basis points
  };

  const result = await client.submitAndWait(tx);
  return result.result.hash;
}

export async function createNFTOffer(
  client: Client,
  tokenId: string,
  amount: string,
  expiration?: number
) {
  const tx = {
    TransactionType: 'NFTokenCreateOffer',
    Account: client.wallet!.address,
    NFTokenID: tokenId,
    Amount: amount,
    Expiration: expiration
  };

  const result = await client.submitAndWait(tx);
  return result.result.hash;
}
```