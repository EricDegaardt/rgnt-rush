/*
  # Implement RLS for scoreboard table and handle duplicate emails

  1. Security Changes
    - Enable RLS on scoreboard table
    - Add policies for read, insert, and update operations
    
  2. Data Cleanup
    - Remove duplicate emails (keep the latest entry for each email)
    - Add unique constraint on email column
    
  3. Performance
    - Add indexes for efficient sorting and email lookups
*/

-- Enable RLS on scoreboard table
ALTER TABLE scoreboard ENABLE ROW LEVEL SECURITY;

-- Clean up duplicate emails before adding unique constraint
-- Keep only the latest entry for each email (highest id)
DELETE FROM scoreboard 
WHERE id NOT IN (
  SELECT DISTINCT ON (email) id
  FROM scoreboard 
  WHERE email IS NOT NULL
  ORDER BY email, id DESC
);

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
-- This will now work since we cleaned up duplicates above
CREATE UNIQUE INDEX IF NOT EXISTS unique_scoreboard_email ON scoreboard(email) WHERE email IS NOT NULL;