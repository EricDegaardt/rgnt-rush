/*
  # Add marketing consent column to scoreboard table

  1. Changes
    - Add `marketing_consent` column to `scoreboard` table
    - Set column type as boolean with default value false
    - Allow null values for backward compatibility with existing records

  2. Security
    - No RLS changes needed as table already has appropriate policies
*/

-- Add marketing_consent column to scoreboard table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'scoreboard' AND column_name = 'marketing_consent'
  ) THEN
    ALTER TABLE scoreboard ADD COLUMN marketing_consent boolean DEFAULT false;
  END IF;
END $$;