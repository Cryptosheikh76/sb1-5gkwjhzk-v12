```typescript
import { useState } from 'react';
import { useNFTSales } from '../../hooks/useNFTSales';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Badge } from '../../../../components/ui/Badge';
import { formatNumber } from '../../../../utils/format';
import type { NFTListing } from '../../types';

interface NFTCardProps {
  listing: NFTListing;
}

export function NFTCard({ listing }: NFTCardProps) {
  const [loading, setLoading] = useState(false);
  const { purchase } = useNFTSales();

  const handlePurchase = async () => {
    try {
      setLoading(true);
      await purchase(listing.id, listing.price, listing.item.collection.creator_id);
    } catch (error) {
      console.error('Purchase failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="aspect-square relative">
        <img 
          src={listing.item.metadata.image} 
          alt={listing.item.metadata.name}
          className="w-full h-full object-cover"
        />
        <Badge 
          variant="secondary"
          className="absolute top-2 right-2"
        >
          {listing.item.type}
        </Badge>
      </div>

      <div className="p-4 space-y-2">
        <h3 className="font-semibold">{listing.item.metadata.name}</h3>
        <p className="text-sm text-gray-400">{listing.item.metadata.description}</p>

        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-400">Price</p>
            <p className="font-medium">{formatNumber(listing.price)} AGC</p>
          </div>
          {listing.item.type === 'merch' && listing.shipping && (
            <div className="text-right">
              <p className="text-sm text-gray-400">Shipping</p>
              <p className="text-sm">{listing.shipping.regions}</p>
            </div>
          )}
        </div>

        <Button
          onClick={handlePurchase}
          loading={loading}
          fullWidth
        >
          Purchase
        </Button>
      </div>
    </Card>
  );
}
```