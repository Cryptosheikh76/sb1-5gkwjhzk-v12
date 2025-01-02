import { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { Product } from '../types';

export function useStore() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProduct = async (product: Omit<Product, 'id'>) => {
    try {
      setLoading(true);
      const { data, error: dbError } = await supabase
        .from('products')
        .insert(product)
        .select()
        .single();

      if (dbError) throw dbError;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create product');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      setLoading(true);
      const { data, error: dbError } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (dbError) throw dbError;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createProduct,
    updateProduct,
    loading,
    error
  };
}