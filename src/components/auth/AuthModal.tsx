import { Dialog } from '@headlessui/react';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { validateEmail, validatePassword, validateUsername } from '../../utils/validation';
import { ErrorMessage } from '../common/ErrorMessage';

export function AuthModal({ isOpen, onClose }: { 
  isOpen: boolean; 
  onClose: () => void;
}) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate inputs
    if (!validateEmail(email)) {
      setError('Please enter a valid email');
      return;
    }

    if (isSignUp) {
      const usernameErrors = validateUsername(username);
      if (usernameErrors.length > 0) {
        setError(usernameErrors[0]);
        return;
      }
    }

    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      setError(passwordErrors[0]);
      return;
    }

    const result = isSignUp 
      ? await signUp(email, password, username)
      : await signIn(email, password);

    if (result.error) {
      setError(result.error.message);
    } else {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/80" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-zinc-900 rounded-lg p-6 w-full max-w-sm">
          <Dialog.Title className="text-xl font-bold mb-4 text-white">
            {isSignUp ? 'Create Account' : 'Sign In'}
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            )}
            
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && <ErrorMessage message={error} />}

            <Button
              type="submit"
              variant="primary"
              fullWidth
            >
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </Button>

            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
            </Button>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}