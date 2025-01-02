/*
  # Initial Schema Setup

  1. New Tables
    - users
      - Custom user data extending auth.users
    - videos
      - Store video metadata
    - streams
      - Live streaming information
    - stream_invites
      - Blockchain-based invite system

  2. Security
    - RLS enabled on all tables
    - Policies for authenticated access
*/

-- Users table for additional user data
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Videos table for the For You page
CREATE TABLE IF NOT EXISTS videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  likes_count INT DEFAULT 0,
  comments_count INT DEFAULT 0
);

-- Live streams table
CREATE TABLE IF NOT EXISTS streams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  title TEXT NOT NULL,
  is_live BOOLEAN DEFAULT false,
  requires_invite BOOLEAN DEFAULT false,
  stream_key TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ
);

-- Stream invites for blockchain verification
CREATE TABLE IF NOT EXISTS stream_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stream_id UUID REFERENCES streams(id) NOT NULL,
  wallet_address TEXT NOT NULL,
  token_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(stream_id, wallet_address)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE stream_invites ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read all profiles"
  ON users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Videos policies
CREATE POLICY "Videos are viewable by everyone"
  ON videos FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create videos"
  ON videos FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Streams policies
CREATE POLICY "Public streams are viewable by everyone"
  ON streams FOR SELECT
  TO authenticated
  USING (NOT requires_invite OR user_id = auth.uid());

CREATE POLICY "Users can create streams"
  ON streams FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Stream invites policies
CREATE POLICY "Users can view their stream invites"
  ON stream_invites FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM streams
      WHERE streams.id = stream_id
      AND streams.user_id = auth.uid()
    )
  );