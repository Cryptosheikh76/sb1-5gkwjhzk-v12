```typescript
import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { supabase } from '../lib/supabase';

const router = Router();

// Get live streams
router.get('/', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('streams')
      .select(`
        *,
        creator:users(username, avatar_url),
        metrics:stream_metrics(viewer_count)
      `)
      .eq('is_live', true)
      .order('viewer_count', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    next(error);
  }
});

// Start stream
router.post('/start', authMiddleware, async (req, res, next) => {
  try {
    const { title, isPrivate } = req.body;
    if (!title) {
      throw new AppError('Title is required', 400, 'STREAM_TITLE_REQUIRED');
    }

    const { data, error } = await supabase
      .from('streams')
      .insert({
        title,
        is_private: isPrivate,
        creator_id: req.user.id,
        is_live: true,
        started_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    next(error);
  }
});

// End stream
router.post('/:id/end', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('streams')
      .update({ 
        is_live: false,
        ended_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('creator_id', req.user.id);

    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export { router as streamRouter };
```