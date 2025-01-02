```typescript
import { useState } from 'react';
import { useShippingOrder } from '../../hooks/useShippingOrder';
import { Input } from '../../../../components/ui/Input';
import { Button } from '../../../../components/ui/Button';
import { Alert } from '../../../../components/ui/Alert';
import type { NFTListing } from '../../types';

interface ShippingFormProps {
  listing: NFTListing;
  onComplete: () => void;
}

export function ShippingForm({ listing, onComplete }: ShippingFormProps) {
  const [address, setAddress] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    country: '',
    postalCode: ''
  });
  const { createOrder, loading, error } = useShippingOrder();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createOrder(listing.id, {
        shippingAddress: `${address.name}\n${address.street}\n${address.city}, ${address.state} ${address.postalCode}\n${address.country}`
      });
      onComplete();
    } catch (error) {
      console.error('Failed to create shipping order:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Full Name"
        value={address.name}
        onChange={(e) => setAddress({ ...address, name: e.target.value })}
        required
      />
      <Input
        label="Street Address"
        value={address.street}
        onChange={(e) => setAddress({ ...address, street: e.target.value })}
        required
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="City"
          value={address.city}
          onChange={(e) => setAddress({ ...address, city: e.target.value })}
          required
        />
        <Input
          label="State/Province"
          value={address.state}
          onChange={(e) => setAddress({ ...address, state: e.target.value })}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Postal Code"
          value={address.postalCode}
          onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
          required
        />
        <Input
          label="Country"
          value={address.country}
          onChange={(e) => setAddress({ ...address, country: e.target.value })}
          required
        />
      </div>

      {error && <Alert type="error" message={error} />}

      <Button
        type="submit"
        loading={loading}
        fullWidth
      >
        Confirm Shipping Details
      </Button>
    </form>
  );
}
```