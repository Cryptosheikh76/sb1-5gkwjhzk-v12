```typescript
import { useState } from 'react';
import { useNFTMarket } from '../../hooks/useNFTMarket';
import { NFTFilters } from './NFTFilters';
import { NFTGrid } from './NFTGrid';
import { NFTSort } from './NFTSort';
import { LoadingSpinner } from '../../../../components/common/LoadingSpinner';
import { Alert } from '../../../../components/ui/Alert';

export function NFTMarketplace() {
  const [filters, setFilters] = useState({
    type: 'all',
    priceRange: [0, 1000],
    hasShipping: false
  });
  const [sortBy, setSortBy] = useState<'price' | 'date'>('date');
  const { listings, loading, error } = useNFTMarket(filters, sortBy);

  if (loading) return <LoadingSpinner />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <NFTFilters 
          filters={filters} 
          onChange={setFilters} 
        />
        <NFTSort 
          value={sortBy} 
          onChange={setSortBy} 
        />
      </div>

      <NFTGrid listings={listings} />
    </div>
  );
}
```