```typescript
import { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../auth/components/AuthProvider';
import { monitoring } from '../../../lib/monitoring';

export function useSocialShare() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const shareContent = async (platform: string, url: string, title: string) => {
    try {
      setLoading(true);

      // Generate share URLs
      const shareUrls = {
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`
      };

      // Open share dialog
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');

      // Record share event
      if (user) {
        await supabase.from('content_shares').insert({
          user_id: user.id,
          content_url: url,
          platform
        });
      }

      // Track analytics
      monitoring.logEvent('content_shared', {
        platform,
        url,
        userId: user?.id
      });

    } catch (error) {
      console.error('Share failed:', error);
      monitoring.captureError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      monitoring.logEvent('link_copied', {
        url: text,
        userId: user?.id
      });
    } catch (error) {
      console.error('Copy failed:', error);
      monitoring.captureError(error as Error);
    }
  };

  return {
    shareContent,
    copyToClipboard,
    loading
  };
}
```