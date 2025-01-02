```typescript
import { Request, Response, NextFunction } from 'express';
import { supabase } from '../lib/supabase';
import { AppError } from './errorHandler';

export async function authMiddleware(
  req: Request,
  res: Response, 
  next: NextFunction
) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new AppError('No token provided', 401, 'AUTH_NO_TOKEN');
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      throw new AppError('Invalid token', 401, 'AUTH_INVALID_TOKEN');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}
```