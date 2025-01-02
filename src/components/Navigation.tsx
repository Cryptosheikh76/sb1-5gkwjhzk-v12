```typescript
import { Link, useLocation } from 'react-router-dom';
import { 
  CyberHomeIcon,
  CyberStreamIcon,
  CyberChatIcon,
  CyberUploadIcon,
  CyberSettingsIcon
} from './icons/CyberIcons';
import { cn } from '../utils/styles';
import { Button } from './ui/Button';
import { useAuth } from '../hooks/useAuth';
import { SettingsButton } from './ui/SettingsButton';

export function Navigation() {
  const location = useLocation();
  const { user } = useAuth();

  const mainNavItems = [
    { to: '/', icon: CyberHomeIcon, label: 'For You' },
    { to: '/live', icon: CyberStreamIcon, label: 'Live' },
    { to: '/messages', icon: CyberChatIcon, label: 'Messages' },
    { to: '/profile', icon: UserIcon, label: 'Profile' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-900/95 backdrop-blur-md border-t border-zinc-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-2">
          <div className="flex-1 flex justify-around items-center">
            {mainNavItems.map(({ to, icon: Icon, label }) => {
              const isActive = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={cn(
                    'flex flex-col items-center p-2 rounded-lg transition-colors',
                    isActive ? 'text-primary' : 'text-gray-400 hover:text-white'
                  )}
                >
                  <Icon 
                    className={cn(
                      'w-6 h-6 hover-icon',
                      isActive && 'active-icon'
                    )} 
                  />
                  <span className="text-xs mt-1">{label}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2 ml-4">
            {user && (
              <Button
                as={Link}
                to="/upload"
                variant="primary"
                size="sm"
                className="rounded-full shadow-neon"
              >
                <CyberUploadIcon className="w-5 h-5" />
              </Button>
            )}
            <SettingsButton />
          </div>
        </div>
      </div>
    </div>
  );
}
```