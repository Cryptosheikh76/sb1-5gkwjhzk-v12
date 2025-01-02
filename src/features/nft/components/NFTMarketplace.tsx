```typescript
import { useState } from 'react';
import { useNFTMarket } from '../hooks/useNFTMarket';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { formatNumber } from '../../../utils/format';

export function NFTMarketplace() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { listings, loading, purchaseNFT } = useNFTMarket();

  if (loading) return <LoadingSpinner />;

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'music', label: 'Music' },
    { id: 'merch', label: 'Merchandise' },
    { id: 'tickets', label: 'Event Tickets' }
  ];

  const filteredListings = selectedCategory === 'all' 
    ? listings 
    : listings.filter(item => item.type === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(category => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? 'primary' : 'secondary'}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.label}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredListings.map(item => (
          <Card key={item.id} className="overflow-hidden">
            <img 
              src={item.image} 
              alt={item.title}
              className="w-full aspect-square object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-sm text-gray-400">{item.description}</p>
              
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Price</p>
                  <p className="font-medium">{item.price} AGC</p>
                </div>
                {item.type === 'merch' && (
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Shipping</p>
                    <p className="text-sm">{item.shipping?.regions}</p>
                  </div>
                )}
              </div>

              <Button
                onClick={() => purchaseNFT(item.id)}
                className="mt-4"
                fullWidth
              >
                Purchase
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
```