
-- Create a table for storing game scores
CREATE TABLE public.scoreboard (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL,
  distance INTEGER NOT NULL,
  selected_bike TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Since you don't want authentication, we'll make this table publicly accessible
-- Enable RLS but allow public access
ALTER TABLE public.scoreboard ENABLE ROW LEVEL SECURITY;

-- Create policy that allows anyone to view scores
CREATE POLICY "Anyone can view scores" 
  ON public.scoreboard 
  FOR SELECT 
  USING (true);

-- Create policy that allows anyone to insert scores
CREATE POLICY "Anyone can insert scores" 
  ON public.scoreboard 
  FOR INSERT 
  WITH CHECK (true);
