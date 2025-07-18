
import { supabase } from '@/integrations/supabase/client';
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
      id: data.id, // Keep as string (UUID)
      full_name_ar: data.full_name_ar,
      full_name_en: data.full_name_en,
      email: data.email,
      password_hash: '',
      phone_number: data.phone_number || undefined,
      role: data.role as 'student' | 'admin', // Proper type casting
      profile_picture_url: data.profile_picture_url || undefined,
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
        profile_picture_url: userData.profile_picture_url,
      })
      .select()
      .single();
    
    if (error || !data) {
      console.error("Error creating user profile:", error);
      return null;
    }
    
    return {
      id: data.id, // Keep as string (UUID)
      full_name_ar: data.full_name_ar,
      full_name_en: data.full_name_en,
      email: data.email,
      password_hash: '',
      phone_number: data.phone_number || undefined,
      role: data.role as 'student' | 'admin', // Proper type casting
      profile_picture_url: data.profile_picture_url || undefined,
      created_at: data.created_at
    };
  },
  
  // Request operations
  getRequestsByUserId: async (userId: string): Promise<Request[]> => {
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .eq('user_id', userId);
    
    if (error || !data) {
      console.error("Error fetching requests:", error);
      return [];
    }
    
    return data.map(item => ({
      id: item.id, // Keep as string (UUID)
      user_id: item.user_id, // Keep as string (UUID)
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
      id: data.id, // Keep as string (UUID)
      user_id: data.user_id, // Keep as string (UUID)
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
        user_id: requestData.user_id, // Keep as string (UUID)
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
      id: data.id, // Keep as string (UUID)
      user_id: data.user_id, // Keep as string (UUID)
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
  getFilesByRequestId: async (requestId: string): Promise<UploadedFile[]> => {
    const { data, error } = await supabase
      .from('files')
      .select('*')
      .eq('request_id', requestId);
    
    if (error || !data) {
      console.error("Error fetching files:", error);
      return [];
    }
    
    return data.map(item => ({
      id: item.id, // Keep as string (UUID)
      request_id: item.request_id, // Keep as string (UUID)
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
        request_id: fileData.request_id, // Keep as string (UUID)
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
      id: data.id, // Keep as string (UUID)
      request_id: data.request_id, // Keep as string (UUID)
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
      id: item.id, // Keep as string since it's a UUID
      title: item.title,
      content: item.content,
      is_active: item.is_active,
      created_at: item.created_at,
      image_url: item.image_url
    }));
  },
  
  getNews: async (): Promise<NewsItem[]> => {
    // Mock data for now - replace with actual API call
    const mockNews = [
      {
        id: "1",
        title: "مرحباً بكم في منصة الطلبة اليمنيين",
        content: "نحن سعداء لخدمتكم وتقديم أفضل الخدمات للطلبة اليمنيين في العراق",
        is_active: true,
        created_at: new Date().toISOString(),
        image_url: null
      },
      {
        id: "2", 
        title: "خدمة توثيق الشهادات متاحة الآن",
        content: "يمكنكم الآن طلب خدمة توثيق الشهادات إلكترونياً من خلال المنصة",
        is_active: true,
        created_at: new Date().toISOString(),
        image_url: null
      },
      {
        id: "3",
        title: "تحديث مهم: ساعات العمل الجديدة",
        content: "تم تحديث ساعات العمل لتكون من الساعة 8 صباحاً حتى 4 عصراً",
        is_active: true,
        created_at: new Date().toISOString(),
        image_url: null
      }
    ];

    return mockNews;
  }
};

export default databaseService;
