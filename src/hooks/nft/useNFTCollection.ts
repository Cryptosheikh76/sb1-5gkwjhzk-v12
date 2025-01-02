```typescript
import { useState, useEffect } from 'react';
import { NFTCollection } from '../../lib/xrpl/nft/types';
import { supabase } from '../../lib/supabase';

export function useNFTCollection(collectionId: string) {
  const [collection, setCollection] = useState<NFTCollection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: dbError } = await supabase
          .from('nft_collections')
          .select('*')
          .eq('id', collectionId)
          .single();

        if (dbError) throw dbError;
        setCollection(data as NFTCollection);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load collection');
      } finally {
        setLoading(false);
      }
    };

    fetchCollection();
  }, [collectionId]);

  return { collection, loading, error };
}
```