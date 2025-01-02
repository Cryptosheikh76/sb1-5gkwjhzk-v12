import { useState, useCallback } from 'react';
import { supabase } from '../../../lib/supabase';
import { StreamSettings } from '../types/stream';
import { STREAM_SETTINGS, STREAM_ERRORS } from '../constants/stream';
import { useAuth } from '../../../hooks/useAuth';
import { generateStreamKey } from '../utils/stream';

export function useStreamSetup() {
  const [streamSettings, setStreamSettings] = useState<StreamSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const setupStream = useCallback(async (title: string) => {
    if (!user) {
      throw new Error(STREAM_ERRORS.NOT_LOGGED_IN);
    }

    try {
      setLoading(true);
      setError(null);

      const streamKey = generateStreamKey(user.id);
      const settings: StreamSettings = {
        streamKey,
        serverUrl: `${window.location.protocol}//${window.location.host}/live`,
        title,
        bitrate: STREAM_SETTINGS.DEFAULT_BITRATE,
        fps: STREAM_SETTINGS.DEFAULT_FPS,
        resolution: `${STREAM_SETTINGS.DEFAULT_RESOLUTION.width}x${STREAM_SETTINGS.DEFAULT_RESOLUTION.height}`
      };

      const { error: dbError } = await supabase
        .from('streams')
        .insert({
          user_id: user.id,
          title,
          stream_key: streamKey,
          is_live: false
        });

      if (dbError) throw dbError;

      setStreamSettings(settings);
      return settings;
    } catch (err) {
      const message = err instanceof Error ? err.message : STREAM_ERRORS.CONNECTION_ERROR;
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    streamSettings,
    setupStream,
    loading,
    error
  };
}