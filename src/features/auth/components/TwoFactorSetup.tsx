```typescript
import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Alert } from '../../../components/ui/Alert';
import { useTwoFactor } from '../hooks/useTwoFactor';

export function TwoFactorSetup() {
  const [verificationCode, setVerificationCode] = useState('');
  const { 
    setupKey, 
    qrCodeUrl, 
    verifyAndEnable2FA, 
    loading, 
    error 
  } = useTwoFactor();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await verifyAndEnable2FA(verificationCode);
  };

  if (!setupKey || !qrCodeUrl) return null;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium mb-2">Set up Two-Factor Authentication</h3>
        <p className="text-sm text-gray-400">
          Scan this QR code with your authenticator app
        </p>
      </div>

      <div className="flex justify-center">
        <QRCodeSVG value={qrCodeUrl} size={200} />
      </div>

      <div className="p-4 bg-zinc-800 rounded-lg">
        <p className="text-sm font-medium mb-2">Manual entry code:</p>
        <code className="text-sm font-mono">{setupKey}</code>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Enter verification code"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          placeholder="000000"
          maxLength={6}
          pattern="\d{6}"
          required
        />

        {error && <Alert type="error" message={error} />}

        <Button
          type="submit"
          disabled={loading || verificationCode.length !== 6}
          loading={loading}
          fullWidth
        >
          Verify and Enable 2FA
        </Button>
      </form>
    </div>
  );
}
```