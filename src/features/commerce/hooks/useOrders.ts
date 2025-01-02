import { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { Order } from '../types';
import { usePayments } from '../../payments/hooks/usePayments';

export function useOrders() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { sendPayment } = usePayments();

  const createOrder = async (
    productId: string, 
    quantity: number,
    shippingDetails?: ShippingDetails
  ) => {
    try {
      setLoading(true);
      
      // Get product details
      const { data: product } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (!product) throw new Error('Product not found');

      // Create order record
      const { data: order, error: dbError } = await supabase
        .from('orders')
        .insert({
          product_id: productId,
          quantity,
          total_amount: (parseFloat(product.price) * quantity).toString(),
          shipping_details: shippingDetails,
          status: 'pending'
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // Process payment
      const payment = await sendPayment({
        amount: order.total_amount,
        currency: product.currency,
        recipientId: product.creator_id,
        chainId: 'ethereum', // Default to Ethereum
        metadata: {
          type: 'purchase',
          itemId: order.id
        }
      });

      // Update order with transaction hash
      if (payment.status === 'success') {
        await supabase
          .from('orders')
          .update({
            status: 'paid',
            transaction_hash: payment.transactionHash
          })
          .eq('id', order.id);
      }

      return order;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create order');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createOrder,
    loading,
    error
  };
}