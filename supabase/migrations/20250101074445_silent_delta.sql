-- Algorithm settings table
CREATE TABLE IF NOT EXISTS algorithm_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  weights JSONB NOT NULL DEFAULT '{
    "engagement": 0.4,
    "recency": 0.2,
    "relevance": 0.2,
    "quality": 0.2
  }',
  engagement_metrics JSONB NOT NULL DEFAULT '{
    "likeWeight": 1,
    "commentWeight": 2,
    "shareWeight": 3,
    "minWatchTime": 10
  }',
  quality_thresholds JSONB NOT NULL DEFAULT '{
    "minEngagementRate": 0.01,
    "spamThreshold": 0.8,
    "contentDiversity": 0.3
  }',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Algorithm performance metrics
CREATE TABLE IF NOT EXISTS algorithm_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_engagement JSONB NOT NULL DEFAULT '{
    "avgWatchTime": 0,
    "completionRate": 0,
    "returnRate": 0
  }',
  content_performance JSONB NOT NULL DEFAULT '{
    "viralityRate": 0,
    "creatorRetention": 0,
    "monetizationRate": 0
  }',
  system_health JSONB NOT NULL DEFAULT '{
    "diversityScore": 0,
    "fairnessScore": 0,
    "latency": 0
  }',
  timestamp TIMESTAMPTZ DEFAULT now()
);

-- A/B test configurations
CREATE TABLE IF NOT EXISTS ab_test_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  variants JSONB NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- A/B test results
CREATE TABLE IF NOT EXISTS ab_test_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id UUID REFERENCES ab_test_configs(id),
  variant TEXT NOT NULL,
  metrics JSONB NOT NULL,
  sample_size INTEGER NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE algorithm_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE algorithm_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_test_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_test_results ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Only staff can manage algorithm settings"
  ON algorithm_settings
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.is_staff = true
    )
  );

CREATE POLICY "Only staff can view algorithm metrics"
  ON algorithm_metrics
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.is_staff = true
    )
  );

CREATE POLICY "Only staff can manage A/B tests"
  ON ab_test_configs
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.is_staff = true
    )
  );

-- Functions
CREATE OR REPLACE FUNCTION update_algorithm_metrics()
RETURNS TRIGGER AS $$
DECLARE
  last_update TIMESTAMPTZ;
BEGIN
  -- Check if an hour has passed since last update
  SELECT timestamp INTO last_update
  FROM algorithm_metrics
  ORDER BY timestamp DESC
  LIMIT 1;

  -- Only proceed if no update in the last hour
  IF last_update IS NULL OR last_update < now() - interval '1 hour' THEN
    -- Calculate user engagement metrics
    WITH user_stats AS (
      SELECT
        AVG(watch_time) as avg_watch_time,
        COUNT(DISTINCT user_id)::float / NULLIF(COUNT(user_id), 0) as return_rate
      FROM analytics_events
      WHERE event_type = 'view'
      AND created_at > now() - interval '1 day'
    )
    INSERT INTO algorithm_metrics (
      user_engagement,
      content_performance,
      system_health
    )
    SELECT
      jsonb_build_object(
        'avgWatchTime', COALESCE(avg_watch_time, 0),
        'returnRate', COALESCE(return_rate, 0)
      ),
      jsonb_build_object(
        'viralityRate', 0,
        'creatorRetention', 0,
        'monetizationRate', 0
      ),
      jsonb_build_object(
        'diversityScore', 0,
        'fairnessScore', 0,
        'latency', 0
      )
    FROM user_stats;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update metrics
CREATE TRIGGER update_algorithm_metrics_hourly
  AFTER INSERT ON analytics_events
  FOR EACH STATEMENT
  EXECUTE FUNCTION update_algorithm_metrics();