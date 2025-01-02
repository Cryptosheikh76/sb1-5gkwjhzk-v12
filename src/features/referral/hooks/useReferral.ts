```typescript
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../auth/components/AuthProvider';
import { monitoring } from '../../../lib/monitoring';

interface ReferralStats {
  totalReferrals: number;
  activeUsers: number;
  earnings: string;
}

export function useReferral() {
  const { user } = useAuth();
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [referralStats, setReferralStats] = useState<ReferralStats>({
    totalReferrals: 0,
    activeUsers: 0,
    earnings: '0'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadReferralData();
    }
  }, [user]);

  const loadReferralData = async () => {
    try {
      const [codeResponse, statsResponse] = await Promise.all([
        supabase
          .from('referral_codes')
          .select('code')
          .eq('user_id', user?.id)
          .single(),
        supabase
          .from('referral_stats')
          .select('*')
          .eq('referrer_id', user?.id)
          .single()
      ]);

      if (codeResponse.data) {
        setReferralCode(codeResponse.data.code);
      }

      if (statsResponse.data) {
        setReferralStats(statsResponse.data);
      }
    } catch (err) {
      console.error('Failed to load referral data:', err);
    }
  };

  const generateReferralCode = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const code = `${user.username}-${Math.random().toString(36).slice(2, 8)}`;
      
      const { error: dbError } = await supabase
        .from('referral_codes')
        .insert({
          user_id: user.id,
          code,
          status: 'active'
        });

      if (dbError) throw dbError;
      
      setReferralCode(code);
      monitoring.logEvent('referral_code_generated');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate code');
      monitoring.captureError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      monitoring.logEvent('referral_link_copied');
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  return {
    referralCode,
    referralStats,
    generateReferralCode,
    copyReferralLink,
    loading,
    error
  };
}
```