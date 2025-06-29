
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/database';
import { toast as sonnerToast } from 'sonner';

// Function to fetch user profile from database
export const fetchUserProfile = async (email: string): Promise<User | null> => {
  try {
    console.log('Fetching user profile for email:', email);
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
    
    console.log('User profile fetched successfully:', data);
    return data;
  } catch (error) {
    console.error('Exception fetching user profile:', error);
    return null;
  }
};

// Function to create user profile if it doesn't exist
export const createUserProfileIfNotExists = async (email: string, name: string, role: 'student' | 'admin' = 'student'): Promise<boolean> => {
  try {
    console.log('Creating user profile if not exists for email:', email);
    
    // Check if profile already exists
    const existingProfile = await fetchUserProfile(email);
    if (existingProfile) {
      console.log('User profile already exists, skipping creation');
      return true;
    }

    console.log('No existing profile found, creating new profile with:', { email, name, role });

    // Create profile
    const { error } = await supabase
      .from('users')
      .insert({
        full_name_ar: name,
        full_name_en: name,
        email: email,
        role: role
      });
    
    if (error) {
      console.error('Error creating user profile:', error);
      return false;
    }
    
    console.log('User profile created successfully');
    return true;
  } catch (error) {
    console.error('Exception creating user profile:', error);
    return false;
  }
};

// Function to send an email notification
export const sendEmailNotification = async (email: string, subject: string, message: string) => {
  try {
    console.log(`Email notification to be sent to ${email}`);
    console.log(`Subject: ${subject}`);
    console.log(`Message: ${message}`);
    
    sonnerToast("تم إرسال إشعار", {
      description: `تم إرسال إشعار بتسجيل الدخول إلى ${email}`,
      action: {
        label: "عرض",
        onClick: () => console.log("View email notification"),
      },
    });
  } catch (error) {
    console.error("Error sending email notification:", error);
  }
};

// Auth service functions
export const loginUser = async (email: string, password: string): Promise<{
  success: boolean;
  userProfile: User | null;
  error?: string;
}> => {
  try {
    console.log('Attempting login for email:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error || !data.user) {
      console.error('Login error:', error);
      return { 
        success: false, 
        userProfile: null, 
        error: error?.message || "البريد الإلكتروني أو كلمة المرور غير صحيحة" 
      };
    }
    
    console.log('Login successful, fetching user profile');
    
    // Fetch full user profile from our users table
    let userProfile = await fetchUserProfile(data.user.email || '');
    
    // If profile doesn't exist in users table but auth was successful, create it
    if (!userProfile) {
      console.log('User authenticated but profile not found, creating profile');
      const fullName = data.user?.user_metadata?.full_name || data.user?.user_metadata?.full_name_ar || '';
      const createSuccess = await createUserProfileIfNotExists(data.user.email || '', fullName);
      
      if (createSuccess) {
        userProfile = await fetchUserProfile(data.user.email || '');
      }
      
      if (!userProfile) {
        console.error('Failed to create or retrieve user profile after login');
        return { 
          success: false, 
          userProfile: null, 
          error: "تم تسجيل الدخول ولكن لم يتم العثور على الملف الشخصي" 
        };
      }
    }
    
    console.log('Login and profile fetching complete');
    
    sendEmailNotification(
      userProfile.email,
      "تسجيل دخول جديد - منصة الطلبة اليمنيين",
      `مرحباً ${userProfile.full_name_ar},\n\nتم تسجيل دخول جديد إلى حسابك في منصة الطلبة اليمنيين.\nإذا لم تكن أنت من قام بهذا الإجراء، يرجى الاتصال بالدعم الفني فوراً.\n\nمع تحيات فريق منصة الطلبة اليمنيين`
    );
    
    return { success: true, userProfile };
  } catch (error) {
    console.error("Login error:", error);
    return { 
      success: false, 
      userProfile: null, 
      error: "حدث خطأ أثناء محاولة تسجيل الدخول" 
    };
  }
};

export const signupUser = async (
  nameAr: string, 
  email: string, 
  password: string,
  nameEn: string = '',
  phoneNumber: string = '',
  residenceStatus: string = ''
): Promise<{
  success: boolean;
  userProfile: User | null;
  error?: string;
}> => {
  try {
    console.log("Starting signup process", { nameAr, nameEn, email, phoneNumber, residenceStatus });
    
    // First, check if the user already exists in database
    const existingProfile = await fetchUserProfile(email);
    if (existingProfile) {
      console.error('User profile already exists in database');
      return { 
        success: false, 
        userProfile: null, 
        error: "هذا البريد الإلكتروني مسجل مسبقاً" 
      };
    }
    
    // Create the user in Supabase Auth with additional metadata
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          full_name_ar: nameAr,
          full_name_en: nameEn || nameAr,
          full_name: nameAr,
          name: nameAr,
          phone_number: phoneNumber,
          residence_status: residenceStatus
        }
      }
    });
    
    if (error || !data.user) {
      console.error("Supabase Auth signup error:", error);
      return { 
        success: false, 
        userProfile: null, 
        error: error?.message || "حدث خطأ أثناء إنشاء الحساب" 
      };
    }
    
    console.log("Auth signup successful, creating user profile");
    
    // Wait a moment for the trigger to potentially create the profile
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create user profile manually if trigger didn't work
    const createSuccess = await createUserProfileIfNotExists(email, nameAr);
    if (!createSuccess) {
      console.error("Failed to create user profile");
      return { 
        success: false, 
        userProfile: null, 
        error: "فشل في إنشاء ملف المستخدم" 
      };
    }
    
    // Fetch the newly created user profile
    const userProfile = await fetchUserProfile(email);
    if (!userProfile) {
      console.error("Created auth user but failed to retrieve profile");
      return { 
        success: false, 
        userProfile: null, 
        error: "فشل في استرجاع ملف المستخدم بعد التسجيل" 
      };
    }
    
    console.log("Signup and profile creation successful");
    
    sendEmailNotification(
      email,
      "مرحباً بك في منصة الطلبة اليمنيين",
      `مرحباً ${nameAr},\n\nشكراً لإنشاء حساب في منصة الطلبة اليمنيين. نحن سعداء بانضمامك إلينا.\n\nمع تحيات فريق منصة الطلبة اليمنيين`
    );
    
    return { success: true, userProfile };
  } catch (error) {
    console.error("Signup error:", error);
    return { 
      success: false, 
      userProfile: null, 
      error: "حدث خطأ أثناء محاولة إنشاء الحساب" 
    };
  }
};

export const logoutUser = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log("Logging out user");
    await supabase.auth.signOut();
    console.log("Logout successful");
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    return { 
      success: false, 
      error: "حدث خطأ أثناء محاولة تسجيل الخروج" 
    };
  }
};
