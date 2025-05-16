
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { toast as sonnerToast } from '@/components/ui/sonner';
import { User } from '@/types/database';
import { mockDatabase } from '@/services/mockDatabase';

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
    // Check if user is logged in from local storage on initial load
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      toast({
        title: "مرحباً بعودتك!",
        description: "تم تسجيل دخولك تلقائياً",
      });
    }
  }, []);
  
  // Function to simulate sending an email notification
  const sendEmailNotification = (email: string, subject: string, message: string) => {
    console.log(`Email notification sent to ${email}`);
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
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    // In a real app, you would authenticate against a real database
    const user = mockDatabase.getUserByEmail(email);
    
    if (user) {
      // In production, you'd compare hashed passwords
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: `مرحباً بك ${user.full_name_ar} في منصة الطلبة اليمنيين`,
      });
      
      // Send email notification for login
      sendEmailNotification(
        user.email,
        "تسجيل دخول جديد - منصة الطلبة اليمنيين",
        `مرحباً ${user.full_name_ar},\n\nتم تسجيل دخول جديد إلى حسابك في منصة الطلبة اليمنيين.\nإذا لم تكن أنت من قام بهذا الإجراء، يرجى الاتصال بالدعم الفني فوراً.\n\nمع تحيات فريق منصة الطلبة اليمنيين`
      );
      
      return true;
    }
    
    // For demo purposes, create a user if not found
    if (email && password) {
      const newUser = mockDatabase.createUser({
        full_name_ar: email.split('@')[0],
        full_name_en: email.split('@')[0],
        email,
        password_hash: password, // In production, this would be hashed
        role: 'student',
      });
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: `مرحباً بك ${newUser.full_name_ar} في منصة الطلبة اليمنيين`,
      });
      
      // Send email notification for new account creation
      sendEmailNotification(
        newUser.email,
        "مرحباً بك في منصة الطلبة اليمنيين",
        `مرحباً ${newUser.full_name_ar},\n\nشكراً لإنشاء حساب في منصة الطلبة اليمنيين. نحن سعداء بانضمامك إلينا.\n\nمع تحيات فريق منصة الطلبة اليمنيين`
      );
      
      return true;
    }
    
    return false;
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    // Check if user already exists
    const existingUser = mockDatabase.getUserByEmail(email);
    
    if (existingUser) {
      toast({
        title: "البريد الإلكتروني مستخدم",
        description: "هذا البريد الإلكتروني مسجل مسبقاً",
        variant: "destructive",
      });
      return false;
    }
    
    if (name && email && password) {
      const newUser = mockDatabase.createUser({
        full_name_ar: name,
        full_name_en: name,
        email,
        password_hash: password, // In production, this would be hashed
        role: 'student',
      });
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      
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
    return false;
  };

  const logout = () => {
    // Send email notification for logout if user exists
    if (user) {
      sendEmailNotification(
        user.email,
        "تسجيل خروج - منصة الطلبة اليمنيين",
        `مرحباً ${user.full_name_ar},\n\nتم تسجيل الخروج من حسابك في منصة الطلبة اليمنيين.\n\nمع تحيات فريق منصة الطلبة اليمنيين`
      );
    }
    
    setUser(null);
    localStorage.removeItem('user');
    toast({
      title: "تم تسجيل الخروج",
      description: "نتمنى رؤيتك مجددا قريباً",
    });
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
