
-- Create a table for leaderboard scores
CREATE TABLE public.leaderboard_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL,
  distance INTEGER NOT NULL,
  selected_bike TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to allow public read access but no individual user restrictions
ALTER TABLE public.leaderboard_scores ENABLE ROW LEVEL SECURITY;

-- Create policy that allows anyone to view all scores (public leaderboard)
CREATE POLICY "Anyone can view leaderboard scores" 
  ON public.leaderboard_scores 
  FOR SELECT 
  USING (true);

-- Create policy that allows anyone to insert scores (no auth required)
CREATE POLICY "Anyone can add scores" 
  ON public.leaderboard_scores 
  FOR INSERT 
  WITH CHECK (true);

-- Create an index to optimize leaderboard queries (ordered by distance desc)
CREATE INDEX idx_leaderboard_scores_distance_desc ON public.leaderboard_scores (distance DESC, created_at DESC);
