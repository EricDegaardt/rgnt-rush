import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface LeaderboardEntry {
  id: string
  username: string
  distance: number
  selected_bike: string
  created_at: string
}

export const saveScore = async (username: string, distance: number, selectedBike: string): Promise<boolean> => {
  try {
    console.log('Attempting to save score:', { username, distance: Math.floor(distance), selectedBike });
    
    const { data, error } = await supabase
      .from('leaderboard')
      .insert([
        {
          username,
          distance: Math.floor(distance),
          selected_bike: selectedBike
        }
      ])
      .select()

    if (error) {
      console.error('Supabase error saving score:', error);
      return false
    }

    console.log('Score saved successfully:', data);
    return true
  } catch (error) {
    console.error('Error saving score:', error)
    return false
  }
}

export const getLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  try {
    console.log('Fetching leaderboard...');
    
    const { data, error } = await supabase
      .from('leaderboard')
      .select('*')
      .order('distance', { ascending: false })
      .limit(15)

    if (error) {
      console.error('Supabase error fetching leaderboard:', error)
      return []
    }

    console.log('Leaderboard fetched:', data);
    return data || []
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return []
  }
}

export const checkIfScoreQualifies = async (distance: number): Promise<boolean> => {
  try {
    console.log('Checking if score qualifies:', Math.floor(distance));
    
    const { data, error } = await supabase
      .from('leaderboard')
      .select('distance')
      .order('distance', { ascending: false })
      .limit(15)

    if (error) {
      console.error('Error checking score qualification:', error)
      return true // Allow submission if we can't check
    }

    // If we have less than 15 scores, always qualify
    if (!data || data.length < 15) {
      console.log('Less than 15 scores, qualifying automatically');
      return true
    }

    // Check if the new score is better than the 15th place
    const lowestScore = data[14]?.distance || 0
    const qualifies = Math.floor(distance) > lowestScore
    console.log('Score qualification check:', { newScore: Math.floor(distance), lowestScore, qualifies });
    return qualifies
  } catch (error) {
    console.error('Error checking score qualification:', error)
    return true // Allow submission if we can't check
  }
}