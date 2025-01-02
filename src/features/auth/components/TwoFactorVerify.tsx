```typescript
import { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Alert } from '../../../components/ui/Alert';
import { useAuth } from '../hooks/useAuth';

interface TwoFactorVerifyProps {
  onVerify: () => void;
}

export function TwoFactorVerify({ onVerify }: TwoFactorVerifyProps) {
  const [code, setCode] = useState('');
  const { verify2FA, loading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await verify2FA(code);
    if (success) {
      onVerify();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-medium mb-2">Two-Factor Authentication</h3>
        <p className="text-sm text-gray-400">
          Enter the code from your authenticator app
        </p>
      </div>

      <Input
        label="Verification Code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="000000"
        maxLength={6}
        pattern="\d{6}"
        required
      />

      {error && <Alert type="error" message={error} />}

      <Button
        type="submit"
        disabled={loading || code.length !== 6}
        loading={loading}
        fullWidth
      >
        Verify
      </Button>
    </form>
  );
}
```