
import { createContext, useContext, ReactNode } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { User } from '@/types/database';
import { 
  loginUser,
  signupUser,
  logoutUser,
  sendEmailNotification
} from '@/services/authService';
import { useAuthState } from '@/hooks/useAuthState';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user, setUser } = useAuthState();
  const { toast } = useToast();

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log('Login requested for:', email);
    const result = await loginUser(email, password);
    
    if (result.success && result.userProfile) {
      console.log('Login successful, setting user state');
      setUser(result.userProfile);
      
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: `مرحباً بك ${result.userProfile.full_name_ar} في منصة الطلبة اليمنيين`,
      });
      
      return true;
    } else {
      console.error('Login failed:', result.error);
      toast({
        title: "فشل تسجيل الدخول",
        description: result.error || "حدث خطأ غير معروف",
        variant: "destructive",
      });
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    console.log('Signup requested for:', email);
    const result = await signupUser(name, email, password);
    
    if (result.success && result.userProfile) {
      console.log('Signup successful, setting user state');
      setUser(result.userProfile);
      
      toast({
        title: "تم إنشاء الحساب بنجاح",
        description: "مرحباً بك في منصة الطلبة اليمنيين",
      });
      
      return true;
    } else {
      console.error('Signup failed:', result.error);
      toast({
        title: "فشل إنشاء الحساب",
        description: result.error || "حدث خطأ غير معروف",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = async () => {
    console.log('Logout requested');
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
      console.log('Logout successful, clearing user state');
      setUser(null);
      toast({
        title: "تم تسجيل الخروج",
        description: "نتمنى رؤيتك مجددا قريباً",
      });
    } else {
      console.error('Logout failed:', result.error);
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
