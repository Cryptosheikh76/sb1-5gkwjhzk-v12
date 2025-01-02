```typescript
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../../hooks/useAuth';
import { describe, it, expect, beforeEach } from 'vitest';
import { server } from '../../setupTests';
import { http, HttpResponse } from 'msw';

describe('useAuth', () => {
  beforeEach(() => {
    server.use(
      http.post('*/auth/v1/token', () => {
        return HttpResponse.json({
          access_token: 'test-token',
          user: {
            id: 'test-user',
            email: 'test@example.com'
          }
        });
      })
    );
  });

  it('initializes with null user and no loading state', () => {
    const { result } = renderHook(() => useAuth());
    
    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('handles sign in successfully', async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.signIn('test@example.com', 'password');
    });

    expect(result.current.user).toBeTruthy();
    expect(result.current.user?.email).toBe('test@example.com');
  });

  it('handles sign out', async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.signOut();
    });

    expect(result.current.user).toBeNull();
  });
});
```