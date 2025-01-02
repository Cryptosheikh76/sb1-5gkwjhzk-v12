import { AnalyticsEvent } from '../types';
import { supabase } from '../../../lib/supabase';

export async function trackEvent(event: AnalyticsEvent): Promise<void> {
  // Store event in Supabase
  const { error: dbError } = await supabase
    .from('analytics_events')
    .insert(event);

  if (dbError) throw dbError;

  // Update relevant metrics based on event type
  await updateMetrics(event);
}

async function updateMetrics(event: AnalyticsEvent): Promise<void> {
  const { name, userId, properties } = event;

  switch (name) {
    case 'video_view':
      await updateViewMetrics(userId!, properties.videoId);
      break;
    case 'stream_start':
      await updateStreamMetrics(userId!, properties.streamId);
      break;
    case 'tip_sent':
      await updateEarningMetrics(properties.recipientId, properties);
      break;
    // Add more event-specific metric updates
  }
}

async function updateViewMetrics(userId: string, contentId: string): Promise<void> {
  const { error } = await supabase.rpc('increment_view_metrics', {
    user_id: userId,
    content_id: contentId
  });

  if (error) throw error;
}

async function updateStreamMetrics(userId: string, streamId: string): Promise<void> {
  const { error } = await supabase.rpc('update_stream_metrics', {
    user_id: userId,
    stream_id: streamId
  });

  if (error) throw error;
}

async function updateEarningMetrics(
  userId: string,
  { amount, currency }: { amount: string; currency: string }
): Promise<void> {
  const { error } = await supabase.rpc('update_earning_metrics', {
    user_id: userId,
    amount,
    currency
  });

  if (error) throw error;
}