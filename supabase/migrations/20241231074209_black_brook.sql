-- Create sounds table
CREATE TABLE IF NOT EXISTS sounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES users(id) NOT NULL,
  title TEXT NOT NULL,
  artist TEXT,
  url TEXT NOT NULL,
  waveform INTEGER[] NOT NULL,
  duration INTEGER NOT NULL,
  usage_count INTEGER DEFAULT 0,
  category TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create sound usage table
CREATE TABLE IF NOT EXISTS sound_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sound_id UUID REFERENCES sounds(id) NOT NULL,
  video_id UUID REFERENCES videos(id) NOT NULL,
  start_time INTEGER NOT NULL,
  duration INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE sounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE sound_usage ENABLE ROW LEVEL SECURITY;

-- Sound policies
CREATE POLICY "Anyone can view sounds"
  ON sounds FOR SELECT
  USING (true);

CREATE POLICY "Users can create sounds"
  ON sounds FOR INSERT
  TO authenticated
  WITH CHECK (creator_id = auth.uid());

-- Sound usage policies
CREATE POLICY "Anyone can view sound usage"
  ON sound_usage FOR SELECT
  USING (true);

CREATE POLICY "Users can create sound usage"
  ON sound_usage FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM videos
      WHERE videos.id = video_id
      AND videos.user_id = auth.uid()
    )
  );