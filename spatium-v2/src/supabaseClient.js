import { createClient } from '@supabase/supabase-js'

// Replace these with your actual Supabase project credentials
// You can find these in your Supabase Dashboard:
// 1. Go to https://supabase.com/dashboard
// 2. Select your project
// 3. Go to Settings > API
// 4. Copy the "Project URL" and "anon/public" key

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_PROJECT_URL'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Configure auth settings
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    // Storage adapter for persisting auth state
    storage: window.localStorage
  }
})

// Export auth helpers for convenience
export const auth = supabase.auth

// Helper functions for common auth operations
export const authHelpers = {
  // Sign up new user
  signUp: async (email, password, metadata = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      })
      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Sign in existing user
  signIn: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Sign out current user
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut()
      return { error }
    } catch (error) {
      return { error }
    }
  },

  // Get current session
  getSession: async () => {
    try {
      const { data, error } = await supabase.auth.getSession()
      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Get current user
  getUser: async () => {
    try {
      const { data, error } = await supabase.auth.getUser()
      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }
}

export default supabase
