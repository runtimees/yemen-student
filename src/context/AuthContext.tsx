
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

// Add the missing createUserProfileIfNotExists function
const createUserProfileIfNotExists = async (email: string, name: string): Promise<boolean> => {
  try {
    // Check if user already exists in the users table
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking for existing user:', checkError);
      return false;
    }
    
    // If user already exists, no need to create
    if (existingUser) {
      console.log('User profile already exists');
      return true;
    }
    
    // Create new user profile
    const { error: insertError } = await supabase
      .from('users')
      .insert({
        email: email,
        full_name_ar: name,
        full_name_en: name,
        role: 'student'
      });
    
    if (insertError) {
      console.error('Error creating user profile:', insertError);
      return false;
    }
    
    console.log('Created new user profile');
    return true;
  } catch (error) {
    console.error('Unexpected error creating user profile:', error);
    return false;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    console.log("Setting up auth state listener");
    
    // Set up auth state listener FIRST to avoid missing auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (event === 'SIGNED_IN' && session?.user) {
        // Don't call supabase functions directly in the callback to avoid deadlocks
        // Use setTimeout to defer the call to the next event loop
        setTimeout(async () => {
          const userEmail = session.user.email || '';
          console.log('User signed in, fetching profile for:', userEmail);
          
          const userProfile = await fetchUserProfile(userEmail);
          if (userProfile) {
            console.log('User profile found and set');
            setUser(userProfile);
            toast({
              title: "تم تسجيل الدخول",
              description: `مرحباً بك ${userProfile.full_name_ar} في منصة الطلبة اليمنيين`,
            });
          } else {
            console.error('User authenticated but no profile found');
            // Create profile if not exists
            const userName = session.user.user_metadata.full_name || '';
            const profileCreated = await createUserProfileIfNotExists(userEmail, userName);
            
            if (profileCreated) {
              const newProfile = await fetchUserProfile(userEmail);
              if (newProfile) {
                setUser(newProfile);
                console.log('Created and set new user profile');
              }
            }
          }
        }, 0);
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out, clearing user state');
        setUser(null);
      }
    });
    
    // THEN check for existing session
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      console.log('Checking for existing session:', data.session ? 'Found' : 'None');
      
      if (data.session?.user) {
        const userEmail = data.session.user.email || '';
        console.log('Session found, fetching profile for:', userEmail);
        
        const userProfile = await fetchUserProfile(userEmail);
        if (userProfile) {
          console.log('User profile found and set from existing session');
          setUser(userProfile);
          toast({
            title: "مرحباً بعودتك!",
            description: "تم تسجيل دخولك تلقائياً",
          });
        } else {
          console.error('Session exists but no profile found');
          // Create profile if not exists
          const userName = data.session.user.user_metadata.full_name || '';
          const profileCreated = await createUserProfileIfNotExists(userEmail, userName);
          
          if (profileCreated) {
            const newProfile = await fetchUserProfile(userEmail);
            if (newProfile) {
              setUser(newProfile);
              console.log('Created and set new user profile from session');
            }
          }
        }
      }
    };
    
    checkSession();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

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
