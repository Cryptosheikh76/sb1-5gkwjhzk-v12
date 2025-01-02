```typescript
import { Client } from 'xrpl';
import { NFTMetadata, NFTCollection } from './types';

export interface NFTContractConfig {
  name: string;
  symbol: string;
  royaltyFee: number; // In basis points (e.g., 500 = 5%)
  maxSupply?: number;
}

export async function deployNFTContract(
  client: Client,
  config: NFTContractConfig
): Promise<string> {
  const tx = {
    TransactionType: 'NFTokenMint',
    Account: client.wallet!.address,
    NFTokenTaxon: 0,
    Flags: config.royaltyFee > 0 ? 1 : 0,
    TransferFee: config.royaltyFee,
    URI: Buffer.from(JSON.stringify({
      name: config.name,
      symbol: config.symbol,
      maxSupply: config.maxSupply
    })).toString('hex')
  };

  const result = await client.submitAndWait(tx);
  return result.result.hash;
}

export async function mintToken(
  client: Client,
  collection: NFTCollection,
  metadata: NFTMetadata
): Promise<string> {
  const tx = {
    TransactionType: 'NFTokenMint',
    Account: client.wallet!.address,
    NFTokenTaxon: 0,
    URI: Buffer.from(JSON.stringify(metadata)).toString('hex'),
    Flags: collection.royaltyFee > 0 ? 1 : 0,
    TransferFee: collection.royaltyFee
  };

  const result = await client.submitAndWait(tx);
  return result.result.hash;
}

export async function createSellOffer(
  client: Client,
  tokenId: string,
  price: string,
  expiration?: number
): Promise<string> {
  const tx = {
    TransactionType: 'NFTokenCreateOffer',
    Account: client.wallet!.address,
    NFTokenID: tokenId,
    Amount: price,
    Expiration: expiration,
    Flags: 1 // Sellable
  };

  const result = await client.submitAndWait(tx);
  return result.result.hash;
}

export async function acceptBuyOffer(
  client: Client,
  offerId: string
): Promise<string> {
  const tx = {
    TransactionType: 'NFTokenAcceptOffer',
    Account: client.wallet!.address,
    NFTokenSellOffer: offerId
  };

  const result = await client.submitAndWait(tx);
  return result.result.hash;
}
```