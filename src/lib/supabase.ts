
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

const supabaseUrl = "https://xueziitmykcjdmybfckc.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1ZXppaXRteWtjamRteWJmY2tjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyMDUzMjEsImV4cCI6MjA2Njc4MTMyMX0.q12sDpIMhywcHqT-kxjHSJ79wKJ9vgH16yS2XKO3IxQ";

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
