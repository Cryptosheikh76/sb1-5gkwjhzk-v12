-- Duets table
CREATE TABLE IF NOT EXISTS duets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_video_id UUID REFERENCES videos(id) NOT NULL,
  creator_id UUID REFERENCES users(id) NOT NULL,
  url TEXT NOT NULL,
  layout TEXT NOT NULL CHECK (layout IN ('side-by-side', 'picture-in-picture')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Stitches table
CREATE TABLE IF NOT EXISTS stitches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_video_id UUID REFERENCES videos(id) NOT NULL,
  creator_id UUID REFERENCES users(id) NOT NULL,
  url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Video effects table
CREATE TABLE IF NOT EXISTS video_effects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID REFERENCES videos(id) NOT NULL,
  effect_type TEXT NOT NULL,
  effect_config JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE duets ENABLE ROW LEVEL SECURITY;
ALTER TABLE stitches ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_effects ENABLE ROW LEVEL SECURITY;

-- Duets policies
CREATE POLICY "Duets are viewable by everyone"
  ON duets FOR SELECT
  USING (true);

CREATE POLICY "Users can create duets"
  ON duets FOR INSERT
  TO authenticated
  WITH CHECK (creator_id = auth.uid());

-- Stitches policies
CREATE POLICY "Stitches are viewable by everyone"
  ON stitches FOR SELECT
  USING (true);

CREATE POLICY "Users can create stitches"
  ON stitches FOR INSERT
  TO authenticated
  WITH CHECK (creator_id = auth.uid());

-- Video effects policies
CREATE POLICY "Video effects are viewable by everyone"
  ON video_effects FOR SELECT
  USING (true);

CREATE POLICY "Users can manage their video effects"
  ON video_effects FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM videos
      WHERE videos.id = video_id
      AND videos.user_id = auth.uid()
    )
  );

-- Add duet and stitch counts to videos
ALTER TABLE videos 
ADD COLUMN IF NOT EXISTS duet_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS stitch_count INTEGER DEFAULT 0;

-- Function to update duet count
CREATE OR REPLACE FUNCTION update_duet_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE videos
  SET duet_count = duet_count + 1
  WHERE id = NEW.original_video_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update stitch count
CREATE OR REPLACE FUNCTION update_stitch_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE videos
  SET stitch_count = stitch_count + 1
  WHERE id = NEW.original_video_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updating counts
CREATE TRIGGER increment_duet_count
  AFTER INSERT ON duets
  FOR EACH ROW
  EXECUTE FUNCTION update_duet_count();

CREATE TRIGGER increment_stitch_count
  AFTER INSERT ON stitches
  FOR EACH ROW
  EXECUTE FUNCTION update_stitch_count();