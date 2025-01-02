```typescript
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { monitoring } from '../../../lib/monitoring';
import type { CuratedContent, CurationAction } from '../types';

export function useContentCuration() {
  const [content, setContent] = useState<CuratedContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      const { data, error: dbError } = await supabase
        .from('curated_content')
        .select(`
          *,
          creator:users(username, avatar_url)
        `)
        .order('created_at', { ascending: false });

      if (dbError) throw dbError;
      setContent(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load content');
      monitoring.captureError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const curateContent = async (contentId: string, action: CurationAction) => {
    try {
      setLoading(true);

      const updates = {
        status: action === 'feature' ? 'featured' : 
               action === 'promote' ? 'promoted' : 'removed',
        curated_at: new Date().toISOString()
      };

      const { error: dbError } = await supabase
        .from('curated_content')
        .update(updates)
        .eq('id', contentId);

      if (dbError) throw dbError;

      monitoring.logEvent('content_curated', {
        contentId,
        action,
        status: updates.status
      });

      await loadContent();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to curate content');
      monitoring.captureError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return {
    content,
    curateContent,
    loading,
    error
  };
}
```