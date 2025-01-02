/*
  # Analytics System Migration v2
  
  1. New Tables
    - content_metrics_v2 for tracking content performance
    - analytics_events_v2 for raw event data
  2. Security
    - Enable RLS
    - Add policies with unique version identifiers
*/

-- Drop existing policies if they exist
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "content_metrics_select_policy_v1" ON content_metrics;
    DROP POLICY IF EXISTS "analytics_events_insert_policy_v1" ON analytics_events;
END $$;

-- Content metrics table
CREATE TABLE IF NOT EXISTS content_metrics_v2 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES users(id) NOT NULL,
  content_id UUID NOT NULL,
  title TEXT NOT NULL,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  average_watch_time FLOAT DEFAULT 0,
  published_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Analytics events table for raw data
CREATE TABLE IF NOT EXISTS analytics_events_v2 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  event_type TEXT NOT NULL,
  content_id UUID,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE content_metrics_v2 ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events_v2 ENABLE ROW LEVEL SECURITY;

-- Content metrics policies with unique names
CREATE POLICY "content_metrics_select_policy_v2"
  ON content_metrics_v2 FOR SELECT
  TO authenticated
  USING (creator_id = auth.uid());

-- Analytics events policies with unique names
CREATE POLICY "analytics_events_insert_policy_v2"
  ON analytics_events_v2 FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Drop existing function and trigger if they exist
DROP TRIGGER IF EXISTS process_analytics_event_trigger_v2 ON analytics_events_v2;
DROP FUNCTION IF EXISTS process_analytics_event_v2();

-- Function to update metrics on new event
CREATE OR REPLACE FUNCTION process_analytics_event_v2()
RETURNS TRIGGER AS $$
BEGIN
  -- Update content metrics
  IF NEW.event_type IN ('view', 'like', 'comment') THEN
    INSERT INTO content_metrics_v2 (creator_id, content_id, title)
    VALUES (
      (SELECT user_id FROM videos WHERE id = NEW.content_id),
      NEW.content_id,
      (SELECT title FROM videos WHERE id = NEW.content_id)
    )
    ON CONFLICT (id) DO UPDATE SET
      views = CASE 
        WHEN NEW.event_type = 'view' THEN content_metrics_v2.views + 1
        ELSE content_metrics_v2.views
      END,
      likes = CASE 
        WHEN NEW.event_type = 'like' THEN content_metrics_v2.likes + 1
        ELSE content_metrics_v2.likes
      END,
      comments = CASE 
        WHEN NEW.event_type = 'comment' THEN content_metrics_v2.comments + 1
        ELSE content_metrics_v2.comments
      END,
      updated_at = now();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for processing analytics events
CREATE TRIGGER process_analytics_event_trigger_v2
  AFTER INSERT ON analytics_events_v2
  FOR EACH ROW
  EXECUTE FUNCTION process_analytics_event_v2();