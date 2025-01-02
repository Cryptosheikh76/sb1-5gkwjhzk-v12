```typescript
import { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Alert } from '../../../components/ui/Alert';
import { useXamanWallet } from '../hooks/useXamanWallet';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';

export function XamanConnect() {
  const [qrVisible, setQrVisible] = useState(false);
  const { connect, disconnect, loading, error, connected, qrCode } = useXamanWallet();

  if (loading) {
    return (
      <div className="flex justify-center p-4">
        <LoadingSpinner />
      </div>
    );
  }

  if (connected) {
    return (
      <div className="space-y-4">
        <Alert type="success" message="Xaman wallet connected!" />
        <Button 
          variant="secondary" 
          onClick={disconnect}
          fullWidth
        >
          Disconnect Wallet
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!qrVisible ? (
        <Button 
          onClick={() => {
            connect();
            setQrVisible(true);
          }}
          fullWidth
        >
          Connect Xaman Wallet
        </Button>
      ) : (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg">
            {qrCode && (
              <img 
                src={qrCode} 
                alt="Scan with Xaman Wallet" 
                className="w-full"
              />
            )}
          </div>
          <p className="text-sm text-center text-gray-400">
            Scan this QR code with your Xaman wallet app
          </p>
          {error && <Alert type="error" message={error} />}
          <Button 
            variant="secondary" 
            onClick={() => setQrVisible(false)}
            fullWidth
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}
```