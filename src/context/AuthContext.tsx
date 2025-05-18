
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { User } from '@/types/database';
import { supabase } from '@/lib/supabase';
import { 
  fetchUserProfile,
  loginUser,
  signupUser,
  logoutUser,
  sendEmailNotification
} from '@/services/authService';

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
    // Set up auth state listener FIRST to avoid missing auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (event === 'SIGNED_IN' && session?.user) {
        // Don't call supabase functions directly in the callback to avoid deadlocks
        // Use setTimeout to defer the call to the next event loop
        setTimeout(async () => {
          const userProfile = await fetchUserProfile(session.user.email || '');
          if (userProfile) {
            setUser(userProfile);
            toast({
              title: "تم تسجيل الدخول",
              description: `مرحباً بك ${userProfile.full_name_ar} في منصة الطلبة اليمنيين`,
            });
          }
        }, 0);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });
    
    // THEN check for existing session
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        const userProfile = await fetchUserProfile(data.session.user.email || '');
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
    
    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  const login = async (email: string, password: string): Promise<boolean> => {
    const result = await loginUser(email, password);
    
    if (result.success && result.userProfile) {
      setUser(result.userProfile);
      
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: `مرحباً بك ${result.userProfile.full_name_ar} في منصة الطلبة اليمنيين`,
      });
      
      return true;
    } else {
      toast({
        title: "فشل تسجيل الدخول",
        description: result.error || "حدث خطأ غير معروف",
        variant: "destructive",
      });
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    const result = await signupUser(name, email, password);
    
    if (result.success && result.userProfile) {
      setUser(result.userProfile);
      
      toast({
        title: "تم إنشاء الحساب بنجاح",
        description: "مرحباً بك في منصة الطلبة اليمنيين",
      });
      
      return true;
    } else {
      toast({
        title: "فشل إنشاء الحساب",
        description: result.error || "حدث خطأ غير معروف",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = async () => {
    // Send email notification for logout if user exists
    if (user) {
      sendEmailNotification(
        user.email,
        "تسجيل خروج - منصة الطلبة اليمنيين",
        `مرحباً ${user.full_name_ar},\n\nتم تسجيل الخروج من حسابك في منصة الطلبة اليمنيين.\n\nمع تحيات فريق منصة الطلبة اليمنيين`
      );
    }
    
    const result = await logoutUser();
    
    if (result.success) {
      setUser(null);
      toast({
        title: "تم تسجيل الخروج",
        description: "نتمنى رؤيتك مجددا قريباً",
      });
    } else {
      toast({
        title: "خطأ",
        description: result.error || "حدث خطأ أثناء محاولة تسجيل الخروج",
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
