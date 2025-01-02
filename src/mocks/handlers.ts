```typescript
import { http, HttpResponse } from 'msw';

export const handlers = [
  // Auth endpoints
  http.post('*/auth/v1/token', () => {
    return HttpResponse.json({
      access_token: 'mock-token',
      user: {
        id: 'mock-user-id',
        email: 'test@example.com'
      }
    });
  }),

  // Supabase endpoints
  http.get('*/rest/v1/videos', () => {
    return HttpResponse.json([
      {
        id: '1',
        title: 'Test Video',
        description: 'Test Description',
        url: 'https://example.com/video.mp4',
        creator: {
          username: 'testuser',
          avatar_url: 'https://example.com/avatar.jpg'
        }
      }
    ]);
  }),

  // XRPL endpoints
  http.post('*/xrpl/v1/accounts', () => {
    return HttpResponse.json({
      address: 'mock-xrpl-address',
      balance: '100'
    });
  })
];
```