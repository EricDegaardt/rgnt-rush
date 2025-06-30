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

// Session storage utilities for temporary user data (clears when browser/tab closes)
export const SESSION_USERNAME_KEY = 'rgnt_rush_session_username';
export const USER_DATA_KEY = 'rgnt_rush_user_data';

export interface UserData {
  username: string;
  email: string;
  marketingConsent: boolean;
}

// Save username only for current session (clears when browser closes)
export const saveSessionUsername = (username: string) => {
  try {
    sessionStorage.setItem(SESSION_USERNAME_KEY, username);
  } catch (error) {
    console.warn('Failed to save session username:', error);
  }
};

// Get username from current session only
export const getSessionUsername = (): string => {
  try {
    return sessionStorage.getItem(SESSION_USERNAME_KEY) || '';
  } catch (error) {
    console.warn('Failed to load session username:', error);
    return '';
  }
};

// Clear session username (called when user wants to start fresh)
export const clearSessionUsername = () => {
  try {
    sessionStorage.removeItem(SESSION_USERNAME_KEY);
  } catch (error) {
    console.warn('Failed to clear session username:', error);
  }
};

// Save user data locally for email subscription persistence only
export const saveUserDataLocally = (userData: UserData) => {
  try {
    // Only save email and marketing consent, not username
    const persistentData = {
      email: userData.email,
      marketingConsent: userData.marketingConsent
    };
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(persistentData));
  } catch (error) {
    console.warn('Failed to save user data to localStorage:', error);
  }
};

export const getUserDataFromStorage = (): Partial<UserData> => {
  try {
    const stored = localStorage.getItem(USER_DATA_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      // Always get username from session, not persistent storage
      return {
        username: getSessionUsername(),
        email: data.email || '',
        marketingConsent: data.marketingConsent || false
      };
    }
  } catch (error) {
    console.warn('Failed to load user data from localStorage:', error);
  }
  return {
    username: getSessionUsername()
  };
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