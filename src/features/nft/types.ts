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

export interface NFTListing {
  id: string;
  item: {
    id: string;
    token_id: string;
    type: 'music' | 'merch' | 'ticket';
    collection: {
      id: string;
      name: string;
      creator_id: string;
    };
  };
  price: string;
  status: 'active' | 'sold' | 'cancelled';
  shipping?: {
    regions: string;
    estimated_days: number;
  };
  created_at: string;
}

export interface ShippingOrder {
  id: string;
  listing_id: string;
  buyer_id: string;
  shipping_address: string;
  tracking_number?: string;
  status: 'pending' | 'shipped' | 'delivered';
  created_at: string;
}
```