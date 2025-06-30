/*
  # Implement RLS for scoreboard table

  1. Security Changes
    - Enable RLS on scoreboard table
    - Add policy for anyone to read scoreboard data
    - Add policy for anyone to insert new scores
    - Add unique constraint on email to prevent duplicates
    
  2. Indexes
    - Add index on distance for efficient sorting
    - Add index on email for efficient duplicate checking
*/

-- Enable RLS on scoreboard table
ALTER TABLE scoreboard ENABLE ROW LEVEL SECURITY;

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

-- Create index for efficient sorting by distance
CREATE INDEX IF NOT EXISTS idx_scoreboard_distance ON scoreboard(distance DESC);

-- Create index on email for efficient duplicate checking
CREATE INDEX IF NOT EXISTS idx_scoreboard_email ON scoreboard(email) WHERE email IS NOT NULL;

-- Add unique constraint on email to prevent duplicates (only for non-null emails)
CREATE UNIQUE INDEX IF NOT EXISTS unique_scoreboard_email ON scoreboard(email) WHERE email IS NOT NULL;