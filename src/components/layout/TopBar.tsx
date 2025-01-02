```typescript
import { useAuth } from '../../features/auth/components/AuthProvider';
import { Button } from '../ui/Button';
import { WalletButton } from '../wallet/WalletButton';
import { Logo } from './Logo';

interface TopBarProps {
  onAuthClick: () => void;
}

export function TopBar({ onAuthClick }: TopBarProps) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-surface/95 backdrop-blur-md border-b border-zinc-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Logo />

          <div className="flex items-center gap-4">
            <WalletButton />
            
            {!user && (
              <Button onClick={onAuthClick}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
```