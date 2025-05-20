
import { supabase } from '@/lib/supabase';

export const createStorageBucketIfNotExists = async () => {
  try {
    // Check if the bucket already exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error checking storage buckets:', listError);
      return false;
    }
    
    // Check if our files bucket exists
    const filesBucketExists = buckets?.some(bucket => bucket.name === 'files');
    
    if (filesBucketExists) {
      console.log('Files storage bucket already exists');
      return true;
    }
    
    // Create the bucket if it doesn't exist
    const { error: createError } = await supabase.storage.createBucket('files', {
      public: true,
      fileSizeLimit: 10485760, // 10MB
    });
    
    if (createError) {
      console.error('Error creating files storage bucket:', createError);
      
      // Check if the error is related to permissions and handle it
      if (createError.message.includes('new row violates row-level security policy')) {
        console.warn('Permission issue with bucket creation. This typically requires admin action in Supabase.');
        return false;
      }
      
      return false;
    }
    
    console.log('Created files storage bucket successfully');
    return true;
  } catch (error) {
    console.error('Unexpected error creating storage bucket:', error);
    return false;
  }
};
