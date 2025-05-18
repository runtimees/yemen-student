
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Using the values from Supabase integration
const supabaseUrl = "https://bidnqcafzochmwrevwhp.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpZG5xY2Fmem9jaG13cmV2d2hwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0Mjc1OTksImV4cCI6MjA2MzAwMzU5OX0.WRjlnipWyvWOEGPG_ywy_GbHOlJ_IIN3Z-JX0XjXXio";

// Initialize the Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Log information about the Supabase configuration
console.log('Supabase client initialized with URL:', supabaseUrl);
