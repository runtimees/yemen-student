
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { User as UserProfile } from '@/types/database';
import { loginUser, signupUser, logoutUser } from '@/services/authService';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (nameAr: string, email: string, password: string, nameEn?: string, phoneNumber?: string, residenceStatus?: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  session: null,
  loading: true,
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
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
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
                setUserProfile({
                  id: parseInt(profile.id),
                  full_name_ar: profile.full_name_ar || '',
                  full_name_en: profile.full_name_en || '',
                  email: profile.email,
                  password_hash: '',
                  phone_number: profile.phone_number || undefined,
                  role: profile.role as 'student' | 'admin',
                  created_at: profile.created_at
                });
              }
            } catch (error) {
              console.error('Error fetching user profile:', error);
            }
          }, 0);
        } else {
          setUserProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    const result = await loginUser(email, password);
    if (result.success && result.userProfile) {
      setUserProfile(result.userProfile);
      return true;
    }
    return false;
  };

  const handleSignup = async (
    nameAr: string, 
    email: string, 
    password: string,
    nameEn?: string,
    phoneNumber?: string,
    residenceStatus?: string
  ): Promise<boolean> => {
    const result = await signupUser(nameAr, email, password, nameEn, phoneNumber, residenceStatus);
    if (result.success && result.userProfile) {
      setUserProfile(result.userProfile);
      return true;
    }
    return false;
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
    login: handleLogin,
    signup: handleSignup,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
