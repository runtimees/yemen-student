
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

// Create a dummy client when credentials are missing to prevent crashes
// This allows the app to load, even though Supabase functions won't work
let supabase: ReturnType<typeof createClient<Database>>;

try {
  // The Supabase client requires a valid URL format
  if (supabaseUrl && supabaseUrl.startsWith('http')) {
    supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
    console.log('Supabase client initialized successfully');
  } else {
    // Create a mock client that will log errors instead of crashing
    // @ts-ignore - creating a mock client to prevent crashes
    supabase = {
      from: () => ({
        select: () => ({ data: null, error: { message: 'No valid Supabase connection' } }),
        insert: () => ({ data: null, error: { message: 'No valid Supabase connection' } }),
        update: () => ({ data: null, error: { message: 'No valid Supabase connection' } }),
        delete: () => ({ data: null, error: { message: 'No valid Supabase connection' } }),
      }),
      auth: {
        signInWithPassword: () => Promise.resolve({ 
          data: { user: null, session: null },
          error: { message: 'No valid Supabase connection', code: 'not_connected', status: 0, __isAuthError: true }
        }),
        signUp: () => Promise.resolve({ 
          data: { user: null, session: null },
          error: { message: 'No valid Supabase connection', code: 'not_connected', status: 0, __isAuthError: true }
        }),
        signOut: () => Promise.resolve({ error: null }),
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { id: '0', callback: () => {}, unsubscribe: () => {} } } }),
      },
      storage: {
        from: () => ({
          upload: () => ({ data: null, error: { message: 'No valid Supabase connection' } }),
          getPublicUrl: () => ({ data: { publicUrl: '' } }),
        }),
      },
    };
    console.error('Created mock Supabase client due to missing or invalid URL. Please connect to Supabase to enable full functionality.');
  }
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
  // @ts-ignore - creating an empty mock client as fallback
  supabase = {
    from: () => ({
      select: () => ({ data: null, error: { message: 'Supabase initialization failed' } }),
    }),
    auth: {
      signInWithPassword: () => Promise.resolve({ 
        data: { user: null, session: null },
        error: { message: 'Supabase initialization failed', code: 'init_failed', status: 0, __isAuthError: true }
      }),
      signOut: () => Promise.resolve({ error: null }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { id: '0', callback: () => {}, unsubscribe: () => {} } } }),
    },
  };
}

export { supabase };
