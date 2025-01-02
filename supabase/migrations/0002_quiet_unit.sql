/*
  # Analytics and Bot Detection Tables

  1. New Tables
    - `analytics`
      - User-level analytics aggregation
      - Stores total views, unique viewers, watch time, etc.
    - `video_views`
      - Individual view records
      - Includes bot detection data
  
  2. Security
    - Enable RLS on both tables
    - Users can only read their own analytics
    - Insert allowed for authenticated users
*/

-- Analytics table for user statistics
CREATE TABLE IF NOT EXISTS analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  total_views INT DEFAULT 0,
  unique_viewers INT DEFAULT 0,
  watch_time INT DEFAULT 0, -- in seconds
  engagement_rate FLOAT DEFAULT 0,
  bot_interactions INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

-- Video views table with bot detection
CREATE TABLE IF NOT EXISTS video_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID REFERENCES videos(id) NOT NULL,
  viewer_ip TEXT NOT NULL,
  user_agent TEXT,
  is_bot BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_views ENABLE ROW LEVEL SECURITY;

-- Analytics policies
CREATE POLICY "Users can view their own analytics"
  ON analytics
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Video views policies
CREATE POLICY "Users can track views on their videos"
  ON video_views
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM videos
      WHERE videos.id = video_id
      AND videos.user_id = auth.uid()
    )
  );

-- Function to update analytics on new view
CREATE OR REPLACE FUNCTION update_analytics_on_view()
RETURNS TRIGGER AS $$
BEGIN
  -- Get the video owner's user_id
  WITH video_owner AS (
    SELECT user_id
    FROM videos
    WHERE id = NEW.video_id
  )
  -- Update or create analytics record
  INSERT INTO analytics (user_id, total_views, unique_viewers, bot_interactions)
  SELECT 
    user_id,
    1,
    1,
    CASE WHEN NEW.is_bot THEN 1 ELSE 0 END
  FROM video_owner
  ON CONFLICT (user_id) DO UPDATE
  SET 
    total_views = analytics.total_views + 1,
    unique_viewers = analytics.unique_viewers + 
      CASE WHEN NOT EXISTS (
        SELECT 1 FROM video_views 
        WHERE viewer_ip = NEW.viewer_ip 
        AND created_at < NEW.created_at
      ) THEN 1 ELSE 0 END,
    bot_interactions = analytics.bot_interactions + 
      CASE WHEN NEW.is_bot THEN 1 ELSE 0 END,
    updated_at = now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update analytics on new view
CREATE TRIGGER update_analytics_after_view
  AFTER INSERT ON video_views
  FOR EACH ROW
  EXECUTE FUNCTION update_analytics_on_view();