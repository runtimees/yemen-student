
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { User as UserProfile } from '@/types/database';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: SupabaseUser | null;
  userProfile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (nameAr: string, email: string, password: string, nameEn?: string, phoneNumber?: string, residenceStatus?: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  session: null,
  loading: true,
  isAuthenticated: false,
  login: async () => false,
  signup: async () => false,
  logout: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const isAuthenticated = !!user && !!session;

  useEffect(() => {
    console.log("Setting up auth state listener in AuthContext");
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed in AuthContext:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user profile when logged in
          setTimeout(async () => {
            try {
              const { data: profile } = await supabase
                .from('users')
                .select('*')
                .eq('email', session.user.email)
                .single();
              
              if (profile) {
                console.log('User profile found and set in AuthContext');
                setUserProfile({
                  id: parseInt(profile.id),
                  full_name_ar: profile.full_name_ar || '',
                  full_name_en: profile.full_name_en || '',
                  email: profile.email,
                  password_hash: '',
                  phone_number: profile.phone_number || undefined,
                  role: profile.role as 'student' | 'admin',
                  profile_picture_url: profile.profile_picture_url || undefined,
                  created_at: profile.created_at
                });
                
                toast({
                  title: "تم تسجيل الدخول بنجاح",
                  description: `مرحباً بك ${profile.full_name_ar}`,
                });
              }
            } catch (error) {
              console.error('Error fetching user profile in AuthContext:', error);
            }
          }, 0);
        } else {
          setUserProfile(null);
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Checking for existing session in AuthContext:', session ? 'Found' : 'None');
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [toast]);

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Attempting login for email:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error || !data.user) {
        console.error('Login error:', error);
        toast({
          title: "فشل تسجيل الدخول",
          description: error?.message || "البريد الإلكتروني أو كلمة المرور غير صحيحة",
          variant: "destructive",
        });
        return false;
      }
      
      console.log('Login successful');
      return true;
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

  const handleSignup = async (
    nameAr: string, 
    email: string, 
    password: string,
    nameEn?: string,
    phoneNumber?: string,
    residenceStatus?: string
  ): Promise<boolean> => {
    try {
      console.log("Starting signup process", { nameAr, nameEn, email, phoneNumber, residenceStatus });
      
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
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
        console.error("Signup error:", error);
        toast({
          title: "فشل إنشاء الحساب",
          description: error?.message || "حدث خطأ أثناء إنشاء الحساب",
          variant: "destructive",
        });
        return false;
      }
      
      console.log("Signup successful");
      toast({
        title: "تم إنشاء الحساب بنجاح",
        description: "مرحباً بك في منصة الطلبة اليمنيين",
      });
      
      return true;
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

  const handleLogout = async (): Promise<void> => {
    try {
      console.log("Logging out user");
      await supabase.auth.signOut();
      setUser(null);
      setUserProfile(null);
      setSession(null);
      
      toast({
        title: "تم تسجيل الخروج",
        description: "تم تسجيل خروجك بنجاح",
      });
      
      console.log("Logout successful");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تسجيل الخروج",
        variant: "destructive",
      });
    }
  };

  const value = {
    user,
    userProfile,
    session,
    loading,
    isAuthenticated,
    login: handleLogin,
    signup: handleSignup,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
