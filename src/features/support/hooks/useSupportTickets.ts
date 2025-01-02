```typescript
import { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../auth/components/AuthProvider';
import { monitoring } from '../../../lib/monitoring';

interface TicketData {
  subject: string;
  message: string;
  priority?: 'low' | 'medium' | 'high';
}

export function useSupportTickets() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTicket = async (data: TicketData) => {
    if (!user) throw new Error('Must be logged in');

    try {
      setLoading(true);
      setError(null);

      const { error: dbError } = await supabase
        .from('support_tickets')
        .insert({
          user_id: user.id,
          subject: data.subject,
          message: data.message,
          priority: data.priority || 'low',
          status: 'open'
        });

      if (dbError) throw dbError;

      monitoring.logEvent('support_ticket_created', {
        subject: data.subject,
        priority: data.priority
      });

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create ticket';
      setError(message);
      monitoring.captureError(err instanceof Error ? err : new Error(message));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getTickets = async () => {
    if (!user) throw new Error('Must be logged in');

    try {
      setLoading(true);
      setError(null);

      const { data, error: dbError } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (dbError) throw dbError;
      return data;

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load tickets';
      setError(message);
      monitoring.captureError(err instanceof Error ? err : new Error(message));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createTicket,
    getTickets,
    loading,
    error
  };
}
```