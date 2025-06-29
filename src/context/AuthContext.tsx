
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { User as UserProfile } from '@/types/database';
import { loginUser, signupUser, logoutUser } from '@/services/authService';

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

  const isAuthenticated = !!user && !!session;

  useEffect(() => {
    console.log('Setting up auth state listener');
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN' && session?.user) {
          // Defer profile fetching to avoid deadlocks
          setTimeout(async () => {
            try {
              const { data: profile } = await supabase
                .from('users')
                .select('*')
                .eq('email', session.user.email)
                .single();
              
              if (profile) {
                setUserProfile({
                  id: profile.id,
                  full_name_ar: profile.full_name_ar || '',
                  full_name_en: profile.full_name_en || '',
                  email: profile.email,
                  password_hash: '',
                  phone_number: profile.phone_number || undefined,
                  role: profile.role as 'student' | 'admin',
                  profile_picture_url: profile.profile_picture_url || undefined,
                  created_at: profile.created_at
                });
              }
            } catch (error) {
              console.error('Error fetching user profile:', error);
            }
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          setUserProfile(null);
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      const result = await loginUser(email, password);
      if (result.success && result.userProfile) {
        setUserProfile(result.userProfile);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error in context:', error);
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
      const result = await signupUser(nameAr, email, password, nameEn, phoneNumber, residenceStatus);
      if (result.success && result.userProfile) {
        setUserProfile(result.userProfile);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Signup error in context:', error);
      return false;
    }
  };

  const handleLogout = async (): Promise<void> => {
    await logoutUser();
    setUser(null);
    setUserProfile(null);
    setSession(null);
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
