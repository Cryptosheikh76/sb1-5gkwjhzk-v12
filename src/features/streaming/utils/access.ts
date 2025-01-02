import { supabase } from '../../../lib/supabase';
import { verifyTokenOwnership } from '../../../lib/blockchain/tokens';

export async function verifyStreamAccess(streamId: string): Promise<boolean> {
  const { data: stream } = await supabase
    .from('streams')
    .select('*')
    .eq('id', streamId)
    .single();

  if (!stream) {
    throw new Error('Stream not found');
  }

  if (!stream.isPrivate) {
    return true;
  }

  // Check token requirements
  if (stream.requiredTokens?.length) {
    const hasTokens = await verifyTokenOwnership(
      stream.creatorAddress,
      stream.requiredTokens,
      stream.chainId
    );
    
    if (!hasTokens) {
      throw new Error('Required tokens not owned');
    }
  }

  return true;
}