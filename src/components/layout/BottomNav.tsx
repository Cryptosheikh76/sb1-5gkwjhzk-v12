import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  VideoCameraIcon,
  PlusCircleIcon,
  WalletIcon,
  UserIcon 
} from '@heroicons/react/24/outline';
import { 
  HomeIcon as HomeIconSolid,
  VideoCameraIcon as VideoCameraSolid,
  PlusCircleIcon as PlusCircleSolid,
  WalletIcon as WalletIconSolid,
  UserIcon as UserIconSolid
} from '@heroicons/react/24/solid';
import { useAuth } from '../../features/auth/components/AuthProvider';

export function BottomNav() {
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { path: '/', icon: HomeIcon, activeIcon: HomeIconSolid, label: 'Home' },
    { path: '/live', icon: VideoCameraIcon, activeIcon: VideoCameraSolid, label: 'Live' },
    { path: '/upload', icon: PlusCircleIcon, activeIcon: PlusCircleSolid, label: 'Create' },
    { path: '/wallet', icon: WalletIcon, activeIcon: WalletIconSolid, label: 'Wallet' },
    { path: '/profile', icon: UserIcon, activeIcon: UserIconSolid, label: 'Profile' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-md border-t border-zinc-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-around py-2">
          {navItems.map(({ path, icon: Icon, activeIcon: ActiveIcon, label }) => {
            const isActive = location.pathname === path;
            const IconComponent = isActive ? ActiveIcon : Icon;
            
            return (
              <Link
                key={path}
                to={path}
                className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                  isActive ? 'text-primary' : 'text-gray-400 hover:text-white'
                }`}
              >
                <IconComponent className="w-6 h-6" />
                <span className="text-xs mt-1">{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}