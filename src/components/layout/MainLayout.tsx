import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { TopBar } from './TopBar';
import { SkipLink } from '../common/SkipLink';

export default function MainLayout() {
  return (
    <>
      <SkipLink />
      <div className="min-h-screen bg-background text-white">
        <TopBar />
        
        <main id="main-content" className="container mx-auto px-4 pb-20">
          <Outlet />
        </main>

        <BottomNav />
      </div>
    </>
  );
}