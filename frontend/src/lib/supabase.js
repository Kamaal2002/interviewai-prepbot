import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Check if we're in development and show a warning instead of throwing an error
if (import.meta.env.DEV && (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY)) {
  console.warn('⚠️ Supabase environment variables not found. Please set up your .env file with:');
  console.warn('VITE_SUPABASE_URL=your_supabase_project_url');
  console.warn('VITE_SUPABASE_ANON_KEY=your_supabase_anon_key');
  console.warn('VITE_OPENAI_API_KEY=your_openai_api_key');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helpers
export const auth = {
  // Sign up with email and password
  signUp: async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { data, error };
  },

  // Sign in with email and password
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  // Sign in with Google
  signInWithGoogle: async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    return { data, error };
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Get current user
  getCurrentUser: () => {
    return supabase.auth.getUser();
  },

  // Listen to auth changes
  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback);
  },
};

// Storage helpers
export const storage = {
  // Upload file to storage
  uploadFile: async (bucket, path, file) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file);
    return { data, error };
  },

  // Get public URL for file
  getPublicUrl: (bucket, path) => {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    return data.publicUrl;
  },

  // Delete file from storage
  deleteFile: async (bucket, path) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .remove([path]);
    return { data, error };
  },
};

// Database helpers for storing practice sessions
export const database = {
  // Save practice session
  saveSession: async (sessionData) => {
    const { data, error } = await supabase
      .from('practice_sessions')
      .insert([sessionData])
      .select();
    return { data, error };
  },

  // Get user's practice sessions
  getSessions: async (userId) => {
    const { data, error } = await supabase
      .from('practice_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  // Update session
  updateSession: async (sessionId, updates) => {
    const { data, error } = await supabase
      .from('practice_sessions')
      .update(updates)
      .eq('id', sessionId)
      .select();
    return { data, error };
  },

  // Delete session
  deleteSession: async (sessionId) => {
    const { data, error } = await supabase
      .from('practice_sessions')
      .delete()
      .eq('id', sessionId);
    return { data, error };
  },

  // Get user profile
  getProfile: async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return { data, error };
  },

  // Update user profile
  updateProfile: async (userId, updates) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select();
    return { data, error };
  },

  // Get user progress
  getUserProgress: async (userId) => {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .single();
    return { data, error };
  },

  // Update user progress
  updateUserProgress: async (userId, updates) => {
    const { data, error } = await supabase
      .from('user_progress')
      .update(updates)
      .eq('user_id', userId)
      .select();
    return { data, error };
  },

  // Get user files
  getUserFiles: async (userId) => {
    const { data, error } = await supabase
      .from('user_files')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  // Delete user file
  deleteUserFile: async (fileId) => {
    const { data, error } = await supabase
      .from('user_files')
      .delete()
      .eq('id', fileId);
    return { data, error };
  },
}; 