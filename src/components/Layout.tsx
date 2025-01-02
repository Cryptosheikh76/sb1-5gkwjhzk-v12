```typescript
import { Outlet } from 'react-router-dom';
import { Navigation } from './Navigation';
import { MessageButton } from './messaging/MessageButton';
import { ErrorBoundary } from '../utils/errorBoundary';

export function Layout() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-black text-white">
        <main className="container mx-auto px-4 pb-20">
          <div className="fixed bottom-24 right-4">
            <MessageButton />
          </div>
          <Outlet />
        </main>
        <Navigation />
      </div>
    </ErrorBoundary>
  );
}

export default Layout;
```