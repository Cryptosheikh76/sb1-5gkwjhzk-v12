```typescript
export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

export interface NFTOffer {
  id: string;
  tokenId: string;
  amount: string;
  owner: string;
  expiration?: number;
}

export interface NFTCollection {
  id: string;
  name: string;
  symbol: string;
  creator: string;
  totalSupply: number;
  royaltyFee: number;
}
```