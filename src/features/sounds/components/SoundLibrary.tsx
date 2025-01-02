import { useState } from 'react';
import { useSoundLibrary } from '../hooks/useSoundLibrary';
import { SoundUploader } from './SoundUploader';
import { SoundList } from './SoundList';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';

export function SoundLibrary() {
  const [showUploader, setShowUploader] = useState(false);
  const { sounds, loading } = useSoundLibrary();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-glow">Sound Library</h2>
        <Button onClick={() => setShowUploader(true)}>
          Add Sound
        </Button>
      </div>

      <SoundList sounds={sounds} loading={loading} />

      <Modal
        isOpen={showUploader}
        onClose={() => setShowUploader(false)}
        title="Upload Sound"
      >
        <SoundUploader onSuccess={() => setShowUploader(false)} />
      </Modal>
    </div>
  );
}