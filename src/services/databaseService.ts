
import { supabase } from '@/lib/supabase';
import { User, Request, UploadedFile, NewsItem } from '@/types/database';

export const databaseService = {
  // User operations
  getUserByEmail: async (email: string): Promise<User | null> => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
      
    if (error || !data) {
      console.error("Error fetching user:", error);
      return null;
    }
    
    return {
      id: parseInt(data.id),
      full_name_ar: data.full_name_ar,
      full_name_en: data.full_name_en,
      email: data.email,
      password_hash: '', // No longer store password hash in client
      phone_number: data.phone_number || undefined,
      role: data.role,
      created_at: data.created_at
    };
  },
  
  createUser: async (userData: Omit<User, 'id' | 'created_at'>): Promise<User | null> => {
    // For Supabase Auth, we'll use their built-in auth service
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password_hash,
      options: {
        data: {
          full_name_ar: userData.full_name_ar,
          full_name_en: userData.full_name_en,
          role: userData.role
        }
      }
    });
    
    if (authError || !authData.user) {
      console.error("Error creating auth user:", authError);
      return null;
    }
    
    // Now create the user profile in our users table
    const { data, error } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        full_name_ar: userData.full_name_ar,
        full_name_en: userData.full_name_en,
        email: userData.email,
        phone_number: userData.phone_number,
        role: userData.role,
      })
      .select()
      .single();
    
    if (error || !data) {
      console.error("Error creating user profile:", error);
      return null;
    }
    
    return {
      id: parseInt(data.id),
      full_name_ar: data.full_name_ar,
      full_name_en: data.full_name_en,
      email: data.email,
      password_hash: '',
      phone_number: data.phone_number || undefined,
      role: data.role,
      created_at: data.created_at
    };
  },

  // Request operations
  getRequestsByUserId: async (userId: number): Promise<Request[]> => {
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .eq('user_id', userId.toString());
    
    if (error || !data) {
      console.error("Error fetching requests:", error);
      return [];
    }
    
    return data.map(item => ({
      id: parseInt(item.id),
      user_id: parseInt(item.user_id),
      service_type: item.service_type as any,
      status: item.status as any,
      request_number: item.request_number,
      submission_date: item.submission_date,
      university_name: item.university_name || undefined,
      major: item.major || undefined,
      additional_notes: item.additional_notes || undefined,
      created_at: item.created_at
    }));
  },
  
  getRequestByNumber: async (requestNumber: string): Promise<Request | null> => {
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .eq('request_number', requestNumber)
      .single();
    
    if (error || !data) {
      console.error("Error fetching request:", error);
      return null;
    }
    
    return {
      id: parseInt(data.id),
      user_id: parseInt(data.user_id),
      service_type: data.service_type as any,
      status: data.status as any,
      request_number: data.request_number,
      submission_date: data.submission_date,
      university_name: data.university_name || undefined,
      major: data.major || undefined,
      additional_notes: data.additional_notes || undefined,
      created_at: data.created_at
    };
  },
  
  createRequest: async (requestData: Omit<Request, 'id' | 'created_at'>): Promise<Request | null> => {
    // Generate a unique request number
    const requestNumber = `REQ-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    
    const { data, error } = await supabase
      .from('requests')
      .insert({
        user_id: requestData.user_id.toString(),
        service_type: requestData.service_type,
        status: requestData.status,
        request_number: requestNumber,
        submission_date: requestData.submission_date,
        university_name: requestData.university_name,
        major: requestData.major,
        additional_notes: requestData.additional_notes
      })
      .select()
      .single();
    
    if (error || !data) {
      console.error("Error creating request:", error);
      return null;
    }
    
    return {
      id: parseInt(data.id),
      user_id: parseInt(data.user_id),
      service_type: data.service_type as any,
      status: data.status as any,
      request_number: data.request_number,
      submission_date: data.submission_date,
      university_name: data.university_name || undefined,
      major: data.major || undefined,
      additional_notes: data.additional_notes || undefined,
      created_at: data.created_at
    };
  },

  // File operations
  getFilesByRequestId: async (requestId: number): Promise<UploadedFile[]> => {
    const { data, error } = await supabase
      .from('files')
      .select('*')
      .eq('request_id', requestId.toString());
    
    if (error || !data) {
      console.error("Error fetching files:", error);
      return [];
    }
    
    return data.map(item => ({
      id: parseInt(item.id),
      request_id: parseInt(item.request_id),
      file_type: item.file_type as any,
      file_path: item.file_path,
      uploaded_at: item.uploaded_at
    }));
  },
  
  uploadFile: async (fileData: Omit<UploadedFile, 'id' | 'uploaded_at'>, file: File): Promise<UploadedFile | null> => {
    // First upload the file to Supabase Storage
    const filePath = `uploads/${fileData.request_id}/${fileData.file_type}/${file.name}`;
    const { data: storageData, error: storageError } = await supabase.storage
      .from('files')
      .upload(filePath, file);
    
    if (storageError || !storageData) {
      console.error("Error uploading file to storage:", storageError);
      return null;
    }
    
    // Get the public URL for the file
    const { data: publicUrlData } = supabase.storage
      .from('files')
      .getPublicUrl(filePath);
    
    const publicUrl = publicUrlData.publicUrl;
    
    // Now save the file metadata to the database
    const { data, error } = await supabase
      .from('files')
      .insert({
        request_id: fileData.request_id.toString(),
        file_type: fileData.file_type,
        file_path: publicUrl
      })
      .select()
      .single();
    
    if (error || !data) {
      console.error("Error saving file metadata:", error);
      return null;
    }
    
    return {
      id: parseInt(data.id),
      request_id: parseInt(data.request_id),
      file_type: data.file_type as any,
      file_path: data.file_path,
      uploaded_at: data.uploaded_at
    };
  },

  // News operations
  getActiveNews: async (): Promise<NewsItem[]> => {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (error || !data) {
      console.error("Error fetching news:", error);
      return [];
    }
    
    return data.map(item => ({
      id: parseInt(item.id),
      title: item.title,
      content: item.content,
      is_active: item.is_active,
      created_at: item.created_at
    }));
  }
};

export default databaseService;
