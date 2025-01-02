import { supabase } from '../lib/supabase';

export const inviteService = {
  async createInvite(streamId: string, walletAddress: string) {
    const { data, error } = await supabase
      .from('stream_invites')
      .insert({
        stream_id: streamId,
        wallet_address: walletAddress
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async verifyInvite(streamId: string, walletAddress: string) {
    const { data, error } = await supabase
      .from('stream_invites')
      .select('*')
      .eq('stream_id', streamId)
      .eq('wallet_address', walletAddress)
      .single();
    
    if (error) return false;
    return !!data;
  }
};