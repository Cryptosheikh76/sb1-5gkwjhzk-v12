```typescript
import { NFTCard } from './NFTCard';
import type { NFTListing } from '../../types';

interface NFTGridProps {
  listings: NFTListing[];
}

export function NFTGrid({ listings }: NFTGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map(listing => (
        <NFTCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
```