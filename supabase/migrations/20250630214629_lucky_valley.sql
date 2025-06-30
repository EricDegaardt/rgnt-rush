/*
  # Fix RLS policies and constraints for scoreboard table

  1. Security Changes
    - Enable RLS on scoreboard table (if not already enabled)
    - Create policies for read, insert, and update operations (if they don't exist)
    
  2. Data Cleanup
    - Remove duplicate emails (keep the latest entry for each email)
    - Add unique constraint on email column (if it doesn't exist)
    
  3. Performance
    - Add indexes for efficient sorting and email lookups (if they don't exist)
*/

-- Enable RLS on scoreboard table (safe to run multiple times)
ALTER TABLE scoreboard ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist, then recreate them
DO $$
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Anyone can read scoreboard" ON scoreboard;
  DROP POLICY IF EXISTS "Anyone can insert scores" ON scoreboard;
  DROP POLICY IF EXISTS "Anyone can update scores" ON scoreboard;
  
  -- Create new policies
  CREATE POLICY "Anyone can read scoreboard"
    ON scoreboard
    FOR SELECT
    TO anon, authenticated
    USING (true);

  CREATE POLICY "Anyone can insert scores"
    ON scoreboard
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

  CREATE POLICY "Anyone can update scores"
    ON scoreboard
    FOR UPDATE
    TO anon, authenticated
    USING (true);
END $$;

-- Clean up duplicate emails before adding unique constraint
-- Keep only the latest entry for each email (highest id)
DELETE FROM scoreboard 
WHERE id NOT IN (
  SELECT DISTINCT ON (email) id
  FROM scoreboard 
  WHERE email IS NOT NULL
  ORDER BY email, id DESC
);

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_scoreboard_distance ON scoreboard(distance DESC);
CREATE INDEX IF NOT EXISTS idx_scoreboard_email ON scoreboard(email) WHERE email IS NOT NULL;

-- Drop existing unique constraint if it exists, then recreate it
DROP INDEX IF EXISTS unique_scoreboard_email;
CREATE UNIQUE INDEX unique_scoreboard_email ON scoreboard(email) WHERE email IS NOT NULL;