```typescript
import { useState } from 'react';
import { useWallet } from '../../../hooks/useWallet';
import { supabase } from '../../../lib/supabase';
import type { ShippingOrder } from '../types';

export function useShippingOrder() {
  const { client } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createOrder = async (
    listingId: string,
    data: { shippingAddress: string }
  ): Promise<ShippingOrder> => {
    if (!client) throw new Error('Wallet not connected');

    try {
      setLoading(true);
      setError(null);

      const { data: order, error: dbError } = await supabase
        .from('shipping_orders')
        .insert({
          listing_id: listingId,
          buyer_id: client.wallet!.address,
          shipping_address: data.shippingAddress,
          status: 'pending'
        })
        .select()
        .single();

      if (dbError) throw dbError;
      return order;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create shipping order');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getOrderStatus = async (orderId: string): Promise<ShippingOrder> => {
    const { data, error } = await supabase
      .from('shipping_orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error) throw error;
    return data;
  };

  return {
    createOrder,
    getOrderStatus,
    loading,
    error
  };
}
```