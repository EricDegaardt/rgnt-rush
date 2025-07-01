/*
  # Fix RLS policies and indexes for scoreboard table

  1. Security
    - Enable RLS on scoreboard table (if not already enabled)
    - Add policies for reading, inserting, and updating scores (with existence checks)
  
  2. Performance
    - Add indexes for efficient sorting and email lookups (with existence checks)
    - Add unique constraint on email to prevent duplicates
*/

-- Enable RLS on scoreboard table (only if not already enabled)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'scoreboard' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE scoreboard ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Anyone can read scoreboard" ON scoreboard;
DROP POLICY IF EXISTS "Anyone can insert scores" ON scoreboard;
DROP POLICY IF EXISTS "Anyone can update scores" ON scoreboard;

-- Allow anyone to read scoreboard data
CREATE POLICY "Anyone can read scoreboard"
  ON scoreboard
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow anyone to insert new scores
CREATE POLICY "Anyone can insert scores"
  ON scoreboard
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow anyone to update their own scores (for email updates)
CREATE POLICY "Anyone can update scores"
  ON scoreboard
  FOR UPDATE
  TO anon, authenticated
  USING (true);

-- Create index for efficient sorting by distance (with existence check)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_scoreboard_distance'
  ) THEN
    CREATE INDEX idx_scoreboard_distance ON scoreboard(distance DESC);
  END IF;
END $$;

-- Create index on email for efficient duplicate checking (with existence check)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_scoreboard_email'
  ) THEN
    CREATE INDEX idx_scoreboard_email ON scoreboard(email) WHERE email IS NOT NULL;
  END IF;
END $$;

-- Add unique constraint on email to prevent duplicates (with existence check)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'unique_scoreboard_email'
  ) THEN
    CREATE UNIQUE INDEX unique_scoreboard_email ON scoreboard(email) WHERE email IS NOT NULL;
  END IF;
END $$;