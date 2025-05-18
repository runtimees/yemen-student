
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';
import { AuthError } from '@supabase/supabase-js';

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
    // Create a proper mock client with functions that return the right types
    // We use 'any' type here to override TypeScript's default behavior for the mock functions
    // @ts-ignore - creating a mock client to prevent crashes
    supabase = {
      from: (table: string) => {
        const filterBuilder = {
          eq: () => filterBuilder,
          neq: () => filterBuilder,
          gt: () => filterBuilder,
          gte: () => filterBuilder,
          lt: () => filterBuilder,
          lte: () => filterBuilder,
          like: () => filterBuilder,
          ilike: () => filterBuilder,
          in: () => filterBuilder,
          is: () => filterBuilder,
          // Add other required methods
          select: () => filterBuilder,
          order: () => filterBuilder,
          limit: () => filterBuilder,
          single: () => Promise.resolve({ data: null, error: { message: 'No valid Supabase connection' } }),
          then: () => Promise.resolve({ data: null, error: { message: 'No valid Supabase connection' } })
        };
        
        return {
          select: () => filterBuilder,
          insert: () => Promise.resolve({ data: null, error: { name: 'Error', message: 'No valid Supabase connection' } }),
          update: () => Promise.resolve({ data: null, error: { name: 'Error', message: 'No valid Supabase connection' } }),
          delete: () => Promise.resolve({ data: null, error: { name: 'Error', message: 'No valid Supabase connection' } }),
        };
      },
      auth: {
        signInWithPassword: () => {
          const authError = new AuthError('No valid Supabase connection', 'not_connected');
          return Promise.resolve({ 
            data: { user: null, session: null }, 
            error: authError
          });
        },
        signUp: () => {
          const authError = new AuthError('No valid Supabase connection', 'not_connected');
          return Promise.resolve({ 
            data: { user: null, session: null }, 
            error: authError
          });
        },
        signOut: () => Promise.resolve({ error: null }),
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { id: '0', callback: () => {}, unsubscribe: () => {} } } }),
      },
      storage: {
        from: () => ({
          upload: () => Promise.resolve({ data: null, error: { name: 'StorageError', message: 'No valid Supabase connection' } }),
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
    from: (table: string) => {
      const filterBuilder = {
        eq: () => filterBuilder,
        neq: () => filterBuilder,
        gt: () => filterBuilder,
        gte: () => filterBuilder,
        lt: () => filterBuilder,
        lte: () => filterBuilder,
        like: () => filterBuilder,
        ilike: () => filterBuilder,
        is: () => filterBuilder,
        in: () => filterBuilder,
        // Add other required methods
        select: () => filterBuilder,
        order: () => filterBuilder,
        limit: () => filterBuilder,
        single: () => Promise.resolve({ data: null, error: { message: 'Supabase initialization failed' } }),
        then: () => Promise.resolve({ data: null, error: { message: 'Supabase initialization failed' } })
      };
      
      return {
        select: () => filterBuilder,
      };
    },
    auth: {
      signInWithPassword: () => {
        const authError = new AuthError('Supabase initialization failed', 'init_failed');
        return Promise.resolve({ 
          data: { user: null, session: null }, 
          error: authError
        });
      },
      signOut: () => Promise.resolve({ error: null }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { id: '0', callback: () => {}, unsubscribe: () => {} } } }),
    },
  };
}

export { supabase };
