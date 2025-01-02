import { supabase } from '../../lib/supabase';

export const analyticsService = {
  async getUserStats(userId: string) {
    const { data, error } = await supabase
      .from('analytics')
      .select(`
        total_views,
        unique_viewers,
        watch_time,
        engagement_rate,
        bot_interactions
      `)
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    return data;
  },

  async trackView(videoId: string, viewerIp: string, userAgent: string) {
    const isSuspiciousBot = await this.detectBot(viewerIp, userAgent);
    
    const { error } = await supabase
      .from('video_views')
      .insert({
        video_id: videoId,
        viewer_ip: viewerIp,
        user_agent: userAgent,
        is_bot: isSuspiciousBot
      });

    if (error) throw error;
  },

  async detectBot(ip: string, userAgent: string): Promise<boolean> {
    // Bot detection logic based on patterns
    const botPatterns = [
      /bot/i,
      /crawler/i,
      /spider/i,
      /headless/i
    ];

    // Check user agent against bot patterns
    const isBot = botPatterns.some(pattern => pattern.test(userAgent));

    // Check for suspicious behavior patterns
    const { data: suspiciousActivity } = await supabase
      .from('video_views')
      .select('created_at')
      .eq('viewer_ip', ip)
      .gte('created_at', new Date(Date.now() - 5 * 60 * 1000).toISOString()) // Last 5 minutes
      .order('created_at', { ascending: false });

    // If more than 30 views in 5 minutes from same IP, mark as bot
    const isRateLimited = (suspiciousActivity?.length ?? 0) > 30;

    return isBot || isRateLimited;
  }
};