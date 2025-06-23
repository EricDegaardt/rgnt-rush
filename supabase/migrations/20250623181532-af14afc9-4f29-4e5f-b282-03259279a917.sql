
-- Add email column to leaderboard_scores table for competition entry
ALTER TABLE public.leaderboard_scores 
ADD COLUMN email TEXT;

-- Create an index on email for efficient queries
CREATE INDEX idx_leaderboard_scores_email ON public.leaderboard_scores (email);
