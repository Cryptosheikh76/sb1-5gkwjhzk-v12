import { useWallet } from '../../../hooks/blockchain/useWallet';
import { VideoMetadata } from '../types';
import { verifyTokenOwnership } from '../../../lib/blockchain/tokens';

export function useVideoAccess() {
  const { address, chainId } = useWallet();

  const checkAccess = async (video: VideoMetadata): Promise<boolean> => {
    if (!video.tokenGated) return true;
    if (!address || !chainId) return false;

    if (video.requiredTokens?.length) {
      const hasTokens = await verifyTokenOwnership(
        address,
        video.requiredTokens,
        chainId
      );
      return hasTokens;
    }

    return true;
  };

  return { checkAccess };
}