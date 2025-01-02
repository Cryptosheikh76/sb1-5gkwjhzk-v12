import { useState, useCallback } from 'react';
import { StreamConnection } from '../types';
import { connectToStream } from '../utils/webrtc';
import { verifyStreamAccess } from '../utils/access';

export function useStreamViewer(streamId: string) {
  const [connection, setConnection] = useState<StreamConnection | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const joinStream = useCallback(async () => {
    try {
      setLoading(true);
      
      // Verify access
      await verifyStreamAccess(streamId);
      
      // Connect to WebRTC
      const conn = await connectToStream(streamId);
      setConnection(conn);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join stream');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [streamId]);

  const leaveStream = useCallback(() => {
    if (connection) {
      connection.peerConnection.close();
      connection.dataChannel.close();
      setConnection(null);
    }
  }, [connection]);

  return { connection, loading, error, joinStream, leaveStream };
}