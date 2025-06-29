/*
  # Create leaderboard table

  1. New Tables
    - `leaderboard`
      - `id` (uuid, primary key)
      - `username` (text, not null)
      - `distance` (integer, not null)
      - `selected_bike` (text, not null)
      - `created_at` (timestamp)
      
  2. Security
    - Enable RLS on `leaderboard` table
    - Add policy for anyone to read leaderboard data
    - Add policy for anyone to insert new scores
    
  3. Indexes
    - Add index on distance for efficient sorting
*/

CREATE TABLE IF NOT EXISTS leaderboard (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text NOT NULL,
  distance integer NOT NULL,
  selected_bike text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read leaderboard data
CREATE POLICY "Anyone can read leaderboard"
  ON leaderboard
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow anyone to insert new scores
CREATE POLICY "Anyone can insert scores"
  ON leaderboard
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Create index for efficient sorting by distance
CREATE INDEX IF NOT EXISTS idx_leaderboard_distance ON leaderboard(distance DESC);