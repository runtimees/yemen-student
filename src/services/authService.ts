
import { supabase } from '@/lib/supabase';
import { User } from '@/types/database';
import { toast as sonnerToast } from '@/components/ui/sonner';

// Function to fetch user profile from database
export const fetchUserProfile = async (email: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Exception fetching user profile:', error);
    return null;
  }
};

// Function to send an email notification
export const sendEmailNotification = async (email: string, subject: string, message: string) => {
  try {
    // In a real app, you would call a Supabase Edge Function to send emails
    console.log(`Email notification to be sent to ${email}`);
    console.log(`Subject: ${subject}`);
    console.log(`Message: ${message}`);
    
    // Show a toast to simulate email notification in the demo
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
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error || !data.user) {
      return { 
        success: false, 
        userProfile: null, 
        error: error?.message || "البريد الإلكتروني أو كلمة المرور غير صحيحة" 
      };
    }
    
    // Fetch full user profile from our users table
    const userProfile = await fetchUserProfile(data.user.email || '');
    if (!userProfile) {
      return { 
        success: false, 
        userProfile: null, 
        error: "تم تسجيل الدخول ولكن لم يتم العثور على الملف الشخصي" 
      };
    }
    
    // Send email notification for login
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

export const signupUser = async (name: string, email: string, password: string): Promise<{
  success: boolean;
  userProfile: User | null;
  error?: string;
}> => {
  try {
    console.log("Starting signup process", { name, email });
    
    // First, check if the user already exists in database
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (existingUser) {
      return { 
        success: false, 
        userProfile: null, 
        error: "هذا البريد الإلكتروني مسجل مسبقاً" 
      };
    }
    
    // Create the user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name
        }
      }
    });
    
    if (error) {
      console.error("Supabase Auth signup error:", error);
      return { 
        success: false, 
        userProfile: null, 
        error: error.message || "حدث خطأ أثناء إنشاء الحساب" 
      };
    }
    
    console.log("Auth signup successful, creating user profile");
    
    // Create user profile in our users table
    const { error: insertError } = await supabase
      .from('users')
      .insert({
        full_name_ar: name,
        full_name_en: name,
        email: email,
        role: 'student'
      });
    
    if (insertError) {
      console.error("Error creating user profile:", insertError);
      return { 
        success: false, 
        userProfile: null, 
        error: "تم إنشاء الحساب ولكن فشل إنشاء الملف الشخصي" 
      };
    }
    
    // Fetch the newly created user profile
    const userProfile = await fetchUserProfile(email);
    if (!userProfile) {
      return { 
        success: false, 
        userProfile: null, 
        error: "فشل في استرجاع ملف المستخدم بعد التسجيل" 
      };
    }
    
    // Send email notification for account creation
    sendEmailNotification(
      email,
      "مرحباً بك في منصة الطلبة اليمنيين",
      `مرحباً ${name},\n\nشكراً لإنشاء حساب في منصة الطلبة اليمنيين. نحن سعداء بانضمامك إلينا.\n\nمع تحيات فريق منصة الطلبة اليمنيين`
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
    await supabase.auth.signOut();
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    return { 
      success: false, 
      error: "حدث خطأ أثناء محاولة تسجيل الخروج" 
    };
  }
};
