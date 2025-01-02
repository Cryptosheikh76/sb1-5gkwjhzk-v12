import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../hooks/useAuth';

export function useTwoFactor() {
  const [setupKey, setSetupKey] = useState<string | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const generateSetupKey = async () => {
      if (!user) return;

      try {
        const { data, error: setupError } = await supabase.functions.invoke('generate-2fa-secret', {
          body: { userId: user.id }
        });

        if (setupError) throw setupError;

        setSetupKey(data.secret);
        setQrCodeUrl(
          `otpauth://totp/SuperHub:${user.email}?secret=${data.secret}&issuer=SuperHub`
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to generate 2FA setup');
      }
    };

    generateSetupKey();
  }, [user]);

  const verifyAndEnable2FA = async (code: string) => {
    if (!user || !setupKey) return;

    try {
      setLoading(true);
      setError(null);

      const { error: verifyError } = await supabase.functions.invoke('verify-2fa-setup', {
        body: { 
          userId: user.id,
          secret: setupKey,
          code
        }
      });

      if (verifyError) throw verifyError;

      const { error: updateError } = await supabase
        .from('users')
        .update({ 
          two_factor_enabled: true,
          two_factor_secret: setupKey
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify 2FA code');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    setupKey,
    qrCodeUrl,
    verifyAndEnable2FA,
    loading,
    error
  };
}