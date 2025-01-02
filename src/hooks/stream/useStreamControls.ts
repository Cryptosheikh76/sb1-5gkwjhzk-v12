import { useState } from 'react';
import { useStream } from '../useStream';
import { analytics } from '../../lib/analytics';

export function useStreamControls() {
  const [isLive, setIsLive] = useState(false);
  const { startStream, updateStatus, loading, error } = useStream();

  const startLiveStream = async (title: string) => {
    try {
      const stream = await startStream(title, 'false');
      setIsLive(true);
      analytics.trackEvent('stream_start', { streamId: stream.id });
      return stream;
    } catch (error) {
      analytics.trackError(error as Error, 'stream_start');
      throw error;
    }
  };

  const endLiveStream = async () => {
    try {
      await updateStatus(false);
      setIsLive(false);
    } catch (error) {
      analytics.trackError(error as Error, 'stream_end');
      throw error;
    }
  };

  return {
    isLive,
    loading,
    error,
    startLiveStream,
    endLiveStream
  };
}