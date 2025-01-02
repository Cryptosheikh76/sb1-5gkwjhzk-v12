import { useState } from 'react';
import { streamService } from '../services/streamService';
import { handleStreamError } from '../utils/errors';
import type { Stream } from '../types';

export function useStream(streamId?: string) {
  const [stream, setStream] = useState<Stream | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startStream = async (title: string, requiresInvite = 'false') => {
    try {
      setLoading(true);
      const newStream = await streamService.createStream(title, requiresInvite);
      setStream(newStream);
      return newStream;
    } catch (e) {
      const errorMessage = handleStreamError(e);
      setError(errorMessage);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (isLive: boolean) => {
    if (!streamId) return;
    try {
      setLoading(true);
      const updatedStream = await streamService.updateStreamStatus(streamId, isLive);
      setStream(updatedStream);
      return updatedStream;
    } catch (e) {
      const errorMessage = handleStreamError(e);
      setError(errorMessage);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return {
    stream,
    loading,
    error,
    startStream,
    updateStatus
  };
}