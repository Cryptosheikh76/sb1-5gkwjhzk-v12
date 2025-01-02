/*
  # Messaging System Schema V4
  
  1. New Tables
    - conversations_v3
    - conversation_participants_v3 
    - messages_v3
    - message_reactions_v3
    
  2. Security
    - Enable RLS
    - Add uniquely named policies
*/

-- Drop existing policies if they exist
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "conversations_v3_select_policy" ON conversations_v3;
    DROP POLICY IF EXISTS "messages_v3_select_policy" ON messages_v3;
    DROP POLICY IF EXISTS "messages_v3_insert_policy" ON messages_v3;
END $$;

-- Create tables if they don't exist
CREATE TABLE IF NOT EXISTS conversations_v3 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  type TEXT NOT NULL CHECK (type IN ('direct', 'group')),
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS conversation_participants_v3 (
  conversation_id UUID REFERENCES conversations_v3(id) NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  joined_at TIMESTAMPTZ DEFAULT now(),
  last_read_at TIMESTAMPTZ,
  PRIMARY KEY (conversation_id, user_id)
);

CREATE TABLE IF NOT EXISTS messages_v3 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations_v3(id) NOT NULL,
  sender_id UUID REFERENCES auth.users(id) NOT NULL,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'text',
  metadata JSONB DEFAULT '{}',
  is_edited BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS message_reactions_v3 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID REFERENCES messages_v3(id) NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  reaction TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(message_id, user_id, reaction)
);

-- Enable RLS
ALTER TABLE conversations_v3 ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants_v3 ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages_v3 ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_reactions_v3 ENABLE ROW LEVEL SECURITY;

-- Create new policies with unique names
CREATE POLICY "conversations_v3_select_policy_20250101"
  ON conversations_v3 FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM conversation_participants_v3
      WHERE conversation_id = id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "messages_v3_select_policy_20250101"
  ON messages_v3 FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM conversation_participants_v3
      WHERE conversation_id = messages_v3.conversation_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "messages_v3_insert_policy_20250101"
  ON messages_v3 FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversation_participants_v3
      WHERE conversation_id = messages_v3.conversation_id
      AND user_id = auth.uid()
    )
  );

-- Drop existing function and trigger if they exist
DROP TRIGGER IF EXISTS update_conversation_on_message_v3 ON messages_v3;
DROP FUNCTION IF EXISTS update_conversation_timestamp_v3();

-- Create function and trigger with unique names
CREATE OR REPLACE FUNCTION update_conversation_timestamp_v3_20250101()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations_v3
  SET updated_at = now()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_conversation_on_message_v3_20250101
  AFTER INSERT ON messages_v3
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_timestamp_v3_20250101();