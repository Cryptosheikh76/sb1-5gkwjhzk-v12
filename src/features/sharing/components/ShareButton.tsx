```typescript
import { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { useSocialShare } from '../hooks/useSocialShare';
import { SharePlatform } from '../types';

interface ShareButtonProps {
  contentId: string;
  contentType: 'video' | 'stream' | 'nft';
  title: string;
  creatorId: string;
}

export function ShareButton({ contentId, contentType, title, creatorId }: ShareButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const { shareContent, copyToClipboard, loading } = useSocialShare();

  const platforms: SharePlatform[] = [
    { id: 'twitter', name: 'Twitter', color: 'bg-[#1DA1F2]' },
    { id: 'facebook', name: 'Facebook', color: 'bg-[#4267B2]' },
    { id: 'telegram', name: 'Telegram', color: 'bg-[#0088cc]' },
    { id: 'whatsapp', name: 'WhatsApp', color: 'bg-[#25D366]' }
  ];

  const shareUrl = `${window.location.origin}/${contentType}/${contentId}`;

  return (
    <>
      <Button
        onClick={() => setShowModal(true)}
        variant="secondary"
        className="flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        Share
      </Button>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Share Content"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3">
            {platforms.map(platform => (
              <Button
                key={platform.id}
                onClick={() => shareContent(platform.id, shareUrl, title)}
                className={`${platform.color} text-white`}
                loading={loading}
              >
                {platform.name}
              </Button>
            ))}
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Share Link</p>
            <div className="flex gap-2">
              <Input
                value={shareUrl}
                readOnly
                className="flex-1"
              />
              <Button
                onClick={() => copyToClipboard(shareUrl)}
                variant="secondary"
              >
                Copy
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
```