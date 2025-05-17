
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// These environment variables are automatically populated when using Lovable's Supabase integration
// Default to empty strings to prevent runtime errors, but the client won't work properly without real values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Log information about the Supabase configuration to help with debugging
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anonymous Key is missing. Please make sure you have connected your Lovable project to Supabase.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Check if the client was created successfully
if (!supabase) {
  console.error('Failed to initialize Supabase client');
}
