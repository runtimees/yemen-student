
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { toast as sonnerToast } from '@/components/ui/sonner';
import { User } from '@/types/database';
import { supabase } from '@/lib/supabase';
import { databaseService } from '@/services/databaseService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in from Supabase session
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        // Fetch user profile from our users table
        const userProfile = await databaseService.getUserByEmail(data.session.user.email || '');
        if (userProfile) {
          setUser(userProfile);
          toast({
            title: "مرحباً بعودتك!",
            description: "تم تسجيل دخولك تلقائياً",
          });
        }
      }
    };
    
    checkSession();
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const userProfile = await databaseService.getUserByEmail(session.user.email || '');
        if (userProfile) {
          setUser(userProfile);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  // Function to send an email notification using Supabase Edge Functions
  const sendEmailNotification = async (email: string, subject: string, message: string) => {
    try {
      // In a real app, you would call a Supabase Edge Function to send emails
      // For now, we'll just show a toast and log to console
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

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Use Supabase Auth for login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error || !data.user) {
        toast({
          title: "فشل تسجيل الدخول",
          description: error?.message || "البريد الإلكتروني أو كلمة المرور غير صحيحة",
          variant: "destructive",
        });
        return false;
      }
      
      // Fetch full user profile from our users table
      const userProfile = await databaseService.getUserByEmail(data.user.email || '');
      if (userProfile) {
        setUser(userProfile);
        
        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: `مرحباً بك ${userProfile.full_name_ar} في منصة الطلبة اليمنيين`,
        });
        
        // Send email notification for login
        sendEmailNotification(
          userProfile.email,
          "تسجيل دخول جديد - منصة الطلبة اليمنيين",
          `مرحباً ${userProfile.full_name_ar},\n\nتم تسجيل دخول جديد إلى حسابك في منصة الطلبة اليمنيين.\nإذا لم تكن أنت من قام بهذا الإجراء، يرجى الاتصال بالدعم الفني فوراً.\n\nمع تحيات فريق منصة الطلبة اليمنيين`
        );
        
        return true;
      } else {
        // This would be rare - auth success but no profile
        toast({
          title: "خطأ في الملف الشخصي",
          description: "تم تسجيل الدخول ولكن لم يتم العثور على الملف الشخصي",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء محاولة تسجيل الدخول",
        variant: "destructive",
      });
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      // Check if user already exists
      const existingUser = await databaseService.getUserByEmail(email);
      
      if (existingUser) {
        toast({
          title: "البريد الإلكتروني مستخدم",
          description: "هذا البريد الإلكتروني مسجل مسبقاً",
          variant: "destructive",
        });
        return false;
      }
      
      if (name && email && password) {
        const newUser = await databaseService.createUser({
          full_name_ar: name,
          full_name_en: name,
          email,
          password_hash: password,
          role: 'student',
        });
        
        if (newUser) {
          setUser(newUser);
          
          toast({
            title: "تم إنشاء الحساب بنجاح",
            description: "مرحباً بك في منصة الطلبة اليمنيين",
          });
          
          // Send email notification for account creation
          sendEmailNotification(
            newUser.email,
            "مرحباً بك في منصة الطلبة اليمنيين",
            `مرحباً ${newUser.full_name_ar},\n\nشكراً لإنشاء حساب في منصة الطلبة اليمنيين. نحن سعداء بانضمامك إلينا.\n\nمع تحيات فريق منصة الطلبة اليمنيين`
          );
          
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء محاولة إنشاء الحساب",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = async () => {
    try {
      // Send email notification for logout if user exists
      if (user) {
        sendEmailNotification(
          user.email,
          "تسجيل خروج - منصة الطلبة اليمنيين",
          `مرحباً ${user.full_name_ar},\n\nتم تسجيل الخروج من حسابك في منصة الطلبة اليمنيين.\n\nمع تحيات فريق منصة الطلبة اليمنيين`
        );
      }
      
      // Sign out from Supabase Auth
      await supabase.auth.signOut();
      
      setUser(null);
      toast({
        title: "تم تسجيل الخروج",
        description: "نتمنى رؤيتك مجددا قريباً",
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء محاولة تسجيل الخروج",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      login, 
      signup, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
