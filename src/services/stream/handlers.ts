```typescript
import { Server, Socket } from 'socket.io';
import { supabase } from '../../lib/supabase';
import { StreamEvent } from './types';

export function setupStreamHandlers(io: Server) {
  io.on('connection', (socket: Socket) => {
    let currentStreamId: string | null = null;

    socket.on('stream:join', async (streamId: string) => {
      try {
        // Verify stream exists and is live
        const { data: stream } = await supabase
          .from('streams')
          .select('*')
          .eq('id', streamId)
          .eq('is_live', true)
          .single();

        if (!stream) {
          socket.emit('error', 'Stream not found or not live');
          return;
        }

        // Join stream room
        socket.join(`stream:${streamId}`);
        currentStreamId = streamId;

        // Update viewer count
        await supabase.rpc('increment_stream_viewers', { stream_id: streamId });

        // Emit viewer count to all clients in the room
        const { data: stats } = await supabase
          .from('stream_stats')
          .select('viewer_count')
          .eq('stream_id', streamId)
          .single();

        io.to(`stream:${streamId}`).emit('stream:stats', stats);
      } catch (error) {
        console.error('Error joining stream:', error);
        socket.emit('error', 'Failed to join stream');
      }
    });

    socket.on('stream:chat', async (message: string) => {
      if (!currentStreamId) return;

      try {
        const { data: chatMessage } = await supabase
          .from('stream_messages')
          .insert({
            stream_id: currentStreamId,
            content: message,
            user_id: socket.data.userId
          })
          .select('*, user:users(username, avatar_url)')
          .single();

        io.to(`stream:${currentStreamId}`).emit('stream:chat', chatMessage);
      } catch (error) {
        console.error('Error sending chat message:', error);
        socket.emit('error', 'Failed to send message');
      }
    });

    socket.on('disconnect', async () => {
      if (currentStreamId) {
        await supabase.rpc('decrement_stream_viewers', {
          stream_id: currentStreamId
        });
      }
    });
  });
}
```