
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
}

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
    // Mock login - in a real app, you would authenticate against a server
    if (email && password) {
      const newUser = {
        id: Math.random().toString(36).substring(2, 9),
        name: email.split('@')[0],
        email,
      };
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: `مرحباً بك ${newUser.name} في منصة الطلبة اليمنيين`,
      });
      
      return true;
    }
    return false;
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    // Mock signup - in a real app, you would create a user account on a server
    if (name && email && password) {
      const newUser = {
        id: Math.random().toString(36).substring(2, 9),
        name,
        email,
      };
      
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
