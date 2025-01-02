```typescript
import { createContext, useContext, useReducer, ReactNode } from 'react';
import { User } from '../features/auth/types';
import { WalletState } from '../lib/xrpl/types';

interface AppState {
  user: User | null;
  wallet: WalletState | null;
  theme: 'light' | 'dark';
  notifications: boolean;
  reducedMotion: boolean;
}

type AppAction = 
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_WALLET'; payload: WalletState | null }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'SET_NOTIFICATIONS'; payload: boolean }
  | { type: 'SET_REDUCED_MOTION'; payload: boolean };

const initialState: AppState = {
  user: null,
  wallet: null,
  theme: 'dark',
  notifications: true,
  reducedMotion: false
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_WALLET':
      return { ...state, wallet: action.payload };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload };
    case 'SET_REDUCED_MOTION':
      return { ...state, reducedMotion: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppState must be used within AppProvider');
  }
  return context;
}
```