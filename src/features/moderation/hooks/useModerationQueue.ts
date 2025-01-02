```typescript
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { ModerationItem, ModerationAction } from '../types';

export function useModerationQueue() {
  const [items, setItems] = useState<ModerationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadQueue();
  }, []);

  const loadQueue = async () => {
    try {
      const { data, error: dbError } = await supabase
        .from('moderation_queue')
        .select(`
          *,
          reporter:users!reporter_id(username),
          content:flagged_content(*)
        `)
        .eq('status', 'pending')
        .order('severity', { ascending: false });

      if (dbError) throw dbError;
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load moderation queue');
    } finally {
      setLoading(false);
    }
  };

  const takeAction = async (itemId: string, action: ModerationAction) => {
    try {
      setLoading(true);

      const { error: dbError } = await supabase
        .from('moderation_queue')
        .update({ 
          status: 'resolved',
          resolution: action,
          resolved_at: new Date().toISOString()
        })
        .eq('id', itemId);

      if (dbError) throw dbError;

      // If blocking content, update content status
      if (action === 'block') {
        await supabase
          .from('flagged_content')
          .update({ status: 'blocked' })
          .eq('id', itemId);
      }

      await loadQueue();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to take action');
    } finally {
      setLoading(false);
    }
  };

  return {
    items,
    loading,
    error,
    takeAction,
    refresh: loadQueue
  };
}
```