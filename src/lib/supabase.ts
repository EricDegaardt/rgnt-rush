import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface LeaderboardEntry {
  id: string;
  username: string;
  email?: string;
  distance: number;
  selected_bike: string;
  marketing_consent?: boolean;
  created_at: string;
}

// Local storage utilities for user data
export const USER_DATA_KEY = 'rgnt_rush_user_data';

export interface UserData {
  username: string;
  email: string;
  marketingConsent: boolean;
}

export const saveUserDataLocally = (userData: UserData) => {
  try {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
  } catch (error) {
    console.warn('Failed to save user data to localStorage:', error);
  }
};

export const getUserDataFromStorage = (): Partial<UserData> => {
  try {
    const stored = localStorage.getItem(USER_DATA_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Failed to load user data from localStorage:', error);
  }
  return {};
};

// Check if email already exists in database
export const checkEmailExists = async (email: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('scoreboard')
      .select('id')
      .eq('email', email.trim())
      .limit(1);
    
    if (error) {
      console.warn('Error checking email existence:', error);
      return false;
    }
    
    return data && data.length > 0;
  } catch (error) {
    console.warn('Error checking email existence:', error);
    return false;
  }
};