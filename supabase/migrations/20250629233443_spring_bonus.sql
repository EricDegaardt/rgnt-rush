/*
  # Add email field to leaderboard table

  1. Changes
    - Add `email` column to `leaderboard` table
    - Add `marketing_consent` column to track user consent
    - Update existing policies to handle new fields

  2. Security
    - Maintain existing RLS policies
    - Email and consent fields are optional for backward compatibility
*/

-- Add email and marketing consent columns
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leaderboard' AND column_name = 'email'
  ) THEN
    ALTER TABLE leaderboard ADD COLUMN email text;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leaderboard' AND column_name = 'marketing_consent'
  ) THEN
    ALTER TABLE leaderboard ADD COLUMN marketing_consent boolean DEFAULT false;
  END IF;
END $$;