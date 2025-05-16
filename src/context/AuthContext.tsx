
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useToast } from '@/components/ui/use-toast';
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
      
      return true;
    }
    return false;
  };

  const logout = () => {
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
