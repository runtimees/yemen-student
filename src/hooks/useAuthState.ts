
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { User } from '@/types/database';
import { supabase } from '@/lib/supabase';
import { fetchUserProfile } from '@/services/authService';
import { createUserProfileIfNotExists } from '@/utils/userUtils';

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    console.log("Setting up auth state listener");
    
    // Set up auth state listener FIRST to avoid missing auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
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

  return { user, setUser };
}
