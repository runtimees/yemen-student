
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

const supabaseUrl = "https://kowibkflehnvmhhdxhpu.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtvd2lia2ZsZWhudm1oaGR4aHB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2Njg5MDIsImV4cCI6MjA2MzI0NDkwMn0.XeLIehR-KeG-V1b-G2R4A5-ysOKneOE34jxb_0zXGHw";

// Initialize the Supabase client with proper configuration for auth persistence
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: localStorage,
    detectSessionInUrl: true,
    flowType: 'implicit'
  }
});

// Log information about the Supabase configuration
console.log('Supabase client initialized with URL:', supabaseUrl);
