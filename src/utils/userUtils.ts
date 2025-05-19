
import { supabase } from '@/lib/supabase';

// Create user profile if it doesn't exist in the database
export const createUserProfileIfNotExists = async (email: string, name: string): Promise<boolean> => {
  try {
    console.log('Creating user profile if not exists:', { email, name });
    
    // Check if user already exists in the users table
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking for existing user:', checkError);
      return false;
    }
    
    // If user already exists, no need to create
    if (existingUser) {
      console.log('User profile already exists:', existingUser);
      return true;
    }
    
    console.log('No existing user found, creating new profile');
    
    // Get the user ID from auth.users
    const { data: authData } = await supabase.auth.getUser();
    const userId = authData?.user?.id;
    
    if (!userId) {
      console.error('Cannot create user profile: No authenticated user ID found');
      return false;
    }
    
    console.log('Got user ID for profile creation:', userId);
    
    // Create new user profile with the correct ID
    const { error: insertError } = await supabase
      .from('users')
      .insert({
        id: userId,
        email: email,
        full_name_ar: name,
        full_name_en: name,
        role: 'student'
      });
    
    if (insertError) {
      console.error('Error creating user profile:', insertError);
      return false;
    }
    
    console.log('Created new user profile successfully');
    return true;
  } catch (error) {
    console.error('Unexpected error creating user profile:', error);
    return false;
  }
};
