/*
  # Add Stream Chat and Tipping
  
  1. New Tables
    - stream_messages for live chat
    - stream_tips for tracking tips
  2. Security
    - Enable RLS
    - Add policies for chat and tips
*/

-- Create stream messages table
CREATE TABLE IF NOT EXISTS stream_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stream_id UUID REFERENCES streams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create stream tips table
CREATE TABLE IF NOT EXISTS stream_tips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stream_id UUID REFERENCES streams(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id),
  amount TEXT NOT NULL,
  transaction_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE stream_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE stream_tips ENABLE ROW LEVEL SECURITY;

-- Stream messages policies
CREATE POLICY "Anyone can view stream messages"
  ON stream_messages FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can send messages"
  ON stream_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM streams
      WHERE streams.id = stream_id
      AND streams.is_live = true
    )
  );

-- Stream tips policies
CREATE POLICY "Anyone can view stream tips"
  ON stream_tips FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can send tips"
  ON stream_tips FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM streams
      WHERE streams.id = stream_id
      AND streams.is_live = true
    )
  );