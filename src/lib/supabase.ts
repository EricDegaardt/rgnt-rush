import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

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
    const { error } = await supabase
      .from('leaderboard')
      .insert([
        {
          username,
          distance: Math.floor(distance),
          selected_bike: selectedBike
        }
      ])

    if (error) {
      console.error('Error saving score:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error saving score:', error)
    return false
  }
}

export const getLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  try {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('*')
      .order('distance', { ascending: false })
      .limit(15)

    if (error) {
      console.error('Error fetching leaderboard:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return []
  }
}

export const checkIfScoreQualifies = async (distance: number): Promise<boolean> => {
  try {
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
      return true
    }

    // Check if the new score is better than the 15th place
    const lowestScore = data[14]?.distance || 0
    return Math.floor(distance) > lowestScore
  } catch (error) {
    console.error('Error checking score qualification:', error)
    return true // Allow submission if we can't check
  }
}