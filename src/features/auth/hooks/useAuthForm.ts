```typescript
import { useState } from 'react';
import { useAuth } from '../components/AuthProvider';
import { SignInCredentials, SignUpCredentials } from '../types';
import { validateEmail, validatePassword } from '../utils/validation';

export function useAuthForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signInWithEmail } = useAuth();

  const handleSignIn = async (credentials: SignInCredentials) => {
    try {
      setLoading(true);
      setError(null);

      const emailError = validateEmail(credentials.email);
      if (emailError) {
        setError(emailError);
        return;
      }

      const passwordErrors = validatePassword(credentials.password);
      if (passwordErrors.length > 0) {
        setError(passwordErrors[0]);
        return;
      }

      await signInWithEmail(credentials.email, credentials.password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    handleSignIn
  };
}
```