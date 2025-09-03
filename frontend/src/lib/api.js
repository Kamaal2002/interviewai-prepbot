const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Import Supabase client
import { supabase } from './supabase.js';

// File upload and text extraction - Express server only
export const extractTextFromFile = async (file, userId, fileType = 'resume') => {
  const formData = new FormData();
  formData.append('file', file);
  
  // Add additional data if available
  if (userId) formData.append('userId', userId);
  if (fileType) formData.append('fileType', fileType);

  try {
    const response = await fetch(`${API_BASE_URL}/api/extract-text`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('File processing failed:', error);
    throw error;
  }
};

// Generate interview questions - Express server only
export const generateQuestions = async (params) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/generate-questions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Question generation failed:', error);
    throw error;
  }
};

// Save practice session to Supabase using Supabase client
export const savePracticeSession = async (sessionData) => {
  console.log('savePracticeSession: Starting with sessionData:', sessionData);
  
  try {
    console.log('savePracticeSession: Using Supabase client to insert session');
    const { data, error } = await supabase
      .from('practice_sessions')
      .insert([sessionData])
      .select();

    if (error) {
      console.error('savePracticeSession: Supabase error:', error);
      throw new Error(error.message);
    }

    console.log('savePracticeSession: Success response:', data);
    return data[0]; // Return the first (and only) inserted record
  } catch (error) {
    console.error('Failed to save practice session:', error);
    throw error;
  }
};

// Get user's practice sessions from Supabase using Supabase client
export const getUserSessions = async (userId) => {
  console.log('getUserSessions: Starting with userId:', userId);
  
  try {
    console.log('getUserSessions: Using Supabase client to fetch sessions');
    const { data, error } = await supabase
      .from('practice_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('getUserSessions: Supabase error:', error);
      throw new Error(error.message);
    }

    console.log('getUserSessions: Success response:', data);
    return data;
  } catch (error) {
    console.error('Failed to get user sessions:', error);
    throw error;
  }
};

// Update user progress in Supabase using Supabase client
export const updateUserProgress = async (userId, progressData) => {
  try {
    const { data, error } = await supabase
      .from('user_progress')
      .upsert([{ user_id: userId, ...progressData }])
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return data[0];
  } catch (error) {
    console.error('Failed to update user progress:', error);
    throw error;
  }
};

// Question generation with resume and job description
export const generatePersonalizedQuestions = async ({
  resumeText,
  jobDescription,
  questionCount,
  questionTypes,
  difficulty = 'mixed',
  userId
}) => {
  const params = {
    questionCount: parseInt(questionCount),
    questionTypes,
    difficulty,
  };

  if (resumeText) {
    params.resumeText = resumeText;
  }

  if (jobDescription) {
    params.jobDescription = jobDescription;
  }

  if (userId) {
    params.userId = userId;
  }

  return generateQuestions(params);
}; 